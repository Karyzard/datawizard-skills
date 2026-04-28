# Component Patterns – CSS reference

## Obsah
1. [Design tokeny](#design-tokeny)
2. [Buttons](#buttons)
3. [Form inputs](#form-inputs)
4. [Cards](#cards)
5. [Checkbox & Toggle](#checkbox--toggle)
6. [Progress bar](#progress-bar)
7. [Navigation](#navigation)
8. [Mood presets](#mood-presets)

---

## Design tokeny

Základ každého prototypu – konzistentní proměnné:

```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-primary-light: #dbeafe;
  --color-bg: #ffffff;
  --color-surface: #ffffff;
  --color-text: #1f2937;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Typography */
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;

  /* Spacing (4px grid) */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */

  /* Effects */
  --radius-sm: 0.25rem;
  --radius: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --transition: 150ms ease;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.5;
}
```

---

## Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius);
  font-weight: 500;
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all var(--transition);
  text-decoration: none;
}

/* Primary */
.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
}
.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

/* Secondary */
.btn-secondary {
  background: white;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}
.btn-secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* Ghost */
.btn-ghost {
  background: none;
  border: none;
  color: var(--color-text-secondary);
}
.btn-ghost:hover {
  color: var(--color-text);
  background: #f3f4f6;
}

/* Danger */
.btn-danger {
  background: var(--color-error);
  color: white;
  border: none;
}
.btn-danger:hover {
  background: #dc2626;
}

/* Sizes */
.btn-sm { padding: var(--space-1) var(--space-3); font-size: var(--font-size-sm); }
.btn-lg { padding: var(--space-3) var(--space-6); font-size: var(--font-size-lg); }

/* FAB (Floating Action Button) */
.btn-fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: var(--shadow-lg);
}
```

---

## Form inputs

```css
.form-group {
  margin-bottom: var(--space-4);
}

.label {
  display: block;
  margin-bottom: var(--space-1);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: var(--font-size-base);
  font-family: inherit;
  transition: border-color var(--transition), box-shadow var(--transition);
}
.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.input::placeholder {
  color: var(--color-text-secondary);
}
.input.error {
  border-color: var(--color-error);
}

.helper-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
}
.error-text {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin-top: var(--space-1);
}

/* Select */
.select {
  appearance: none;
  background-image: url("data:image/svg+xml,..."); /* chevron */
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 2.5rem;
}
```

---

## Cards

```css
.card {
  background: var(--color-surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: var(--space-6);
}

.card-header {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-4);
}

.card-clickable {
  cursor: pointer;
  transition: transform var(--transition), box-shadow var(--transition);
}
.card-clickable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card-bordered {
  box-shadow: none;
  border: 1px solid var(--color-border);
}

/* List card (for items in a list) */
.list-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  transition: background var(--transition);
}
.list-item:hover {
  background: #f9fafb;
}
.list-item:last-child {
  border-bottom: none;
}
```

---

## Checkbox & Toggle

```css
/* Custom checkbox */
.checkbox {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}
.checkbox input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: var(--color-primary);
}

/* Toggle switch */
.toggle {
  width: 44px;
  height: 24px;
  background: var(--color-border);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background var(--transition);
  border: none;
}
.toggle.active {
  background: var(--color-primary);
}
.toggle::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform var(--transition);
  box-shadow: var(--shadow-sm);
}
.toggle.active::before {
  transform: translateX(20px);
}
```

---

## Progress bar

```css
.progress {
  height: 8px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width 300ms ease;
}
.progress-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
}

/* Circular progress (optional) */
.progress-ring {
  transform: rotate(-90deg);
}
.progress-ring-circle {
  transition: stroke-dashoffset 300ms ease;
}
```

---

## Navigation

```css
/* Tab bar (mobile bottom nav) */
.tab-bar {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: var(--space-2) 0;
}
.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-decoration: none;
}
.tab-item.active {
  color: var(--color-primary);
}

/* Header with back button */
.header {
  display: flex;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
.header-title {
  flex: 1;
  text-align: center;
  font-weight: 600;
}
```

---

## Mood presets

### Minimal
```css
:root {
  --color-primary: #374151;
  --color-bg: #ffffff;
  --color-border: #f3f4f6;
  --radius: 0.25rem;
  --shadow: none;
  --font-sans: system-ui, sans-serif;
}
```

### Modern (default)
```css
:root {
  --color-primary: #3b82f6;
  --color-bg: #ffffff;
  --radius: 0.5rem;
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

### Playful
```css
:root {
  --color-primary: #8b5cf6;
  --color-bg: #faf5ff;
  --radius: 1rem;
  --shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.15);
}
```

### Corporate
```css
:root {
  --color-primary: #1e40af;
  --color-bg: #f8fafc;
  --radius: 0.25rem;
  --shadow: 0 1px 3px rgb(0 0 0 / 0.1);
  --font-sans: 'Segoe UI', system-ui, sans-serif;
}
```

### Luxury (dark)
```css
:root {
  --color-primary: #d4a853;
  --color-bg: #0f0f0f;
  --color-surface: #1a1a1a;
  --color-text: #f5f5f5;
  --color-text-secondary: #a3a3a3;
  --color-border: #2a2a2a;
  --radius: 0.25rem;
}
```

### Startup
```css
:root {
  --color-primary: #f43f5e;
  --color-bg: #ffffff;
  --radius: 0.75rem;
  --shadow: 0 10px 25px -5px rgba(244, 63, 94, 0.1);
}
/* Gradient header */
.header { background: linear-gradient(135deg, #f43f5e, #8b5cf6); }
```
