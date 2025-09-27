# Hybrid Fallback System

This module implements cloud fallback when Built-in AI APIs are not available.

## ⚠️ Important: Manual Configuration

For security reasons, API credentials are **NOT** included in the code. To test hybrid mode:

### Configuration via Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Execute one of the commands below:

```javascript
// For Gemini API
await setHybridConfig('gemini', 'YOUR_API_KEY_HERE');

// For OpenAI API  
await setHybridConfig('openai', 'YOUR_API_KEY_HERE');

// For Firebase (custom endpoint)
await setHybridConfig('firebase', 'YOUR_API_KEY', 'https://your-endpoint.com/api');
```

### Getting Credentials

**Gemini API (Google):**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Use in format: `AIza...`

**OpenAI API:**
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Use in format: `sk-...`

**Firebase AI Logic:**
1. Configure your Firebase project
2. Implement custom endpoint
3. Configure URL and credentials

## How It Works

1. **Local First**: Always tries Chrome native APIs first
2. **Smart Fallback**: If local fails and Hybrid is active, uses cloud
3. **Privacy**: Clearly warns when data leaves the device
4. **Flexible**: Supports multiple providers

## Provider Status

| Provider | Status | Notes |
|----------|--------|-------|
| Gemini API | ✅ Implemented | Requires Google API key |
| OpenAI API | ✅ Implemented | Requires OpenAI API key |
| Firebase AI Logic | 🚧 Stub | Requires custom implementation |

## Useful Commands

```javascript
// Check current configuration
getHybridConfig()

// Disable hybrid mode
toggleHybridMode(false)

// Clear configuration
clearHybridConfig()

// Test prompt
await hybridPrompt("Hello, how are you?")
```

## Security

- Credentials stored only in localStorage
- Not sent in source code
- Automatically cleared when uninstalling extension
- Clear warnings about data usage