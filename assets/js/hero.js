/* Harlang.io animated header graphics: Intro (script → AI voice → waveform) and Projects (code → dubbing timeline). */
(function(){
  const NS = 'http://www.w3.org/2000/svg';
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const C = { bg1:'#1c1c26', bg2:'#2a2748', purple:'#6767cf', light:'#a3a3f5', teal:'#2fbfae', blue:'#5b8def', line:'#34354a', dim:'#4a4a66', text:'#c9c9e4' };

  function el(tag, attrs, parent, text){
    const n = document.createElementNS(NS, tag);
    for (const k in (attrs||{})) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }
  function rng(seed){ let s = seed; return () => (s = (s*16807) % 2147483647) / 2147483647; }
  function backdrop(svg, id){
    const defs = el('defs', {}, svg);
    const g = el('linearGradient', {id:id+'bg', x1:0, y1:0, x2:1, y2:1}, defs);
    el('stop', {offset:'0', 'stop-color':C.bg1}, g); el('stop', {offset:'1', 'stop-color':C.bg2}, g);
    const bar = el('linearGradient', {id:id+'bar', x1:0, y1:0, x2:0, y2:1}, defs);
    el('stop', {offset:'0', 'stop-color':C.light}, bar); el('stop', {offset:'1', 'stop-color':C.purple}, bar);
    const glow = el('radialGradient', {id:id+'glow', cx:'0.5', cy:'0.5', r:'0.5'}, defs);
    el('stop', {offset:'0', 'stop-color':C.purple, 'stop-opacity':'.45'}, glow); el('stop', {offset:'1', 'stop-color':C.purple, 'stop-opacity':'0'}, glow);
    el('rect', {width:746, height:300, fill:`url(#${id}bg)`}, svg);
    el('ellipse', {cx:560, cy:90, rx:230, ry:120, fill:`url(#${id}glow)`}, svg);
    const grid = el('g', {stroke:'#ffffff', 'stroke-opacity':'.05'}, svg);
    for (let x=0; x<=746; x+=31) el('line', {x1:x, y1:0, x2:x, y2:300}, grid);
    for (let y=0; y<=300; y+=30) el('line', {x1:0, y1:y, x2:746, y2:y}, grid);
    return defs;
  }

  /* ───────────── Intro hero: script → neural net → voice, on one timeline ───────────── */
  (function intro(){
    const svg = document.getElementById('introHero'); if (!svg) return;
    backdrop(svg, 'i');

    // script editor (input)
    el('rect', {x:26, y:24, width:196, height:152, rx:10, fill:'#14141b', 'fill-opacity':.85, stroke:C.line}, svg);
    [['#e06c75',42],['#e5c07b',56],['#61c28a',70]].forEach(d => el('circle', {cx:d[1], cy:40, r:3.5, fill:d[0], opacity:.85}, svg));
    el('line', {x1:26, y1:52, x2:222, y2:52, stroke:C.line}, svg);
    const style = el('style', {}, svg);
    style.textContent = `
      @keyframes typeLine { 0%{transform:scaleX(0)} 14%{transform:scaleX(1)} 88%{transform:scaleX(1)} 100%{transform:scaleX(0)} }
      .cl { transform-box:fill-box; transform-origin:left center; animation:typeLine 9s ease-out infinite; }
      @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
      .cur { animation:blink 1s steps(1) infinite; }
      @media (prefers-reduced-motion: reduce){ .cl,.cur{ animation:none; } }`;
    const lines = [[0,72,C.light],[1,104,C.teal],[1,56,C.blue],[2,112,C.text],[2,84,C.purple],[1,40,C.blue],[0,34,C.light],[0,90,C.dim]];
    lines.forEach((l, i) => {
      const y = 66 + i*13;
      el('text', {x:36, y:y+6, fill:C.dim, 'font-size':8}, svg, String(i+1));
      const r = el('rect', {x:54 + l[0]*14, y:y, width:l[1], height:6, rx:3, fill:l[2], opacity:.85, class:'cl'}, svg);
      r.style.animationDelay = (i*0.35)+'s';
    });
    el('rect', {x:54, y:66+8*13, width:6, height:9, fill:C.light, class:'cur'}, svg);

    // neural net (the "AI voice" step)
    const lx = [262, 312, 362], counts = [4,5,4], cy = 100, gap = 24;
    const layers = counts.map((n, li) => Array.from({length:n}, (_, i) => ({x:lx[li], y:cy + (i-(n-1)/2)*gap, glow:0, li})));
    const edgeG = el('g', {stroke:C.light, 'stroke-width':.8}, svg);
    const outs = [[],[],[]];
    for (let li=0; li<2; li++) layers[li].forEach(a => layers[li+1].forEach(b => {
      el('line', {x1:a.x, y1:a.y, x2:b.x, y2:b.y, 'stroke-opacity':.16}, edgeG);
      (a.out = a.out || []).push(b);
    }));
    // feed links from editor to first layer, and from last layer to waveform
    layers[0].forEach(n => el('line', {x1:222, y1:cy+(n.y-cy)*.6, x2:n.x, y2:n.y, stroke:C.light, 'stroke-width':.8, 'stroke-opacity':.12, 'stroke-dasharray':'2 3'}, svg));
    layers[2].forEach(n => el('line', {x1:n.x, y1:n.y, x2:402, y2:cy+(n.y-cy)*.5, stroke:C.light, 'stroke-width':.8, 'stroke-opacity':.12, 'stroke-dasharray':'2 3'}, svg));
    const nodeEls = [];
    layers.forEach(L => L.forEach(n => {
      n.halo = el('circle', {cx:n.x, cy:n.y, r:9, fill:C.purple, opacity:0}, svg);
      n.dot = el('circle', {cx:n.x, cy:n.y, r:3.6, fill:'#1c1c2a', stroke:C.light, 'stroke-width':1.3}, svg);
    }));
    el('text', {x:312, y:178, 'text-anchor':'middle', 'font-size':8.5, 'letter-spacing':'.22em', fill:'#8a8aa8'}, svg, 'AI VOICE');
    const pulseG = el('g', {}, svg);
    const pulses = [];
    function spawn(from, t){
      const to = from.out[Math.floor(Math.random()*from.out.length)];
      pulses.push({from, to, t0:t, dur:380 + Math.random()*180, dot: el('circle', {r:2.6, fill:'#fff'}, pulseG)});
    }

    // waveform (output)
    const N = 44, wx0 = 428, wx1 = 722, wcy = 100;
    const step = (wx1 - wx0) / (N-1);
    const bars = [];
    for (let i=0; i<N; i++) bars.push(el('rect', {x:wx0 + i*step - 2.2, width:4.4, rx:2.2, fill:'url(#ibar)'}, svg));
    el('line', {x1:wx0-8, y1:wcy, x2:wx1+8, y2:wcy, stroke:C.light, 'stroke-opacity':.2}, svg);

    // greeting pill
    const greet = [['DA','Hej verden'],['EN','Hello world'],['DE','Hallo Welt'],['ES','Hola mundo'],['FR','Bonjour le monde'],['JA','こんにちは世界']];
    const pill = el('g', {}, svg);
    el('rect', {x:428, y:26, width:150, height:24, rx:12, fill:'#14141b', 'fill-opacity':.85, stroke:C.line}, pill);
    el('rect', {x:433, y:30, width:26, height:16, rx:8, fill:C.purple}, pill);
    const bt = el('text', {x:446, y:41.5, 'text-anchor':'middle', 'font-size':9, 'font-weight':700, fill:'#fff'}, pill, 'DA');
    const gt = el('text', {x:466, y:42, 'font-size':11.5, fill:C.text}, pill, 'Hej verden');

    // tracks
    const tr = [['DA',C.purple],['EN',C.teal],['ES',C.blue]];
    const trY = [206, 232, 258];
    const blocks = [];
    tr.forEach((t, ti) => {
      el('text', {x:26, y:trY[ti]+11, 'font-size':9.5, 'font-weight':700, fill:'#9a9ab0'}, svg, t[0]);
      el('rect', {x:52, y:trY[ti], width:670, height:16, rx:4, fill:'#ffffff', 'fill-opacity':.04}, svg);
      const r = rng(11 + ti*7); let x = 56 + r()*20;
      while (x < 700) {
        const w = 26 + r()*70;
        const bb = el('rect', {x:x, y:trY[ti]+2, width:Math.min(w, 718-x), height:12, rx:3, fill:t[1], opacity:.28}, svg);
        blocks.push({el:bb, x0:x, x1:x+Math.min(w,718-x)});
        x += w + 6 + r()*26;
      }
    });

    // playhead
    const phLine = el('line', {y1:64, y2:276, stroke:'#fff', 'stroke-width':1.4, 'stroke-opacity':.9}, svg);
    const phTop = el('g', {}, svg);
    el('rect', {x:-33, y:186, width:66, height:15, rx:7.5, fill:C.purple}, phTop);
    const tc = el('text', {x:0, y:197, 'text-anchor':'middle', 'font-size':9, 'font-weight':700, fill:'#fff'}, phTop, '00:00:00:00');
    const phTri = el('path', {d:'M-4 0 L4 0 L0 6 Z', fill:'#fff'}, svg);

    const P0 = 52, P1 = 722, DUR = 9000;
    let kick = 0, lastT = 0, nextSpawn = 0;
    function frame(t){
      const dt = Math.min(64, t - lastT || 16); lastT = t;
      const p = (t % DUR) / DUR;
      const px = P0 + (P1-P0) * p;
      phLine.setAttribute('x1', px); phLine.setAttribute('x2', px);
      phTop.setAttribute('transform', `translate(${Math.max(P0+33, Math.min(P1-33, px))} 0)`);
      phTri.setAttribute('transform', `translate(${px} 201)`);
      const secs = p * 83.0, f = Math.floor((secs % 1) * 24), sc = Math.floor(secs) % 60, m = Math.floor(secs/60);
      tc.textContent = `00:${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}:${String(f).padStart(2,'0')}`;

      // synapse firing
      if (t > nextSpawn) { spawn(layers[0][Math.floor(Math.random()*4)], t); nextSpawn = t + 260 + Math.random()*260; }
      for (let i=pulses.length-1; i>=0; i--) {
        const q = pulses[i], u = (t - q.t0) / q.dur;
        if (u >= 1) {
          q.to.glow = 1; q.dot.remove(); pulses.splice(i,1);
          if (q.to.out) spawn(q.to, t); else kick = Math.min(1.2, kick + .5);
          continue;
        }
        const e = u*u*(3-2*u);
        q.dot.setAttribute('cx', q.from.x + (q.to.x - q.from.x)*e);
        q.dot.setAttribute('cy', q.from.y + (q.to.y - q.from.y)*e);
      }
      layers.forEach(L => L.forEach(n => {
        n.glow *= Math.pow(.004, dt/1000);
        n.halo.setAttribute('opacity', .55*n.glow); n.halo.setAttribute('r', 6 + 6*n.glow);
        n.dot.setAttribute('fill', n.glow > .35 ? C.light : '#1c1c2a');
      }));
      kick *= Math.pow(.05, dt/1000);

      for (let i=0; i<N; i++){
        const x = wx0 + i*step;
        const near = Math.exp(-Math.pow((x - px) / 70, 2));
        const base = 10 + 14*Math.abs(Math.sin(i*0.55)) + 8*Math.abs(Math.sin(i*1.37+1));
        const live = 0.55 + 0.45*Math.sin(t/260 + i*0.9) * Math.cos(t/510 + i*0.31);
        const h = base * (0.45 + 0.55*live) * (1 + 1.4*near + .9*kick);
        bars[i].setAttribute('y', wcy - h); bars[i].setAttribute('height', Math.max(3, h*2));
        bars[i].setAttribute('opacity', Math.min(1, 0.5 + 0.5*near + .3*kick));
      }
      blocks.forEach(b => b.el.setAttribute('opacity', (px >= b.x0 && px <= b.x1) ? 1 : (px > b.x1 ? .55 : .28)));
      const gi = Math.floor(t / 1800) % greet.length;
      const ph = (t % 1800) / 1800, a = ph < .12 ? ph/.12 : ph > .88 ? (1-ph)/.12 : 1;
      if (bt.textContent !== greet[gi][0]) { bt.textContent = greet[gi][0]; gt.textContent = greet[gi][1]; }
      gt.setAttribute('opacity', a); bt.setAttribute('opacity', Math.max(a, .6));
    }
    if (reduce) { layers.forEach(L => L.forEach((n,i) => { n.glow = (i%2)?0:.8; n.halo.setAttribute('opacity', .45*n.glow); })); frame(DUR*0.42); }
    else { (function loop(t){ if (svg.getClientRects().length) frame(t); requestAnimationFrame(loop); })(performance.now()); }
  })();

  /* ───────────── Alternative hero: actually readable code → rendered dubbing tracks ───────────── */
  (function codeHero(){
    const svg = document.getElementById('codeHero'); if (!svg) return;
    backdrop(svg, 'c');
    const MONO = '"SF Mono","JetBrains Mono",Menlo,Consolas,"Liberation Mono",monospace';
    el('rect', {x:26, y:22, width:430, height:256, rx:10, fill:'#14141b', 'fill-opacity':.9, stroke:C.line}, svg);
    [['#e06c75',42],['#e5c07b',56],['#61c28a',70]].forEach(d => el('circle', {cx:d[1], cy:38, r:3.5, fill:d[0], opacity:.85}, svg));
    el('text', {x:241, y:42, 'text-anchor':'middle', 'font-size':10, fill:'#8a8aa8', 'font-family':MONO}, svg, 'localize.ts');
    el('line', {x1:26, y1:52, x2:456, y2:52, stroke:C.line}, svg);

    const src = [
      '// script → voice, in every language',
      'async function localize(script, langs) {',
      '  const cues = parseTimecodes(script);',
      '  for (const lang of langs) {',
      '    const voice = await castVoice(lang);',
      '    const take = await synthesize(cues, voice);',
      '    timeline.add(lang, take);',
      '  }',
      '  return timeline.render();',
      '}',
      '',
      'localize(script, ["da", "en", "de", "es"]);'
    ];
    const col = {kw:C.light, str:C.teal, fn:'#7aa2f7', com:'#5b5d7a', txt:'#d6d6ec', num:'#f0a35e'};
    const re = /(\/\/.*$)|("[^"]*")|\b(async|function|const|for|of|await|return)\b|\b([A-Za-z_]\w*)(?=\()|(\s+|\w+|.)/g;
    const lines = src.map(line => { const toks = []; let m; re.lastIndex = 0;
      while ((m = re.exec(line))) toks.push(m[1] ? [m[0],'com'] : m[2] ? [m[0],'str'] : m[3] ? [m[0],'kw'] : m[4] ? [m[0],'fn'] : [m[0],'txt']);
      return toks; });
    const total = src.reduce((a,l)=>a+l.length,0) + src.length;
    const LH = 17, X0 = 62, Y0 = 76;
    const lineEls = lines.map((toks, i) => {
      el('text', {x:46, y:Y0 + i*LH, 'text-anchor':'end', 'font-size':10, fill:'#4a4a66', 'font-family':MONO}, svg, String(i+1));
      const t = el('text', {x:X0, y:Y0 + i*LH, 'font-size':11.5, 'font-family':MONO, 'xml:space':'preserve', style:'white-space:pre'}, svg);
      return toks.map(tk => ({node: el('tspan', {fill:col[tk[1]]}, t), text:tk[0]}));
    });
    const cursor = el('rect', {width:7, height:13, fill:C.light}, svg);

    // right: rendered tracks
    el('rect', {x:476, y:22, width:246, height:256, rx:10, fill:'#14141b', 'fill-opacity':.7, stroke:C.line}, svg);
    el('text', {x:494, y:44, 'font-size':10, 'letter-spacing':'.2em', 'font-weight':700, fill:C.text}, svg, 'TIMELINE');
    const status = el('text', {x:704, y:44, 'text-anchor':'end', 'font-size':10, fill:'#8a8aa8'}, svg, 'idle');
    const langs = [['DA',C.purple,'Mads'],['EN',C.teal,'Emma'],['DE',C.blue,'Jonas'],['ES','#c77dff','Lucía']];
    const NB = 30, rows = langs.map((L, i) => {
      const y = 64 + i*44;
      el('rect', {x:494, y:y, width:28, height:16, rx:8, fill:L[1]}, svg);
      el('text', {x:508, y:y+11.5, 'text-anchor':'middle', 'font-size':9, 'font-weight':700, fill:'#101018'}, svg, L[0]);
      el('text', {x:530, y:y+12, 'font-size':10, fill:'#9a9ab0'}, svg, L[2]);
      const bars = Array.from({length:NB}, (_, k) => el('rect', {x:494 + k*7, width:4.2, rx:2, fill:L[1]}, svg));
      return {y, bars};
    });
    const done = el('text', {x:494, y:266, 'font-size':10, 'font-weight':700, fill:C.teal}, svg, '');

    const CYC = 15000, TYPE = 8500, REND = 2400;
    function draw(typed, rend){
      let n = typed, cx = X0, cy = Y0 - 11;
      lines.forEach((toks, li) => {
        let used = 0;
        const room = Math.max(0, Math.min(n, src[li].length));
        toks.forEach((tk, ti) => { const take = Math.max(0, Math.min(tk[0].length, room - used)); lineEls[li][ti].node.textContent = tk[0].slice(0, take); used += tk[0].length; });
        if (n >= 0 && n <= src[li].length + 1 && typed >= 0) { if (n <= src[li].length) { cx = X0 + room * 6.9; cy = Y0 - 11 + li*LH; } }
        n -= src[li].length + 1;
      });
      cursor.setAttribute('x', cx); cursor.setAttribute('y', cy);
      cursor.setAttribute('opacity', (Math.floor(performance.now()/500) % 2 || typed < total) ? 1 : 0);
      rows.forEach((r, ri) => {
        const a = Math.max(0, Math.min(1, (rend*langs.length - ri)));
        r.bars.forEach((b, k) => {
          const on = (k / NB) < a;
          const h = on ? 5 + 17*Math.abs(Math.sin(k*.7 + ri*1.9) * Math.cos(k*.23 + ri)) : 2;
          b.setAttribute('y', r.y + 28 - h/2); b.setAttribute('height', h); b.setAttribute('opacity', on ? .95 : .25);
        });
      });
      status.textContent = rend <= 0 ? (typed < total ? 'writing…' : 'compiling…') : rend < 1 ? 'rendering…' : 'done';
      done.textContent = rend >= 1 ? '✓ 4 languages · 00:01:24' : '';
    }
    function frame(t){
      const c = t % CYC;
      const typed = Math.min(total, Math.floor(c / TYPE * total));
      const rend = c < TYPE ? 0 : Math.min(1, (c - TYPE - 400) / REND);
      draw(c > CYC - 600 ? 0 : typed, c > CYC - 600 ? 0 : Math.max(0, rend));
    }
    if (reduce) { draw(total, 1); } else { (function loop(t){ if (svg.getClientRects().length) frame(t); requestAnimationFrame(loop); })(performance.now()); }
  })();
})();
