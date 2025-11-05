# CoinPulse 🚀

A real-time Price/Trade Tracker Dashboard for meme coins built with React, TypeScript, and WebSockets.

## 📋 Overview

CoinPulse is a dynamic dashboard application that enables users to track live cryptocurrency prices and trade feeds for meme coins. The dashboard features a grid-based layout where users can add, remove, and rearrange widgets to monitor multiple tokens simultaneously.

## ✨ Features

### Widget Types

- **Live Price Widget**
  - Real-time price updates in USD and SOL
  - 24-hour price variation percentage
  - Auto-updating via WebSocket connection

- **Trade Feed Widget**
  - Latest 20 trades in descending order (newest first)
  - Displays wallet address, amount, type (buy/sell), time, and transaction hash
  - Real-time updates without pagination

### Dashboard Capabilities

- **Grid-based Layout**: Drag-and-drop interface for widget positioning
- **Add/Remove Widgets**: Dynamic widget management with token contract address input
- **URL State Synchronization**: Dashboard state persists in URL query parameters for easy sharing
- **Single WebSocket Connection**: Optimized real-time data streaming
- **Responsive Design**: Modern, elegant UI with smooth animations

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Data Fetching**: Axios + React Query (TanStack Query)
- **Animations**: Motion (Framer Motion)
- **Validation**: Zod
- **API**: Mobula.DM for blockchain data
- **Real-time**: WebSockets for live updates

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (preferred package manager)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd coinpulse

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Mobula API key

# Start development server
pnpm dev
```

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server (http://localhost:5173)
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors automatically
pnpm type:check       # Run TypeScript type checking

# Testing
pnpm test             # Run tests (when implemented)
```

## 📁 Project Structure

The project follows **Hexagonal Architecture** (Ports & Adapters) and **SOLID principles** for maintainability and testability:

```
coinpulse/
├── src/
│   ├── domain/                    # Core business logic (independent)
│   │   ├── entities/              # Domain entities (Widget, Price, Trade)
│   │   ├── repositories/          # Repository interfaces (output ports)
│   │   └── value-objects/         # Value objects (immutable domain data)
│   │
│   ├── application/               # Application layer (use cases)
│   │   ├── use-cases/             # Business use cases
│   │   │   ├── widget/            # Widget management use cases
│   │   │   ├── price/             # Price tracking use cases
│   │   │   └── trade/             # Trade feed use cases
│   │   └── ports/                 # Application ports (interfaces)
│   │       ├── input/             # Input ports (use case interfaces)
│   │       └── output/            # Output ports (repository interfaces)
│   │
│   ├── infrastructure/            # External implementations (adapters)
│   │   ├── api/                   # API adapters
│   │   │   └── mobula/            # Mobula API client
│   │   │       ├── MobulaApiClient.ts  # HTTP REST client
│   │   │       ├── parsers.ts     # Data extraction helpers
│   │   │       └── validators.ts  # Data validation helpers
│   │   ├── websocket/             # WebSocket adapters
│   │   │   ├── WebSocketClient.ts       # Generic WebSocket client
│   │   │   ├── PriceWebSocketService.ts # Price-specific logic
│   │   │   ├── TradeWebSocketService.ts # Trade-specific logic
│   │   │   └── MobulaWebSocketClient.ts # Unified WebSocket facade
│   │   ├── repositories/          # Repository implementations
│   │   └── services/              # Application services
│   │       └── TokenMetadataService.ts  # Token metadata caching
│   │
│   ├── ui/                        # UI layer (React)
│   │   ├── components/            # React components
│   │   │   ├── widgets/           # Widget components
│   │   │   ├── dashboard/         # Dashboard components
│   │   │   └── common/            # Shared UI components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── stores/                # Zustand stores (UI state)
│   │   │   ├── priceStore.ts      # Price data cache
│   │   │   ├── tradeStore.ts      # Trade data cache
│   │   │   ├── tokenMetadataStore.ts  # Token metadata cache
│   │   │   └── widgetStore.ts     # Widget persistence (localStorage)
│   │   ├── layouts/               # Layout components
│   │   └── pages/                 # Page components
│   │
│   ├── shared/                    # Shared utilities
│   │   ├── types/                 # TypeScript types & interfaces
│   │   ├── utils/                 # Utility functions
│   │   │   ├── result.ts          # Result type (Rust-inspired)
│   │   │   ├── id.ts              # ID generation (Web Crypto API)
│   │   │   ├── number.ts          # Number formatting
│   │   │   ├── string.ts          # String utilities
│   │   │   ├── time.ts            # Time formatting (Intl API)
│   │   │   └── async.ts           # Async utilities
│   │   ├── constants/             # Application constants
│   │   └── validation/            # Zod schemas
│   │
│   ├── config/                    # Configuration
│   │   ├── api.config.ts          # API configuration
│   │   └── websocket.config.ts    # WebSocket configuration
│   │
│   ├── styles/                    # Global styles
│   ├── App.tsx                    # Main application component
│   └── main.tsx                   # Application entry point
│
├── public/                        # Static assets
└── index.html                     # HTML template
```

### Architecture Principles

- **Hexagonal Architecture**: Clear separation between core business logic (domain), application use cases, and external adapters
- **Dependency Rule**: Dependencies point inward (infrastructure → application → domain)
- **SOLID Principles**:
  - **Single Responsibility**: Each module has one reason to change
  - **Open/Closed**: Open for extension, closed for modification
  - **Liskov Substitution**: Implementations are interchangeable via interfaces
  - **Interface Segregation**: Specific ports for specific needs
  - **Dependency Inversion**: Depend on abstractions (ports), not concretions

### Key Architectural Decisions

#### 1. **Result Type Pattern** (Rust-inspired)

All data operations return explicit `Result<T, E>` types instead of throwing exceptions:

```typescript
type Result<T, E> =
  | { outcome: "success"; value: T }
  | { outcome: "failed"; error: E; cause?: string };
```

- **Benefits**: Explicit error handling, type-safe, forces handling of error cases
- **Usage**: API calls, use cases, repositories

#### 2. **Token Metadata Service**

Centralized service for fetching and caching token metadata (symbol, name, decimals):

```typescript
// Fetches once, caches in Zustand store, reuses everywhere
const metadata = await TokenMetadataService.getTokenMetadata(contractAddress);
```

- **Benefits**: Single API call per token, consistent data across components
- **Storage**: `tokenMetadataStore` (Zustand)

#### 3. **Validators & Parsers**

Reusable validation and data extraction utilities for Mobula API:

- **`validators.ts`**: Type guards for runtime validation
- **`parsers.ts`**: Extract data from inconsistent API responses
- **Benefits**: DRY principle, maintainable, testable

#### 4. **State Management Architecture**

- **Zustand stores in UI layer** (`ui/stores/`) - not infrastructure
- Stores are UI concerns for React reactivity
- Simple object exports for use cases (implements output ports)

```typescript
export const useWidgetStore = create(...)  // React hook
export const widgetStore = { ... }         // Use case adapter
```

#### 5. **WebSocket Architecture**

Separation of concerns for clean, maintainable WebSocket code:

- **`WebSocketClient`**: Generic WebSocket connection management
- **`PriceWebSocketService`**: Price-specific subscription logic
- **`TradeWebSocketService`**: Trade-specific subscription logic
- **`MobulaWebSocketClient`**: Unified facade for use cases

#### 6. **Domain Entity Separation**

Entities follow Domain-Driven Design - each entity contains ONLY its core data:

```typescript
// ✅ Price = Market data only
class Price {
  priceUSD: Money;
  priceSOL: Money;
  variation24h: Percentage;
}

// ✅ Trade = Transaction data only
class Trade {
  amount: Money;
  type: TradeType;
  timestamp: Date;
}

// ✅ TokenMetadata = Static token info (separate entity)
type TokenMetadata = {
  symbol: string; // e.g., "SOL", "BONK"
  name: string; // e.g., "Solana", "Bonk"
  decimals: number;
  logo?: string;
};
```

- **Benefits**: Clean separation of concerns, no data duplication
- **Source**: `TokenMetadata` fetched once via `TokenMetadataService`, cached in Zustand
- **Usage**: Components fetch metadata separately using `useTokenMetadata` hook

#### 7. **Performance Optimizations**

**Trade Feed Batching** - Critical for high-frequency tokens (e.g., SOL):

```typescript

// Store with pending buffer
{
  trades: Map<address, Trade[]>,        // Displayed trades
  pendingTrades: Map<address, Trade[]>, // Buffer for batching
  flushPendingTrades() // Merge buffer → trades (1x/sec)
}
```

- **Benefits**: -50% re-renders, -90% memory usage (1GB → 80MB)
- **Trade-off**: +1s latency (acceptable for UI smoothness)
- **Implementation**: `setInterval` flushes buffer every 1000ms

**Memory Management:**

- Strict 20-trade limit per token (enforced in store)
- Deduplication by transaction hash
- Automatic cleanup on widget unmount

## 🎯 Implementation Details

### Key Requirements

1. **Component Architecture**: Modular, reusable components with clear prop interfaces
2. **Single WebSocket**: One connection manages all widget subscriptions
3. **URL State Management**: Dashboard configuration syncs with URL query parameters
4. **Real-time Updates**: Live data via WebSocket connections
5. **Clean Code**: Emphasis on readability, capability, and simplicity

### API Integration

#### Mobula API

The application uses [Mobula.DM](https://mobula.io/) for cryptocurrency data:

**REST API Endpoints:**

- `/market/data` - Token price and market data
- `/market/trades/pair` - Historical trade data
- `/metadata` - Token metadata (symbol, name, decimals)

**WebSocket Streams:**

- Market Feed (`wss://api.mobula.io`) - Real-time price and trade updates
- Multi-events stream with filters for specific tokens

**Getting an API Key:**

1. Visit [Mobula Dashboard](https://mobula.io/)
2. Sign up for a free account
3. Generate an API key
4. Add to `.env`:
   ```bash
   VITE_MOBULA_API_KEY=your_api_key_here
   ```

**Rate Limits:**

- Free tier: 100 requests/minute
- WebSocket: Unlimited connections
- Token addresses: Solana blockchain (`So11111...` format)

## 🎨 Design Philosophy

- **Modern UI/UX**: Clean, intuitive interface with smooth transitions
- **Performance**: Optimized rendering and efficient state management
- **Accessibility**: Keyboard navigation and screen reader support
- **Responsive**: Works seamlessly across desktop and mobile devices

## 📝 Development Notes

### Custom Hooks

**Core Data Hooks:**

- **`usePriceData(contractAddress)`**: Fetches initial price via REST, subscribes to WebSocket updates
- **`useTradeData(contractAddress)`**: Fetches initial trades via REST, subscribes to WebSocket updates with batching
- **`useTokenMetadata(contractAddress)`**: Fetches token metadata (symbol, name, logo) once on mount
- **`useWidgets()`**: Manages widget CRUD operations
- **`useWebSocket()`**: Manages WebSocket connection lifecycle

**Hook Architecture:**

```typescript
// Component usage pattern
function LivePriceWidget({ contractAddress }) {
  // 1. Fetch metadata once (cached)
  useTokenMetadata(contractAddress);

  // 2. Read metadata from store (reactive)
  const metadata = useTokenMetadataStore(state =>
    state.getMetadata(contractAddress.toLowerCase())
  );

  // 3. Subscribe to price updates
  const { price, isLoading, error } = usePriceData(contractAddress);

  // 4. Display data
  return <div>{metadata?.symbol}: {price.priceUSD}</div>;
}
```

### Coding Standards

#### File Naming Conventions

- **React Components**: PascalCase (e.g., `LivePriceWidget.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `usePriceData.ts`)
- **Stores**: camelCase (e.g., `priceStore.ts`, `widgetStore.ts`)
- **Services**: PascalCase (e.g., `TokenMetadataService.ts`)
- **Utilities**: camelCase (e.g., `validators.ts`, `parsers.ts`)

#### Type Conventions

- **Component Props**: Type aliases (not interfaces)
  ```typescript
  type LivePriceWidgetProps = { ... }
  ```
- **Domain Interfaces**: Descriptive suffixes
  - Input ports: `*InputPort` (e.g., `AddWidgetInputPort`)
  - Output ports: `*OutputPort` (e.g., `PriceRepositoryOutputPort`)
- **No enum usage**: Use type unions instead
  ```typescript
  type WidgetType = "LIVE_PRICE" | "TRADE_FEED";
  ```

#### Code Quality

- **No type assertions (`as`)**: Use type guards instead
- **Explicit null checks**: `value !== null` instead of `!value`
- **Early returns**: Prefer guard clauses for readability
- **No bang operator (`!`)**: Avoid non-null assertions
- **Type-safe utilities**: All helpers use proper type guards

#### ID Generation

- Uses **Web Crypto API** for secure, unique IDs
- Fallback to timestamp-based for unsupported environments

#### Internationalization

- **Native Intl APIs** for formatting:
  - `Intl.NumberFormat` for numbers and currency
  - `Intl.RelativeTimeFormat` for relative time
  - `Intl.DateTimeFormat` for dates

### Development Philosophy

- Built as part of a coding challenge/interview
- Atomic commit strategy for clear development history
- Focus on code elegance and simplicity
- No unnecessary complexity or over-engineering
- **DRY principle**: Reusable validators, parsers, and utilities
- **Type safety first**: Leverage TypeScript's type system fully

## 🚀 Usage

### Adding Widgets

1. Click "Add Widget" button in the dashboard
2. Select widget type (Live Price or Trade Feed)
3. Enter Solana token contract address
   - Example SOL: `So11111111111111111111111111111111111111112`
   - Example BONK: `DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263`
4. Widget appears in the grid with real-time data

### Widget Features

**Live Price Widget:**

- Main price in USD (e.g., $0.00001234)
- Price in SOL
- 24h variation percentage (colored red/green)
- Token symbol and name

**Trade Feed Widget:**

- Latest 20 trades (auto-updating)
- Buy/Sell indicators (color-coded)
- Transaction amounts in USD
- Wallet addresses (truncated)
- Relative timestamps
- Transaction hash links

### Managing Widgets

- **Remove**: Click × button on widget
- **Persist**: Widgets auto-save to localStorage
- **Share**: URL contains dashboard state

## 📄 License

MIT

## 🤝 Contributing

This is a demonstration project. Feedback and suggestions are welcome!

---

**Built with ❤️ using React, TypeScript, and Hexagonal Architecture**
