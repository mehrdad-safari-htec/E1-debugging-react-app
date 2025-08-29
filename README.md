# React Feedback App

This project started as Brad Traversy’s React Front To Back 2022 Feedback App.  
It allows users to add, edit, and delete feedback using a mock REST API powered by `json-server`.  

👉 [Original project](https://github.com/bradtraversy/feedback-app)

---

## What’s Updated

- Migrated from Create React App to Vite for faster dev and builds  
- Upgraded to React 19 with the modern JSX transform  
- Fully converted to TypeScript (`.ts` / `.tsx`) with strict type checking  
- Added some test cases, testing now uses Vitest + React Testing Library instead of Jest  
- Some of the bugs are fixed  
- Improved developer workflow with type checks, modern bundling, and faster feedback loop  
---

## Usage

### Install dependencies
```bash
npm install
```

### Run

```bash
npm run dev
```
- Starts the Vite dev server for the React app
- Runs json-server on port 5000 (mock API)

### Test

```bash
npm run test
```
- Executes unit tests with Vitest

