# Offline-First Queue-Based Sync Demo

A React Native CLI application demonstrating an offline-first architecture with queue-based synchronization, priority scheduling, and automatic retry on network restoration.

## Architecture

This application implements a **Queue-Based Offline Sync Architecture** with clear separation of concerns across multiple layers.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      UI Layer                           │
│  ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │  ActionButtons  │    │         LogsList            │ │
│  │  (Small/Large)  │    │   (Completed Actions)       │ │
│  └────────┬────────┘    └─────────────┬───────────────┘ │
└───────────┼───────────────────────────┼─────────────────┘
            │                           │
            ▼                           │
┌─────────────────────────────────────────────────────────┐
│                   Service Layer                         │
│  ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │   SyncEngine    │◄───│     NetworkListener         │ │
│  │  (Sequential    │    │   (NetInfo Events)          │ │
│  │   Processing)   │    └─────────────────────────────┘ │
│  └────────┬────────┘                                    │
│           │            ┌─────────────────────────────┐  │
│           └───────────►│      API Simulator          │  │
│                        │   (500ms/2000ms delays)     │  │
│                        └─────────────────────────────┘  │
└───────────┼─────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                           │
│  ┌─────────────────────────────────────────────────────┐│
│  │              ActionRepository                       ││
│  │  • insertAction()     • markAsCompleted()          ││
│  │  • getPendingOrdered() • incrementRetry()          ││
│  │  • getCompletedActions()                           ││
│  └────────────────────────┬────────────────────────────┘│
│                           │                             │
│  ┌────────────────────────▼────────────────────────────┐│
│  │              SQLite Database                        ││
│  │         (react-native-sqlite-storage)              ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User presses button** → Action inserted into SQLite with priority
2. **SyncEngine.run()** → Fetches pending actions ordered by priority
3. **Sequential processing** → Each action sent to API one at a time
4. **On success** → Action marked as completed with timestamp
5. **On failure** → Retry count incremented, processing stops
6. **Network restored** → SyncEngine automatically triggered

## Project Structure

```
src/
├── components/
│   ├── ActionButtons.tsx    # Small/Large action buttons
│   └── LogsList.tsx         # Display synced actions
├── database/
│   ├── db.ts                # SQLite initialization
│   └── actionRepository.ts  # CRUD operations
├── services/
│   ├── syncEngine.ts        # Queue processing logic
│   ├── api.ts               # Simulated API calls
│   └── networkListener.ts   # NetInfo subscription
├── types/
│   └── index.ts             # TypeScript interfaces
└── App.tsx                  # Main app component
```

## Key Features

- **Offline-first**: Actions are queued locally and synced when online
- **Priority scheduling**: Small actions (priority 1) always sync before Large (priority 2)
- **Sequential processing**: One action at a time, no parallel `Promise.all`
- **Automatic retry**: Syncs automatically when network is restored
- **Persistence**: Queue survives app restarts (SQLite storage)
- **Retry limit**: Actions are skipped after 5 failed attempts

## Database Schema

```sql
CREATE TABLE actions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,           -- 'small' or 'large'
  payload TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending' or 'completed'
  priority INTEGER NOT NULL,     -- 1 (small) or 2 (large)
  retry_count INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  synced_at INTEGER
);
```

## Getting Started

### Prerequisites

- Node.js >= 22.11.0
- Yarn
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

```bash
# Install dependencies
yarn install

# Install iOS pods
cd ios && pod install && cd ..
```

### Running the App

```bash
# Start Metro bundler
yarn start

# Run on iOS
yarn ios

# Run on Android
yarn android
```

## Testing Offline Behavior

1. **Airplane Mode Test**
   - Enable airplane mode
   - Press Small and Large buttons
   - Actions are queued (check console logs)
   - Disable airplane mode
   - Watch actions sync automatically

2. **Priority Test**
   - Press Large button first
   - Press Small button second
   - Small action syncs before Large (despite queue order)

3. **Restart Test**
   - Queue actions while offline
   - Kill the app completely
   - Reopen the app
   - Enable network
   - Queued actions sync automatically

## Sync Rules

1. **Small before Large**: All pending small actions must complete before any large action starts
2. **Stop on failure**: If an action fails, processing stops immediately
3. **Retry limit**: Actions with 5+ failures are skipped
4. **No parallel sync**: Only one sync operation runs at a time

## Trade-offs & Limitations

| Limitation | Reason |
|------------|--------|
| No background sync when app is killed | React Native limitation without native modules |
| No exponential backoff | Simplified for demo purposes |
| No conflict resolution | Single-writer assumption |
| Simulated API | Replace with real endpoints in production |
| Simple retry strategy | Production would need more sophisticated logic |
| No sync progress UI | Keeping UI minimal per requirements |

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Singleton SyncEngine | Prevents multiple sync processes, ensures sequential order |
| Priority stored in DB | Allows correct ordering at query level, persists across restarts |
| Sequential for-loop | Explicit control flow, easy to debug, clear stop-on-failure |
| UUID for action IDs | Works offline, no server round-trip needed |
| NetInfo listener | Native network state detection, triggers sync on reconnect |

## Dependencies

- `react-native-sqlite-storage` - Local SQLite database
- `@react-native-community/netinfo` - Network state detection

## License

MIT
