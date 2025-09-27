// Translator + LanguageDetector APIs - Chrome Built-in AI
import { AIError, SessionManager, checkAPISupport, withTimeout } from './ai-base.js';

const sessionManager = new SessionManager();

export async function translateSelection(text, targetLang = "pt", timeoutMs = 30000) {
  try {
    // Verifica se as APIs estão disponíveis
    checkAPISupport('LanguageDetector');
    checkAPISupport('Translator');
    
    // Valida entrada
    if (!text || text.trim().length < 1) {
      throw new AIError('Texto vazio para traduzir', 'Translator');
    }

    // Detecta idioma do texto
    const detector = await withTimeout(
      sessionManager.createSession(self.LanguageDetector),
      5000,
      'Criação do detector de idioma'
    );

    let detectedLanguage;
    try {
      const detection = await withTimeout(
        detector.detect(text),
        10000,
        'Detecção de idioma'
      );
      detectedLanguage = detection.language || 'auto';
    } finally {
      await sessionManager.destroySession(detector);
    }

    // Se já está no idioma alvo, retorna original
    if (detectedLanguage === targetLang) {
      return {
        translatedText: text,
        sourceLanguage: detectedLanguage,
        targetLanguage: targetLang,
        isTranslated: false
      };
    }

    // Cria tradutor
    const translator = await withTimeout(
      sessionManager.createSession(self.Translator, {
        sourceLanguage: detectedLanguage,
        targetLanguage: targetLang
      }),
      5000,
      'Criação do tradutor'
    );

    let translatedText;
    try {
      translatedText = await withTimeout(
        translator.translate(text),
        timeoutMs,
        'Tradução do texto'
      );
    } finally {
      await sessionManager.destroySession(translator);
    }

    return {
      translatedText,
      sourceLanguage: detectedLanguage,
      targetLanguage: targetLang,
      isTranslated: true
    };

  } catch (error) {
    if (error instanceof AIError) {
      throw error;
    }
    throw new AIError(
      `Erro na tradução: ${error.message}`,
      'Translator',
      error
    );
  }
}

export async function detectLanguage(text, timeoutMs = 10000) {
  try {
    checkAPISupport('LanguageDetector');
    
    if (!text || text.trim().length < 1) {
      throw new AIError('Texto vazio para detectar idioma', 'LanguageDetector');
    }

    const detector = await withTimeout(
      sessionManager.createSession(self.LanguageDetector),
      5000,
      'Criação do detector'
    );

    try {
      const result = await withTimeout(
        detector.detect(text),
        timeoutMs,
        'Detecção de idioma'
      );
      
      return {
        language: result.language || 'unknown',
        confidence: result.confidence || 0
      };
    } finally {
      await sessionManager.destroySession(detector);
    }

  } catch (error) {
    if (error instanceof AIError) {
      throw error;
    }
    throw new AIError(
      `Erro na detecção de idioma: ${error.message}`,
      'LanguageDetector',
      error
    );
  }
}

export async function checkTranslatorAvailability() {
  try {
    const detectorAvailable = 'LanguageDetector' in self;
    const translatorAvailable = 'Translator' in self;
    
    let detectorCapabilities = null;
    let translatorCapabilities = null;

    if (detectorAvailable) {
      detectorCapabilities = await self.LanguageDetector.capabilities?.();
    }

    if (translatorAvailable) {
      translatorCapabilities = await self.Translator.capabilities?.();
    }

    return {
      detector: {
        available: detectorAvailable && detectorCapabilities?.available === 'readily',
        capabilities: detectorCapabilities
      },
      translator: {
        available: translatorAvailable && translatorCapabilities?.available === 'readily',
        capabilities: translatorCapabilities
      },
      fullFeature: detectorAvailable && translatorAvailable
    };

  } catch (error) {
    return {
      detector: { available: false, error: error.message },
      translator: { available: false, error: error.message },
      fullFeature: false
    };
  }
}

export function getSupportedLanguages() {
  // Idiomas comumente suportados pelas APIs de tradução
  return {
    'pt': 'Português',
    'en': 'English',
    'es': 'Español',
    'fr': 'Français',
    'de': 'Deutsch',
    'it': 'Italiano',
    'ja': '日本語',
    'ko': '한국어',
    'zh': '中文',
    'ru': 'Русский',
    'ar': 'العربية'
  };
}