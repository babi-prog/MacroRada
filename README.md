# MacroRadar | Institutional Macroeconomic Intelligence & Volatility Surveillance Terminal

**MacroRadar** is a standalone, real-time macroeconomic event calendar, deviation analyzer, and volatility surveillance terminal built for quantitative traders, macro researchers, and institutional desks.

> **CRITICAL ARCHITECTURAL CONSTRAINT:** Strictly macro intelligence, event surprise measurement, and calendar telemetry. Contains **zero candlestick charts, price charts, or live trading feeds**.

---

## Key Features

### 1. Real-Time HUD & Dual Clocks (`TopHud.tsx`)
- **Dual Synchronized Clocks:** Live ticking `HH:MM:SS` monospace displays for **New York (EDT/UTC-4)** and **Addis Ababa (EAT/UTC+3)**.
- **Timezone Switcher:** Instant toggle between NY and EAT schedules that drives all table row timestamps and timeline nodes.
- **Next High-Impact Countdown:** Prominent real-time countdown to the next upcoming `HIGH` impact catalyst (e.g., `NEXT: US CPI (YoY) IN 00h 14m 22s`).
- **Macro Volatility Warning Banner:** Automatically fires a pulsing crimson alert banner (`bg-red-950/60 border-red-500/50`) whenever a `HIGH` impact event is scheduled within **15 minutes**.
- **Simulate Imminent News Button:** Instant test toggle in the header allowing you to trigger and test the 15-minute alert banner and visual states anytime.

### 2. Visual 24-Hour Event Timeline Radar (`Timeline24H.tsx`)
- **24-Hour Horizontal Axis:** `00:00` to `23:59` track with hour tick marks and global market session overlays (Tokyo, London, New York).
- **Live "NOW" Playhead:** Vertical laser marker with playhead badge tracking current minute of the day in the active timezone.
- **Interactive Event Nodes:** Colored by impact level:
  - `HIGH`: Crimson (`bg-red-500`, glowing pulse)
  - `MEDIUM`: Amber (`bg-amber-500`)
  - `LOW`: Slate (`bg-zinc-400`)
- **30-Minute Proximity Radar Pulse:** Continuous Framer Motion expanding radar ring for any event scheduled within **30 minutes**.
- **Interactive Mini-Tooltip:** Hovering over any node displays release time, currency, forecast, and prior figures; clicking immediately opens the intelligence drawer.

### 3. Multi-Dimensional Filter & Search Bar (`FilterBar.tsx`)
- **Day Tabs:** `All Week`, `Yesterday`, `Today`, `Tomorrow`.
- **Currency Quick Pills:** Multi-select pills (`ALL`, `USD`, `EUR`, `GBP`, `JPY`, `CAD`, `AUD`, `CHF`, `NZD`) with country flags and active badges.
- **Impact Level Filters:** Multi-select toggle for `HIGH`, `MEDIUM`, and `LOW` events.
- **Instant Keyword Search:** Live filter by title, issuing agency, or category. Global keyboard shortcut (`/` or `Cmd+K` / `Ctrl+K`).
- **Filter Reset & Counter:** Displays exact matching releases (e.g., `Showing 14 of 30`).

### 4. Tabular Event Rows & Surprise Deviation Meter (`EventRow.tsx`)
- **Monospace Terminal Data:** Formatted `Actual`, `Forecast`, and `Previous` with units (`%`, `K`, `B`, `Index`).
- **Bidirectional Deviation Bar:** Computes surprise delta `actual - forecast` taking polarity into account (e.g., lower Unemployment is positive/beat, higher CPI/GDP is hawkish beat). Renders an emerald green bar for beats and crimson red bar for misses alongside badges (`+0.3% BEAT` or `-15K MISS`).

### 5. Slide-Over Macro Intelligence Drawer (`EventDrawer.tsx`)
- **Issuing Agency & Frequency:** Full description of indicator methodology.
- **"Why Traders Care":** Detailed institutional analysis of market implications.
- **Volatility Playbook:** Explicit bullish/hawkish vs. bearish/dovish scenario thresholds.
- **Asset Class Impact Matrix:** Direct mapping to EUR/USD, US10Y, SPX, XAU/USD, USD/JPY with volatility classifications (`EXTREME`, `HIGH`, `MODERATE`).
- **Historical Release Series:** Table of last 6 prints showing `Date`, `Actual`, `Forecast`, `Previous`, and `Surprise Delta`.

### 6. Dual-Engine Feed Architecture & Live ForexFactory Proxy (`calendarService.ts` & `ffLiveAdapter.ts`)
- **Vite CORS Proxy:** Proxies `/api/ff-calendar` -> `https://nfs.faireconomy.media/ff_calendar_thisweek.json` with `changeOrigin: true` and `secure: true`.
- **Live Parser & Normalizer (`ffLiveAdapter.ts`):** 
  - Normalizes G8 currency pairs (`USD`, `EUR`, `GBP`, `JPY`, `CAD`, `AUD`, `CHF`, `NZD`).
  - Converts ISO-8601 offset timestamps into UTC millisecond anchors.
  - Extracts clean numerical values and units (`%`, `K`, `M`, `B`, `Index`, `bps`).
  - Auto-classifies categories (Inflation, Central Bank, Employment, Growth, Consumer, Manufacturing, Housing, Trade) and polarity (`INVERTED` for Unemployment/Claims vs. `NORMAL` for economic expansion).
  - Synthesizes institutional intelligence metadata (issuing agencies, volatility playbooks, affected asset class matrices, and 6-month historical release series).
- **Intelligent Local Cache Layer (`ffCache.ts`):**
  - Caches live feed under `macroradar_ff_cache_v1` with a **15-minute TTL policy**.
  - Rate-limit guard with **60-second cooldown** on manual force re-fetches.
  - Automatic graceful fallback to cached payload or dynamic Mock Data Engine when offline or rate-limited (HTTP 429).
  - **Persistent Custom Actual Overrides:** Allows entering or simulating actual prints for any event, persisted across reloads under `macroradar_actual_overrides`.
- **Top HUD Data Source Pill (`TopHud.tsx`):**
  - Instant toggle between **LIVE FF FEED** (pulsing emerald radar dot) and **SIMULATOR** (purple radar dot).
  - Real-time `Last synced: Xm ago` readout with force-sync spinning trigger button.

---

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `/` or `Cmd+K` / `Ctrl+K` | Focus keyword search bar |
| `M` | Toggle Data Source (`LIVE FF FEED` <-> `SIMULATOR`) |
| `R` | Force sync live feed (bypasses 15m cache) |
| `Esc` | Close Macro Intelligence Drawer / Modals |
| `T` | Toggle active timezone (`NY` <-> `EAT`) |
| `S` | Toggle Simulated Imminent News Alert |
| `1` / `2` / `3` | Quick switch day (`Yesterday` / `Today` / `Tomorrow`) |
| `?` | Show Hotkeys Modal |

---

## Development, Desktop App & Build

### Web Terminal Development
```bash
# Install dependencies
npm install

# Start Vite development server (with CORS proxy)
npm run dev

# Run TypeScript check & build web production bundle
npm run build

# Run Vitest test suite
npm test
```

### Standalone Desktop Terminal (Electron)
```bash
# Launch Standalone Desktop App in Development Mode (Live reload)
npm run electron:dev

# Run Standalone Desktop App against local production bundle
npm run electron:start

# Build Standalone Windows Application Folder (Unpacked)
npm run electron:pack
# Output binary: release/win-unpacked/MacroRadar.exe

# Build Portable Single-File Executable (.exe)
npm run electron:dist
# Output binary: release/MacroRadar 1.0.0.exe
```
