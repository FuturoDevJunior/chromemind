// Content script para extrair texto das páginas
function getReadablePageText() {
  try {
    // Prioriza elementos semânticos primeiro
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
    
    // Tenta encontrar o melhor container de conteúdo
    for (const selector of candidates) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim().length > 100) {
        targetElement = element;
        break;
      }
    }
    
    // Cria walker para extrair texto limpo
    const walker = document.createTreeWalker(
      targetElement, 
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Ignora scripts, styles e elementos ocultos
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
    const maxChars = 50000; // Limite para performance
    
    while (walker.nextNode() && charCount < maxChars) {
      const text = walker.currentNode.nodeValue.trim();
      if (text && text.length > 2 && !/^\s*$/.test(text)) {
        textBuffer += text + ' ';
        charCount += text.length;
      }
    }
    
    // Limpa espaços extras e retorna
    return textBuffer.replace(/\s+/g, ' ').trim();
    
  } catch (error) {
    console.error('Erro ao extrair texto da página:', error);
    return document.body.textContent?.substring(0, 10000) || '';
  }
}

function getSelectionText() {
  try {
    const selection = window.getSelection();
    if (!selection.rangeCount) return '';
    
    const range = selection.getRangeAt(0);
    const text = range.toString().trim();
    
    // Limita seleção muito grande
    return text.length > 10000 ? text.substring(0, 10000) + '...' : text;
    
  } catch (error) {
    console.error('Erro ao obter seleção:', error);
    return '';
  }
}

function getPageMetadata() {
  try {
    const title = document.title || '';
    const url = window.location.href;
    const lang = document.documentElement.lang || 'unknown';
    
    // Tenta obter descrição da página
    const description = document.querySelector('meta[name="description"]')?.content || '';
    
    return { title, url, lang, description };
  } catch (error) {
    console.error('Erro ao obter metadados:', error);
    return { title: '', url: '', lang: 'unknown', description: '' };
  }
}

// Listener para mensagens do side panel
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
        sendResponse({ success: true, message: 'Content script ativo' });
        break;
        
      default:
        sendResponse({ success: false, error: 'Tipo de mensagem não reconhecido' });
    }
  } catch (error) {
    console.error('Erro no content script:', error);
    sendResponse({ success: false, error: error.message });
  }
  
  return true; // Mantém o canal de resposta aberto
});

// Sinaliza que o content script foi carregado
console.log('ChromeMind content script carregado');