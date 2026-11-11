/*
 * Jessie Sunday — site behaviour.
 *
 * Plain JavaScript with no dependencies and no build step. Every page loads
 * this one file with `defer`. Each feature below looks for its own markup and
 * does nothing when that markup is not on the page, so the pages stay fully
 * readable with JavaScript turned off.
 *
 *   1. Theme toggle (light / dark)
 *   2. Header: mobile menu, right-click the logo for the brand page
 *   3. Footer: pause control, and the seal (or shark) in the bay
 *   4. Scroll reveals
 *   5. Illustrations that move with scrolling
 *   6. Approach page: the roadmap route
 *   7. Selected work: category filters
 *   8. Partner page: choose a path
 *   9. Contact page: inquiry form
 *  10. Brand page: copy a color
 */
(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const clamp01 = (value) => Math.min(1, Math.max(0, value));

  /* ------------------------------------------------------------------ *
   * 1. Theme toggle
   *
   * A small inline script in each page's <head> sets data-theme on <html>
   * before the first paint (stored choice first, then the system setting).
   * The sun/moon icon is chosen by CSS from that attribute.
   * ------------------------------------------------------------------ */
  function initThemeToggle() {
    const button = document.querySelector(".theme-toggle");
    if (!button) return;

    button.addEventListener("click", () => {
      const root = document.documentElement;
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", next);
      } catch {
        // Storage is unavailable; the choice lasts for this page view only.
      }
      root.setAttribute("data-theme", next);
    });
  }

  /* ------------------------------------------------------------------ *
   * 2. Header
   * ------------------------------------------------------------------ */
  function initHeader() {
    const pill = document.querySelector(".nav-pill");
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.getElementById("mobile-nav");
    if (pill && toggle && menu) {
      const setOpen = (open) => {
        pill.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
        menu.toggleAttribute("inert", !open);
      };
      const isOpen = () => pill.classList.contains("open");

      toggle.addEventListener("click", () => setOpen(!isOpen()));

      // A link to the current page (or an anchor on it) doesn't reload, so
      // close the menu on any link click.
      menu.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) setOpen(false);
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isOpen()) {
          setOpen(false);
          toggle.focus();
        }
      });

      // Coming Back to a page restored from the browser's cache: start closed.
      window.addEventListener("pageshow", (event) => {
        if (event.persisted) setOpen(false);
      });
    }

    // Right-clicking the logo opens the brand page (logo downloads and
    // colors) instead of the browser's context menu.
    const wordmark = document.querySelector(".wordmark[data-brand-page]");
    if (wordmark) {
      wordmark.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        window.location.href = wordmark.getAttribute("data-brand-page");
      });
    }
  }

  /* ------------------------------------------------------------------ *
   * 3. Footer
   *
   * The pause button stops the CSS boat animations (and any creature in
   * mid-leap). Clicking the water — or pressing Enter or Space on it — makes
   * a seal jump out; every fifth time it is a shark.
   * ------------------------------------------------------------------ */
  const SEAL_ART =
    '<path d="M-12 31Q-43 12-30-14q5-13 12-22-5-19 7-27 15-9 27 2 6 6 4 14l10 7q3 7-10 9-7 1-10-3 7 16 1 35-5 17-17 30l15 9q9 9-3 9L-9 42q-15 13-22 7-3-6 19-18Z" fill="var(--scene-paper)" />' +
    '<path d="M-12 31Q-43 12-30-14q5-13 12-22-5-19 7-27 15-9 27 2 6 6 4 14l10 7q3 7-10 9-7 1-10-3 7 16 1 35-5 17-17 30l15 9q9 9-3 9L-9 42q-15 13-22 7-3-6 19-18Z" fill="url(#bay-hatch)" />' +
    '<path d="M-6-30Q8-15 0 8q-5 14-14 20-12-11-9-26 3-21 17-32Z" fill="var(--scene-paper)" stroke="none" />' +
    '<path d="M-21-12Q-48-7-48 11q8 6 28-11" fill="currentColor" />' +
    '<path d="M1-13Q24-4 27 9 14 13 3 0" fill="url(#bay-cross)" />' +
    '<path d="m-41 7 15-13M-20 39l-6 7m24-7 9 6M-10-23q-7 16-4 26" stroke-width=".8" />' +
    '<ellipse cx="17" cy="-40" rx="10" ry="7" fill="var(--scene-paper)" stroke-width=".8" />' +
    '<circle cx="9" cy="-51" r="2.2" fill="currentColor" stroke="none" />' +
    '<path d="m24-44 5 3-5 3Z" fill="currentColor" />' +
    '<path d="m18-39 18-3m-18 6 18 2m-21-1 13 7" stroke-width=".8" />' +
    '<path d="m-16-16 2 2m-6 9 2 1m2 13 2 2m3-36 2 1m-2 16 2 2" stroke-width="2.5" />';

  const SHARK_ART =
    '<path d="M-43-5Q-24-23-3-21L7-48q13 5 17 29Q45-14 63 1 47 16 19 17L1 35l-2-19q-24 1-43-12l-23 21 7-28-10-25Z" fill="var(--scene-paper)" />' +
    '<path d="M-43-5Q-24-23-3-21L7-48q13 5 17 29Q45-14 63 1 47 16 19 17L1 35l-2-19q-24 1-43-12l-23 21 7-28-10-25Z" fill="url(#bay-hatch)" />' +
    '<path d="M-35 0Q4 7 51 1L61 2Q43 15 19 15L1 32l-2-18Q-22 14-35 0Z" fill="var(--scene-paper)" stroke="none" />' +
    '<path d="M6 2-9 24Q9 23 21 7" fill="currentColor" />' +
    '<path d="M24-11q-4 7-1 13m-6-15q-4 7-1 13m-6-14q-4 6-1 11M37 4q9 5 21-1" stroke-width="1.2" />' +
    '<path d="m40 5 2 4 3-3 3 3 3-4" stroke-width=".8" />' +
    '<circle cx="43" cy="-6" r="2" fill="currentColor" stroke="none" />' +
    '<path d="M-57-17l5 14-7 17M7-38l9 18" stroke-width=".8" />';

  const SPLASH_ART =
    '<g class="bay-seal-ripples"><path d="M-42 2q42-8 84 0m-74 6q30 5 64 0m-81 1h-10m108-2h11M-24 15q24 3 48 0" /></g>' +
    '<g class="bay-seal-splash">' +
    '<path d="M-30-4q-8-17-16-19m66 17q8-18 18-24M-15-7l-5-16m25 13 5-13" />' +
    '<path d="M-48-29q-6-10-7-1 2 6 7 1Zm88-9q2-12 7-5 2 6-7 5ZM-20-30q-4-9-6-3 0 5 6 3Z" fill="currentColor" stroke="none" />' +
    "</g>";

  function initFooter() {
    const footer = document.querySelector(".site-footer");
    if (!footer) return;

    let paused = false;
    let creature = null;
    let stillTimer = 0;
    let jumpCount = 0;

    function removeCreature() {
      window.clearTimeout(stillTimer);
      stillTimer = 0;
      if (creature) creature.remove();
      creature = null;
    }

    // Reduced motion shows a still creature briefly, so no animation-end
    // event fires. Pausing holds it; resuming starts the wait again.
    function scheduleStillRemoval() {
      window.clearTimeout(stillTimer);
      stillTimer = 0;
      if (!creature || paused || !reducedMotion.matches) return;
      stillTimer = window.setTimeout(removeCreature, 1800);
    }

    const pauseButton = footer.querySelector(".footer-motion");
    if (pauseButton) {
      const glyph = pauseButton.querySelector("span");
      const label = Array.from(pauseButton.childNodes)
        .reverse()
        .find((node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());

      pauseButton.addEventListener("click", () => {
        paused = !paused;
        footer.classList.toggle("is-paused", paused);
        pauseButton.setAttribute("aria-pressed", String(paused));
        if (glyph) glyph.textContent = paused ? "▷" : "Ⅱ";
        if (label) label.nodeValue = paused ? "Resume motion" : "Pause motion";
        scheduleStillRemoval();
      });
    }

    const water = footer.querySelector(".bay-water-trigger");
    const svg = water ? water.ownerSVGElement : null;
    const lastBoat = svg ? svg.querySelector(".bay-boat--distant") : null;
    if (!water || !svg || !lastBoat) return;

    function startJump(event) {
      let x = 720;
      let y = 455;
      const matrix = svg.getScreenCTM();
      const bounds = svg.parentElement ? svg.parentElement.getBoundingClientRect() : null;
      if (event && matrix && bounds) {
        // Invert the SVG transform to account for the cropped artwork on mobile.
        const point = new DOMPoint(
          Math.max(bounds.left + 60, Math.min(bounds.right - 60, event.clientX)),
          event.clientY,
        ).matrixTransform(matrix.inverse());
        x = Math.max(100, Math.min(1340, point.x));
        y = Math.max(360, Math.min(500, point.y));
      }

      removeCreature();
      jumpCount += 1;
      const isShark = jumpCount % 5 === 0;

      const group = document.createElementNS(SVG_NS, "g");
      group.setAttribute("class", "bay-seal");
      group.setAttribute("data-creature", isShark ? "shark" : "seal");
      group.setAttribute("transform", `translate(${x} ${y}) scale(${isShark ? 0.45 : 0.35})`);
      group.setAttribute("pointer-events", "none");
      group.setAttribute("stroke-width", "1.5");
      group.innerHTML =
        '<g clip-path="url(#bay-seal-surface)"><g class="bay-seal-leap">' +
        (isShark ? SHARK_ART : SEAL_ART) +
        "</g></g>" +
        SPLASH_ART;

      const leap = group.querySelector(".bay-seal-leap");
      leap.addEventListener("animationend", (animationEvent) => {
        if (animationEvent.target === leap && creature === group) removeCreature();
      });

      // Drawn after the boats and before the foliage in the corners.
      lastBoat.after(group);
      creature = group;
      scheduleStillRemoval();
    }

    water.addEventListener("click", (event) => startJump(event));
    water.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!event.repeat) startJump();
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * 4. Scroll reveals
   *
   * Progressive enhancement: content is always visible in the HTML. Elements
   * marked data-reveal, the children of data-reveal-group, and data-flourish
   * drawings below the fold are held back, then arrive as they scroll in.
   * The CSS lives under [data-motion] in site.css.
   * ------------------------------------------------------------------ */
  function initScrollReveals() {
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    const targets = document.querySelectorAll(
      "main [data-reveal], main [data-reveal-group] > *, main [data-flourish]",
    );
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-motion", "entered");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -32px 0px", threshold: 0 },
    );

    for (const target of targets) {
      // Never hide copy that is already on screen when the page loads.
      if (
        !target.hasAttribute("data-flourish") &&
        target.getBoundingClientRect().top < window.innerHeight
      ) continue;

      const parent = target.parentElement;
      if (parent && parent.hasAttribute("data-reveal-group")) {
        const index = Array.from(parent.children).indexOf(target);
        target.style.setProperty("--reveal-delay", `${Math.min(index, 2) * 75}ms`);
      }
      target.setAttribute("data-motion", "pending");
      observer.observe(target);
    }

    // Keyboard focus landing inside a held-back element shows it at once.
    document.addEventListener("focusin", (event) => {
      if (!(event.target instanceof Element)) return;
      for (const target of targets) {
        if (target.contains(event.target)) {
          target.removeAttribute("data-motion");
          observer.unobserve(target);
        }
      }
    });

    reducedMotion.addEventListener("change", () => {
      if (!reducedMotion.matches) return;
      observer.disconnect();
      for (const target of targets) {
        target.removeAttribute("data-motion");
        target.style.removeProperty("--reveal-delay");
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * 5. Illustrations that move with scrolling
   *
   * Inside a [data-hero-scene] section, each SVG layer marked
   * data-scene-motion="<kind>" drifts as the page scrolls. getScenePose is
   * the whole score: every layer starts at its drawn position (progress 0)
   * and the motion is fully reversible.
   *
   * Optional attributes on a layer:
   *   data-scene-seed    a number that offsets the layer's sway
   *   data-scene-origin  "x y" point the layer rotates around
   * ------------------------------------------------------------------ */
  function getScenePose(kind, progress, seed) {
    const p = Number.isFinite(progress) ? clamp01(progress) : 0;
    const phase = ((seed || 0) % 23) * 0.37;
    const wave = (frequency, offset = phase) =>
      Math.sin(p * frequency + offset) - Math.sin(offset);

    switch (kind) {
      case "case-photo": return { x: 0, y: -36 * p, rotation: 0 };
      case "bridge": return { x: -26 * p, y: 38 * p, rotation: -0.8 * p };
      case "curtains": return { x: 20 * p, y: -24 * p, rotation: 1.2 * p };
      case "chandelier": return { x: 0, y: 8 * p, rotation: 6 * wave(7, 0) };
      case "pendant": return { x: 0, y: 4 * p, rotation: 3 * wave(6, 0) };
      case "disco": return { x: 0, y: 0, rotation: 540 * p };
      case "glints": return { x: 0, y: 0, rotation: -95 * p };
      case "boat": return { x: 210 * p, y: 7 * wave(14, 0), rotation: 4 * wave(10, 0) };
      case "back-foliage": return { x: 5 * wave(5), y: -24 * p, rotation: 0.6 * wave(5) };
      case "foliage": return { x: 9 * wave(7), y: 22 * p, rotation: 1.2 * wave(6) };
      case "candles": return { x: -10 * p, y: 18 * p, rotation: -1.5 * wave(5, 0) };
      case "reception": return { x: -9 * p, y: 18 * p, rotation: 0.3 * wave(5) };
      case "stage": return { x: -12 * p, y: 20 * p, rotation: 0 };
      case "dinner": return { x: 0, y: 16 * p, rotation: 0 };
      case "person": return { x: 7 * wave(8), y: 3 * wave(11), rotation: 1.8 * wave(7) };
      case "performer": return { x: 10 * wave(8), y: 4 * wave(10), rotation: 3 * wave(7) };
      case "flowers": return { x: 2 * wave(6), y: 2 * wave(8), rotation: 2 * wave(7) };
      case "lights": return { x: 0, y: -9 * p, rotation: 0.7 * wave(6, 0) };
      case "festoon-bulb": return { x: 0, y: 0, rotation: 7 * wave(7) };
      case "cafe-window": return { x: 7 * p, y: -14 * p, rotation: 0 };
      case "cafe-table": return { x: 0, y: 10 * p, rotation: 0 };
      case "steam": return { x: 4 * wave(7), y: -22 * p, rotation: 3 * wave(5) };
      case "chart-bar": return { x: 0, y: -12 * wave(5), rotation: 0 };
      default: return { x: 0, y: 0, rotation: 0 };
    }
  }

  /** Reads the moving layers inside an element, remembering where each was drawn. */
  function readSceneLayers(container) {
    return Array.from(container.querySelectorAll("[data-scene-motion]")).map((element) => ({
      element,
      kind: element.dataset.sceneMotion,
      seed: Number(element.dataset.sceneSeed || 0),
      origin: element.dataset.sceneOrigin || "0 0",
      // Preserve the original placement and mirroring of each illustration.
      base: element.getAttribute("transform"),
    }));
  }

  function poseLayers(layers, progress) {
    for (const { element, kind, seed, origin, base } of layers) {
      const { x, y, rotation } = getScenePose(kind, progress, seed);
      element.setAttribute(
        "transform",
        `${base || ""} translate(${x.toFixed(3)} ${y.toFixed(3)}) rotate(${rotation.toFixed(3)} ${origin})`,
      );
    }
  }

  function resetLayers(layers) {
    for (const { element, base } of layers) {
      if (base === null) element.removeAttribute("transform");
      else element.setAttribute("transform", base);
    }
  }

  function initHeroScene(scene) {
    const layers = readSceneLayers(scene);
    let frame = 0;
    let previousTime = 0;
    let visible = true;
    let start = 0;
    let distance = 1;
    let current = 0;

    const progress = () => clamp01((window.scrollY - start) / distance);

    function cancel() {
      window.cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    }

    function tick(time) {
      frame = 0;
      if (reducedMotion.matches || !visible || document.hidden) return;
      // Ease toward the scroll position so the artwork glides, not snaps.
      const target = progress();
      const delta = previousTime ? Math.min(64, time - previousTime) : 16;
      previousTime = time;
      current += (target - current) * (1 - Math.exp(-delta / 65));
      const settled = Math.abs(target - current) < 0.0002;
      if (settled) current = target;
      poseLayers(layers, current);
      if (!settled) frame = window.requestAnimationFrame(tick);
      else previousTime = 0;
    }

    function schedule() {
      if (!frame && visible && !reducedMotion.matches && !document.hidden) {
        frame = window.requestAnimationFrame(tick);
      }
    }

    function measure() {
      const bounds = scene.getBoundingClientRect();
      start = Math.max(0, bounds.top + window.scrollY - window.innerHeight * 0.15);
      distance = Math.max(1, bounds.height);
      schedule();
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        current = progress();
        schedule();
      } else cancel();
    });
    const resizeObserver = new ResizeObserver(measure);

    measure();
    current = progress();
    observer.observe(scene);
    resizeObserver.observe(scene);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancel();
      else schedule();
    });
    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches) {
        cancel();
        current = 0;
        resetLayers(layers);
      } else {
        current = progress();
        schedule();
      }
    });
  }

  function initHeroScenes() {
    if (!("IntersectionObserver" in window) || !("ResizeObserver" in window)) return;
    document.querySelectorAll("[data-hero-scene]").forEach(initHeroScene);
  }

  /* ------------------------------------------------------------------ *
   * 6. Approach page: the roadmap route
   *
   * Measures the real position of each numbered stop so the connecting line
   * follows the copy at every screen size, then inks the line in (and marks
   * each stop as reached) as the page scrolls.
   * ------------------------------------------------------------------ */
  function initRoadmap() {
    const svg = document.querySelector("[data-roadmap-route]");
    const root = svg ? svg.parentElement : null;
    if (!svg || !root || !("IntersectionObserver" in window) || !("ResizeObserver" in window)) return;

    const paths = Array.from(svg.querySelectorAll("path"));
    const reveal = svg.querySelector("[data-roadmap-reveal]");
    const stops = Array.from(root.querySelectorAll("[data-roadmap-step]")).map((element) => ({
      element,
      node: element.querySelector("[data-roadmap-node]"),
      top: 0,
      height: 1,
      x: 0,
      y: 0,
      layers: readSceneLayers(element),
    }));
    if (!reveal || !stops.length || stops.some((stop) => !stop.node)) return;

    let documentTop = 0;
    let frame = 0;
    let visible = true;
    let viewportHeight = window.innerHeight;
    let width = 1;

    function resetFigures() {
      for (const stop of stops) resetLayers(stop.layers);
    }

    function paint() {
      frame = 0;
      const focus = window.scrollY + viewportHeight * 0.65 - documentTop;
      // A rectangular reveal follows the steadily descending route exactly,
      // even as the connector curves between differently sized steps.
      const first = stops[0].y;
      const last = stops[stops.length - 1].y;
      const progress = reducedMotion.matches
        ? 1
        : clamp01((focus - first) / Math.max(1, last - first));
      const cutoff = first + progress * (last - first);
      reveal.setAttribute("d", `M0 0H${width}V${cutoff}H0Z`);
      root.dataset.roadmapProgress = progress.toFixed(3);
      for (const stop of stops) {
        stop.node.dataset.reached = String(reducedMotion.matches || focus >= stop.y);
        if (reducedMotion.matches) continue;
        poseLayers(stop.layers, clamp01((focus - stop.top) / stop.height));
      }
    }

    function schedule() {
      if (!frame && visible && !document.hidden) frame = window.requestAnimationFrame(paint);
    }

    function measure() {
      const bounds = root.getBoundingClientRect();
      width = bounds.width;
      documentTop = bounds.top + window.scrollY;
      viewportHeight = window.innerHeight;
      svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
      for (const stop of stops) {
        const row = stop.element.getBoundingClientRect();
        const node = stop.node.getBoundingClientRect();
        stop.top = row.top - bounds.top;
        stop.height = row.height;
        stop.x = node.left + node.width / 2 - bounds.left;
        stop.y = node.top + node.height / 2 - bounds.top;
      }
      const bend = bounds.width < 700 ? 10 : Math.min(72, bounds.width * 0.055);
      let d = `M${stops[0].x} ${stops[0].y}`;
      for (let i = 1; i < stops.length; i++) {
        const a = stops[i - 1];
        const b = stops[i];
        const sign = i % 2 ? 1 : -1;
        const mid = (a.y + b.y) / 2;
        d += `C${a.x + bend * sign} ${a.y + 100} ${b.x - bend * sign} ${mid} ${b.x} ${b.y}`;
      }
      for (const path of paths) if (path !== reveal) path.setAttribute("d", d);
      paint();
    }

    const resizeObserver = new ResizeObserver(measure);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        measure();
        schedule();
      } else {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    });

    measure();
    resizeObserver.observe(root);
    intersectionObserver.observe(root);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    reducedMotion.addEventListener("change", () => {
      resetFigures();
      paint();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      } else schedule();
    });
  }

  /* ------------------------------------------------------------------ *
   * 7. Selected work: category filters
   *
   * Each filter button carries data-filter ("all" or a category name) and
   * each .work-card carries the matching data-category. Cards that stay
   * glide to their new places; cards that appear rise in.
   * ------------------------------------------------------------------ */
  function initWorkFilters() {
    const filters = document.querySelector(".filters");
    const grid = document.querySelector(".work-grid");
    if (!filters || !grid) return;

    const buttons = Array.from(filters.querySelectorAll("button[data-filter]"));
    const cards = Array.from(grid.querySelectorAll(".work-card"));
    const announcement = document.querySelector(".filters + [aria-live]");
    const canAnimate = typeof Element.prototype.animate === "function";
    const visibleCards = () => cards.filter((card) => !card.hidden);

    let filter = "all";
    let animations = [];

    function cancelAnimations() {
      animations.forEach((animation) => animation.cancel());
      animations = [];
    }
    reducedMotion.addEventListener("change", cancelAnimations);
    window.addEventListener("resize", cancelAnimations);

    function choose(next) {
      // Remember where everything was before the layout changes.
      const previous =
        next !== filter && canAnimate
          ? {
              height: grid.getBoundingClientRect().height,
              cards: new Map(
                visibleCards().map((card) => [
                  card,
                  { rect: card.getBoundingClientRect(), opacity: getComputedStyle(card).opacity },
                ]),
              ),
            }
          : null;

      filter = next;
      for (const button of buttons) {
        const active = button.dataset.filter === filter;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      }
      for (const card of cards) {
        card.hidden = filter !== "all" && card.dataset.category !== filter;
      }
      const count = visibleCards().length;
      if (announcement) {
        announcement.textContent = `Showing ${count} ${count === 1 ? "project" : "projects"}.`;
      }

      if (!previous) return;
      cancelAnimations();
      if (reducedMotion.matches) return;

      // Measure the final layout together, before animating from the old positions.
      const nextHeight = grid.getBoundingClientRect().height;
      const measured = visibleCards().map((card) => ({ card, rect: card.getBoundingClientRect() }));
      const timing = { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" };

      for (const { card, rect } of measured) {
        const before = previous.cards.get(card);
        animations.push(
          card.animate(
            [
              {
                transform: before
                  ? `translate(${before.rect.left - rect.left}px, ${before.rect.top - rect.top}px)`
                  : "translateY(12px)",
                opacity: before ? before.opacity : 0,
              },
              { transform: "translate(0, 0)", opacity: 1 },
            ],
            timing,
          ),
        );
      }

      if (previous.height !== nextHeight) {
        animations.push(
          grid.animate(
            [{ height: `${previous.height}px` }, { height: `${nextHeight}px` }],
            timing,
          ),
        );
      }
    }

    for (const button of buttons) {
      button.addEventListener("click", () => choose(button.dataset.filter));
    }
  }

  /* ------------------------------------------------------------------ *
   * 8. Partner page: choose a path
   *
   * The two paths are real anchors (#fractional-route, #project-route), so
   * each one is shareable and the browser's Back button works. The matching
   * detail panel is un-hidden for whichever anchor is in the address bar.
   * ------------------------------------------------------------------ */
  function initPartnerPaths() {
    const root = document.querySelector("[data-adventure-choice]");
    if (!root) return;

    const paths = ["fractional", "project"]
      .map((id) => {
        const panel = document.getElementById(`${id}-route`);
        const link = root.querySelector(`a[href="#${id}-route"]`);
        return { id, panel, link, card: link ? link.closest("article") : null };
      })
      .filter((path) => path.panel && path.link);

    function readChoice() {
      const match = paths.find((path) => window.location.hash === `#${path.id}-route`);
      return match ? match.id : null;
    }

    function focusDestination(id) {
      const target = document.getElementById(id);
      if (!target) return;
      const focusable = target.querySelector("h2[tabindex], a");
      if (focusable) focusable.focus({ preventScroll: true });
      target.scrollIntoView({
        behavior: reducedMotion.matches ? "instant" : "smooth",
        block: "start",
      });
    }

    let selected = null;

    /** Shows the panel named in the address bar. Returns true if that changed. */
    function render() {
      const next = readChoice();
      if (next === selected) return false;
      selected = next;
      root.dataset.adventureChoice = selected || "none";
      for (const path of paths) {
        const chosen = path.id === selected;
        path.panel.hidden = !chosen;
        path.link.setAttribute("aria-expanded", String(chosen));
        if (path.card) path.card.dataset.selected = String(chosen);
      }
      return true;
    }

    function update() {
      if (render() && selected) focusDestination(`${selected}-route`);
    }

    function choose(event) {
      // Leave new-tab and modified clicks to the browser.
      if (
        event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      ) return;
      event.preventDefault();
      const hash = event.currentTarget.hash;
      if (window.location.hash === hash) {
        focusDestination(hash.slice(1));
        return;
      }
      window.history.pushState(null, "", hash);
      update();
      if (hash === "#choose-path") focusDestination("choose-path");
    }

    root
      .querySelectorAll('a[href$="-route"][aria-controls], a[href="#choose-path"]')
      .forEach((link) => link.addEventListener("click", choose));
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);

    // Arriving on a shared link: show its panel straight away. The browser
    // then jumps to the anchor itself and clears keyboard focus as the page
    // finishes loading, so move focus into the panel only after that.
    if (render() && selected) {
      const focusPanel = () => {
        if (selected) focusDestination(`${selected}-route`);
      };
      if (document.readyState === "complete") focusPanel();
      else window.addEventListener("load", () => window.requestAnimationFrame(focusPanel), { once: true });
    }
  }

  /* ------------------------------------------------------------------ *
   * 9. Contact page: inquiry form
   *
   * The form never sends anything from the website. It prepares a short
   * introduction the visitor can copy or download.
   *
   * To have it open a prefilled email draft instead, put Jessie's address in
   * the form's data-contact-email attribute in contact/index.html:
   *
   *   <form id="inquiry-form" data-contact-email="hello@example.com">
   *
   * Links from the Partner page arrive with ?type=fractional or
   * ?type=project, which is carried into the introduction.
   * ------------------------------------------------------------------ */
  const PARTNERSHIP_BY_QUERY = {
    fractional: "Fractional / retainer",
    project: "Project-based",
  };
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function buildMailtoUrl(recipient, name, summary) {
    const subject = `Let’s create something together — ${name.trim()}`;
    return (
      `mailto:${encodeURIComponent(recipient)}` +
      `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`
    );
  }

  function initInquiryForm() {
    const form = document.getElementById("inquiry-form");
    const output = document.querySelector(".inquiry-output");
    if (!form || !output) return;
    // Email submission is temporarily disabled; the form shows "Coming soon".
    // Remove data-coming-soon (and the disabled attributes) in contact/index.html to re-enable.
    if (form.hasAttribute("data-coming-soon")) {
      form.addEventListener("submit", (event) => event.preventDefault());
      return;
    }

    const status = document.getElementById("form-status");
    const note = document.getElementById("inquiry-note");
    const summaryBox = output.querySelector("pre");
    const [copyButton, downloadButton] = output.querySelectorAll(".form-actions button");
    const setStatus = (message) => {
      if (status) status.textContent = message;
    };

    const configured = (form.dataset.contactEmail || "").trim();
    const recipient = EMAIL_PATTERN.test(configured) ? configured : null;
    let summary = "";

    if (recipient) {
      if (note) {
        const link = document.createElement("a");
        link.href = `mailto:${recipient}`;
        link.textContent = recipient;
        note.textContent = "Opens a draft in your email app. You review and send it. Or email ";
        note.append(link);
      }
      const explanation = output.querySelector("p");
      if (explanation) {
        explanation.textContent =
          "An email draft has been requested in your email app. Review and send it there, or copy this inquiry into a new email.";
      }
    }

    const type = new URLSearchParams(window.location.search).get("type");
    const preselect = type && Object.hasOwn(PARTNERSHIP_BY_QUERY, type) ? PARTNERSHIP_BY_QUERY[type] : null;
    if (preselect) {
      const context = document.createElement("p");
      context.className = "inquiry-context";
      context.textContent = `Interested in: ${preselect}`;
      form.prepend(context);
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const email = String(new FormData(form).get("email") || "").trim();
      summary = [
        "Hi Jessie,",
        "",
        "I’d love to connect and hear more about working together.",
        "",
        `Email: ${email}`,
        ...(preselect ? [`Partnership: ${preselect}`] : []),
        "",
        "Looking forward to connecting!",
      ].join("\n");

      if (summaryBox) summaryBox.textContent = summary;
      if (copyButton) copyButton.textContent = "Copy inquiry";
      setStatus("Inquiry prepared. Nothing has been sent from the website.");
      output.hidden = false;
      output.focus({ preventScroll: true });
      output.scrollIntoView({
        behavior: reducedMotion.matches ? "instant" : "smooth",
        block: "center",
      });

      if (recipient) window.location.href = buildMailtoUrl(recipient, email, summary);
    });

    if (copyButton) {
      copyButton.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(summary);
          copyButton.textContent = "Copied ✓";
          setStatus("Inquiry copied to clipboard.");
        } catch {
          setStatus("Copy is unavailable here. Select the inquiry text or use Download .txt.");
          if (summaryBox) {
            const range = document.createRange();
            range.selectNodeContents(summaryBox);
            const selection = window.getSelection();
            if (selection) {
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        }
      });
    }

    if (downloadButton) {
      downloadButton.addEventListener("click", () => {
        const url = URL.createObjectURL(new Blob([summary], { type: "text/plain;charset=utf-8" }));
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "jessie-sunday-inquiry.txt";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        setStatus("Your inquiry download is ready. Nothing has been sent.");
      });
    }
  }

  /* ------------------------------------------------------------------ *
   * 10. Brand page: copy a color
   *
   * Each swatch's button carries the value to copy in data-hex.
   * ------------------------------------------------------------------ */
  function initColorSwatches() {
    document.querySelectorAll(".swatch").forEach((swatch) => {
      const button = swatch.querySelector(".swatch-copy[data-hex]");
      if (!button) return;
      const name = swatch.querySelector("h3") ? swatch.querySelector("h3").textContent : "Color";
      const label = button.querySelector("span");
      const status = swatch.querySelector('[role="status"]');
      let timer = 0;

      function show(state) {
        if (label) label.textContent = state === "copied" ? "Copied" : "Copy";
        if (status) {
          status.textContent =
            state === "copied" ? `${name} hex code copied.`
            : state === "failed" ? "Copy is unavailable here. Select the code."
            : "";
        }
        window.clearTimeout(timer);
        if (state !== "idle") timer = window.setTimeout(() => show("idle"), 1800);
      }

      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(button.dataset.hex);
          show("copied");
        } catch {
          show("failed");
        }
      });
    });
  }

  /* ------------------------------------------------------------------ */

  function init() {
    initThemeToggle();
    initHeader();
    initFooter();
    initScrollReveals();
    initHeroScenes();
    initRoadmap();
    initWorkFilters();
    initPartnerPaths();
    initInquiryForm();
    initColorSwatches();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
