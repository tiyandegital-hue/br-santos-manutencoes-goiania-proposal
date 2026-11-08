/* Home hero chat mock — Santos Manutenções (demonstração / simulação).
   Script per STITCH-PROMPT.md: greeting -> problem chips -> urgency question -> priority guidance. */
(function () {
  const body = document.getElementById("home-chat-body");
  if (!body) return;
  const WA = "https://wa.me/5562992633484?text=Ol%C3%A1%2C%20preciso%20de%20um%20encanador%20urgente.";

  const now = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const scroll = () => { body.scrollTop = body.scrollHeight; };
  const wait = ms => new Promise(r => setTimeout(r, ms));

  function typing() {
    const t = document.createElement("div");
    t.className = "typing";
    t.innerHTML = "<i></i><i></i><i></i>";
    body.appendChild(t); scroll();
    return t;
  }
  function botMsg(html) {
    const m = document.createElement("div");
    m.className = "msg bot";
    m.innerHTML = html + `<span class="meta">${now()} · BOT</span>`;
    body.appendChild(m); scroll();
  }
  function userMsg(text) {
    const m = document.createElement("div");
    m.className = "msg user";
    m.textContent = text;
    const meta = document.createElement("span");
    meta.className = "meta"; meta.textContent = now() + " · VOCÊ ✓✓";
    m.appendChild(meta);
    body.appendChild(m); scroll();
  }
  function chips(list) {
    const wrap = document.createElement("div");
    wrap.className = "chips";
    list.forEach(c => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = c.label;
      b.addEventListener("click", () => {
        wrap.querySelectorAll("button").forEach(x => x.disabled = true);
        c.onPick();
      });
      wrap.appendChild(b);
    });
    body.appendChild(wrap); scroll();
  }
  async function say(html, chipList) {
    const t = typing();
    await wait(650);
    t.remove();
    botMsg(html);
    if (chipList) chips(chipList);
  }

  const step2 = () => say(
    "Entendi — isso é urgente. A água está jorrando agora ou já conseguiu fechar o registro?",
    [
      { label: "Jorrando agora", onPick: () => { userMsg("Jorrando agora"); step3(); } },
      { label: "Já fechei o registro", onPick: () => { userMsg("Já fechei o registro"); step3(); } }
    ]
  );

  const step3 = () => say(
    "Prioridade máxima. Primeiro: feche o registro geral se conseguir — fica perto do hidrômetro, na entrada da casa. Quer ver a triagem completa ou falar com a gente agora?",
    [
      { label: "Ver a demonstração completa", onPick: () => { window.location.href = "bot.html"; } },
      { label: "Chamar no WhatsApp", onPick: () => { window.open(WA, "_blank", "noopener"); } }
    ]
  );

  /* Greeting on load */
  say(
    "Olá! Aqui é o atendimento da Santos Manutenções. O que está acontecendo aí?",
    [
      { label: "Cano estourou", onPick: () => { userMsg("Cano estourou"); step2(); } },
      { label: "Vazamento", onPick: () => { userMsg("Vazamento"); step2(); } },
      { label: "Entupimento", onPick: () => { userMsg("Entupimento"); step2(); } },
      { label: "Outra coisa", onPick: () => { userMsg("Outra coisa"); step2(); } }
    ]
  );
})();
