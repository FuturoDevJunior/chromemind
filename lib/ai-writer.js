// Writer/Rewriter APIs - Chrome Built-in AI (Origin Trial)
import { AIError, SessionManager, checkAPISupport, withTimeout } from './ai-base.js';

const sessionManager = new SessionManager();

export async function rewrite(text, { 
  tone = "clear", 
  length = "medium",
  timeoutMs = 30000 
} = {}) {
  try {
    // Verifica se a API está disponível
    checkAPISupport('Rewriter');
    
    // Valida entrada
    if (!text || text.trim().length < 1) {
      throw new AIError('Texto vazio para reescrever', 'Rewriter');
    }

    if (text.length > 10000) {
      text = text.substring(0, 10000) + '...';
    }

    // Configurações da sessão
    const sessionConfig = {
      tone,
      length,
      format: 'plain-text'
    };

    // Cria sessão
    const rewriter = await withTimeout(
      sessionManager.createSession(self.Rewriter, sessionConfig),
      5000,
      'Criação do reescritor'
    );

    let result;
    try {
      result = await withTimeout(
        rewriter.rewrite(text),
        timeoutMs,
        'Reescrita do texto'
      );
    } finally {
      await sessionManager.destroySession(rewriter);
    }

    return result;

  } catch (error) {
    if (error instanceof AIError) {
      throw error;
    }
    throw new AIError(
      `Erro no Rewriter API: ${error.message}. Certifique-se de que o Origin Trial está ativo.`,
      'Rewriter',
      error
    );
  }
}

export async function writeFromIdea(idea, context = "", { 
  task = "draft",
  audience = "general",
  format = "markdown",
  timeoutMs = 30000 
} = {}) {
  try {
    // Verifica se a API está disponível
    checkAPISupport('Writer');
    
    // Valida entrada
    if (!idea || idea.trim().length < 1) {
      throw new AIError('Ideia vazia para escrever', 'Writer');
    }

    // Configurações da sessão
    const sessionConfig = {
      task,
      audience,
      format
    };

    // Cria sessão
    const writer = await withTimeout(
      sessionManager.createSession(self.Writer, sessionConfig),
      5000,
      'Criação do escritor'
    );

    let result;
    try {
      result = await withTimeout(
        writer.write({ idea, context, format }),
        timeoutMs,
        'Escrita do texto'
      );
    } finally {
      await sessionManager.destroySession(writer);
    }

    return result;

  } catch (error) {
    if (error instanceof AIError) {
      throw error;
    }
    throw new AIError(
      `Erro no Writer API: ${error.message}. Certifique-se de que o Origin Trial está ativo.`,
      'Writer',
      error
    );
  }
}

export async function improveText(text, improvement = "clarity") {
  const improvements = {
    clarity: { tone: "clear", length: "medium" },
    concise: { tone: "casual", length: "short" },
    formal: { tone: "formal", length: "medium" },
    creative: { tone: "casual", length: "long" }
  };

  const options = improvements[improvement] || improvements.clarity;
  return await rewrite(text, options);
}

export async function checkWriterAvailability() {
  try {
    const rewriterAvailable = 'Rewriter' in self;
    const writerAvailable = 'Writer' in self;
    
    let rewriterCapabilities = null;
    let writerCapabilities = null;

    if (rewriterAvailable) {
      rewriterCapabilities = await self.Rewriter.capabilities?.();
    }

    if (writerAvailable) {
      writerCapabilities = await self.Writer.capabilities?.();
    }

    return {
      rewriter: {
        available: rewriterAvailable && rewriterCapabilities?.available === 'readily',
        capabilities: rewriterCapabilities,
        requiresOriginTrial: true
      },
      writer: {
        available: writerAvailable && writerCapabilities?.available === 'readily',
        capabilities: writerCapabilities,
        requiresOriginTrial: true
      },
      fullFeature: rewriterAvailable && writerAvailable
    };

  } catch (error) {
    return {
      rewriter: { 
        available: false, 
        error: error.message,
        requiresOriginTrial: true 
      },
      writer: { 
        available: false, 
        error: error.message,
        requiresOriginTrial: true 
      },
      fullFeature: false
    };
  }
}

export function getSupportedTones() {
  return [
    'clear',
    'formal', 
    'casual',
    'professional',
    'creative'
  ];
}

export function getSupportedLengths() {
  return [
    'short',
    'medium',
    'long'
  ];
}

export function getSupportedTasks() {
  return [
    'draft',
    'outline',
    'summary',
    'expansion'
  ];
}

export function getSupportedAudiences() {
  return [
    'general',
    'academic',
    'business', 
    'technical',
    'casual'
  ];
}