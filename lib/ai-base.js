// Módulo base com utilidades comuns para as APIs de IA
export class AIError extends Error {
  constructor(message, apiName, originalError = null) {
    super(message);
    this.name = 'AIError';
    this.apiName = apiName;
    this.originalError = originalError;
  }
}

export class StreamingManager {
  constructor(onChunk = null) {
    this.onChunk = onChunk;
    this.buffer = '';
  }

  processChunk(chunk) {
    this.buffer += chunk;
    if (this.onChunk) {
      this.onChunk(this.buffer);
    }
  }

  getResult() {
    return this.buffer;
  }

  reset() {
    this.buffer = '';
  }
}

export class SessionManager {
  constructor() {
    this.activeSessions = new Set();
  }

  async createSession(api, options = {}) {
    try {
      const session = await api.create(options);
      this.activeSessions.add(session);
      return session;
    } catch (error) {
      throw new AIError(`Falha ao criar sessão: ${error.message}`, api.name, error);
    }
  }

  async destroySession(session) {
    try {
      if (session && typeof session.destroy === 'function') {
        await session.destroy();
      }
      this.activeSessions.delete(session);
    } catch (error) {
      console.warn('Erro ao destruir sessão:', error);
    }
  }

  async destroyAllSessions() {
    const promises = Array.from(this.activeSessions).map(session => 
      this.destroySession(session)
    );
    await Promise.allSettled(promises);
    this.activeSessions.clear();
  }
}

export function checkAPISupport(apiName, globalObject = self) {
  if (!(apiName in globalObject)) {
    throw new AIError(
      `${apiName} API não está disponível no seu navegador. Verifique se você está usando Chrome 128+ e se as flags experimentais estão habilitadas.`,
      apiName
    );
  }
  return true;
}

export function checkExtensionAPISupport(apiPath) {
  try {
    const parts = apiPath.split('.');
    let current = chrome;
    
    for (const part of parts) {
      if (!current || !(part in current)) {
        throw new AIError(
          `API de extensão ${apiPath} não está disponível. Verifique se você está em uma extensão com as permissões corretas.`,
          apiPath
        );
      }
      current = current[part];
    }
    return true;
  } catch (error) {
    throw new AIError(
      `Erro ao verificar API de extensão ${apiPath}: ${error.message}`,
      apiPath,
      error
    );
  }
}

export async function withTimeout(promise, timeoutMs = 30000, operation = 'Operação') {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new AIError(`${operation} expirou após ${timeoutMs}ms`, 'timeout'));
    }, timeoutMs);
    
    promise
      .then(result => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}