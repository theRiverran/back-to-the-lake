const fs = require('fs');
const lines = JSON.parse(fs.readFileSync('shigu_lines.json', 'utf8'));
const total = lines.join('').replace(/\s/g, '').length;
const rt = Math.max(1, Math.floor(total / 350));

const paras = lines.slice(1).map(l => {
    const esc = l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // 章节序号：居中
    if (/^[一二三四五六七]$/.test(l)) return '<p class="section-mark">' + esc + '</p>';
    // 称呼行：无缩进
    if (l === '尊敬的同伴、动物朋友们：') return '<p class="no-indent">' + esc + '</p>';
    // 全文完：右对齐
    if (l === '（全文完）') return '<p class="align-right">' + esc + '</p>';
    // 正文：首行缩进2字符
    return '<p>' + esc + '</p>';
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>事故一场 — 湖畔 预览</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:ital,wght@0,400;0,500;1,400&family=Instrument+Sans:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg-primary: #3b2e20;
    --bg-secondary: #34281b;
    --bg-card: #463726;
    --bg-hover: #504030;
    --text-primary: #f0e2cc;
    --text-secondary: #c4b090;
    --text-muted: #918066;
    --border-color: #5a4a36;
    --border-subtle: #4a3c2a;
    --accent: #d8a94e;
    --accent-soft: #554026;
    --tag-bg: #4a3a26;
    --tag-text: #b49c74;
    --font-display: 'DM Serif Display', Georgia, serif;
    --font-body: 'Instrument Sans', system-ui, sans-serif;
    --font-reading: 'Source Serif 4', Georgia, serif;
    --font-mono: 'JetBrains Mono', monospace;
    --radius-sm: 6px;
    --radius-md: 10px;
    --nav-height: 64px;
    --container-width: 1200px;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font-body); background: var(--bg-primary); color: var(--text-primary); line-height: 1.7; min-height: 100vh; }
  body::before { content: ''; position: fixed; inset: 0; z-index: 9999; pointer-events: none; opacity: 0.03; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
  ::selection { background: var(--accent-soft); color: var(--text-primary); }
  .nav { position: sticky; top: 0; z-index: 100; background: var(--bg-primary); border-bottom: 1px solid var(--border-color); }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; height: var(--nav-height); max-width: var(--container-width); margin: 0 auto; padding: 0 2rem; }
  .nav-brand { font-family: var(--font-display); font-size: 1.5rem; color: var(--text-primary); text-decoration: none; display: flex; align-items: center; gap: 0.5rem; }
  .brand-dot { width: 7px; height: 7px; background: var(--accent); border-radius: 50%; display: inline-block; }
  .nav-links { display: flex; list-style: none; gap: 0.25rem; padding: 0; margin: 0; }
  .nav-links a { text-decoration: none; color: var(--text-secondary); font-size: 1rem; font-weight: 500; padding: 0.45rem 0.9rem; border-radius: var(--radius-sm); transition: all 0.25s; }
  .nav-links a:hover, .nav-links a.active { color: var(--text-primary); background: var(--bg-hover); }
  .container { max-width: var(--container-width); margin: 0 auto; padding: 0 2rem; }
  .content-grid { display: grid; grid-template-columns: 1fr 320px; gap: 3rem; padding: 2rem 0 4rem; }
  .entry-header { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border-subtle); }
  .entry-title { font-family: var(--font-display); font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 400; line-height: 1.2; letter-spacing: -0.015em; margin-bottom: 0.75rem; }
  .entry-meta { display: flex; align-items: center; gap: 1rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); letter-spacing: 0.02em; }
  .entry-meta .posted-date { color: var(--accent); font-weight: 500; }
  .entry-meta a { color: var(--text-secondary); text-decoration: none; }
  .entry-content { font-family: var(--font-reading); font-size: 1.15rem; line-height: 1.85; color: var(--text-primary); }
  /* 小说正文排版：段间距=段中行距（margin 0，行盒自然堆叠），首行缩进2字符，两端对齐 */
  .entry-content p { margin: 0; text-indent: 2em; text-align: justify; }
  /* 章节序号：居中，无缩进，间距与其他段落一致 */
  .entry-content p.section-mark { text-align: center; text-indent: 0; margin: 0; font-family: var(--font-display); font-size: 1.5rem; color: var(--accent); letter-spacing: 0.3em; }
  /* 称呼行：无缩进 */
  .entry-content p.no-indent { text-indent: 0; }
  /* 全文完：右对齐，无缩进 */
  .entry-content p.align-right { text-align: right; text-indent: 0; }
  .entry-footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle); }
  .tag-links { display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem; }
  .tag-label { font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); margin-right: 0.25rem; }
  .tag-link { font-family: var(--font-mono); font-size: 0.78rem; padding: 0.3rem 0.75rem; background: var(--tag-bg); color: var(--tag-text); border-radius: 100px; letter-spacing: 0.03em; text-decoration: none; }
  .sidebar-card { background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1.5rem; }
  .sidebar-title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 400; margin-bottom: 1rem; color: var(--text-primary); }
  .author-name { font-family: var(--font-display); font-size: 1.3rem; font-weight: 400; margin-bottom: 0.4rem; }
  .author-bio { font-family: var(--font-reading); font-size: 0.88rem; color: var(--text-muted); font-style: italic; line-height: 1.6; }
  .tag-cloud { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .tag { font-family: var(--font-mono); font-size: 0.78rem; padding: 0.3rem 0.75rem; background: var(--tag-bg); color: var(--tag-text); border-radius: 100px; text-decoration: none; }
  .preview-badge { position: fixed; top: 80px; right: 20px; z-index: 200; background: var(--accent); color: var(--bg-primary); font-family: var(--font-mono); font-size: 0.75rem; padding: 0.4rem 0.8rem; border-radius: 100px; font-weight: 500; letter-spacing: 0.04em; }
  .site-footer { border-top: 1px solid var(--border-subtle); padding: 2rem 0; text-align: center; color: var(--text-muted); font-size: 0.85rem; }
  @media (max-width: 900px) { .content-grid { grid-template-columns: 1fr; gap: 2rem; } .nav-links { display: none; } .container { padding: 0 1.25rem; } .nav-inner { padding: 0 1.25rem; } }
</style>
</head>
<body>
<div class="preview-badge">🔍 预览</div>
<nav class="nav">
  <div class="nav-inner">
    <a href="#" class="nav-brand"><span class="brand-dot"></span> 湖畔</a>
    <ul class="nav-links">
      <li><a href="#">Home</a></li>
      <li><a href="#">轻语</a></li>
      <li><a href="#">漫谈</a></li>
      <li><a href="#" class="active">故事</a></li>
      <li><a href="#">About</a></li>
    </ul>
  </div>
</nav>
<main class="container">
  <div class="content-grid">
    <section>
      <article>
        <header class="entry-header">
          <h1 class="entry-title">事故一场</h1>
          <div class="entry-meta">
            <span class="posted-date">2026.10.07</span>
            <span>${rt} min read</span>
            <span><a href="#">故事</a></span>
          </div>
        </header>
        <div class="entry-content">
${paras}
        </div>
        <footer class="entry-footer">
          <div class="tag-links">
            <span class="tag-label">标签：</span>
            <a href="#" class="tag-link">小说</a>
            <a href="#" class="tag-link">猫</a>
            <a href="#" class="tag-link">寓言</a>
          </div>
        </footer>
      </article>
    </section>
    <aside>
      <div class="sidebar-card">
        <h3 class="author-name">诗心</h3>
        <p class="author-bio">一个存放文字的地方——随笔、日常、与未完成的故事。</p>
      </div>
      <div class="sidebar-card">
        <h3 class="sidebar-title">标签</h3>
        <div class="tag-cloud">
          <a href="#" class="tag">小说</a>
          <a href="#" class="tag">猫</a>
          <a href="#" class="tag">寓言</a>
        </div>
      </div>
    </aside>
  </div>
</main>
<footer class="site-footer"><div class="container">湖畔 — 一个存放文字的地方。用 Jekyll 构建，部署于 GitHub Pages。</div></footer>
</body>
</html>`;

fs.writeFileSync('preview-shi-gu-yi-chang.html', html);
console.log('预览已生成: preview-shi-gu-yi-chang.html');
console.log('字符数:', total, '| 阅读时间:', rt, 'min');
