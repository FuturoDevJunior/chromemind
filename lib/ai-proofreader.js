// Proofreader API - Chrome Built-in AI (Origin Trial)
import { AIError, SessionManager, checkAPISupport, withTimeout } from './ai-base.js';

const sessionManager = new SessionManager();

export async function proofread(text, { 
  audience = "general",
  format = "json",
  timeoutMs = 30000 
} = {}) {
  try {
    // Verifica se a API está disponível
    checkAPISupport('Proofreader');
    
    // Valida entrada
    if (!text || text.trim().length < 1) {
      throw new AIError('Texto vazio para revisar', 'Proofreader');
    }

    if (text.length > 10000) {
      text = text.substring(0, 10000) + '...';
    }

    // Configurações da sessão
    const sessionConfig = {
      audience,
      ...(format && { format })
    };

    // Cria sessão
    const proofreader = await withTimeout(
      sessionManager.createSession(self.Proofreader, sessionConfig),
      5000,
      'Criação do revisor'
    );

    let suggestions;
    try {
      suggestions = await withTimeout(
        proofreader.proofread(text, { format }),
        timeoutMs,
        'Revisão do texto'
      );
    } finally {
      await sessionManager.destroySession(proofreader);
    }

    // Processa e formata sugestões
    if (Array.isArray(suggestions)) {
      return suggestions.map((suggestion, index) => ({
        id: index + 1,
        correction: suggestion.correction || suggestion.text || '',
        label: suggestion.label || 'Correção',
        explanation: suggestion.explanation || 'Melhoria sugerida',
        startIndex: suggestion.startIndex || 0,
        endIndex: suggestion.endIndex || 0,
        confidence: suggestion.confidence || 0.5
      }));
    }

    // Se não for array, tenta converter para formato padrão
    return [{
      id: 1,
      correction: suggestions.toString(),
      label: 'Revisão geral',
      explanation: 'Texto revisado',
      startIndex: 0,
      endIndex: text.length,
      confidence: 1.0
    }];

  } catch (error) {
    if (error instanceof AIError) {
      throw error;
    }
    throw new AIError(
      `Erro no Proofreader API: ${error.message}. Certifique-se de que o Origin Trial está ativo.`,
      'Proofreader',
      error
    );
  }
}

export async function proofreadSimple(text, timeoutMs = 30000) {
  try {
    const suggestions = await proofread(text, { 
      format: "plain-text",
      timeoutMs 
    });
    
    if (suggestions.length === 0) {
      return "✅ Nenhuma correção necessária!";
    }

    return suggestions.map(s => 
      `${s.id}. ${s.label}: ${s.explanation}\n→ "${s.correction}"`
    ).join('\n\n');

  } catch (error) {
    throw error;
  }
}

export async function checkProofreaderAvailability() {
  try {
    if (!('Proofreader' in self)) {
      return {
        available: false,
        reason: 'API não encontrada. Proofreader API requer Origin Trial ativo.'
      };
    }

    const capabilities = await self.Proofreader.capabilities?.();
    return {
      available: capabilities?.available === 'readily',
      details: capabilities,
      requiresOriginTrial: true
    };

  } catch (error) {
    return {
      available: false,
      reason: `Erro: ${error.message}. Verifique se o Origin Trial está configurado.`,
      requiresOriginTrial: true
    };
  }
}

export function getSupportedAudiences() {
  return [
    'general',
    'academic', 
    'business',
    'casual',
    'formal'
  ];
}

export function getSupportedFormats() {
  return [
    'json',
    'plain-text'
  ];
}

export function formatSuggestions(suggestions, originalText) {
  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    return "✅ Texto sem erros detectados!";
  }

  let formatted = `📝 Encontradas ${suggestions.length} sugestão(ões):\n\n`;
  
  suggestions.forEach((suggestion, index) => {
    formatted += `${index + 1}. **${suggestion.label}**\n`;
    formatted += `   💡 ${suggestion.explanation}\n`;
    formatted += `   ✏️ Correção: "${suggestion.correction}"\n`;
    
    if (suggestion.confidence !== undefined) {
      formatted += `   🎯 Confiança: ${Math.round(suggestion.confidence * 100)}%\n`;
    }
    
    formatted += '\n';
  });

  return formatted;
}