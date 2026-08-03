// ============================================================
// Zeca · PizzaCode — front-end estático do chat.
// Fala com um agente de IA hospedado no n8n via webhook (POST).
// Não usa nenhuma chave de API — todo o "cérebro" fica no n8n.
// ============================================================

const $ = (id) => document.getElementById(id);

const chatEl = $("chat");
const composerEl = $("composer");
const inputEl = $("msgInput");
const sendBtn = $("sendBtn");
const settingsPanel = $("settingsPanel");
const settingsToggle = $("settingsToggle");
const webhookInput = $("webhookUrl");
const saveUrlBtn = $("saveUrl");
const themeToggle = $("themeToggle");

const STORAGE_KEY = "lab365_webhook_url";
const THEME_KEY = "lab365_theme";
const PLACEHOLDER_URL = "https://SEU-N8N/webhook/chat";

// --- Tema (segue o SO por padrão; pode ser forçado e fica salvo) ---
(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  updateThemeIcon();
})();

themeToggle.addEventListener("click", () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const current = document.documentElement.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
  updateThemeIcon();
});

function updateThemeIcon() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const current = document.documentElement.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
  themeToggle.querySelector("span").textContent = current === "dark" ? "☀️" : "🌙";
}

// --- Configuração do webhook ---
function getWebhookUrl() {
  return (localStorage.getItem(STORAGE_KEY) || window.WEBHOOK_URL || "").trim();
}

webhookInput.value = localStorage.getItem(STORAGE_KEY) || window.WEBHOOK_URL || "";

settingsToggle.addEventListener("click", () => {
  const isHidden = settingsPanel.hasAttribute("hidden");
  if (isHidden) {
    settingsPanel.removeAttribute("hidden");
    settingsToggle.setAttribute("aria-expanded", "true");
    webhookInput.focus();
  } else {
    settingsPanel.setAttribute("hidden", "");
    settingsToggle.setAttribute("aria-expanded", "false");
  }
});

saveUrlBtn.addEventListener("click", () => {
  const url = webhookInput.value.trim();
  if (url) {
    localStorage.setItem(STORAGE_KEY, url);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  addMessage("sys", "URL do webhook salva ✓");
});

// --- Chips de sugestão: só preenchem o input, quem envia é o usuário ---
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    inputEl.value = chip.textContent;
    inputEl.focus();
  });
});

// --- Mensagens no chat ---
function addMessage(kind, text) {
  const div = document.createElement("div");
  div.className = kind === "sys" ? "msg sys" : kind === "err" ? "msg err" : `msg ${kind}`;
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
  return div;
}

function addTyping() {
  const div = document.createElement("div");
  div.className = "msg bot";
  div.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
  return div;
}

// Mensagem de boas-vindas do Zeca
addMessage("bot", "Oi! Eu sou o Zeca 🍕, atendente virtual da PizzaCode. Pergunte sobre o cardápio, horários ou entregas!");

// --- Envio ---
composerEl.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = getWebhookUrl();
  const text = inputEl.value.trim();
  if (!text) return;

  if (!url || url === PLACEHOLDER_URL) {
    addMessage(
      "err",
      "Nenhum webhook configurado. Abra as configurações (⚙️) e cole a Production URL do seu Webhook n8n."
    );
    return;
  }

  addMessage("me", text);
  inputEl.value = "";
  sendBtn.disabled = true;

  const typingBubble = addTyping();

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensagem: text }),
    });

    const raw = await res.text();

    if (!res.ok) {
      typingBubble.remove();
      addMessage("err", `Erro HTTP ${res.status} ao falar com o Zeca. Verifique se o workflow n8n está ATIVO.`);
      return;
    }

    // A resposta pode vir como texto puro OU JSON { resposta: "..." }
    let reply = raw;
    try {
      const json = JSON.parse(raw);
      reply = json.resposta ?? json.output ?? json.text ?? raw;
    } catch (_) {
      // não era JSON, usa o texto puro mesmo
    }

    typingBubble.className = "msg bot";
    typingBubble.textContent = reply || "(resposta vazia)";
    chatEl.scrollTop = chatEl.scrollHeight;
  } catch (err) {
    typingBubble.remove();
    addMessage(
      "err",
      "Falha de rede ao chamar o webhook. Verifique a URL, se o workflow está ativo e se o CORS (Allowed Origins) está liberado no nó Webhook do n8n."
    );
  } finally {
    sendBtn.disabled = false;
    inputEl.focus();
  }
});
