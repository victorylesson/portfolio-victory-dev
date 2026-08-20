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
  }, 600);
});

// ===== NAVBAR: scroll + mobile toggle =====
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navMobile = document.getElementById("navMobile");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

navToggle.addEventListener("click", () => {
  const isOpen = navMobile.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

// Fecha menu ao clicar em link
navMobile.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMobile.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ===== SMOOTH SCROLL para qualquer âncora =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));

    if (target) {
      e.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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
    {
      threshold: 0.12,
    },
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
    if (!isOpen) {
      item.classList.add("open");
    }
  });
});

// ===== FORMULÁRIO COM VALIDAÇÃO =====
const API_URL = "https://victory-dev-server.onrender.com";

const form = document.getElementById("agendamentoForm");
const formSuccess = document.getElementById("formSuccess");

function validateField(id, errorId, message) {
  const field = document.getElementById(id);
  const error = document.getElementById(errorId);

  if (!field || !error) return false;

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

      if (errEl) {
        errEl.textContent = "";
      }
    });
  }
});

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const v1 = validateField("nome", "nomeError", "Seu nome é obrigatório.");

    const v2 = validateField(
      "email",
      "emailError",
      "Seu e-mail é obrigatório.",
    );

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

    if (!v1 || !v2 || !v3 || !v4 || !v5) {
      return;
    }

    const btn = document.getElementById("btnText");

    if (btn) {
      btn.textContent = "Enviando...";
    }

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (resposta.ok) {
        form.style.display = "none";
        formSuccess.classList.remove("hidden");
      } else {
        if (btn) {
          btn.textContent = "Enviar";
        }

        alert("Erro ao enviar. Tente novamente.");
      }
    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);

      if (btn) {
        btn.textContent = "Enviar";
      }

      alert("Erro ao conectar. Tente novamente.");
    }
  });
}

// ===== FORMATA TELEFONE AUTOMATICAMENTE =====
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

// =========================================================
// CHATBOT
// =========================================================

const chatbotWrapper = document.getElementById("chatbotWrapper");
const chatbotToggle = document.getElementById("chatbotToggle");
const chatbotBox = document.getElementById("chatbotBox");
const chatbotClose = document.getElementById("chatbotClose");
const chatbotMessages = document.getElementById("chatbotMessages");
const chatbotInput = document.getElementById("chatbotInput");
const chatbotSend = document.getElementById("chatbotSend");
const quickRepliesEl = document.getElementById("quickReplies");
const chatbotBadge = document.getElementById("chatbotBadge");

// =========================================================
// BANCO DE RESPOSTAS
// =========================================================

const chatResponses = {
  oi: "Olá! Sou o assistente da victory_dev. Posso ajudar você a encontrar a melhor solução para o seu projeto. O que você está procurando?",

  olá: "Olá! Sou o assistente da victory_dev. Posso ajudar você a encontrar a melhor solução para o seu projeto. O que você está procurando?",

  ola: "Olá! Sou o assistente da victory_dev. Posso ajudar você a encontrar a melhor solução para o seu projeto. O que você está procurando?",

  serviços:
    "A victory_dev trabalha com desenvolvimento de sites, landing pages, automações, gestão de dados e suporte técnico. Se você me contar o que precisa, posso indicar a solução mais adequada.",

  servicos:
    "A victory_dev trabalha com desenvolvimento de sites, landing pages, automações, gestão de dados e suporte técnico. Se você me contar o que precisa, posso indicar a solução mais adequada.",

  site: "Desenvolvo sites modernos, rápidos, responsivos e pensados para gerar resultados. Cada projeto é personalizado de acordo com o negócio. Se quiser, posso orientar você sobre qual tipo de site faz mais sentido.",

  sites:
    "Desenvolvo sites modernos, rápidos, responsivos e pensados para gerar resultados. Cada projeto é personalizado de acordo com o negócio. Se quiser, posso orientar você sobre qual tipo de site faz mais sentido.",

  preço:
    "O valor depende do tipo e da complexidade do projeto. Landing pages costumam ser uma opção mais enxuta, enquanto sites completos e soluções sob medida são avaliados individualmente. Se quiser, posso orientar você sobre o próximo passo.",

  preco:
    "O valor depende do tipo e da complexidade do projeto. Landing pages costumam ser uma opção mais enxuta, enquanto sites completos e soluções sob medida são avaliados individualmente. Se quiser, posso orientar você sobre o próximo passo.",

  valor:
    "Cada projeto recebe um orçamento personalizado de acordo com o que precisa ser desenvolvido. Se você me explicar brevemente sua ideia, posso orientar sobre a solução mais adequada.",

  orçamento:
    "Cada projeto recebe um orçamento personalizado de acordo com o que precisa ser desenvolvido. Se você me explicar brevemente sua ideia, posso orientar sobre a solução mais adequada.",

  orcamento:
    "Cada projeto recebe um orçamento personalizado de acordo com o que precisa ser desenvolvido. Se você me explicar brevemente sua ideia, posso orientar sobre a solução mais adequada.",

  prazo:
    "Landing pages costumam ficar prontas em 3 a 5 dias úteis. Sites completos levam aproximadamente 7 a 15 dias, dependendo do projeto e das funcionalidades.",

  automação:
    "As automações ajudam a reduzir tarefas repetitivas, diminuir erros e economizar tempo. Posso integrar processos com WhatsApp, Instagram e outros sistemas que você já utiliza.",

  automacao:
    "As automações ajudam a reduzir tarefas repetitivas, diminuir erros e economizar tempo. Posso integrar processos com WhatsApp, Instagram e outros sistemas que você já utiliza.",

  automações:
    "As automações ajudam a reduzir tarefas repetitivas, diminuir erros e economizar tempo. Posso integrar processos com WhatsApp, Instagram e outros sistemas que você já utiliza.",

  automacoes:
    "As automações ajudam a reduzir tarefas repetitivas, diminuir erros e economizar tempo. Posso integrar processos com WhatsApp, Instagram e outros sistemas que você já utiliza.",

  dados:
    "A gestão de dados pode incluir dashboards, relatórios, organização de informações e integração entre ferramentas. Se você me explicar o que precisa acompanhar, posso indicar uma solução.",

  dashboard:
    "A gestão de dados pode incluir dashboards, relatórios, organização de informações e integração entre ferramentas. Se você me explicar o que precisa acompanhar, posso indicar uma solução.",

  dashboards:
    "A gestão de dados pode incluir dashboards, relatórios, organização de informações e integração entre ferramentas. Se você me explicar o que precisa acompanhar, posso indicar uma solução.",

  contato:
    "Você pode entrar em contato pelo WhatsApp, pelo e-mail ou pelo formulário de agendamento da página. Se preferir, posso orientar você para o canal mais adequado.",

  whatsapp:
    "Você pode utilizar o botão verde de WhatsApp no canto da página para falar diretamente com a victory_dev.",

  agendar:
    "Você pode preencher o formulário de agendamento aqui na página. A conversa é gratuita e serve para entender seu negócio, sua necessidade e definir a melhor solução.",

  agendamento:
    "Você pode preencher o formulário de agendamento aqui na página. A conversa é gratuita e serve para entender seu negócio, sua necessidade e definir a melhor solução.",

  reunião:
    "Você pode preencher o formulário de agendamento aqui na página. A conversa é gratuita e serve para entender seu negócio, sua necessidade e definir a melhor solução.",

  reuniao:
    "Você pode preencher o formulário de agendamento aqui na página. A conversa é gratuita e serve para entender seu negócio, sua necessidade e definir a melhor solução.",

  projetos:
    "Você pode conhecer alguns dos projetos desenvolvidos na seção Portfólio. Há trabalhos para diferentes segmentos, como clínicas, restaurantes e escritórios.",

  projeto:
    "Você pode conhecer alguns dos projetos desenvolvidos na seção Portfólio. Há trabalhos para diferentes segmentos, como clínicas, restaurantes e escritórios.",

  suporte:
    "Todo projeto inclui 30 dias de suporte gratuito após a entrega. Depois desse período, também existem opções de manutenção e suporte contínuo.",

  manutenção:
    "Depois do período inicial de suporte, também existem opções de manutenção e suporte contínuo para manter o projeto atualizado e funcionando corretamente.",

  manutencao:
    "Depois do período inicial de suporte, também existem opções de manutenção e suporte contínuo para manter o projeto atualizado e funcionando corretamente.",

  obrigado:
    "Por nada. Se precisar de mais alguma informação sobre o projeto, estou à disposição.",

  obrigada:
    "Por nada. Se precisar de mais alguma informação sobre o projeto, estou à disposição.",

  tchau: "Até mais. Quando quiser conversar sobre seu projeto, é só chamar.",
};

// =========================================================
// RESPOSTA PADRÃO
// =========================================================

const defaultResponse =
  "Não consegui entender exatamente o que você precisa. Pode explicar um pouco mais sobre o seu projeto? Se preferir, também posso orientar você sobre sites, automações, dados, preços ou agendamento.";

// =========================================================
// RESPOSTAS RÁPIDAS
// =========================================================

const quickReplies = [
  "Quero um site",
  "Quero uma automação",
  "Preciso de dados",
  "Quero saber o preço",
];

// =========================================================
// HORÁRIO
// =========================================================

function getTime() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// =========================================================
// ADICIONAR MENSAGEM
// =========================================================

function addMessage(text, type) {
  if (!chatbotMessages) return;

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

// =========================================================
// INDICADOR DE DIGITAÇÃO
// =========================================================

function showTyping() {
  if (!chatbotMessages) return;

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

  if (typing) {
    typing.remove();
  }
}

// =========================================================
// ENCONTRA RESPOSTA
// =========================================================

function getBotResponse(input) {
  const normalized = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  for (const key of Object.keys(chatResponses)) {
    const normalizedKey = key
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (normalized.includes(normalizedKey)) {
      return chatResponses[key];
    }
  }

  return defaultResponse;
}

// =========================================================
// RESPOSTA DO BOT
// =========================================================

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

// =========================================================
// ENVIA MENSAGEM DO USUÁRIO
// =========================================================

function sendUserMessage(text) {
  if (!text || !text.trim()) {
    return;
  }

  addMessage(text.trim(), "user");

  chatbotInput.value = "";

  clearQuickReplies();

  const response = getBotResponse(text);

  botReply(response);
}

// =========================================================
// RESPOSTAS RÁPIDAS
// =========================================================

function renderQuickReplies() {
  if (!quickRepliesEl) return;

  clearQuickReplies();

  quickReplies.forEach((label) => {
    const btn = document.createElement("button");

    btn.className = "quick-reply-btn";

    btn.type = "button";

    btn.textContent = label;

    btn.addEventListener("click", () => {
      sendUserMessage(label);
    });

    quickRepliesEl.appendChild(btn);
  });
}

function clearQuickReplies() {
  if (!quickRepliesEl) return;

  quickRepliesEl.innerHTML = "";
}

// =========================================================
// BADGE / BOAS-VINDAS
// =========================================================

function showChatbotWelcome() {
  // Não mostra se o bot já foi aberto
  if (chatbotBox && chatbotBox.classList.contains("open")) {
    return;
  }

  if (chatbotBadge) {
    chatbotBadge.classList.remove("hidden");
  }
}

// =========================================================
// ABRE / FECHA CHATBOT
// =========================================================

if (chatbotToggle) {
  chatbotToggle.addEventListener("click", () => {
    const isOpen = chatbotBox.classList.contains("open");

    if (!isOpen) {
      chatbotBox.classList.add("open");

      if (chatbotWrapper) {
        chatbotWrapper.classList.add("chat-open");
      }

      if (chatbotBadge) {
        chatbotBadge.classList.add("hidden");
      }

      // Mensagem de boas-vindas na primeira abertura
      if (chatbotMessages && chatbotMessages.children.length === 0) {
        setTimeout(() => {
          addMessage(
            "Olá! Sou o assistente da victory_dev. Posso ajudar você a encontrar a melhor solução para o seu projeto. O que você está procurando?",
            "bot",
          );

          renderQuickReplies();
        }, 400);
      }
    } else {
      chatbotBox.classList.remove("open");

      if (chatbotWrapper) {
        chatbotWrapper.classList.remove("chat-open");
      }
    }
  });
}

if (chatbotClose) {
  chatbotClose.addEventListener("click", () => {
    chatbotBox.classList.remove("open");

    if (chatbotWrapper) {
      chatbotWrapper.classList.remove("chat-open");
    }
  });
}

// =========================================================
// ENVIO DA MENSAGEM
// =========================================================

if (chatbotSend) {
  chatbotSend.addEventListener("click", () => {
    sendUserMessage(chatbotInput.value);
  });
}

if (chatbotInput) {
  chatbotInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      sendUserMessage(chatbotInput.value);
    }
  });
}

// =========================================================
// ANIMAÇÃO DE HOVER NOS HERO CARDS
// =========================================================

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

// =========================================================
// CLIQUE NOS HERO CARDS: leva até o serviço correspondente
// (Sites -> Desenvolvimento de Sites, Automações -> Automação
// de Processos, Dados -> Gestão de Dados, Suporte -> Suporte
// Técnico), com animação no card clicado e no destino.
// =========================================================

document.querySelectorAll(".hero-card").forEach((card) => {
  const targetSelector = card.getAttribute("data-scroll-target");

  if (!targetSelector) return;

  const goToService = () => {
    const targetEl = document.querySelector(targetSelector);

    if (!targetEl) return;

    // Reseta o transform de hover/tilt para a animação de clique não conflitar
    card.style.transform = "";

    // Animação de clique no card
    card.classList.remove("is-clicked");
    void card.offsetWidth; // reinicia a animação se clicado várias vezes seguidas
    card.classList.add("is-clicked");

    card.addEventListener(
      "animationend",
      () => card.classList.remove("is-clicked"),
      { once: true },
    );

    // Rola suavemente até a seção do serviço
    targetEl.scrollIntoView({ behavior: "smooth", block: "center" });

    // Destaca o card de serviço ao chegar
    setTimeout(() => {
      targetEl.classList.remove("is-highlighted");
      void targetEl.offsetWidth;
      targetEl.classList.add("is-highlighted");

      targetEl.addEventListener(
        "animationend",
        () => targetEl.classList.remove("is-highlighted"),
        { once: true },
      );
    }, 350);
  };

  card.addEventListener("click", goToService);

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToService();
    }
  });
});

// =========================================================
// ACTIVE NAV LINK POR SEÇÃO
// =========================================================

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
