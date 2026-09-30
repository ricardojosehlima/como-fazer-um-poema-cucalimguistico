(() => {
  const DATA = window.CUCA_DATA;
  const STORAGE_KEY = 'cuca-poema-journey-v3';
  const DRAFT_KEY = 'cuca-poema-visitor-draft-v3';

  const card = document.getElementById('poemCard');
  const titleEl = document.getElementById('poemTitle');
  const textEl = document.getElementById('poemText');
  const metaEl = document.getElementById('poemMeta');
  const mainAction = document.getElementById('mainAction');
  const restartAction = document.getElementById('restartAction');
  const finalRestart = document.getElementById('finalRestart');
  const visitorVersion = document.getElementById('visitorVersion');
  const visitorText = document.getElementById('visitorText');
  const intro = document.getElementById('intro');
  const controls = document.querySelector('.journey-controls');

  const labelGroups = {
    early: [
      'RETIRE OUTRO', 'TEM MAIS NO SACO', 'AGITA PRA VER MAIS UM', 'CLICA QUE TEM MAIS',
      'TIRE MAIS UM', 'OUTRO RECORTE', 'MEXA O SACO', 'PUXE MAIS UM',
      'VAI, ENFIA A MÃO', 'AINDA TEM COISA AÍ', 'ESCOLHA NÃO ESCOLHER', 'MAIS UM DO SACO'
    ],
    middle: [
      'VAI, MAIS UM', 'CLICA. O SACO NÃO MORDE.', 'MAIS UM. SEM GARANTIAS.',
      'FAÇA DE CONTA QUE FOI O ACASO', 'AGITE ATÉ PARECER INTENCIONAL',
      'VAI QUE O PRÓXIMO PRESTA', 'UM RECORTE A MAIS NÃO FAZ MAL',
      'TIRE DAÍ QUALQUER COISA', 'O SACO INSISTE', 'PODE PIORAR',
      'PEGUE OUTRO. OU NÃO.', 'MAIS UM? NATURALMENTE.'
    ],
    late: [
      'ACHOU QUE TINHA ACABADO?', 'VOCÊ AINDA ESTÁ AQUI?', 'CONTINUE POR SUA CONTA E RISCO',
      'TEM COISA PIOR AQUI DENTRO', 'VAMOS PIORAR ISSO', 'AGITA. NÃO PERGUNTE.',
      'UM ÚLTIMO? NÃO.', 'SIGA, JÁ FOI LONGE DEMAIS', 'AINDA NÃO CHEGAMOS AO FUNDO',
      'CLIQUE ANTES QUE A REGRA MUDE', 'RETIRE UM PROBLEMA', 'ABRA O SACO. NÃO OLHE.'
    ]
  };

  const exits = ['exit-left','exit-fall','exit-blur','exit-twist','exit-fold'];
  const enters = ['enter-pop','enter-slide','enter-spin','enter-drop','enter-scrap'];

  function shuffled(arr) {
    const a = [...arr];
    for (let i=a.length-1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  function shuffledIds() { return shuffled(DATA.variations.map(v => v.id)); }
  function shuffledLabels() {
    return [...shuffled(labelGroups.early), ...shuffled(labelGroups.middle), ...shuffled(labelGroups.late)];
  }

  function blankJourney() {
    return { started:false, order:[], labels:[], pos:-1, finished:false };
  }

  function loadJourney() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return blankJourney();
      const s = JSON.parse(raw);
      if (!Array.isArray(s.order) || typeof s.pos !== 'number') throw new Error('bad state');
      if (!Array.isArray(s.labels) || s.labels.length < DATA.variations.length - 1) s.labels = shuffledLabels();
      return s;
    } catch (_) {
      return blankJourney();
    }
  }

  let journey = loadJourney();

  function saveJourney() { localStorage.setItem(STORAGE_KEY, JSON.stringify(journey)); }
  function findVariation(id) { return DATA.variations.find(v => v.id === id); }
  function randomOf(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
  function setStyle(style) { document.body.dataset.style = style || 'plain'; }

  function setDecay(step) {
    const total = DATA.variations.length;
    const p = Math.max(0, Math.min(1, step / total));
    const level = step <= 0 ? 0 : Math.min(10, Math.ceil(p * 10));
    document.body.dataset.decay = String(level);
    document.documentElement.style.setProperty('--journey-progress', p.toFixed(4));

    // Background: one-way fade from paper to a darker, worn brown. It never resets
    // because it is calculated only from how far this saved journey has progressed.
    const start = [243, 239, 229];
    const end = [82, 54, 36];
    const eased = Math.pow(p, 0.88);
    const rgb = start.map((v, i) => Math.round(v + (end[i] - v) * eased));
    document.body.style.setProperty('--paper', `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);

    // Cracks now grow darker, thicker and more complete.
    const crackProgress = Math.pow(p, 0.78);
    document.documentElement.style.setProperty('--crack-offset', String((100 - crackProgress * 122).toFixed(2)));
    document.documentElement.style.setProperty('--crack-opacity', String((0.18 + p * 0.72).toFixed(3)));
    document.documentElement.style.setProperty('--crack-width', `${(1.2 + p * 2.85).toFixed(2)}px`);

    // The scissors keeps a fixed route logic, but now ends much larger and more visible.
    const x = -22 + (98 * p) + 5.5 * Math.sin(p * Math.PI * 5);
    const y = 79 - (60 * p) + 7 * Math.sin(p * Math.PI * 3.2 + 0.8);
    const scale = 0.36 + 2.95 * p;
    const rot = -30 + 136 * p + 13 * Math.sin(p * Math.PI * 4);
    const opacity = p < 0.02 ? 0 : Math.min(0.60, 0.05 + p * 0.55);
    document.documentElement.style.setProperty('--scissor-x', `${x.toFixed(2)}vw`);
    document.documentElement.style.setProperty('--scissor-y', `${y.toFixed(2)}vh`);
    document.documentElement.style.setProperty('--scissor-scale', scale.toFixed(3));
    document.documentElement.style.setProperty('--scissor-rot', `${rot.toFixed(2)}deg`);
    document.documentElement.style.setProperty('--scissor-opacity', opacity.toFixed(3));
  }

  function renderBase(animate=false) {
    setStyle('base');
    setDecay(0);
    metaEl.textContent = 'VERSÃO-BASE';
    titleEl.textContent = DATA.base.title;
    textEl.textContent = DATA.base.text;
    intro.hidden = false;
    visitorVersion.hidden = true;
    card.hidden = false;
    controls.hidden = false;
    mainAction.hidden = false;
    mainAction.textContent = 'AGITE O SACO';
    restartAction.hidden = true;
    if (animate) enter();
  }

  function renderVariation(v, animate=true) {
    setStyle(v.style);
    setDecay(journey.pos + 1);
    metaEl.textContent = 'RETIRADO DO SACO';
    titleEl.textContent = v.title;
    textEl.textContent = v.text;
    intro.hidden = true;
    visitorVersion.hidden = true;
    card.hidden = false;
    controls.hidden = false;
    mainAction.hidden = false;
    restartAction.hidden = false;
    const last = journey.pos >= journey.order.length - 1;
    mainAction.textContent = last ? 'FIM?' : (journey.labels[journey.pos] || 'RETIRE OUTRO');
    if (animate) enter();
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function renderVisitor() {
    setStyle('base');
    setDecay(DATA.variations.length + 1);
    intro.hidden = true;
    card.hidden = true;
    controls.hidden = true;
    visitorVersion.hidden = false;
    visitorText.value = localStorage.getItem(DRAFT_KEY) || '';
    window.scrollTo({top:0, behavior:'smooth'});
    window.setTimeout(() => visitorText.focus({preventScroll:true}), 420);
  }

  function enter() {
    card.classList.remove(...enters,...exits);
    void card.offsetWidth;
    card.classList.add(randomOf(enters));
  }

  function transitionThen(fn) {
    card.classList.remove(...enters,...exits);
    card.classList.add(randomOf(exits));
    window.setTimeout(() => {
      card.classList.remove(...enters,...exits);
      fn();
    }, 430);
  }

  function startJourney() {
    journey = { started:true, order:shuffledIds(), labels:shuffledLabels(), pos:0, finished:false };
    saveJourney();
    transitionThen(() => renderVariation(findVariation(journey.order[0])));
  }

  function next() {
    if (!journey.started) return startJourney();
    const atLast = journey.pos >= journey.order.length - 1;
    if (atLast) {
      journey.finished = true;
      saveJourney();
      transitionThen(renderVisitor);
      return;
    }
    journey.pos += 1;
    saveJourney();
    transitionThen(() => renderVariation(findVariation(journey.order[journey.pos])));
  }

  function restart() {
    localStorage.removeItem(STORAGE_KEY);
    journey = blankJourney();
    renderBase(true);
    window.scrollTo({top:0, behavior:'smooth'});
  }

  mainAction.addEventListener('click', next);
  restartAction.addEventListener('click', restart);
  finalRestart.addEventListener('click', restart);
  document.getElementById('clearJourney').addEventListener('click', restart);
  visitorText.addEventListener('input', () => localStorage.setItem(DRAFT_KEY, visitorText.value));

  const refDlg = document.getElementById('referenceDialog');
  document.getElementById('referenceButton').addEventListener('click', () => refDlg.showModal());
  document.getElementById('originalReference').textContent = DATA.reference.original;
  document.getElementById('archiveLink').href = DATA.reference.archiveUrl;

  const creditsDlg = document.getElementById('creditsDialog');
  document.getElementById('creditsButton').addEventListener('click', () => creditsDlg.showModal());

  // Restore a saved journey on return.
  if (journey.finished) {
    renderVisitor();
  } else if (journey.started && journey.order[journey.pos]) {
    renderVariation(findVariation(journey.order[journey.pos]), false);
  } else {
    renderBase(false);
  }
})();
