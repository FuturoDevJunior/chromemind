// Prompt API (Extensão): chrome.aiOriginTrial.prompt
import { AIError, StreamingManager, SessionManager, checkExtensionAPISupport, withTimeout } from './ai-base.js';

const sessionManager = new SessionManager();

export async function promptNano({ 
  text, 
  systemPrompt = "You are a helpful and concise assistant.", 
  mode = "creative", 
  stream = true,
  onStreamChunk = null,
  timeoutMs = 30000
}) {
  try {
    // Verifica se a API está disponível
    let promptAPI;
    try {
      checkExtensionAPISupport('aiOriginTrial.prompt');
      promptAPI = chrome.aiOriginTrial.prompt;
    } catch {
      // Fallback para API web
      if (self.ai && self.ai.prompt) {
        promptAPI = self.ai.prompt;
      } else {
        throw new AIError(
          'Prompt API não está disponível. Verifique se você está usando Chrome 128+ com origin trial ativo.',
          'PromptAPI'
        );
      }
    }

    // Configurações baseadas no modo
    const sessionConfig = {
      systemPrompt,
      ...(mode === "precise" ? {
        topK: 10,
        temperature: 0.2
      } : {
        topK: 40,
        temperature: 0.8
      })
    };

    // Cria sessão
    const session = await withTimeout(
      sessionManager.createSession(promptAPI, sessionConfig),
      5000,
      'Criação da sessão'
    );

    let result;

    try {
      if (stream && session.promptStreaming) {
        const streamManager = new StreamingManager(onStreamChunk);
        
        const streamOperation = async () => {
          const streamReader = await session.promptStreaming(text);
          
          for await (const chunk of streamReader) {
            streamManager.processChunk(chunk);
          }
          
          return streamManager.getResult();
        };

        result = await withTimeout(streamOperation(), timeoutMs, 'Streaming da resposta');
      } else {
        // Fallback para prompt normal
        result = await withTimeout(
          session.prompt(text),
          timeoutMs,
          'Geração da resposta'
        );
      }

      return result;

    } finally {
      // Sempre limpa a sessão
      await sessionManager.destroySession(session);
    }

  } catch (error) {
    if (error instanceof AIError) {
      throw error;
    }
    throw new AIError(
      `Erro no Prompt API: ${error.message}`,
      'PromptAPI',
      error
    );
  }
}

export async function checkPromptAvailability() {
  try {
    // Tenta detectar qual API está disponível
    if (chrome?.aiOriginTrial?.prompt) {
      const availability = await chrome.aiOriginTrial.prompt.capabilities?.();
      return {
        available: availability?.available === 'readily',
        source: 'extension',
        details: availability
      };
    }
    
    if (self.ai?.prompt) {
      const availability = await self.ai.prompt.capabilities?.();
      return {
        available: availability?.available === 'readily',
        source: 'web',
        details: availability
      };
    }

    return {
      available: false,
      source: 'none',
      details: null
    };

  } catch (error) {
    return {
      available: false,
      source: 'error',
      details: error.message
    };
  }
}

// Cleanup quando a página/extensão é descarregada
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    sessionManager.destroyAllSessions();
  });
}