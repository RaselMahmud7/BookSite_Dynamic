const content = document.getElementById("content");
const progressBar = document.getElementById("progressBar");

const routes = {
  intro: "chapters/intro.html",
  ch1: "chapters/ch1.html",
  ch2: "chapters/ch2.html",
  ch3: "chapters/ch3.html",
  ch4: "chapters/ch4.html",
  ch5: "chapters/ch5.html",
  ch6: "chapters/ch6.html",
  ch7: "chapters/ch7.html",
  ch8: "chapters/ch8.html",
  ch9: "chapters/ch9.html",
  end: "chapters/end.html",
};

function getRoute() {
  const hash = (location.hash || "#intro").replace("#", "");
  return routes[hash] ? hash : "intro";
}

async function loadRoute(routeKey) {
  const path = routes[routeKey];
  const res = await fetch(path);
  const html = await res.text();

  content.innerHTML = html;

  // reveal animation
  requestAnimationFrame(() => {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("show"));
  });

  // copy buttons
  wireCopyButtons();

  // highlight active toc
  setActive(routeKey);

  // reset scroll
  window.scrollTo({ top: 0, behavior: "smooth" });

  // progress reset
  updateProgress();
}

function setActive(routeKey) {
  document.querySelectorAll(".toc-link").forEach(a => {
    a.classList.toggle("active", a.dataset.route === routeKey);
  });
}

function wireCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-copy");
      const el = document.getElementById(id);
      if (!el) return;

      const text = el.innerText;
      const old = btn.textContent;

      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = old), 1000);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);

        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = old), 1000);
      }
    });
  });
}

// progress bar
function updateProgress() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressBar.style.width = pct.toFixed(2) + "%";
}
window.addEventListener("scroll", updateProgress);

// router
window.addEventListener("hashchange", () => loadRoute(getRoute()));

// mobile toc
const mobileToc = document.getElementById("mobileToc");
document.getElementById("mobileTocBtn")?.addEventListener("click", () => mobileToc.classList.remove("hidden"));
document.getElementById("mobileTocClose")?.addEventListener("click", () => mobileToc.classList.add("hidden"));
mobileToc?.addEventListener("click", (e) => {
  if (e.target === mobileToc || e.target.classList.contains("bg-black/60")) mobileToc.classList.add("hidden");
});
document.querySelectorAll(".drawer-link").forEach(a => a.addEventListener("click", () => mobileToc.classList.add("hidden")));

// effects toggle (reduce motion)
document.getElementById("toggleEffectsBtn")?.addEventListener("click", () => {
  document.body.classList.toggle("no-motion");
});

// initial load
loadRoute(getRoute());
