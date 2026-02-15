# Web E2E Tests

## 📖 Overview

End-to-end tests for the web application using [Playwright](https://playwright.dev/).  
Tests run against Chromium and provide fast, reliable testing for the web app.

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 24)
- pnpm (workspace package manager)
- Web app running on `http://localhost:6001`

### Installation

Install dependencies from the workspace root:
```bash
pnpm install
```

Install Chrome browser:
```bash
pnpm --filter web-e2e exec playwright install chromium
```

## 🧪 Running Tests

Run all tests:

```bash
pnpm test --filter web-e2e
```

Run specific tests:

```bash
pnpm --filter web-e2e exec playwright test tests/example.spec.ts
```

Run with UI mode:

```bash
pnpm --filter web-e2e exec playwright test --ui
```

## 📂 Project Structure
```
apps/web-e2e/
├── tests/
│   └── example.spec.ts        # Example tests
├── playwright.config.ts       # Playwright configuration
├── package.json
└── README.md
```

## 📊 Reports

Generate and view HTML reports:
```bash
pnpm --filter web-e2e exec playwright test
pnpm --filter web-e2e exec playwright show-report
```
