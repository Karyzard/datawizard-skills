# HTML Prototype – kompletní příklad

## Obsah
1. [Habit Tracker Dashboard (kompletní HTML)](#habit-tracker-dashboard)
2. [Checklist kvality prototypu](#checklist-kvality)

---

## Habit Tracker Dashboard

Kompletní funkční prototyp – jeden soubor, otevři v prohlížeči:

```html
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Habit Tracker</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-primary: #14b8a6;
      --color-primary-hover: #0d9488;
      --color-primary-light: #ccfbf1;
      --color-bg: #f0fdfa;
      --color-surface: #ffffff;
      --color-text: #134e4a;
      --color-text-secondary: #5eead4;
      --color-border: #99f6e4;
      --color-success: #22c55e;
      --font-sans: 'Inter', system-ui, sans-serif;
      --radius: 1rem;
      --shadow: 0 10px 25px -5px rgba(20, 184, 166, 0.1);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--font-sans);
      background: var(--color-bg);
      min-height: 100vh;
      padding: 1rem;
    }

    .app { max-width: 400px; margin: 0 auto; }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
    }

    .avatar {
      width: 40px; height: 40px;
      background: var(--color-primary);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: 600;
    }

    .settings-btn {
      background: none; border: none;
      font-size: 1.5rem; cursor: pointer;
      opacity: 0.6; transition: opacity 150ms;
    }
    .settings-btn:hover { opacity: 1; }

    .date-section { text-align: center; padding: 1.5rem 0; }
    .date { font-size: 1.25rem; font-weight: 600; color: var(--color-text); }

    .streak {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: var(--color-primary-light);
      padding: 0.5rem 1rem; border-radius: 2rem;
      margin-top: 0.75rem; font-weight: 500;
      color: var(--color-primary-hover);
    }

    .habits-card {
      background: var(--color-surface);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 1.5rem;
    }

    .habit-item {
      display: flex; align-items: center; gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid var(--color-border);
      cursor: pointer; transition: background 150ms;
    }
    .habit-item:last-child { border-bottom: none; }

    .habit-checkbox {
      width: 24px; height: 24px;
      border: 2px solid var(--color-border);
      border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      transition: all 150ms; color: transparent;
    }
    .habit-item.done .habit-checkbox {
      background: var(--color-success);
      border-color: var(--color-success);
      color: white;
    }

    .habit-emoji { font-size: 1.5rem; }
    .habit-name { flex: 1; font-weight: 500; }
    .habit-item.done .habit-name {
      text-decoration: line-through; opacity: 0.6;
    }

    .progress-section {
      margin-top: 1.5rem; padding-top: 1.5rem;
      border-top: 1px solid var(--color-border);
    }
    .progress-bar {
      height: 8px; background: var(--color-border);
      border-radius: 4px; overflow: hidden;
    }
    .progress-fill {
      height: 100%; background: var(--color-primary);
      border-radius: 4px; transition: width 300ms ease;
    }
    .progress-text {
      text-align: center; margin-top: 0.5rem;
      font-size: 0.875rem; color: var(--color-text-secondary);
    }

    .add-btn {
      display: flex; align-items: center; justify-content: center;
      width: 56px; height: 56px;
      background: var(--color-primary); color: white;
      border: none; border-radius: 50%;
      font-size: 1.5rem; cursor: pointer;
      margin: 1.5rem auto 0;
      box-shadow: 0 4px 14px rgba(20, 184, 166, 0.4);
      transition: transform 150ms, box-shadow 150ms;
    }
    .add-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(20, 184, 166, 0.5);
    }
  </style>
</head>
<body>
  <div class="app">
    <header class="header">
      <div class="avatar">T</div>
      <button class="settings-btn">⚙️</button>
    </header>

    <section class="date-section">
      <div class="date">Čtvrtek 18. prosince</div>
      <div class="streak">🔥 5 dní v řadě</div>
    </section>

    <div class="habits-card">
      <div class="habit-item" onclick="toggleHabit(this)">
        <div class="habit-checkbox">✓</div>
        <span class="habit-emoji">💪</span>
        <span class="habit-name">Cvičení</span>
      </div>
      <div class="habit-item done" onclick="toggleHabit(this)">
        <div class="habit-checkbox">✓</div>
        <span class="habit-emoji">📚</span>
        <span class="habit-name">Čtení</span>
      </div>
      <div class="habit-item" onclick="toggleHabit(this)">
        <div class="habit-checkbox">✓</div>
        <span class="habit-emoji">🧘</span>
        <span class="habit-name">Meditace</span>
      </div>
      <div class="habit-item done" onclick="toggleHabit(this)">
        <div class="habit-checkbox">✓</div>
        <span class="habit-emoji">💧</span>
        <span class="habit-name">Pít vodu</span>
      </div>

      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" id="progressFill" style="width: 50%"></div>
        </div>
        <div class="progress-text" id="progressText">2 ze 4 splněno</div>
      </div>
    </div>

    <button class="add-btn">➕</button>
  </div>

  <script>
    function toggleHabit(el) {
      el.classList.toggle('done');
      updateProgress();
    }

    function updateProgress() {
      const items = document.querySelectorAll('.habit-item');
      const done = document.querySelectorAll('.habit-item.done').length;
      const total = items.length;
      const pct = (done / total) * 100;

      document.getElementById('progressFill').style.width = pct + '%';
      document.getElementById('progressText').textContent =
        done + ' ze ' + total + ' splněno';
    }
  </script>
</body>
</html>
```

---

## Checklist kvality

Před odevzdáním prototypu zkontroluj:

### Funkčnost
- [ ] Otevírá se v prohlížeči bez chyb v konzoli
- [ ] Žádné externí závislosti (kromě Google Fonts)
- [ ] Interaktivní prvky reagují (hover, click, toggle)

### Responsive
- [ ] Funguje na mobile (320px+)
- [ ] Funguje na desktop (1024px+)
- [ ] Žádné horizontální scrollování

### Vizuál
- [ ] Realistický obsah (české texty, ne Lorem ipsum)
- [ ] Konzistentní spacing (4px/8px grid)
- [ ] Mood odpovídá zadání

### Accessibility
- [ ] Kontrast textu min. 4.5:1
- [ ] Touch targets min. 44×44px
- [ ] Focus stavy viditelné
- [ ] Lang atribut na html (`lang="cs"`)
