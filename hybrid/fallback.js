// Sistema de fallback híbrido para quando APIs locais não estão disponíveis
// IMPORTANTE: Este módulo requer configuração manual de credenciais por segurança

export class HybridConfig {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      const stored = localStorage.getItem('chromemind-hybrid-config');
      return stored ? JSON.parse(stored) : {
        enabled: false,
        provider: 'none', // 'gemini', 'firebase', 'openai'
        apiKey: '',
        endpoint: ''
      };
    } catch {
      return { enabled: false, provider: 'none', apiKey: '', endpoint: '' };
    }
  }

  saveConfig(config) {
    try {
      this.config = { ...this.config, ...config };
      localStorage.setItem('chromemind-hybrid-config', JSON.stringify(this.config));
      return true;
    } catch {
      return false;
    }
  }

  isConfigured() {
    return this.config.enabled && 
           this.config.provider !== 'none' && 
           this.config.apiKey?.length > 0;
  }
}

const hybridConfig = new HybridConfig();

export async function hybridPrompt(text, options = {}) {
  if (!hybridConfig.isConfigured()) {
    return `🔧 **Hybrid Mode não configurado**

Para ativar o fallback cloud:
1. Configure suas credenciais API
2. Use setHybridConfig() ou a interface de configuração
3. Ative o toggle "Hybrid"

**Providers suportados:**
- Gemini API (Google)
- Firebase AI Logic  
- OpenAI API

**Nota:** Dados serão enviados para o servidor quando Hybrid estiver ativo.`;
  }

  try {
    switch (hybridConfig.config.provider) {
      case 'gemini':
        return await callGeminiAPI(text, options);
      case 'firebase':
        return await callFirebaseAPI(text, options);
      case 'openai':
        return await callOpenAIAPI(text, options);
      default:
        throw new Error('Provider não suportado');
    }
  } catch (error) {
    return `❌ **Erro no Fallback Híbrido**

${error.message}

Verifique:
- Credenciais API válidas
- Conexão com internet
- Quota/limites da API`;
  }
}

async function callGeminiAPI(text, options) {
  const { apiKey, endpoint } = hybridConfig.config;
  const url = endpoint || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  
  const response = await fetch(`${url}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: text
        }]
      }],
      generationConfig: {
        temperature: options.mode === 'precise' ? 0.2 : 0.8,
        maxOutputTokens: 1024
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API erro: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Resposta vazia da API';
}

async function callFirebaseAPI(text, options) {
  // Implementação stub para Firebase AI Logic
  throw new Error('Firebase AI Logic não implementado. Configure endpoint personalizado.');
}

async function callOpenAIAPI(text, options) {
  const { apiKey, endpoint } = hybridConfig.config;
  const url = endpoint || 'https://api.openai.com/v1/chat/completions';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: text
        }
      ],
      temperature: options.mode === 'precise' ? 0.2 : 0.8,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API erro: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Resposta vazia da API';
}

// Funções de configuração para a UI
export function setHybridConfig(provider, apiKey, endpoint = '') {
  return hybridConfig.saveConfig({
    enabled: true,
    provider,
    apiKey,
    endpoint
  });
}

export function getHybridConfig() {
  return {
    ...hybridConfig.config,
    apiKey: hybridConfig.config.apiKey ? '***configurada***' : ''
  };
}

export function toggleHybridMode(enabled) {
  return hybridConfig.saveConfig({ enabled });
}

export function clearHybridConfig() {
  return hybridConfig.saveConfig({
    enabled: false,
    provider: 'none',
    apiKey: '',
    endpoint: ''
  });
}

// Fallbacks específicos para cada tipo de tarefa
export async function hybridSummarize(text) {
  const prompt = `Resuma o seguinte texto em português de forma concisa:

${text}

Resumo:`;
  
  return await hybridPrompt(prompt, { mode: 'precise' });
}

export async function hybridTranslate(text, targetLang = 'pt') {
  const prompt = `Traduza o seguinte texto para ${targetLang}:

${text}

Tradução:`;
  
  return await hybridPrompt(prompt, { mode: 'precise' });
}

export async function hybridProofread(text) {
  const prompt = `Revise e corrija o seguinte texto, explicando as correções:

${text}

Correções:`;
  
  return await hybridPrompt(prompt, { mode: 'precise' });
}

export async function hybridRewrite(text) {
  const prompt = `Reescreva o seguinte texto de forma mais clara e fluente:

${text}

Texto reescrito:`;
  
  return await hybridPrompt(prompt, { mode: 'creative' });
}