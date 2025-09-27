# 🤝 Contributing to ChromeMind

Thank you for your interest in contributing to **ChromeMind**! This project is submitted to the **Google Chrome Built-in AI Challenge 2025**, and we welcome contributions that enhance our competition entry.

## 🏆 Competition Context

ChromeMind is a submission for the **Google Chrome Built-in AI Challenge 2025**, competing in:
- **Most Helpful Chrome Extension**
- **Best Hybrid AI Application**
- **Best Multimodal AI Application**

All contributions should align with these competition goals and demonstrate excellence in Chrome's Built-in AI APIs.

## 🚀 Quick Start

### Prerequisites

Before contributing, ensure you have:

- **Chrome 128+** with Built-in AI APIs enabled
- **Node.js 16+** for development tools
- **Git** for version control
- Basic understanding of Chrome Extensions (Manifest V3)
- Familiarity with Chrome's Built-in AI APIs

### Development Setup

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/chromemind.git
   cd chromemind
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Load Extension in Chrome**
   ```bash
   # Open Chrome and navigate to chrome://extensions/
   # Enable "Developer mode"
   # Click "Load unpacked" and select the chromemind/ directory
   ```

4. **Verify Installation**
   ```bash
   npm run validate
   npm test
   ```

## 📋 Contribution Guidelines

### 🎯 What We're Looking For

**High Priority Contributions:**
- 🤖 Enhanced AI API integrations
- ⚡ Performance optimizations
- 🎨 UI/UX improvements for judge appeal
- 🔒 Security enhancements
- ♿ Accessibility improvements
- 📚 Documentation improvements
- 🧪 Test coverage expansion

**Competition-Focused Areas:**
- Novel uses of Chrome Built-in AI APIs
- Hybrid AI implementations (local + cloud fallback)
- Multimodal AI features
- User experience excellence
- Technical innovation demonstrations

### 🚫 What We Won't Accept

- Changes that break Chrome Built-in AI API integration
- Features requiring external dependencies (keep it lightweight)
- Non-Manifest V3 compatible code
- Security vulnerabilities or privacy violations
- Changes that violate Chrome Web Store policies
- Contributions that don't align with competition goals

## 🔄 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch Naming Convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `perf/` - Performance improvements
- `comp/` - Competition-specific improvements

### 2. Make Your Changes

**Code Style Guidelines:**
- Use ES6+ features (Chrome 128+ support)
- Follow existing code patterns
- Add JSDoc comments for functions
- Keep functions focused and modular
- Handle errors gracefully

**AI API Integration Standards:**
- Always check API availability before use
- Implement proper error handling
- Provide fallback behaviors
- Follow Chrome's Built-in AI best practices
- Test with different API states (enabled/disabled)

### 3. Test Your Changes

```bash
# Validate manifest
npm run validate

# Run syntax tests
npm test

# Manual testing checklist
# - Load extension in Chrome
# - Test all AI features
# - Verify side panel functionality
# - Check console for errors
# - Test edge cases and error scenarios
```

### 4. Commit Your Changes

**Commit Message Format:**
```
type(scope): brief description

Detailed explanation of changes if needed.

- Bullet points for specific changes
- Reference issues: Closes #123
- Competition impact: Improves scoring for "Most Helpful" category

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Commit Types:**
- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation
- `perf` - Performance improvements
- `refactor` - Code refactoring
- `test` - Test additions
- `comp` - Competition improvements

### 5. Submit a Pull Request

1. Push your branch to your fork
2. Create a pull request using our template
3. Fill out all sections of the PR template
4. Link any related issues
5. Ensure all CI checks pass

## 🧪 Testing Guidelines

### Manual Testing Requirements

**Core Functionality:**
- [ ] Extension loads without errors
- [ ] All AI APIs function correctly
- [ ] Side panel opens and displays properly
- [ ] Content script extracts text correctly
- [ ] Error states are handled gracefully

**AI API Testing:**
- [ ] Summarizer API with various text lengths
- [ ] Translator API with different languages
- [ ] Prompt API with various query types
- [ ] Proofreader API with different text quality
- [ ] Writer/Rewriter APIs with different styles

**Edge Case Testing:**
- [ ] Empty text inputs
- [ ] Extremely long text inputs
- [ ] Network connectivity issues
- [ ] API quota exhaustion
- [ ] Unsupported websites
- [ ] Mixed content scenarios

### Automated Testing

```bash
# Run all validation checks
npm run validate

# Syntax validation
npm test

# Future: Integration tests will be added
# npm run test:integration
```

## 📁 Project Structure

Understanding the codebase:

```
chromemind/
├── manifest.json              # Extension configuration
├── service_worker.js          # Background service worker
├── sidepanel.html             # Main interface
├── sidepanel.js               # UI logic and coordination
├── content.js                 # Page text extraction
├── styles.css                 # Interface styling
├── lib/                       # AI modules (modular architecture)
│   ├── ai-base.js            # Common utilities
│   ├── ai-prompt.js          # Prompt API integration
│   ├── ai-summarizer.js      # Summarizer API integration
│   ├── ai-translate.js       # Translator + Language Detector
│   ├── ai-proofreader.js     # Proofreader API integration
│   └── ai-writer.js          # Writer/Rewriter APIs
├── hybrid/                    # Cloud fallback system
│   ├── fallback.js           # Hybrid cloud logic
│   └── README.md             # Hybrid system documentation
├── assets/                    # Icons and resources
└── scripts/                   # Build and validation tools
```

## 🤖 AI API Development Guidelines

### Best Practices for Chrome Built-in AI APIs

**1. API Availability Checking**
```javascript
// Always check API availability
if ('ai' in window && 'summarizer' in window.ai) {
  // Use the API
} else {
  // Provide fallback or error message
}
```

**2. Session Management**
```javascript
// Proper session lifecycle
const session = await window.ai.summarizer.create({
  type: 'key-points',
  format: 'markdown',
  length: 'medium'
});

try {
  const result = await session.summarize(text);
  return result;
} finally {
  session.destroy(); // Always cleanup
}
```

**3. Error Handling**
```javascript
try {
  const result = await performAIOperation();
  return { success: true, data: result };
} catch (error) {
  console.error('AI operation failed:', error);
  return { 
    success: false, 
    error: error.message,
    fallback: 'Suggested fallback action'
  };
}
```

### Competition-Specific Considerations

**Demonstrating API Mastery:**
- Use multiple AI APIs in harmony
- Show advanced configuration options
- Implement smart fallback strategies
- Optimize for performance and user experience

**Innovation Opportunities:**
- Creative combinations of AI APIs
- Novel user interaction patterns
- Intelligent context awareness
- Seamless integration with web content

## 🔒 Security Guidelines

### Chrome Extension Security

**Content Security Policy:**
- No inline JavaScript in HTML
- No `eval()` or `Function()` constructor
- Sanitize all user inputs
- Use nonces for dynamic content

**Permissions:**
- Request minimal permissions
- Justify all requested permissions
- Use activeTab when possible
- Document permission usage

**Data Handling:**
- Process data locally when possible
- Encrypt sensitive data
- Clear temporary data appropriately
- Respect user privacy

## ♿ Accessibility Guidelines

### UI Accessibility Requirements

**Keyboard Navigation:**
- All interactive elements must be keyboard accessible
- Logical tab order
- Visible focus indicators
- Keyboard shortcuts for main actions

**Screen Reader Support:**
- Proper ARIA labels
- Semantic HTML structure
- Alt text for images
- Status announcements for dynamic content

**Visual Accessibility:**
- Sufficient color contrast (WCAG AA minimum)
- Text resizing support
- No color-only information
- High contrast mode compatibility

## 🏆 Competition Excellence

### Making Your Contribution Stand Out

**Technical Excellence:**
- Clean, well-documented code
- Robust error handling
- Performance optimization
- Security best practices

**User Experience:**
- Intuitive interface design
- Smooth interactions
- Helpful error messages
- Accessibility compliance

**Innovation:**
- Creative AI API usage
- Novel problem-solving approaches
- Unique feature combinations
- Technical innovation

### Competition Category Alignment

**Most Helpful:**
- Focus on practical utility
- Solve real user problems
- Intuitive user experience
- Broad applicability

**Best Hybrid AI:**
- Smart local/cloud balance
- Graceful degradation
- Performance optimization
- Privacy consideration

**Best Multimodal:**
- Multiple AI API integration
- Seamless feature coordination
- Rich interaction patterns
- Comprehensive AI showcase

## 📚 Documentation Standards

### Code Documentation

**JSDoc Comments:**
```javascript
/**
 * Summarizes text using Chrome's Built-in Summarizer API
 * @param {string} text - The text to summarize
 * @param {Object} options - Summarization options
 * @param {string} options.type - Summary type ('key-points', 'tl;dr', 'teaser', 'headline')
 * @param {string} options.format - Output format ('markdown', 'plain-text')
 * @param {string} options.length - Summary length ('short', 'medium', 'long')
 * @returns {Promise<Object>} Summary result with success status and data
 */
async function summarizeText(text, options = {}) {
  // Implementation
}
```

**README Updates:**
- Update feature lists
- Modify installation instructions
- Add new API documentation
- Update testing procedures

## 🤝 Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment:

- **Be respectful** - Treat all contributors with respect
- **Be collaborative** - Work together towards common goals
- **Be constructive** - Provide helpful feedback and suggestions
- **Be patient** - Help newcomers learn and grow
- **Focus on competition success** - Align contributions with competition goals

### Getting Help

**Questions about Contributing:**
- Open an issue with the `question` label
- Check existing documentation first
- Be specific about what you need help with

**Technical Questions:**
- Chrome Extension development: [Chrome Developer Docs](https://developer.chrome.com/docs/extensions/)
- Built-in AI APIs: [Chrome AI Documentation](https://developer.chrome.com/docs/ai/built-in-apis)
- Competition details: [Chrome Built-in AI Challenge](https://developer.chrome.com/docs/ai/built-in-apis#challenge)

## 📋 Review Process

### What to Expect

1. **Automated Checks** - CI/CD pipeline validation
2. **Code Review** - Technical and style review
3. **Testing Verification** - Manual testing confirmation
4. **Competition Alignment** - Evaluation of competition value
5. **Documentation Review** - Accuracy and completeness check

### Review Criteria

**Technical Quality:**
- Code correctness and efficiency
- Error handling robustness
- Security best practices
- Performance considerations

**Competition Value:**
- Alignment with competition categories
- Innovation and creativity
- User experience enhancement
- Technical demonstration value

**Project Standards:**
- Code style consistency
- Documentation completeness
- Test coverage adequacy
- Accessibility compliance

## 🎯 Current Priorities

### High Priority Areas

1. **AI API Enhancements**
   - Advanced Prompt API integrations
   - Multi-API workflows
   - Performance optimizations
   - Error handling improvements

2. **User Experience**
   - Interface refinements
   - Accessibility improvements
   - Mobile responsiveness
   - Keyboard navigation

3. **Competition Readiness**
   - Documentation polish
   - Demo preparation
   - Performance benchmarks
   - Security hardening

### Feature Roadmap

**Short Term (Competition Prep):**
- [ ] Enhanced error messages
- [ ] Performance monitoring
- [ ] Accessibility audit
- [ ] Documentation completion

**Medium Term (Post-Competition):**
- [ ] Additional AI API integrations
- [ ] Advanced configuration options
- [ ] Internationalization
- [ ] Analytics integration

## 📞 Contact

**Project Maintainer:** DevFerreiraG
- **GitHub:** [@futurodevjunior](https://github.com/futurodevjunior)
- **Email:** futurodevjunior@gmail.com

**Competition Resources:**
- **Challenge Page:** [Chrome Built-in AI Challenge](https://developer.chrome.com/docs/ai/built-in-apis#challenge)
- **Documentation:** [Built-in AI APIs](https://developer.chrome.com/docs/ai/built-in-apis)
- **Origin Trials:** [Chrome Origin Trials](https://developer.chrome.com/origintrials/)

---

## 🙏 Acknowledgments

Contributors to ChromeMind help make this a stronger competition entry! Every contribution, no matter how small, is valued and appreciated.

**Special thanks to:**
- Chrome team for the amazing Built-in AI APIs
- Open source community for inspiration and support
- Competition participants for pushing innovation boundaries

---

**🏆 Let's build something amazing together for the Google Chrome Built-in AI Challenge 2025!**

*By contributing to ChromeMind, you're helping demonstrate the incredible potential of Chrome's Built-in AI APIs and contributing to the future of browser-native AI experiences.*