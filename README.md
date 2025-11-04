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
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📁 Project Structure

The project follows **Hexagonal Architecture** (Ports & Adapters) and **SOLID principles** for maintainability and testability:

```
coinpulse/
├── src/
│   ├── domain/                    # Core business logic (independent)
│   │   ├── entities/              # Domain entities (Widget, Price, Trade)
│   │   ├── repositories/          # Repository interfaces (ports)
│   │   └── value-objects/         # Value objects (immutable domain data)
│   │
│   ├── application/               # Application layer (use cases)
│   │   ├── use-cases/             # Business use cases
│   │   │   ├── widget/            # Widget-related use cases
│   │   │   ├── price/             # Price tracking use cases
│   │   │   └── trade/             # Trade feed use cases
│   │   └── ports/                 # Application ports (interfaces)
│   │       ├── input/             # Input ports (use case interfaces)
│   │       └── output/            # Output ports (repository interfaces)
│   │
│   ├── infrastructure/            # External implementations (adapters)
│   │   ├── api/                   # API adapters
│   │   │   └── mobula/            # Mobula API client
│   │   ├── websocket/             # WebSocket adapter
│   │   ├── repositories/          # Repository implementations
│   │   └── persistence/           # State management (Zustand stores)
│   │
│   ├── presentation/              # UI layer (React)
│   │   ├── components/            # React components
│   │   │   ├── widgets/           # Widget components
│   │   │   ├── dashboard/         # Dashboard components
│   │   │   └── common/            # Shared UI components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── layouts/               # Layout components
│   │   └── pages/                 # Page components
│   │
│   ├── shared/                    # Shared utilities
│   │   ├── types/                 # TypeScript types & interfaces
│   │   ├── utils/                 # Utility functions
│   │   ├── constants/             # Application constants
│   │   └── validation/            # Zod schemas
│   │
│   ├── config/                    # Configuration
│   │   └── api.config.ts          # API configuration
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

## 🎯 Implementation Details

### Key Requirements

1. **Component Architecture**: Modular, reusable components with clear prop interfaces
2. **Single WebSocket**: One connection manages all widget subscriptions
3. **URL State Management**: Dashboard configuration syncs with URL query parameters
4. **Real-time Updates**: Live data via WebSocket connections
5. **Clean Code**: Emphasis on readability, capability, and simplicity

### API Integration

- **Mobula.DM API**: Used for fetching blockchain data and price information
- **WebSocket**: Real-time updates for prices and trade feeds

## 🎨 Design Philosophy

- **Modern UI/UX**: Clean, intuitive interface with smooth transitions
- **Performance**: Optimized rendering and efficient state management
- **Accessibility**: Keyboard navigation and screen reader support
- **Responsive**: Works seamlessly across desktop and mobile devices

## 📝 Development Notes

- Built as part of a coding challenge/interview
- Atomic commit strategy for clear development history
- Focus on code elegance and simplicity
- No unnecessary complexity or over-engineering

## 🧪 Testing

```bash
# Run tests (when implemented)
pnpm test
```

## 📄 License

MIT

## 🤝 Contributing

This is a demonstration project. Feedback and suggestions are welcome!

---

**Note**: This project uses Mobula.DM API for cryptocurrency data. Ensure you have the necessary API access configured.
