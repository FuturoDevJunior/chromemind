// Summarizer API - Chrome Built-in AI
import { AIError, StreamingManager, SessionManager, checkAPISupport, withTimeout } from './ai-base.js';

const sessionManager = new SessionManager();

export async function summarizePageText(text, { 
  type = "tldr", 
  format = "markdown", 
  length = "short", 
  stream = true,
  onStreamChunk = null,
  timeoutMs = 30000 
} = {}) {
  try {
    // Verifica se a API está disponível
    checkAPISupport('Summarizer');
    
    // Valida entrada
    if (!text || text.trim().length < 10) {
      throw new AIError('Texto muito curto para resumir (mínimo 10 caracteres)', 'Summarizer');
    }

    // Configurações da sessão
    const sessionConfig = {
      type,
      format,
      length,
      sourceLanguage: 'auto',
      targetLanguage: 'pt'
    };

    // Cria sessão
    const summarizer = await withTimeout(
      sessionManager.createSession(self.Summarizer, sessionConfig),
      5000,
      'Criação do resumidor'
    );

    let result;

    try {
      if (stream && summarizer.summarizeStreaming) {
        const streamManager = new StreamingManager(onStreamChunk);
        
        const streamOperation = async () => {
          const streamReader = await summarizer.summarizeStreaming(text);
          
          for await (const chunk of streamReader) {
            streamManager.processChunk(chunk);
          }
          
          return streamManager.getResult();
        };

        result = await withTimeout(streamOperation(), timeoutMs, 'Streaming do resumo');
      } else {
        // Fallback para resumo normal
        result = await withTimeout(
          summarizer.summarize(text),
          timeoutMs,
          'Geração do resumo'
        );
      }

      return result;

    } finally {
      // Sempre limpa a sessão
      await sessionManager.destroySession(summarizer);
    }

  } catch (error) {
    if (error instanceof AIError) {
      throw error;
    }
    throw new AIError(
      `Erro no Summarizer API: ${error.message}`,
      'Summarizer',
      error
    );
  }
}

export async function checkSummarizerAvailability() {
  try {
    if (!('Summarizer' in self)) {
      return {
        available: false,
        reason: 'API não encontrada'
      };
    }

    const capabilities = await self.Summarizer.capabilities?.();
    return {
      available: capabilities?.available === 'readily',
      details: capabilities
    };

  } catch (error) {
    return {
      available: false,
      reason: error.message
    };
  }
}

export function getSupportedFormats() {
  return ['markdown', 'plain-text'];
}

export function getSupportedTypes() {
  return ['tldr', 'key-points', 'teaser', 'headline'];
}

export function getSupportedLengths() {
  return ['short', 'medium', 'long'];
}