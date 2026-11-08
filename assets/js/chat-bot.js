/* Bot page — full 5-step triage simulation, Santos Manutenções.
   Script per STITCH-PROMPT.md. CONFIRMAR (step 4) advances to step 5 (fee range,
   scheduling chips, confirmation, human handoff). Progress rail ETAPA 1/5 -> 5/5. */
(function () {
  const body = document.getElementById("bot-chat-body");
  const rail = document.querySelectorAll(".rail-step");
  const restartBtn = document.getElementById("restart-sim");
  const humanBtn = document.getElementById("human-escape");
  const input = document.getElementById("bot-chat-input");
  const sendBtn = document.getElementById("bot-chat-send");
  if (!body) return;
  const WA = "https://wa.me/5562992633484?text=Ol%C3%A1%2C%20preciso%20de%20um%20encanador%20urgente.";
  const ADDR = "Rua Sergipe, Solar Campinas, Goiânia/GO";

  let step = 1;
  let handedOff = false;
  const now = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const scroll = () => { body.scrollTop = body.scrollHeight; };
  const wait = ms => new Promise(r => setTimeout(r, ms));

  function setStep(n) {
    step = n;
    rail.forEach((el, i) => {
      el.classList.toggle("active", i === n - 1);
      el.classList.toggle("done", i < n - 1);
    });
  }
  function typing() {
    const t = document.createElement("div");
    t.className = "typing"; t.setAttribute("aria-label", "O bot está digitando");
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

  /* --- Step 1: identify the problem --- */
  function step1() {
    setStep(1);
    say("Olá! Aqui é o atendimento da Santos Manutenções. O que está acontecendo aí?", [
      { label: "Cano estourou", onPick: () => { userMsg("Cano estourou"); step2(); } },
      { label: "Vazamento", onPick: () => { userMsg("Vazamento"); step2(); } },
      { label: "Entupimento", onPick: () => { userMsg("Entupimento"); step2(); } },
      { label: "Outra coisa", onPick: () => { userMsg("Outra coisa"); step2(); } }
    ]);
  }

  /* --- Step 2: urgency level --- */
  function step2() {
    setStep(2);
    say("Entendi — isso é urgente. A água está jorrando agora ou já conseguiu fechar o registro?", [
      { label: "Jorrando agora", onPick: () => { userMsg("Jorrando agora"); step3(); } },
      { label: "Já fechei o registro", onPick: () => { userMsg("Já fechei o registro"); step3(); } }
    ]);
  }

  /* --- Step 3: photo --- */
  function step3() {
    setStep(3);
    say("Prioridade máxima. Primeiro: feche o registro geral se conseguir — fica perto do hidrômetro, na entrada da casa. Enquanto isso, me manda uma foto do local?", [
      { label: "Enviar foto (simulação)", onPick: () => { sendPhoto(); } },
      { label: "Pular", onPick: () => { userMsg("Pular"); step4(); } }
    ]);
  }
  async function sendPhoto() {
    userMsg("Enviar foto (simulação)");
    const t = typing();
    await wait(650); t.remove();
    const ph = document.createElement("div");
    ph.className = "photo-thumb";
    ph.innerHTML = `<div class="ph-img">FOTO_REGISTRO_01.JPG<br>Tubo PVC 25mm avariado detectado</div><span class="meta">${now()} · VOCÊ ✓✓</span>`;
    body.appendChild(ph); scroll();
    step4();
  }

  /* --- Step 4: address --- */
  function step4() {
    setStep(4);
    say("Recebi. Agora me passa o endereço da visita:", null);
    const form = document.createElement("div");
    form.className = "chips";
    form.style.flexDirection = "column";
    form.style.alignItems = "stretch";
    const field = document.createElement("input");
    field.type = "text";
    field.value = ADDR;
    field.setAttribute("aria-label", "Endereço da visita");
    field.style.cssText = "flex:1;background:#0B141A;border:1px solid rgba(255,255,255,.2);border-radius:10px;padding:12px 14px;color:#F2F5F0;font:inherit;font-size:15px;width:100%";
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "chip";
    btn.textContent = "Confirmar endereço";
    btn.addEventListener("click", () => {
      const addr = field.value.trim() || ADDR;
      field.disabled = true; btn.disabled = true;
      userMsg(addr);
      step5();
    });
    form.appendChild(field); form.appendChild(btn);
    body.appendChild(form); scroll();
    field.focus();
  }

  /* --- Step 5: fee range + scheduling + confirmation --- */
  function step5() {
    setStep(5);
    say("Obrigado. Para emergência de cano estourado, a faixa da taxa de visita é <span class='fee'>[VALOR A CONFIRMAR PELO PROPRIETÁRIO]</span>. O valor do reparo é fechado após o diagnóstico, antes de começar. Quer agendar para quando?", [
      { label: "Hoje, o quanto antes", onPick: () => { userMsg("Hoje, o quanto antes"); confirmBooking("Hoje, o quanto antes"); } },
      { label: "Hoje à noite", onPick: () => { userMsg("Hoje à noite"); confirmBooking("Hoje à noite"); } },
      { label: "Amanhã de manhã", onPick: () => { userMsg("Amanhã de manhã"); confirmBooking("Amanhã de manhã"); } }
    ]);
  }
  function confirmBooking(when) {
    say(`Agendado (simulação) — ${when}. O encanador confirma o horário por aqui mesmo. Quer falar com uma pessoa agora?`, [
      { label: "Falar com um humano", onPick: () => { userMsg("Falar com um humano"); handoff(); } },
      { label: "Continuar no WhatsApp", onPick: () => { window.open(WA, "_blank", "noopener"); } }
    ]);
  }

  /* --- Human handoff (available at any step) --- */
  function handoff() {
    if (handedOff) return;
    handedOff = true;
    say("Claro — chamando um atendente humano agora. Ele continua a conversa por aqui.", null);
    const note = document.createElement("div");
    note.className = "msg bot";
    note.innerHTML = "<b>ATENDENTE HUMANO ACIONADO — SIMULAÇÃO</b><br>Na conversa real, um encanador plantonista assume a partir daqui." + `<span class="meta">${now()} · SISTEMA</span>`;
    body.appendChild(note); scroll();
  }

  /* Free-text input: acknowledge, keep the current step's chips visible */
  function sendFreeText() {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    userMsg(text);
    say("Anotado (simulação). Continue tocando nas opções acima para avançar na triagem — ou toque em “Falar com um humano” a qualquer momento.", null);
  }
  sendBtn.addEventListener("click", sendFreeText);
  input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); sendFreeText(); } });
  if (humanBtn) humanBtn.addEventListener("click", () => { userMsg("Falar com um humano"); handoff(); });

  /* Restart */
  if (restartBtn) restartBtn.addEventListener("click", () => {
    body.innerHTML = '<div class="chat-date">HOJE · DEMONSTRAÇÃO</div>';
    handedOff = false;
    step1();
  });

  step1();
})();
