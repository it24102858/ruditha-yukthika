import { image, img } from "framer-motion/client";
import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css?family=Inconsolata&text=Hello');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --blue: #1a6cff;
    --blue-dim: #0d3d8f;
    --blue-glow: rgba(26,108,255,0.35);
    --white: #f0f4ff;
    --black: #060810;
    --card-bg: #0b0f1e;
    --border: rgba(26,108,255,0.25);
    --font-display: 'Syne', sans-serif;
    --font-mono: 'Space Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: var(--font-display);
    overflow-x: hidden;
  }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--black); }
  ::-webkit-scrollbar-thumb { background: var(--blue); border-radius: 3px; }

  /* ── NOISE OVERLAY ── */
  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    background-size: 200px;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.4;
  }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.1rem 3rem;
    background: rgba(6,8,16,0.75);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    transition: padding 0.3s;
  }
  .nav.scrolled { padding: 0.7rem 3rem; }
  .nav-logo {
    font-size: 1.3rem; font-weight: 800; letter-spacing: -0.04em;
    color: var(--white);
    font-family: var(--font-display);
  }
  .nav-logo span { color: var(--blue); }
  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a {
    color: rgba(240,244,255,0.6);
    text-decoration: none;
    font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase;
    font-family: var(--font-mono);
    transition: color 0.2s;
    position: relative;
  }
  .nav-links a::after {
    content: '';
    position: absolute; bottom: -4px; left: 0; right: 0; height: 1px;
    background: var(--blue);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.25s;
  }
  .nav-links a:hover { color: var(--white); }
  .nav-links a:hover::after { transform: scaleX(1); }
  .nav-hamburger {
    display: none; flex-direction: column; gap: 5px; cursor: pointer;
    background: none; border: none; padding: 4px;
  }
  .nav-hamburger span {
    display: block; width: 24px; height: 2px;
    background: var(--white); border-radius: 2px;
    transition: all 0.3s;
  }
  .mobile-menu {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(6,8,16,0.97); backdrop-filter: blur(20px);
    flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem;
  }
  .mobile-menu.open { display: flex; }
  .mobile-menu a {
    color: var(--white); text-decoration: none;
    font-size: 2rem; font-weight: 700; letter-spacing: -0.03em;
    transition: color 0.2s;
  }
  .mobile-menu a:hover { color: var(--blue); }
  .close-btn {
    position: absolute; top: 1.5rem; right: 2rem;
    background: none; border: none; color: var(--white);
    font-size: 2rem; cursor: pointer;
  }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center;
    padding: 8rem 2rem 4rem;
    position: relative; overflow: hidden;
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(26,108,255,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,108,255,0.07) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
  }
  .hero-glow {
    position: absolute;
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(26,108,255,0.18) 0%, transparent 65%);
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    animation: pulseGlow 4s ease-in-out infinite;
  }
  @keyframes pulseGlow {
    0%,100% { opacity: 0.7; transform: translate(-50%,-50%) scale(1); }
    50% { opacity: 1; transform: translate(-50%,-50%) scale(1.12); }
  }

  /* CIRCLE AVATAR */
  .avatar-wrap {
    position: relative; width: 160px; height: 160px; margin-bottom: 2.5rem;
    animation: floatAvatar 5s ease-in-out infinite;
  }
  @keyframes floatAvatar {
    0%,100% { transform: translateY(0px); }
    50% { transform: translateY(-14px); }
  }
  .avatar-ring {
    position: absolute; inset: -8px;
    border-radius: 50%;
    background: conic-gradient(var(--blue), #fff, var(--blue-dim), var(--blue));
    animation: spinRing 6s linear infinite;
  }
  @keyframes spinRing {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .avatar-ring-inner {
    position: absolute; inset: 2px;
    border-radius: 50%;
    background: var(--black);
  }
  .avatar-circle {
    position: relative; width: 100%; height: 100%;
    border-radius: 50%; overflow: hidden;
    background: linear-gradient(135deg, var(--blue-dim), var(--black));
    display: flex; align-items: center; justify-content: center;
    font-size: 4rem; z-index: 1;
  }
  .avatar-dots {
    position: absolute; inset: -20px;
    border-radius: 50%;
    border: 1px dashed rgba(26,108,255,0.3);
    animation: spinRing 18s linear infinite reverse;
  }
  .hero-tag {
    font-family: var(--font-mono);
    font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--blue);
    background: rgba(26,108,255,0.1);
    border: 1px solid rgba(26,108,255,0.3);
    padding: 0.35rem 1rem; border-radius: 20px;
    margin-bottom: 1.5rem;
    display: inline-block;
    animation: fadeSlideUp 0.8s ease both;
  }
  .hero-title {
    font-size: normal(3rem, 8vw, 7rem);
    font-weight: 800; line-height: 1;
    letter-spacing: -0.04em;
    margin-bottom: 1.2rem;
    animation: fadeSlideUp 0.8s 0.15s ease both;
  }
  .hero-title .blue { color: var(--blue); }
  .hero-title .dim { color: rgba(240,244,255,0.3); }
  .hero-sub {
    font-family: var(--font-mono);
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    color: rgba(240,244,255,0.55);
    max-width: 560px; line-height: 1.7;
    margin-bottom: 2.5rem;
    animation: fadeSlideUp 0.8s 0.3s ease both;
  }
  .hero-btns {
    display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
    animation: fadeSlideUp 0.8s 0.45s ease both;
  }
  .btn-primary {
    background: var(--blue);
    color: #fff; border: none; cursor: pointer;
    padding: 0.85rem 2rem; border-radius: 4px;
    font-family: var(--font-display); font-size: 0.9rem; font-weight: 700;
    letter-spacing: 0.03em;
    transition: all 0.2s;
    box-shadow: 0 0 24px var(--blue-glow);
    text-decoration: none;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 36px var(--blue-glow); background: #3d7fff; }
  .btn-outline {
    background: transparent;
    color: var(--white); border: 1px solid var(--border); cursor: pointer;
    padding: 0.85rem 2rem; border-radius: 4px;
    font-family: var(--font-display); font-size: 0.9rem; font-weight: 600;
    transition: all 0.2s;
    text-decoration: none;
  }
  .btn-outline:hover { border-color: var(--blue); color: var(--blue); transform: translateY(-2px); }
  .scroll-indicator {
    position: absolute; bottom: 2.5rem;
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    animation: fadeSlideUp 1s 1s ease both;
  }
  .scroll-indicator span {
    font-family: var(--font-mono); font-size: 0.65rem;
    letter-spacing: 0.15em; color: rgba(240,244,255,0.3); text-transform: uppercase;
  }
  .scroll-line {
    width: 1px; height: 50px;
    background: linear-gradient(to bottom, var(--blue), transparent);
    animation: scrollLine 2s ease-in-out infinite;
  }
  @keyframes scrollLine {
    0%,100% { opacity: 0; transform: scaleY(0); transform-origin: top; }
    50% { opacity: 1; transform: scaleY(1); }
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── SECTIONS ── */
  section { padding: 7rem 2rem; }
  .container { max-width: 1100px; margin: 0 auto; }
  .section-label {
    font-family: var(--font-mono);
    font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--blue); margin-bottom: 0.75rem;
  }
  .section-title {
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 800; letter-spacing: -0.04em;
    margin-bottom: 1rem; line-height: 1.1;
  }
  .section-title span { color: var(--blue); }
  .divider {
    width: 60px; height: 3px;
    background: var(--blue);
    margin-bottom: 3rem;
    position: relative; overflow: hidden;
  }
  .divider::after {
    content: '';
    position: absolute; inset: 0;
    background: white;
    animation: shimmer 2s ease-in-out infinite;
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }

  /* ── ABOUT ── */
  .about-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 5rem;
    align-items: center;
  }
  .about-avatar-wrap {
    position: relative; width: 260px; height: 260px; margin: auto;
    animation: floatAvatar 6s 1s ease-in-out infinite;
  }
  .about-avatar-ring {
    position: absolute; inset: -10px; border-radius: 50%;
    background: conic-gradient(var(--blue), transparent 60%, var(--blue));
    animation: spinRing 8s linear infinite;
  }
  .about-avatar-ring-inner { position: absolute; inset: 3px; border-radius: 50%; background: var(--black); }
  .about-avatar-circle {
    position: relative; width: 100%; height: 100%;
    border-radius: 50%; overflow: hidden;
    background: linear-gradient(135deg, #0d1a3d 0%, var(--black) 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 7rem; z-index: 1;
    box-shadow: inset 0 0 60px rgba(26,108,255,0.15);
  }
  .about-dots {
    position: absolute; inset: -25px; border-radius: 50%;
    border: 1px dotted rgba(26,108,255,0.25);
    animation: spinRing 20s linear infinite;
  }
  .about-dots2 {
    position: absolute; inset: -45px; border-radius: 50%;
    border: 1px dotted rgba(26,108,255,0.1);
    animation: spinRing 30s linear infinite reverse;
  }
  .about-text p {
    color: rgba(240,244,255,0.65);
    line-height: 1.9; font-size: 1rem; margin-bottom: 1.2rem;
  }
  .about-stats {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem;
    margin-top: 2rem;
  }
  .stat-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 8px; padding: 1.2rem 1rem; text-align: center;
    transition: all 0.3s;
  }
  .stat-card:hover { border-color: var(--blue); transform: translateY(-4px); box-shadow: 0 8px 24px var(--blue-glow); }
  .stat-num {
    font-size: 2.2rem; font-weight: 800; color: var(--blue);
    letter-spacing: -0.04em; display: block; margin-bottom: 0.3rem;
  }
  .stat-label {
    font-family: var(--font-mono); font-size: 0.65rem;
    letter-spacing: 0.1em; color: rgba(240,244,255,0.4); text-transform: uppercase;
  }

  /* ── SKILLS ── */
  .skills-bg { background: var(--card-bg); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 1.5rem; }
  .skill-card {
    background: var(--black);
    border: 1px solid var(--border);
    border-radius: 10px; padding: 1.8rem;
    transition: all 0.35s;
    position: relative; overflow: hidden;
  }
  .skill-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--blue), transparent);
    transform: scaleX(0); transform-origin: center;
    transition: transform 0.4s;
  }
  .skill-card:hover { border-color: var(--blue); transform: translateY(-5px); box-shadow: 0 12px 32px var(--blue-glow); }
  .skill-card:hover::before { transform: scaleX(1); }
  .skill-icon { font-size: 2.2rem; margin-bottom: 1rem; display: block; }
  .skill-name { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.4rem; }
  .skill-desc { font-family: var(--font-mono); font-size: 0.75rem; color: rgba(240,244,255,0.45); margin-bottom: 1.2rem; line-height: 1.6; }
  .skill-bar-bg { background: rgba(255,255,255,0.06); border-radius: 2px; height: 4px; overflow: hidden; }
  .skill-bar-fill {
    height: 100%; border-radius: 2px;
    background: linear-gradient(90deg, var(--blue-dim), var(--blue));
    transition: width 1.2s cubic-bezier(0.16,1,0.3,1);
  }
  .skill-pct { font-family: var(--font-mono); font-size: 0.7rem; color: var(--blue); float: right; margin-top: -1.1rem; }

  /* ── PROJECTS ── */
  .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px,1fr)); gap: 2rem; }
  .proj-card {
    background: var(--card-bg);
    border: 1px solid var(--border); border-radius: 12px;
    overflow: hidden; transition: all 0.35s;
    cursor: pointer;
  }
  .proj-card:hover { border-color: var(--blue); transform: translateY(-8px); box-shadow: 0 20px 48px rgba(26,108,255,0.2); }
  .proj-thumb {
    height: 190px;
    display: flex; align-items: center; justify-content: center width: 100px;
    font-size: 4rem;
    position: relative; overflow: hidden;
  }
  .proj-thumb-glow {
    position: absolute; inset: 0;
    opacity: 0; transition: opacity 0.35s;
    background: radial-gradient(circle at center, rgba(26,108,255,0.3), transparent 70%);
  }
  .proj-card:hover .proj-thumb-glow { opacity: 1; }
  .proj-num {
    position: absolute; top: 1rem; left: 1rem;
    font-family: var(--font-mono); font-size: 0.65rem;
    color: rgba(240,244,255,0.3); letter-spacing: 0.1em;
  }
  .proj-body { padding: 1.6rem; }
  .proj-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.9rem; }
  .proj-tag {
    font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.08em;
    color: var(--blue); background: rgba(26,108,255,0.1);
    border: 1px solid rgba(26,108,255,0.2);
    padding: 0.2rem 0.6rem; border-radius: 3px;
  }
  .proj-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.6rem; }
  .proj-desc { font-family: var(--font-mono); font-size: 0.78rem; color: rgba(240,244,255,0.5); line-height: 1.7; margin-bottom: 1.2rem; }
  .proj-links { display: flex; gap: 1rem; }
  .proj-link {
    font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.05em;
    color: rgba(240,244,255,0.5); text-decoration: none;
    display: flex; align-items: center; gap: 0.3rem;
    transition: color 0.2s;
  }
  .proj-link:hover { color: var(--blue); }

  /* ── CONTACT ── */
  .contact-inner {
    background: var(--card-bg); border: 1px solid var(--border);
    border-radius: 16px; padding: 4rem;
    text-align: center; position: relative; overflow: hidden;
  }
  .contact-inner::before {
    content: '';
    position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(26,108,255,0.12), transparent 65%);
    pointer-events: none;
  }
  .contact-title { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; letter-spacing: -0.04em; margin-bottom: 1rem; }
  .contact-sub { font-family: var(--font-mono); color: rgba(240,244,255,0.5); font-size: 0.9rem; margin-bottom: 2.5rem; max-width: 480px; margin-left: auto; margin-right: auto; }
  .contact-links { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
  .contact-chip {
    display: flex; align-items: center; gap: 0.5rem;
    background: rgba(255,255,255,0.04); border: 1px solid var(--border);
    border-radius: 40px; padding: 0.6rem 1.3rem;
    font-family: var(--font-mono); font-size: 0.8rem;
    color: rgba(240,244,255,0.6);
    text-decoration: none; transition: all 0.2s; cursor: pointer;
  }
  .contact-chip:hover { border-color: var(--blue); color: var(--white); background: rgba(26,108,255,0.1); transform: translateY(-3px); }

  /* ── FOOTER ── */
  footer {
    text-align: center; padding: 2rem;
    border-top: 1px solid var(--border);
    font-family: var(--font-mono); font-size: 0.72rem;
    color: rgba(240,244,255,0.25);
  }
  footer span { color: var(--blue); }

  /* ── FADE-IN OBSERVER ── */
  .fade-in { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .nav { padding: 1rem 1.5rem; }
    .nav.scrolled { padding: 0.7rem 1.5rem; }
    .nav-links { display: none; }
    .nav-hamburger { display: flex; }
    .about-grid { grid-template-columns: 1fr; gap: 3rem; }
    .about-avatar-wrap { width: 200px; height: 200px; }
    .about-stats { grid-template-columns: repeat(3,1fr); }
    .contact-inner { padding: 2.5rem 1.5rem; }
    section { padding: 5rem 1.5rem; }
  }
  @media (max-width: 480px) {
    .about-stats { grid-template-columns: 1fr 1fr; }
    .hero-btns { flex-direction: column; align-items: center; }
  }
`;
import { FaWordpress } from "react-icons/fa";
import { FaFigma } from "react-icons/fa";
import { FaReact } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa";
import { FaNetworkWired } from "react-icons/fa";

const SKILLS = [
  { icon: <FaReact color="#61DBFB" size={30} />, name: "React & Next.js", desc: "Building scalable SPAs and SSR applications with modern React patterns.", pct: 70},
  { icon: <FaFigma size={30} />, name: "UI/UX Design", desc: "Crafting pixel-perfect interfaces with Figma, focusing on user delight.", pct: 85 },
  { icon: <FaWordpress color="#21759b" size={30} />, name: "WordPress:", desc: "Building user-friendly and responsive websites with customization and plugin integration.", pct: 80 },
  { icon: "🌐", name: "Node.js & APIs", desc: "RESTful & GraphQL API design, Express, serverless functions.", pct: 70 },
  { icon: <FaDatabase size={30} />, name: "Databases", desc: "microsoftSQL, MongoDB, Redis — schema design and query optimisation.", pct: 75 },
  { icon: <FaNetworkWired size={30} color="#1BA0E1" />, name: "Cisco Packet Tracer", desc: "Simulating and designing computer networks using Cisco Packet Tracer.", pct: 70 },
];

const PROJECTS = [
  { num: "01", image: "src/assets/EcoLeaf.png", color: "#0a0d1e", title: "EcoLeaf Mobile Application UI", tags: ["Figma","Wireframing","Prototyping","User Research"], desc: "EcoLeaf Mobile Application UI is a modern mobile app interface designed for a plant store, providing users with an easy and engaging shopping experience.",  repo: "https://www.figma.com/design/uo50jXsHm1tKgpfUDiAFJL/EcoLeaf?nodeid=01&t=f8WBDlhaJiO0NhxQ-1" },
  { num: "02", image: "src/assets/Vehicle1.png", color: "#0d0a1e", title: "Vehicle Intelligent System", tags: ["React","JavaScript","Node.js","MongoDB Atlas"], desc: "Vehicle Intelligent System is a modern full-stack vehicle marketplace with secure authentication, role-based dashboards, and vehicle management features for buyers, sellers, and admins.", live: "https://vehicle-intelligent-system.vercel.app/", repo: "https://github.com/it24102858/ITP-Vehicle-Intelligent-System" },
  { num: "03", image: "src/assets/Travel.png", color: "#030d1a", title: "Travel Explore Mobile Application UI", tags: ["Figma","Wireframing","Prototyping","User Research"], desc: "Travel Explore UI is a modern travel app interface designed for discovering destinations and planning trips with a clean and user-friendly experience.",  repo: "https://www.figma.com/design/qIshmFaydDAeoFH26O6pzv/TExplore?node-id=01&t=NnWXSfRbDYMKdm36-1" },
  { num: "04", image: "src/assets/mobile.jpeg", color: "#0d0510", title: "Smart Tourism App", tags: ["React Native","JavaScript","Android Studio","MongoDB Atlas"], desc: "Smart Tourism App is a travel application designed to help users explore destinations, book services, and plan trips easily. The UI/UX was designed using Figma, and the app was developed with React Native and Node.js for a smooth and modern user experience.", live:"https://smart-tourism-mobile-application.onrender.com", repo: "https://github.com/it24102858/Smart-Tourism-Mobile-Application-" },
  { num: "05", image: "src/assets/Wordpress.png", color: "#0a0d1e", title: "Technovaz – Modern Tech Blogging Website", tags: ["Wordpress","Elementor"], desc: "Technovaz is a modern technology blog website focused on AI, cybersecurity, smartphone innovations, and next-generation computing. The website was designed and managed using WordPress, providing a responsive and user-friendly platform for publishing tech news, articles, and future technology insights.", live: "https://technovaz.kesug.com/?i=1"},
  { num: "06", image: "src/assets/Insurance.jpeg", color: "#0a0d1e", title: "Insurance Management System", tags: ["Spring Boot","Java","JavaScript","MySQL","CSS","HTML"], desc: "Insurance Management System is a web application for managing insurance policies, customer records, and claims efficiently. The project was developed using Spring Boot, Java, MySQL, HTML5, CSS3, and JavaScript for a secure and user-friendly experience.",repo: "https://github.com/it24102664/Web-based-Vehicle-Insurance-Management-System"}
];

function useIntersect(ref) {
  useEffect(() => {
    const els = ref.current?.querySelectorAll(".fade-in");
    if (!els) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function SkillCard({ icon, name, desc, pct, index }) {
  const [filled, setFilled] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setFilled(pct), index * 120); obs.disconnect(); } }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct, index]);
  return (
    <div className="skill-card fade-in" ref={ref} style={{ animationDelay: `${index * 80}ms` }}>
      <span className="skill-icon">{icon}</span>
      <div className="skill-name">{name}</div>
      <div className="skill-desc">{desc}</div>
      <div className="skill-pct">{filled}%</div>
      <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: `${filled}%` }} /></div>
    </div>
  );
}

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef();
  useIntersect(mainRef);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{style}</style>

      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo">Ruditha.<span></span></div>
        <ul className="nav-links">
          {["About","Skills","Projects","Contact"].map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
        <button className="nav-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span/><span/><span/>
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setMenuOpen(false)}>✕</button>
        {["About","Skills","Projects","Contact"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{l}</a>
        ))}
      </div>

      <main ref={mainRef}>
        {/* HERO */}
        <section className="hero" id="home">
       
          <div className="hero-tag">✦ Available for work</div>
          <h1 className="hero-title">
            Hi, I'm <span className="blue">Ruditha Yukthika</span><br/>
            <span className="dim">UI/UX Designer</span> 
          </h1>
          <p className="hero-sub">
            Hi, I’m Ruditha Yukthika, an IT enthusiast with experience in web development, UI/UX design, and database projects. I enjoy creating practical, user-friendly solutions using modern technologies like React, WordPress, and Figma.
          </p>
          <div className="hero-btns">
            <a className="btn-primary" href="#projects">View My Work</a>
            <a className="btn-outline" href="#contact">Get in Touch</a>
          </div>
          <div className="scroll-indicator">
            <span></span>
            <div className="scroll-line"/>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about">
          <div className="container">
            <div className="about-grid">
              <div>
                <div className="about-avatar-wrap">
                  <div className="about-avatar-ring"><div className="about-avatar-ring-inner"/></div>
                  <div className="about-dots"/><div className="about-dots2"/>
                  <div className="about-avatar-circle"><img src="data:image/jpeg;base64,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" style={{width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%"}} /></div>
                </div>
              </div>
              <div className="fade-in">
                <div className="section-label"></div>
                <h2 className="section-title">Designing <span>the Future of Tech</span></h2>
                <div className="divider"/>
                <p>I’m Ruditha Yukthika, an IT professional passionate about building practical and user-friendly tech solutions. I work with web development (HTML, CSS, JavaScript, React), WordPress, UI/UX design with Figma, databases (MySQL, SQLite), and have experience in Cisco networking and Arduino projects.</p>
                
                <div className="about-stats">
                  {[["1+","Years Exp"],["10+","Projects"],].map(([n,l]) => (
                    <div className="stat-card" key={l}>
                      <span className="stat-num">{n}</span>
                      <span className="stat-label">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="skills-bg">
          <div className="container">
            <div className="fade-in">
              <div className="section-label"></div>
              <h2 className="section-title">Skills &amp; <span>Expertise</span></h2>
              <div className="divider"/>
            </div>
            <div className="skills-grid">
              {SKILLS.map((s, i) => <SkillCard key={s.name} {...s} index={i} />)}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <div className="container">
            <div className="fade-in">
              <div className="section-label"></div>
              <h2 className="section-title">Featured <span>Projects</span></h2>
              <div className="divider"/>
            </div>
            <div className="projects-grid">
              {PROJECTS.map((p, i) => (
                <div className="proj-card fade-in" key={p.num} style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="proj-thumb" style={{ background: `linear-gradient(135deg, ${p.color} 0%, #060810 100%)` }}>
                    <div className="proj-thumb-glow"/>
                    <span className="proj-num">{p.num}</span>
                    
                   {p.image
                       ? <img src={p.image} style={{ height:"100%", objectFit:"cover", position:"absolute", inset:0, opacity:0.85}} />
                       : <span style={{ fontSize: "4rem", position: "relative", zIndex: 1 }}>{p.icon}</span>
                  }

                  </div>
                  <div className="proj-body">
                    <div className="proj-tags">{p.tags.map(t => <span className="proj-tag" key={t}>{t}</span>)}</div>
                    <div className="proj-title">{p.title}</div>
                    <p className="proj-desc">{p.desc}</p>
                    <div className="proj-links">
                      <a className="proj-link" href={p.live}>↗ Live Demo</a>
                      <a className="proj-link" href={p.repo}>⌥ Source</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <div className="container">
            <div className="contact-inner fade-in">
              <div className="section-label"></div>
              <h2 className="contact-title">Got a project<br/>in <span style={{color:"var(--blue)"}}>mind?</span></h2>
              <p className="contact-sub">I'm always open to discussing new opportunities, creative ideas, or interesting technical challenges.</p>
              <a className="btn-primary" href="mailto:rudithayukthika29@gmail.com" style={{ display: "inline-block", marginBottom: "2rem" }}>Send Me a Message</a>
              <div className="contact-links">
  {[
  ["GitHub", "https://github.com/it24102858"],
  ["LinkedIn", "https://www.linkedin.com/in/ruditha-yukthika-57a239298/"],
  ["Email", "mailto:rudithayukthika29@gmail.com"]
].map(([label, handle]) => (
  <a
    className="contact-chip"
    key={label}
    href={handle}
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: "none", color: "inherit" }}
  >
    <strong>{label}</strong> — {handle}
  </a>
))}
</div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <p>Designed &amp; Built by <span>Ruditha</span> · {new Date().getFullYear()} </p>
        </footer>
      </main>
    </>
  );
}
