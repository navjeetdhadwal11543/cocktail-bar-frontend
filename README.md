# 🍹 Cocktail Bar Frontend

A React + TypeScript single-page application for browsing a cocktail menu, customising drinks, placing orders, and managing the back-office from an admin dashboard.

> **Live demo:**

The deployed demo runs in **mock mode** — no backend required. Every feature (cart, checkout, dashboard charts, recent orders) works end-to-end against local sample data.

---

## ✨ Features

- Browse a drink menu with images, descriptions
- Customise drinks (mint / garnish / etc.) and add multiple variations to a single cart entry
- Cart persists across page navigation via `sessionStorage`
- Checkout flow that builds a real backend order payload
- Admin dashboard with live order polling (5 s interval)
- KPI cards: operators, waiters, barmen, menu, warehouse
- **Popular Drinks** bar chart + **Order Status** pie chart
- Recent orders table
- Token + refresh-token auth flow against a Django backend (can be configured with the backend for auth by token)
- Automatic fallback to mock data if no backend URL is set

---

## 🛠 Tech stack

- **React 18** + **TypeScript 5**
- **Material UI v5** (theme, components, `sx` prop)
- **React Router v6**
- **Chart.js** + **react-chartjs-2**
- **Axios** for API calls
- **Jest** + **React Testing Library**
- **ESLint** + **Prettier**
- **Create React App** build

---

## 🧠 Architecture highlights

- **Context-based state** — `CartContext` and `OrdersContext` eliminate prop drilling
- **Custom hooks** — `useDrinks`, `useDashboardData`, `usePolledOrders` separate data fetching from UI components
- **Shared MUI theme** + reusable `sx` constants (`src/theme.ts`, `src/styles/sx.ts`) — no duplicated gradients across files
- **Service layer** with an optional **mock mode** for demo deployments without a backend

### Folder structure

```
src/
├── App.tsx                  # router + providers
├── theme.ts                 # MUI theme + shared gradients
├── styles/sx.ts             # reusable sx style objects
├── contexts/                # CartContext, OrdersContext
├── hooks/                   # useDrinks, useDashboardData, usePolledOrders
├── Pages/                   # HomePage, MenuPage, CheckoutPage, DashBoard
├── Components/              # DrinkCard, DrinkTile, Navbar, ...
│   └── dashboard/           # split dashboard sub-components
├── Services/                # cocktailService (API + mock fallback)
├── interfaces/              # shared TypeScript types
└── utils/                   # helpers
```

---

## 🚀 Getting started

**Prerequisites:** Node 18+, npm.

```bash
npm install
npm start          # dev server at http://localhost:3000
```

### Other scripts

| Script          | What it does                   |
| --------------- | ------------------------------ |
| `npm start`     | Run dev server                 |
| `npm run build` | Production build into `build/` |
| `npm test`      | Run Jest test suite            |
| `npm run lint`  | Run ESLint                     |

---

## 🔧 Environment variables

Copy `.env.example` to `.env` and adjust.

| Variable             | Description                                             | Default          |
| -------------------- | ------------------------------------------------------- | ---------------- |
| `REACT_APP_API_URL`  | Backend base URL. Leave empty to run in mock mode.      | _(empty → mock)_ |
| `REACT_APP_API_USER` | Backend username (only when `REACT_APP_API_URL` is set) | —                |
| `REACT_APP_API_PASS` | Backend password (only when `REACT_APP_API_URL` is set) | —                |
| `REACT_APP_TABLE_ID` | Numeric ID of the table this client represents          | `1`              |

---

## 📸 Screenshots

![Home page](./docs/screenshots/Screenshot%202025-12-18%20123105.png)
![Menu](./docs/screenshots/Screenshot%202025-12-18%20123154.png)
![Drink customisation](./docs/screenshots/Screenshot%202025-12-18%20123211.png)
![Checkout](./docs/screenshots/Screenshot%202025-12-18%20123332.png)
![Dashboard](./docs/screenshots/Screenshot%202025-12-18%20123440.png)
