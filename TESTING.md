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
- [ ] Click "📄 Summarize page"
- [ ] Verify text extraction works
- [ ] Should show loading state

### 4. Selection Tests
- [ ] Select text on any webpage
- [ ] Click "🌐 Translate selection → EN"
- [ ] Verify selection detection works
- [ ] Try "✏️ Proofread selection"
- [ ] Try "🔄 Rewrite (clearer)"

### 5. Chat Feature
- [ ] Type question in text area
- [ ] Select mode (Creative/Precise)
- [ ] Click "▶️ Send"
- [ ] Verify response handling

## 🧪 API Availability Tests

### Stable APIs (Should Work Immediately)
- [ ] **Summarizer**: Page summarization
- [ ] **Translator**: Text translation
- [ ] **Language Detector**: Auto language detection

### Origin Trial APIs (May Need Setup)
- [ ] **Prompt API**: Chat functionality
- [ ] **Proofreader**: Grammar checking
- [ ] **Writer/Rewriter**: Text improvement

## 🔧 Troubleshooting

### Common Issues

**1. "API not available" errors**
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
2. Use "Summarize page" to get key points
3. Select foreign quotes and translate
4. Verify summaries are accurate and concise

### Scenario 2: Student/Writer
1. Open a research paper or blog
2. Select a complex paragraph
3. Use "Proofread selection" for grammar
4. Use "Rewrite" for clarity
5. Ask questions via chat about the content

### Scenario 3: International User
1. Visit non-English website
2. Select various text blocks
3. Translate to English
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

## 🏆 For Competition Judges

### Quick Evaluation Steps

1. **Install**: Load unpacked extension in 30 seconds
2. **Test Core Features**: 
   - Summarize any webpage (works immediately)
   - Translate selected text (works immediately)
3. **Evaluate UX**: Clean, intuitive interface
4. **Check Innovation**: Hybrid local + cloud approach
5. **Verify Technical Quality**: Clean code, no errors

### Expected Results
- **Summarizer**: Instant, accurate page summaries (2-5 seconds)
- **Translator**: Fast, high-quality translations (1-3 seconds)
- **UI/UX**: Professional, responsive interface with loading states
- **Performance**: Sub-5-second responses for most operations
- **Reliability**: No crashes, graceful error handling with helpful messages

### Bonus Features (Origin Trial Setup)
- **AI Chat**: Natural conversation with Gemini Nano
- **Proofreader**: Grammar and style improvements
- **Rewriter**: Content clarity enhancement
- **Hybrid Mode**: Cloud fallback demonstration

*This extension showcases the full potential of Chrome's Built-in AI APIs with production-ready code quality and user experience.*