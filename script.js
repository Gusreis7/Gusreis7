"use strict";
(() => {
  const data = window.PORTFOLIO || { projects: [], publications: [] };
  const $ = (selector) => document.querySelector(selector);
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const safeWebUrl = (value) => {
    try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : null; }
    catch { return null; }
  };
  const externalLink = (label, href, className) => {
    const link = el("a", className, label + " ↗");
    link.href = href; link.target = "_blank"; link.rel = "noopener noreferrer";
    link.append(el("span", "sr-only", " (abre em nova aba)"));
    return link;
  };
  const illustrations = {
    books: '<path fill="#9d8bd5" d="M40 106h146v14H40z"/><path fill="#5d4e92" d="M40 118h146v7H40z"/><path fill="#6e58b6" d="M52 56h26v49H52z"/><path fill="#fdfbff" d="M59 63h12v5H59z"/><path fill="#ac94e5" d="M83 37h29v68H83z"/><path fill="#fff" d="M89 44h16v5H89zM89 84h16v4H89z"/><path fill="#455bb5" d="M118 57h20v48h-20z"/><path fill="#e3dcf5" d="M142 67h35v38h-35z"/><path fill="#8c78bf" d="M149 74h21v4h-21zM149 84h14v4h-14z"/><path fill="#8570c1" d="M184 38h8v-8h6v8h8v6h-8v8h-6v-8h-8z"/>',
    documents: '<path fill="#bac9ed" d="M66 37h82v89H66z"/><path fill="#fafdff" d="M82 24h67l18 18v72H82z"/><path fill="#7898d8" d="M149 24v18h18zM96 53h44v5H96zM96 65h56v5H96zM96 77h38v5H96z"/><path fill="#3b63bb" d="M147 88h42v30h-42z"/><path fill="#fff" d="M157 98h5v5h5v-5h5v-5h5v10h-5v5h-10v-5h-5z"/>',
    audio: '<path fill="#5d5182" d="M53 57h8v31h-8zM68 42h8v60h-8zM83 61h8v22h-8zM98 28h8v88h-8zM113 47h8v50h-8zM128 35h8v74h-8zM143 58h8v29h-8zM158 44h8v56h-8zM173 63h8v20h-8z"/><path fill="#c393b0" d="M98 28h8v16h-8zM128 35h8v13h-8zM68 42h8v11h-8zM158 44h8v12h-8z"/>'
  };
  const art = (project) => {
    const holder = el("div", "project-art " + project.theme);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 240 150"); svg.setAttribute("aria-hidden", "true");
    // Fixed, repository-owned SVG paths; content data is always rendered as text.
    svg.innerHTML = illustrations[project.motif] || illustrations.documents;
    holder.append(svg, el("span", "art-corner", "PROJECT_" + project.number));
    return holder;
  };

  if ($('#project-grid')) {
    const projects = (data.projects || []).filter(project => safeWebUrl(project.codeUrl));
    const renderProjects = (filter = 'all') => {
      const visible = projects.filter(project => filter === 'all' || project.category === filter);
      $('#project-grid').replaceChildren(...visible.map(project => {
        const card = el('article', 'project-card');
        const body = el('div', 'project-body');
        body.append(el('p', 'project-category', project.categoryLabel), el('h2', 'project-title', project.title), el('p', 'project-description', project.description));
        const tags = el('ul', 'project-tags'); tags.append(...project.tags.map(tag => el('li', '', tag)));
        const links = el('div', 'project-direct-links');
        links.append(externalLink('Ver código no GitHub', safeWebUrl(project.codeUrl), 'inline-link'));
        if (safeWebUrl(project.demoUrl)) links.append(externalLink('Acessar aplicação', safeWebUrl(project.demoUrl), 'inline-link'));
        body.append(tags, links); card.append(art(project), body); return card;
      }));
      $('#project-count').textContent = String(visible.length).padStart(2, '0') + (visible.length === 1 ? ' repositório' : ' repositórios');
    };
    document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(item => {
        const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active));
      }); renderProjects(button.dataset.filter);
    })); renderProjects();
  }
  if ($('#other-repos')) $('#other-repos').replaceChildren(...(data.otherRepos || []).filter(repo => safeWebUrl(repo.url)).map(repo => {
    const row = el('li'); row.append(externalLink(repo.name, safeWebUrl(repo.url), 'inline-link'), el('span', 'repo-language', repo.language)); return row;
  }));
  if ($('#publication-list')) $('#publication-list').replaceChildren(...(data.publications || []).filter(paper => safeWebUrl(paper.url)).map(paper => {
    const card = el('article', 'paper-card'); const top = el('div', 'paper-top');
    top.append(el('span', 'paper-venue', paper.venue), el('span', 'paper-role', paper.role));
    const title = el('h2'); title.append(externalLink(paper.title, safeWebUrl(paper.url), 'paper-title-link'));
    const authors = el('details', 'paper-authors'); authors.append(el('summary', '', 'Autores'), el('p', '', paper.authors));
    const links = el('div', 'paper-links'); links.append(externalLink('Publicação', safeWebUrl(paper.url), 'inline-link'));
    if (safeWebUrl(paper.pdf)) links.append(externalLink('Ler PDF', safeWebUrl(paper.pdf), 'inline-link'));
    if (safeWebUrl(paper.code)) links.append(externalLink('Código', safeWebUrl(paper.code), 'inline-link'));
    card.append(top, title, el('p', 'paper-summary', paper.summary), authors, links);
    if (paper.doi) card.append(el('p', 'paper-doi', 'DOI: ' + paper.doi)); return card;
  }));
  const toggle = $('.menu-toggle'); const nav = $('#main-nav');
  if (toggle && nav) {
    const closeMenu = () => { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
    toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
  }
  if ($('.lab-info') && $('#lab-note')) $('.lab-info').addEventListener('click', event => {
    const open = event.currentTarget.getAttribute('aria-expanded') !== 'true';
    event.currentTarget.setAttribute('aria-expanded', String(open)); event.currentTarget.textContent = open ? '−' : '+'; $('#lab-note').hidden = !open;
  });
  if ($('#github-contact') && safeWebUrl(data.github)) { $('#github-contact').href = safeWebUrl(data.github); $('#github-contact').hidden = false; }
  if ($('#resume-link') && data.resume && (safeWebUrl(data.resume) || /^\.\/assets\/[\w./-]+\.pdf$/i.test(data.resume))) { $('#resume-link').href = data.resume; $('#resume-link').hidden = false; }

  const bookList = $('.book-list');
  if (bookList && Array.isArray(data.topBooks)) {
    const books = data.topBooks.map(book => typeof book === 'string' ? {title: book} : book)
      .filter(book => book && typeof book.title === 'string' && book.title.trim()).slice(0, 3);
    bookList.replaceChildren(...books.map((book, index) => {
      const row = el('li'); const body = el('div');
      body.append(el('h3', '', book.title.trim()));
      if (typeof book.author === 'string' && book.author.trim()) body.append(el('p', '', book.author.trim()));
      row.append(el('span', 'book-rank', String(index + 1).padStart(2, '0')), body); return row;
    }));
    if ($('.reading-card')) $('.reading-card').hidden = books.length === 0;
  }

  // The YouTube API is loaded only on the page that contains this player.
  const musicFrame = $('#atlas-player');
  if (musicFrame) {
    const musicCard = $('#music-card');
    const musicButton = $('#music-toggle');
    const musicLabel = $('#music-toggle-label');
    const musicIcon = $('#music-toggle-icon');
    const musicStatus = $('#music-status');
    const music = data.music || {};
    const heading = $('.music-heading h2');
    const artistLine = $('.music-artist');
    const discLabel = $('.record-disc > span');
    const external = $('.music-external');
    const manualName = typeof music.name === 'string' ? music.name.trim() : '';
    const manualArtist = typeof music.artist === 'string' ? music.artist.trim() : '';
    let displayName = manualName || 'Música do momento';
    let displayArtist = manualArtist;
    let musicPlayer;
    let playerReady = false;
    const refreshMusicText = () => {
      if (heading) heading.textContent = displayName;
      if (artistLine) { artistLine.textContent = displayArtist; artistLine.hidden = !displayArtist; }
      if (discLabel) {
        discLabel.textContent = Array.from(displayName.toLocaleUpperCase('pt-BR')).slice(0, 6).join('');
        discLabel.title = displayName; discLabel.style.fontSize = '7px';
      }
      musicFrame.title = displayName + (displayArtist ? ' — ' + displayArtist : '') + ', player do YouTube';
      const active = musicButton.getAttribute('aria-pressed') === 'true';
      musicButton.setAttribute('aria-label', (active ? 'Pausar ' : 'Tocar ') + displayName + (displayArtist ? ', ' + displayArtist : ''));
    };
    const youtubeVideoId = (value) => {
      if (typeof value !== 'string' || !value.trim()) return null;
      try {
        const raw = value.trim();
        const url = new URL(/^https?:\/\//i.test(raw) ? raw : 'https://' + raw);
        if (!['https:', 'http:'].includes(url.protocol)) return null;
        const host = url.hostname.toLowerCase();
        const parts = url.pathname.split('/').filter(Boolean);
        let id;
        if (['youtu.be', 'www.youtu.be'].includes(host)) id = parts[0];
        else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
          id = ['embed', 'shorts', 'live'].includes(parts[0]) ? parts[1] : url.searchParams.get('v');
        }
        return typeof id === 'string' && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
      } catch { return null; }
    };
    const videoId = youtubeVideoId(music.url);
    refreshMusicText();
    if (!videoId) {
      musicFrame.removeAttribute('src');
      musicButton.disabled = true;
      musicLabel.textContent = 'Indisponível';
      musicStatus.textContent = 'Nenhuma faixa disponível no momento.';
      if (external) external.hidden = true;
      return;
    }
    const canonicalUrl = 'https://www.youtube.com/watch?v=' + videoId;
    if (external) { external.href = canonicalUrl; external.hidden = false; }
    const embedUrl = new URL('https://www.youtube-nocookie.com/embed/' + videoId);
    for (const [key, value] of Object.entries({enablejsapi: '1', autoplay: '1', playsinline: '1', rel: '0'})) embedUrl.searchParams.set(key, value);
    if (['http:', 'https:'].includes(window.location.protocol)) embedUrl.searchParams.set('origin', window.location.origin);
    musicFrame.src = embedUrl.href;
    if (!manualName) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);
      const metadataUrl = 'https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent(canonicalUrl);
      fetch(metadataUrl, {signal: controller.signal, credentials: 'omit'})
        .then(response => { if (!response.ok) throw new Error('Metadata unavailable'); return response.json(); })
        .then(metadata => {
          if (typeof metadata.title === 'string' && metadata.title.trim()) displayName = metadata.title.trim();
          if (!manualArtist && typeof metadata.author_name === 'string') displayArtist = metadata.author_name.trim();
          refreshMusicText();
        })
        .catch(() => { /* Keep the playable video and neutral title on network errors. */ })
        .finally(() => clearTimeout(timeout));
    }
    const updateMusicState = (state) => {
      const playing = state === 1;
      const active = playing || state === 3;
      musicCard.classList.toggle('is-playing', playing);
      musicButton.setAttribute('aria-pressed', String(active));
      refreshMusicText();
      musicLabel.textContent = active ? 'Pausar' : 'Tocar';
      musicIcon.textContent = active ? 'Ⅱ' : '▶';
      musicStatus.textContent = playing ? 'Tocando agora.' : state === 3 ? 'Carregando a faixa…' : state === 0 ? 'Quer ouvir de novo?' : state === 2 ? 'Pausado.' : 'Dê o play para ouvir.';
    };
    const unavailable = () => {
      playerReady = false;
      musicCard.classList.remove('is-playing');
      musicButton.disabled = true;
      musicButton.setAttribute('aria-pressed', 'false');
      musicLabel.textContent = 'Indisponível';
      musicIcon.textContent = '▶';
      musicStatus.textContent = 'Você também pode ouvir no YouTube.';
    };
    musicButton.addEventListener('click', () => {
      if (!playerReady) return;
      const state = musicPlayer.getPlayerState();
      if (state === 1 || state === 3) musicPlayer.pauseVideo();
      else musicPlayer.playVideo();
    });
    const initializeMusic = () => {
      if (musicPlayer) return;
      musicPlayer = new window.YT.Player('atlas-player', {
        events: {
          onReady: (event) => {
            playerReady = true;
            musicButton.disabled = false;
            updateMusicState(event.target.getPlayerState());
          },
          onStateChange: (event) => updateMusicState(event.data),
          onAutoplayBlocked: () => {
            updateMusicState(-1);
            musicStatus.textContent = 'Dê o play para ouvir.';
          },
          onError: unavailable
        }
      });
    };
    if (window.YT && typeof window.YT.Player === 'function') initializeMusic();
    else {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previousReady === 'function') previousReady();
        initializeMusic();
      };
      const apiScript = document.createElement('script');
      apiScript.src = 'https://www.youtube.com/iframe_api';
      apiScript.onerror = unavailable;
      document.head.append(apiScript);
    }
  }
})();
