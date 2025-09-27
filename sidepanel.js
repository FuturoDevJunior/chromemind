// ChromeMind Side Panel - Complete Built-in AI APIs Integration
import { summarizePageText, checkSummarizerAvailability } from './lib/ai-summarizer.js';
import { translateSelection, checkTranslatorAvailability } from './lib/ai-translate.js';
import { proofreadSimple, checkProofreaderAvailability } from './lib/ai-proofreader.js';
import { rewrite, checkWriterAvailability } from './lib/ai-writer.js';
import { promptNano, checkPromptAvailability } from './lib/ai-prompt.js';
import { 
  hybridPrompt, 
  hybridSummarize, 
  hybridTranslate, 
  hybridProofread, 
  hybridRewrite,
  getHybridConfig 
} from './hybrid/fallback.js';

// Interface elements
const $ = (selector) => document.querySelector(selector);
const output = $('#output');
const hybridToggle = $('#hybridToggle');
const streamToggle = $('#streamToggle');

// Application state
let isProcessing = false;

// UI Functions
function showLoading(message = 'Processing...') {
  output.textContent = `⏳ ${message}`;
  output.className = 'output loading';
  setButtonsState(false);
}

function showResult(text, isError = false) {
  output.textContent = text;
  output.className = isError ? 'output error' : 'output success';
  setButtonsState(true);
}

function showStreaming(text) {
  output.textContent = text;
  output.className = 'output';
}

function setButtonsState(enabled) {
  isProcessing = !enabled;
  document.querySelectorAll('button').forEach(btn => {
    btn.disabled = !enabled;
  });
}

// Function to get page text
async function getPageText() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_TEXT' });
    
    if (response?.success) {
      return {
        text: response.text,
        metadata: response.metadata || {}
      };
    }
    throw new Error('Failed to get page text');
  } catch (error) {
    throw new Error(`Error accessing page: ${error.message}`);
  }
}

// Function to get selection
async function getSelection() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_SELECTION' });
    
    if (response?.success) {
      return response.text;
    }
    throw new Error('Failed to get selection');
  } catch (error) {
    throw new Error(`Error accessing selection: ${error.message}`);
  }
}

// Wrapper para tentar local primeiro, depois híbrido
async function tryLocalThenHybrid(localFn, hybridFn, fallbackMessage) {
  const useHybrid = hybridToggle.checked;
  
  try {
    // Sempre tenta local primeiro
    return await localFn();
  } catch (localError) {
    console.warn('Local API error:', localError);
    
    if (useHybrid) {
      try {
        showLoading('Using cloud fallback...');
        return await hybridFn();
      } catch (hybridError) {
        throw new Error(`Local: ${localError.message}\nHybrid: ${hybridError.message}`);
      }
    } else {
      throw new Error(`${localError.message}\n\n💡 Tip: Enable "Hybrid" toggle to use cloud fallback when local AI APIs are unavailable.`);
    }
  }
}

// Button handlers

$('#btnSummarize').addEventListener('click', async () => {
  if (isProcessing) return;
  
  showLoading('Getting page text...');
  
  try {
    const { text, metadata } = await getPageText();
    if (!text || text.length < 50) {
      throw new Error('Page does not contain enough text to summarize');
    }

    showLoading('Generating summary...');
    
    const result = await tryLocalThenHybrid(
      () => summarizePageText(text, {
        type: "key-points",
        format: "markdown",
        length: "short",
        stream: streamToggle.checked,
        onStreamChunk: streamToggle.checked ? showStreaming : null
      }),
      () => hybridSummarize(text),
      'Summarizer API not available'
    );

    const finalResult = `📄 **Page Summary**\n${metadata.title ? `**Title:** ${metadata.title}\n` : ''}\n${result}`;
    showResult(finalResult);

  } catch (error) {
    showResult(`❌ Summary error:\n${error.message}`, true);
  }
});

$('#btnTranslate').addEventListener('click', async () => {
  if (isProcessing) return;
  
  showLoading('Getting text...');
  
  try {
    let text = await getSelection();
    if (!text) {
      const pageData = await getPageText();
      text = pageData.text.substring(0, 2000); // Limit for translation
      if (!text) {
        throw new Error('No text selected or found on page');
      }
    }

    showLoading('Translating to English...');
    
    const result = await tryLocalThenHybrid(
      async () => {
        const translation = await translateSelection(text, 'en');
        if (!translation.isTranslated) {
          return `✅ **Text is already in English**\n\n${translation.translatedText}`;
        }
        return `🌐 **Translation ${translation.sourceLanguage} → ${translation.targetLanguage}**\n\n${translation.translatedText}`;
      },
      () => hybridTranslate(text, 'en'),
      'Translator API not available'
    );

    showResult(result);

  } catch (error) {
    showResult(`❌ Translation error:\n${error.message}`, true);
  }
});

$('#btnProofread').addEventListener('click', async () => {
  if (isProcessing) return;
  
  showLoading('Getting selection...');
  
  try {
    const text = await getSelection();
    if (!text) {
      throw new Error('Please select text first to proofread');
    }

    if (text.length > 5000) {
      throw new Error('Text too long. Please select up to 5000 characters.');
    }

    showLoading('Proofreading text...');
    
    const result = await tryLocalThenHybrid(
      () => proofreadSimple(text),
      () => hybridProofread(text),
      'Proofreader API not available'
    );

    showResult(`✏️ **Grammar Review**\n\n${result}`);

  } catch (error) {
    showResult(`❌ Proofreading error:\n${error.message}`, true);
  }
});

$('#btnRewrite').addEventListener('click', async () => {
  if (isProcessing) return;
  
  showLoading('Getting selection...');
  
  try {
    const text = await getSelection();
    if (!text) {
      throw new Error('Please select text first to rewrite');
    }

    if (text.length > 3000) {
      throw new Error('Text too long. Please select up to 3000 characters.');
    }

    showLoading('Rewriting text...');
    
    const result = await tryLocalThenHybrid(
      () => rewrite(text, { tone: "clear", length: "medium" }),
      () => hybridRewrite(text),
      'Rewriter API not available'
    );

    showResult(`🔄 **Rewritten Text**\n\n${result}`);

  } catch (error) {
    showResult(`❌ Rewriting error:\n${error.message}`, true);
  }
});

$('#btnPrompt').addEventListener('click', async () => {
  if (isProcessing) return;
  
  const question = $('#promptInput').value.trim();
  if (!question) {
    showResult('❌ Please enter a question first', true);
    return;
  }

  showLoading('Thinking...');
  
  try {
    const mode = $('#promptMode').value;
    
    const result = await tryLocalThenHybrid(
      () => promptNano({
        text: question,
        systemPrompt: "You are a helpful and concise assistant integrated into Chrome. Respond clearly and objectively.",
        mode,
        stream: streamToggle.checked,
        onStreamChunk: streamToggle.checked ? showStreaming : null
      }),
      () => hybridPrompt(question, { mode }),
      'Prompt API not available'
    );

    showResult(`🧠 **Response**\n\n${result}`);
    $('#promptInput').value = '';

  } catch (error) {
    showResult(`❌ Prompt error:\n${error.message}`, true);
  }
});

// API initialization and checking
async function initializeApp() {
  try {
    // Verifica disponibilidade das APIs
    const [summarizer, translator, proofreader, writer, prompt] = await Promise.all([
      checkSummarizerAvailability(),
      checkTranslatorAvailability(),
      checkProofreaderAvailability(),
      checkWriterAvailability(),
      checkPromptAvailability()
    ]);

    // Log API status for development only
    if (typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || sessionStorage.getItem('debug'))) {
      console.log('ChromeMind API Status:', {
        summarizer: summarizer.available,
        translator: translator.fullFeature,
        proofreader: proofreader.available,
        writer: writer.fullFeature,
        prompt: prompt.available
      });
    }

    // Configura estado inicial dos toggles
    const hybridConfig = getHybridConfig();
    hybridToggle.checked = hybridConfig.enabled || false;

    // Mostra status inicial
    const readyAPIs = [];
    if (summarizer.available) readyAPIs.push('Summary');
    if (translator.fullFeature) readyAPIs.push('Translation');
    if (proofreader.available) readyAPIs.push('Proofreading');
    if (writer.fullFeature) readyAPIs.push('Rewriting');
    if (prompt.available) readyAPIs.push('Prompt');

    const statusMessage = readyAPIs.length > 0 
      ? `✅ **Ready!** Available APIs: ${readyAPIs.join(', ')}`
      : `⚠️ **APIs not available locally**\n\nEnable "Hybrid" to use cloud fallback`;

    showResult(statusMessage);

  } catch (error) {
    console.error('Initialization error:', error);
    showResult(`❌ Initialization error: ${error.message}`, true);
  }
}

// Event listeners para toggles
hybridToggle.addEventListener('change', () => {
  const status = hybridToggle.checked ? 'enabled' : 'disabled';
  // Development debug only
  if (sessionStorage.getItem('debug')) {
    console.log(`ChromeMind: Hybrid mode ${status}`);
  }
});

streamToggle.addEventListener('change', () => {
  const status = streamToggle.checked ? 'enabled' : 'disabled';
  // Development debug only
  if (sessionStorage.getItem('debug')) {
    console.log(`ChromeMind: Streaming ${status}`);
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 's':
        e.preventDefault();
        $('#btnSummarize').click();
        break;
      case 't':
        e.preventDefault();
        $('#btnTranslate').click();
        break;
      case 'Enter':
        if (e.target.id === 'promptInput') {
          e.preventDefault();
          $('#btnPrompt').click();
        }
        break;
    }
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Cleanup function for when panel is closed
function cleanup() {
  // Cleanup is handled automatically by Chrome when panel closes
  if (window.ChromeMindDebug?.sessionManager) {
    window.ChromeMindDebug.sessionManager.destroyAllSessions();
  }
}

// Listen for beforeunload to cleanup
window.addEventListener('beforeunload', cleanup);

// Expose functions for console debugging and production troubleshooting
window.ChromeMindDebug = {
  checkSummarizerAvailability,
  checkTranslatorAvailability,
  checkProofreaderAvailability,
  checkWriterAvailability,
  checkPromptAvailability,
  getHybridConfig,
  cleanup,
  enableDebug: () => sessionStorage.setItem('debug', 'true'),
  disableDebug: () => sessionStorage.removeItem('debug'),
  version: '1.0.0'
};