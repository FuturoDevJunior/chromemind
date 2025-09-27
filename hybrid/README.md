# Hybrid Fallback System

Este módulo implementa fallback em nuvem quando as Built-in AI APIs não estão disponíveis.

## ⚠️ Importante: Configuração Manual

Por razões de segurança, as credenciais API **NÃO** estão incluídas no código. Para testar o modo híbrido:

### Configuração via Console do Navegador

1. Abra DevTools (F12)
2. Vá para a aba Console
3. Execute um dos comandos abaixo:

```javascript
// Para Gemini API
await setHybridConfig('gemini', 'SUA_API_KEY_AQUI');

// Para OpenAI API  
await setHybridConfig('openai', 'SUA_API_KEY_AQUI');

// Para Firebase (endpoint personalizado)
await setHybridConfig('firebase', 'SUA_API_KEY', 'https://seu-endpoint.com/api');
```

### Obter Credenciais

**Gemini API (Google):**
1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma nova API key
3. Use no formato: `AIza...`

**OpenAI API:**
1. Acesse [OpenAI Platform](https://platform.openai.com/api-keys)
2. Crie uma nova API key
3. Use no formato: `sk-...`

**Firebase AI Logic:**
1. Configure seu projeto Firebase
2. Implemente endpoint personalizado
3. Configure URL e credenciais

## Como Funciona

1. **Local First**: Sempre tenta APIs nativas do Chrome primeiro
2. **Fallback Inteligente**: Se local falhar e Hybrid estiver ativo, usa cloud
3. **Privacidade**: Avisa claramente quando dados saem do dispositivo
4. **Flexível**: Suporta múltiplos providers

## Status dos Providers

| Provider | Status | Notas |
|----------|--------|-------|
| Gemini API | ✅ Implementado | Requer API key do Google |
| OpenAI API | ✅ Implementado | Requer API key da OpenAI |
| Firebase AI Logic | 🚧 Stub | Requer implementação personalizada |

## Comandos Úteis

```javascript
// Verificar configuração atual
getHybridConfig()

// Desativar modo híbrido
toggleHybridMode(false)

// Limpar configuração
clearHybridConfig()

// Testar prompt
await hybridPrompt("Olá, como você está?")
```

## Segurança

- Credenciais armazenadas apenas no localStorage
- Não enviadas no código fonte
- Limpas automaticamente ao desinstalar extensão
- Avisos claros sobre uso de dados