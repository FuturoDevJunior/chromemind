# 🧪 Testing Guide - ChromeMind

## ✅ Pre-Installation Checklist

- [ ] Chrome 128+ installed
- [ ] Developer mode enabled in `chrome://extensions/`
- [ ] Built-in AI flags enabled (for development)

## 🚀 Installation Steps

1. **Download/Clone** the ChromeMind project
2. **Open** `chrome://extensions/` in Chrome
3. **Enable** "Developer mode" (top right toggle)
4. **Click** "Load unpacked"
5. **Select** the `chromemind/` folder
6. **Verify** ChromeMind appears in extensions list

## 🔍 Basic Functionality Tests

### 1. Extension Loading
- [ ] Extension loads without errors
- [ ] Brain icon (🧠) appears in Chrome toolbar
- [ ] Clicking icon opens side panel

### 2. Interface Tests
- [ ] Side panel opens correctly
- [ ] All buttons are visible and clickable
- [ ] Toggles (Hybrid, Stream) work
- [ ] Text area accepts input
- [ ] Output area displays messages

### 3. Page Text Extraction
- [ ] Navigate to any article/blog post
- [ ] Click "📄 Resumo da página"
- [ ] Verify text extraction works
- [ ] Should show loading state

### 4. Selection Tests
- [ ] Select text on any webpage
- [ ] Click "🌐 Traduzir seleção → PT-BR"
- [ ] Verify selection detection works
- [ ] Try "✏️ Revisar seleção"
- [ ] Try "🔄 Reescrever (mais claro)"

### 5. Chat Feature
- [ ] Type question in text area
- [ ] Select mode (Creative/Precise)
- [ ] Click "▶️ Enviar"
- [ ] Verify response handling

## 🧪 API Availability Tests

### Stable APIs (Should Work)
- [ ] **Summarizer**: Page summarization
- [ ] **Translator**: Text translation
- [ ] **Language Detector**: Auto language detection

### Origin Trial APIs (May Need Setup)
- [ ] **Prompt API**: Chat functionality
- [ ] **Proofreader**: Grammar checking
- [ ] **Writer/Rewriter**: Text improvement

## 🔧 Troubleshooting

### Common Issues

**1. "API não disponível" errors**
- ✅ **Fix**: Enable Chrome flags for Built-in AI
- ✅ **Location**: `chrome://flags/#optimization-guide-on-device-model`
- ✅ **Set to**: Enabled

**2. Origin Trial APIs not working**
- ✅ **Fix**: Register for Chrome Origin Trials
- ✅ **URL**: https://developer.chrome.com/origintrials/
- ✅ **APIs**: "Prompt API", "Writer APIs"

**3. Extension not loading**
- ✅ **Fix**: Check developer console for errors
- ✅ **Location**: `chrome://extensions/` → Details → Inspect views

**4. Side panel not opening**
- ✅ **Fix**: Try right-clicking icon → "Open side panel"
- ✅ **Alternative**: Check if another extension is conflicting

### Debug Commands

Open DevTools Console in side panel and run:

```javascript
// Check API availability
ChromeMindDebug.checkSummarizerAvailability()
ChromeMindDebug.checkTranslatorAvailability()
ChromeMindDebug.checkPromptAvailability()

// Check hybrid configuration
ChromeMindDebug.getHybridConfig()

// Test content script
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, {type: 'PING'});
});
```

## 📊 Performance Benchmarks

Expected performance on modern hardware:

| Task | Expected Time | Notes |
|------|---------------|-------|
| Page Summary | 2-5 seconds | Depends on content length |
| Translation | 1-3 seconds | For selections up to 500 words |
| Proofreading | 1-2 seconds | For paragraphs |
| Chat Response | 3-8 seconds | Varies by complexity |
| Text Rewriting | 2-4 seconds | For medium paragraphs |

## 🎯 Test Scenarios

### Scenario 1: News Reader
1. Open a news article
2. Use "Resumo da página" to get key points
3. Select foreign quotes and translate
4. Verify summaries are accurate and concise

### Scenario 2: Student/Writer
1. Open a research paper or blog
2. Select a complex paragraph
3. Use "Revisar seleção" for grammar
4. Use "Reescrever" for clarity
5. Ask questions via chat about the content

### Scenario 3: International User
1. Visit non-Portuguese website
2. Select various text blocks
3. Translate to Portuguese
4. Verify language detection accuracy
5. Test with different source languages

## 🚨 Known Limitations

- **Content Length**: Large pages may timeout
- **API Limits**: Built-in APIs have processing limits
- **Browser Support**: Chrome 128+ required
- **Origin Trials**: Some features need developer setup
- **Network**: Hybrid mode requires internet

## ✅ Success Criteria

Extension is working correctly if:

- [x] Loads without errors
- [x] UI is responsive and intuitive
- [x] At least 2-3 AI features work
- [x] Error messages are helpful
- [x] Performance is acceptable
- [x] No crashes or freezes

## 📝 Reporting Issues

If you encounter problems:

1. **Check Console**: Look for JavaScript errors
2. **Try Incognito**: Test in private browsing
3. **Disable Extensions**: Check for conflicts
4. **Update Chrome**: Ensure latest version
5. **Report Bug**: Include console logs and steps

---

**🎯 Ready for Google Chrome Built-in AI Challenge 2025!**