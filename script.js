document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");
  const navLinks = menu.querySelectorAll("a");

  // 모바일 메뉴 열기/닫기
  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  };

  toggle.addEventListener("click", () => {
    setMenu(!menu.classList.contains("open"));
  });

  navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  // 스크롤 시 헤더 테두리 표시
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 현재 보고 있는 섹션의 메뉴 강조
  const sections = document.querySelectorAll("main section[id]");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  // 스크롤 등장 효과
  const revealTargets = document.querySelectorAll(".section-title, .about-grid, .card, .contact-grid");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });

  // 연락 폼 검사
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name;
    const email = form.elements.email;
    const message = form.elements.message;

    [name, email, message].forEach((field) => field.classList.remove("invalid"));

    let error = "";
    if (!name.value.trim()) {
      error = "이름을 입력해 주세요.";
      name.classList.add("invalid");
      name.focus();
    } else if (!emailPattern.test(email.value.trim())) {
      error = "올바른 이메일 주소를 입력해 주세요.";
      email.classList.add("invalid");
      email.focus();
    } else if (message.value.trim().length < 5) {
      error = "메시지를 5자 이상 입력해 주세요.";
      message.classList.add("invalid");
      message.focus();
    }

    status.className = "form-status";
    if (error) {
      status.textContent = error;
      status.classList.add("error");
      return;
    }

    status.textContent = `${name.value.trim()}님, 메시지 감사합니다! 곧 답장드리겠습니다.`;
    status.classList.add("success");
    form.reset();
  });

  // 맨 위로 버튼 & 연도
  document.getElementById("to-top").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.getElementById("year").textContent = new Date().getFullYear();
});
