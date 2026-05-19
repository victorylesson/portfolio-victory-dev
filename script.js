/* =========================================================
   victory_dev — script.js
   ========================================================= */

// ===== LOADER =====
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("done");
    // Inicia reveal após loader
    observeReveal();
    // Mensagem inicial do chatbot com delay
    setTimeout(showChatbotWelcome, 2000);
  }, 1800);
});

// ===== NAVBAR: scroll + mobile toggle =====
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navMobile = document.getElementById("navMobile");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

navToggle.addEventListener("click", () => {
  navMobile.classList.toggle("open");
});

// Fecha menu ao clicar em link
navMobile.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navMobile.classList.remove("open"));
});

// ===== SMOOTH SCROLL para qualquer âncora =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ===== REVEAL ANIMATION (Intersection Observer) =====
function observeReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Staggered delay por ordem de aparição
          entry.target.style.transitionDelay = `${(i % 4) * 0.1}s`;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// ===== FAQ ACCORDION =====
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const isOpen = item.classList.contains("open");

    // Fecha todos
    document
      .querySelectorAll(".faq-item")
      .forEach((i) => i.classList.remove("open"));

    // Abre o clicado se estava fechado
    if (!isOpen) item.classList.add("open");
  });
});

// ===== FORMULÁRIO COM VALIDAÇÃO =====
const API_URL = "https://victory-dev-server.onrender.com";

const form = document.getElementById("agendamentoForm");
const formSuccess = document.getElementById("formSuccess");

function validateField(id, errorId, message) {
  const field = document.getElementById(id);
  const error = document.getElementById(errorId);
  const value = field.value.trim();

  if (!value) {
    error.textContent = message;
    field.classList.add("invalid");
    return false;
  }

  if (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    error.textContent = "Digite um e-mail válido.";
    field.classList.add("invalid");
    return false;
  }

  if (id === "whatsapp" && value.replace(/\D/g, "").length < 10) {
    error.textContent = "Digite um WhatsApp válido.";
    field.classList.add("invalid");
    return false;
  }

  error.textContent = "";
  field.classList.remove("invalid");
  return true;
}

// Limpa erro ao digitar
["nome", "email", "whatsapp", "nicho", "servico"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("input", () => {
      el.classList.remove("invalid");
      const errEl = document.getElementById(id + "Error");
      if (errEl) errEl.textContent = "";
    });
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const v1 = validateField("nome", "nomeError", "Seu nome é obrigatório.");
  const v2 = validateField("email", "emailError", "Seu e-mail é obrigatório.");
  const v3 = validateField(
    "whatsapp",
    "whatsappError",
    "WhatsApp é obrigatório.",
  );
  const v4 = validateField("nicho", "nichoError", "Selecione seu segmento.");
  const v5 = validateField(
    "servico",
    "servicoError",
    "Selecione o que precisa.",
  );

  if (!v1 || !v2 || !v3 || !v4 || !v5) return;

  const btn = document.getElementById("btnText");
  btn.textContent = "Enviando...";

  const dados = {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
    whatsapp: document.getElementById("whatsapp").value,
    nicho: document.getElementById("nicho").value,
    servico: document.getElementById("servico").value,
    mensagem: document.getElementById("mensagem").value,
  };

  try {
    const resposta = await fetch(`${API_URL}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (resposta.ok) {
      form.style.display = "none";
      formSuccess.classList.remove("hidden");
    } else {
      btn.textContent = "Enviar";
      alert("Erro ao enviar. Tente novamente.");
    }
  } catch (erro) {
    console.error("Erro ao conectar com o servidor:", erro);
    btn.textContent = "Enviar";
    alert("Erro ao conectar. Tente novamente.");
  }
});

// Formata telefone automaticamente
const whatsInput = document.getElementById("whatsapp");
if (whatsInput) {
  whatsInput.addEventListener("input", () => {
    let v = whatsInput.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) {
      v = `(${v.slice(0, 2)}) ${v[2]} ${v.slice(3, 7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    }
    whatsInput.value = v;
  });
}

// ===== CHATBOT =====
const chatbotToggle = document.getElementById("chatbotToggle");
const chatbotBox = document.getElementById("chatbotBox");
const chatbotClose = document.getElementById("chatbotClose");
const chatbotMessages = document.getElementById("chatbotMessages");
const chatbotInput = document.getElementById("chatbotInput");
const chatbotSend = document.getElementById("chatbotSend");
const quickRepliesEl = document.getElementById("quickReplies");
const chatbotBadge = document.getElementById("chatbotBadge");

// Banco de respostas
const chatResponses = {
  oi: "Olá! Seja bem-vindo à victory_dev. Como posso te ajudar hoje?",
  olá: "Olá! Seja bem-vindo à victory_dev. Como posso te ajudar hoje?",
  ola: "Olá! Seja bem-vindo à victory_dev. Como posso te ajudar hoje?",
  ola: "Olá! Tudo bem? Pode falar, estou aqui para ajudar!",
  serviços:
    "Ofereço desenvolvimento de sites, landing pages, automações com IA, gestão de dados e suporte técnico. Qual desses você precisa?",
  servicos:
    "Ofereço desenvolvimento de sites, landing pages, automações com IA, gestão de dados e suporte técnico. Qual desses você precisa?",
  site: "Desenvolvo sites modernos, rápidos e focados em conversão. Cada projeto é 100% personalizado. Quer agendar uma conversa para falar sobre o seu?",
  preço:
    "Os valores variam conforme o escopo. Landing pages costumam ser uma ótima escolha para o início. O mais bacana é você agendar uma consulta gratuita e eu te faço um orçamento personalizado!",
  preco:
    "Os valores variam conforme o escopo. Landing pages costumam ser uma ótima escolha para o início. O mais bacana é você agendar uma consulta gratuita e eu te faço um orçamento personalizado!",
  valor:
    "Cada projeto tem um orçamento personalizado. Me conta o que você precisa e te passo um valor exato. Pode agendar uma reunião gratuita pelo formulário da página!",
  prazo:
    "Landing pages prontas em 3 a 5 dias úteis. Sites completos de 7 a 15 dias. Sempre cumprido o combinado.",
  automação:
    "Com automações você economiza tempo, reduz erros e atende clientes 24h sem precisar de equipe. Posso integrar com WhatsApp, Instagram e sistemas que você já usa.",
  automacao:
    "Com automações você economiza tempo, reduz erros e atende clientes 24h sem precisar de equipe. Posso integrar com WhatsApp, Instagram e sistemas que você já usa.",
  contato:
    "Pode me chamar no WhatsApp (81) 9 9148-2982, por e-mail em victorymendestech@hotmail.com ou pelo Instagram @victory_dev!",
  whatsapp:
    "Clica no botão verde no canto da tela ou acessa: wa.me/5581991482982. Respondo rápido!",
  agendar:
    "Preencha o formulário de agendamento aqui na página e entro em contato em até 2 horas para confirmar. É totalmente gratuito!",
  agendamento:
    "Preencha o formulário de agendamento aqui na página e entro em contato em até 2 horas para confirmar. É totalmente gratuito!",
  projetos:
    "Já conclui projetos de clínicas, restaurantes, escritórios, academias, e-commerces e muito mais. Dá uma olhada nos cases na seção Portfólio!",
  suporte:
    "Todo projeto inclui 30 dias de suporte gratuito após a entrega. Também ofereço planos mensais de manutenção.",
  obrigado: "Disponha! Se precisar de mais alguma coisa, é só falar.",
  tchau: "Até mais! Qualquer dúvida é só chamar. Bons negócios!",
};

const defaultResponse =
  "Não entendi muito bem. Mas fica à vontade para me chamar no WhatsApp (81) 9 9148-2982 ou preencher o formulário de agendamento que entro em contato rapidinho!";

const quickReplies = [
  "Quero um site",
  "Qual o preço?",
  "Agendar reunião",
  "Contato",
];

function getTime() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = `chat-msg ${type}`;

  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.textContent = text;

  const time = document.createElement("span");
  time.className = "chat-time";
  time.textContent = getTime();

  msg.appendChild(bubble);
  msg.appendChild(time);
  chatbotMessages.appendChild(msg);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function showTyping() {
  const typing = document.createElement("div");
  typing.className = "chat-msg bot";
  typing.id = "typingIndicator";

  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";

  const dots = document.createElement("div");
  dots.className = "typing-dots";
  dots.innerHTML = "<span></span><span></span><span></span>";

  bubble.appendChild(dots);
  typing.appendChild(bubble);
  chatbotMessages.appendChild(typing);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typingIndicator");
  if (typing) typing.remove();
}

function getBotResponse(input) {
  const normalized = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  for (const key of Object.keys(chatResponses)) {
    if (normalized.includes(key)) return chatResponses[key];
  }
  return defaultResponse;
}

function botReply(text) {
  showTyping();
  setTimeout(
    () => {
      removeTyping();
      addMessage(text, "bot");
      renderQuickReplies();
    },
    900 + Math.random() * 400,
  );
}

function sendUserMessage(text) {
  if (!text.trim()) return;
  addMessage(text, "user");
  chatbotInput.value = "";
  clearQuickReplies();
  const response = getBotResponse(text);
  botReply(response);
}

function renderQuickReplies() {
  clearQuickReplies();
  quickReplies.forEach((label) => {
    const btn = document.createElement("button");
    btn.className = "quick-reply-btn";
    btn.textContent = label;
    btn.addEventListener("click", () => sendUserMessage(label));
    quickRepliesEl.appendChild(btn);
  });
}

function clearQuickReplies() {
  quickRepliesEl.innerHTML = "";
}

function showChatbotWelcome() {
  // Não mostra se o bot já foi aberto
  if (chatbotBox.classList.contains("open")) return;
  chatbotBadge.classList.remove("hidden");
}

// Abre/fecha chatbot
chatbotToggle.addEventListener("click", () => {
  const isOpen = chatbotBox.classList.contains("open");
  if (!isOpen) {
    chatbotBox.classList.add("open");
    chatbotBadge.classList.add("hidden");
    // Mensagem de boas-vindas na primeira abertura
    if (chatbotMessages.children.length === 0) {
      setTimeout(() => {
        addMessage(
          "Olá! Sou o assistente de victory_dev. Como posso te ajudar?",
          "bot",
        );
        renderQuickReplies();
      }, 400);
    }
  } else {
    chatbotBox.classList.remove("open");
  }
});

chatbotClose.addEventListener("click", () => {
  chatbotBox.classList.remove("open");
});

// Envio de mensagem
chatbotSend.addEventListener("click", () =>
  sendUserMessage(chatbotInput.value),
);
chatbotInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendUserMessage(chatbotInput.value);
});

// ===== ANIMAÇÃO DE HOVER NOS HERO CARDS =====
document.querySelectorAll(".hero-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
    card.style.transform = `perspective(400px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-4px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ===== ACTIVE NAV LINK POR SEÇÃO =====
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.style.color =
      link.getAttribute("href") === `#${current}` ? "var(--neon)" : "";
  });
});
