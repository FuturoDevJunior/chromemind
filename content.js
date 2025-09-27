// Content script for extracting text from pages
function getReadablePageText() {
  try {
    // Prioritize semantic elements first
    const candidates = [
      'article',
      'main', 
      '[role="main"]',
      '.content',
      '.post-content',
      '.entry-content',
      '#content'
    ];
    
    let targetElement = document.body;
    
    // Try to find the best content container
    for (const selector of candidates) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim().length > 100) {
        targetElement = element;
        break;
      }
    }
    
    // Create walker to extract clean text
    const walker = document.createTreeWalker(
      targetElement, 
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Ignore scripts, styles and hidden elements
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          const style = window.getComputedStyle(parent);
          if (style.display === 'none' || style.visibility === 'hidden') {
            return NodeFilter.FILTER_REJECT;
          }
          
          const tagName = parent.tagName.toLowerCase();
          if (['script', 'style', 'noscript', 'iframe'].includes(tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    
    let textBuffer = '';
    let charCount = 0;
    const maxChars = 50000; // Production limit for performance and memory
    
    while (walker.nextNode() && charCount < maxChars) {
      const text = walker.currentNode.nodeValue.trim();
      if (text && text.length > 2 && !/^\s*$/.test(text)) {
        textBuffer += text + ' ';
        charCount += text.length;
      }
    }
    
    // Clean extra spaces and return
    return textBuffer.replace(/\s+/g, ' ').trim();
    
  } catch (error) {
    // Log for troubleshooting while maintaining user privacy
    console.error('ChromeMind: Error extracting page text:', error.message);
    return document.body.textContent?.substring(0, 10000) || '';
  }
}

function getSelectionText() {
  try {
    const selection = window.getSelection();
    if (!selection.rangeCount) return '';
    
    const range = selection.getRangeAt(0);
    const text = range.toString().trim();
    
    // Limit very large selection
    return text.length > 10000 ? text.substring(0, 10000) + '...' : text;
    
  } catch (error) {
    console.error('ChromeMind: Error getting selection:', error.message);
    return '';
  }
}

function getPageMetadata() {
  try {
    const title = document.title || '';
    const url = window.location.href;
    const lang = document.documentElement.lang || 'unknown';
    
    // Try to get page description
    const description = document.querySelector('meta[name="description"]')?.content || '';
    
    return { title, url, lang, description };
  } catch (error) {
    console.error('ChromeMind: Error getting metadata:', error.message);
    return { title: '', url: '', lang: 'unknown', description: '' };
  }
}

// Listener for side panel messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    switch (message.type) {
      case 'GET_PAGE_TEXT':
        const pageText = getReadablePageText();
        sendResponse({ 
          success: true, 
          text: pageText,
          metadata: getPageMetadata()
        });
        break;
        
      case 'GET_SELECTION':
        const selection = getSelectionText();
        sendResponse({ 
          success: true, 
          text: selection 
        });
        break;
        
      case 'PING':
        sendResponse({ success: true, message: 'Content script active' });
        break;
        
      default:
        sendResponse({ success: false, error: 'Message type not recognized' });
    }
  } catch (error) {
    console.error('ChromeMind content script error:', error.message);
    sendResponse({ success: false, error: error.message });
  }
  
  return true; // Keep response channel open
});

// ChromeMind content script loaded successfully