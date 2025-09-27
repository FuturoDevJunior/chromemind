// ChromeMind Side Panel - Integração completa com Built-in AI APIs
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

// Elementos da interface
const $ = (selector) => document.querySelector(selector);
const output = $('#output');
const hybridToggle = $('#hybridToggle');
const streamToggle = $('#streamToggle');

// Estado da aplicação
let isProcessing = false;

// Funções de UI
function showLoading(message = 'Processando...') {
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

// Função para obter texto da página
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
    throw new Error('Falha ao obter texto da página');
  } catch (error) {
    throw new Error(`Erro ao acessar a página: ${error.message}`);
  }
}

// Função para obter seleção
async function getSelection() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_SELECTION' });
    
    if (response?.success) {
      return response.text;
    }
    throw new Error('Falha ao obter seleção');
  } catch (error) {
    throw new Error(`Erro ao acessar seleção: ${error.message}`);
  }
}

// Wrapper para tentar local primeiro, depois híbrido
async function tryLocalThenHybrid(localFn, hybridFn, fallbackMessage) {
  const useHybrid = hybridToggle.checked;
  
  try {
    // Sempre tenta local primeiro
    return await localFn();
  } catch (localError) {
    console.warn('Erro na API local:', localError);
    
    if (useHybrid) {
      try {
        showLoading('Usando fallback cloud...');
        return await hybridFn();
      } catch (hybridError) {
        throw new Error(`Local: ${localError.message}\nHybrid: ${hybridError.message}`);
      }
    } else {
      throw new Error(`${localError.message}\n\n💡 Dica: Ative "Hybrid" para usar fallback cloud.`);
    }
  }
}

// Handlers dos botões

$('#btnSummarize').addEventListener('click', async () => {
  if (isProcessing) return;
  
  showLoading('Obtendo texto da página...');
  
  try {
    const { text, metadata } = await getPageText();
    if (!text || text.length < 50) {
      throw new Error('Página não contém texto suficiente para resumir');
    }

    showLoading('Gerando resumo...');
    
    const result = await tryLocalThenHybrid(
      () => summarizePageText(text, {
        type: "key-points",
        format: "markdown",
        length: "short",
        stream: streamToggle.checked,
        onStreamChunk: streamToggle.checked ? showStreaming : null
      }),
      () => hybridSummarize(text),
      'Summarizer API não disponível'
    );

    const finalResult = `📄 **Resumo da página**\n${metadata.title ? `**Título:** ${metadata.title}\n` : ''}\n${result}`;
    showResult(finalResult);

  } catch (error) {
    showResult(`❌ Erro no resumo:\n${error.message}`, true);
  }
});

$('#btnTranslate').addEventListener('click', async () => {
  if (isProcessing) return;
  
  showLoading('Obtendo texto...');
  
  try {
    let text = await getSelection();
    if (!text) {
      const pageData = await getPageText();
      text = pageData.text.substring(0, 2000); // Limita para tradução
      if (!text) {
        throw new Error('Nenhum texto selecionado ou encontrado na página');
      }
    }

    showLoading('Traduzindo para português...');
    
    const result = await tryLocalThenHybrid(
      async () => {
        const translation = await translateSelection(text, 'pt');
        if (!translation.isTranslated) {
          return `✅ **Texto já está em português**\n\n${translation.translatedText}`;
        }
        return `🌐 **Tradução ${translation.sourceLanguage} → ${translation.targetLanguage}**\n\n${translation.translatedText}`;
      },
      () => hybridTranslate(text, 'pt'),
      'Translator API não disponível'
    );

    showResult(result);

  } catch (error) {
    showResult(`❌ Erro na tradução:\n${error.message}`, true);
  }
});

$('#btnProofread').addEventListener('click', async () => {
  if (isProcessing) return;
  
  showLoading('Obtendo seleção...');
  
  try {
    const text = await getSelection();
    if (!text) {
      throw new Error('Selecione um texto primeiro para revisar');
    }

    if (text.length > 5000) {
      throw new Error('Texto muito longo. Selecione até 5000 caracteres.');
    }

    showLoading('Revisando texto...');
    
    const result = await tryLocalThenHybrid(
      () => proofreadSimple(text),
      () => hybridProofread(text),
      'Proofreader API não disponível'
    );

    showResult(`✏️ **Revisão Gramatical**\n\n${result}`);

  } catch (error) {
    showResult(`❌ Erro na revisão:\n${error.message}`, true);
  }
});

$('#btnRewrite').addEventListener('click', async () => {
  if (isProcessing) return;
  
  showLoading('Obtendo seleção...');
  
  try {
    const text = await getSelection();
    if (!text) {
      throw new Error('Selecione um texto primeiro para reescrever');
    }

    if (text.length > 3000) {
      throw new Error('Texto muito longo. Selecione até 3000 caracteres.');
    }

    showLoading('Reescrevendo texto...');
    
    const result = await tryLocalThenHybrid(
      () => rewrite(text, { tone: "clear", length: "medium" }),
      () => hybridRewrite(text),
      'Rewriter API não disponível'
    );

    showResult(`🔄 **Texto Reescrito**\n\n${result}`);

  } catch (error) {
    showResult(`❌ Erro na reescrita:\n${error.message}`, true);
  }
});

$('#btnPrompt').addEventListener('click', async () => {
  if (isProcessing) return;
  
  const question = $('#promptInput').value.trim();
  if (!question) {
    showResult('❌ Digite uma pergunta primeiro', true);
    return;
  }

  showLoading('Pensando...');
  
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
      'Prompt API não disponível'
    );

    showResult(`🧠 **Response**\n\n${result}`);
    $('#promptInput').value = '';

  } catch (error) {
    showResult(`❌ Erro no prompt:\n${error.message}`, true);
  }
});

// Inicialização e verificação de APIs
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

    console.log('Status das APIs:', {
      summarizer: summarizer.available,
      translator: translator.fullFeature,
      proofreader: proofreader.available,
      writer: writer.fullFeature,
      prompt: prompt.available
    });

    // Configura estado inicial dos toggles
    const hybridConfig = getHybridConfig();
    hybridToggle.checked = hybridConfig.enabled || false;

    // Mostra status inicial
    const readyAPIs = [];
    if (summarizer.available) readyAPIs.push('Resumo');
    if (translator.fullFeature) readyAPIs.push('Tradução');
    if (proofreader.available) readyAPIs.push('Revisão');
    if (writer.fullFeature) readyAPIs.push('Reescrita');
    if (prompt.available) readyAPIs.push('Prompt');

    const statusMessage = readyAPIs.length > 0 
      ? `✅ **Pronto!** APIs disponíveis: ${readyAPIs.join(', ')}`
      : `⚠️ **APIs não disponíveis localmente**\n\nAtivar "Hybrid" para usar fallback cloud`;

    showResult(statusMessage);

  } catch (error) {
    console.error('Erro na inicialização:', error);
    showResult(`❌ Erro ao inicializar: ${error.message}`, true);
  }
}

// Event listeners para toggles
hybridToggle.addEventListener('change', () => {
  const status = hybridToggle.checked ? 'ativado' : 'desativado';
  console.log(`Modo híbrido ${status}`);
});

streamToggle.addEventListener('change', () => {
  const status = streamToggle.checked ? 'ativado' : 'desativado';
  console.log(`Streaming ${status}`);
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

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Expor funções para debug no console
window.ChromeMindDebug = {
  checkSummarizerAvailability,
  checkTranslatorAvailability,
  checkProofreaderAvailability,
  checkWriterAvailability,
  checkPromptAvailability,
  getHybridConfig
};