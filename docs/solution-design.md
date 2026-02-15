# Solution Design

Base on the [functional requirements](./functional-requirements.md), this document describes the design of the solution, including the architecture, data models, and API design.

## Architecture

The platform consists of the following main services:

### Web

The main web application where users interact and play games.

- Located in `apps/web`
- Displays games, matches, and invitations
- Handles player input and moves
- Shows spectator views
- Manages game settings (before match starts)

### Game Service

The backend API service handling realtime gameplay logic.

- Located in `apps/game-api`
- Processes game moves and validates game rules
- Manages game states and turn logic
- Handles game-specific business logic (e.g., tic-tac-toe rules)

### Lobby Service

Backend service managing game entities: games, players, matches, invitations

- Located in `apps/lobby-service`
- Manages match creation, status transitions (waiting → in-progress → finished → ended)
- Manages invitation links and their lifecycle
- Assigns player IDs to new players joining
- Manages player roles (host, player, spectator)
- Handles match state persistence and querying


## 🎮 Data Model

### Game
- `game_id`
- `name`
- `default_settings`

### Match
- `match_id` (unique per match)
- `game_id` (FK → Game)
- `invite_link_id` (FK → InviteLink)
- `host_player_id` (FK → Player)
- `status` (waiting, in-progress, finished, ended)
- `settings` (editable until match starts)

### Player
- `player_id` (unique per match)
- `match_id` (FK → Match)
- `role` (host, player, spectator)
- `status` (waiting, active, kicked, left)

### InviteLink
- `invite_link_id`
- `token` (unique URL-safe string)
- `created_by_player_id` (host)
- `is_active`


## ⚙️ Game Workflows

### 1. Inviting Players
- First player creates a match → becomes **host**.
- System generates `invite_link` tied to the match.
- All players can share the same link.
- Link remains valid across multiple matches until explicitly ended.

### 2. Joining a Game
- Click invite link:
  - If `status = waiting` → join as **player** (assigned new `player_id`).
  - If `status = in-progress` → join as **spectator**.
  - If `status = finished` → prompt to start next match → new `match_id` created, same invite link reused.
  - If `status = ended` → show "The game was ended".

### 3. Playing
- **Waiting state**:
  - Players join lobby.
  - Host can edit settings.
  - Players must wait until host starts.
- **In-progress**:
  - Match locked → no new players, only spectators.
  - Host can kick players.
- **Finished**:
  - Host can start next match → new `match_id`.
- **Ended**:
  - Invite link shows "The game was ended".

Example Flow:

1. Alice creates Tic Tac Toe match → `match_id = M1`, `status = waiting`, `invite_link = L1`.
2. Bob and Carol join via L1 → assigned player IDs in M1.
3. Alice edits settings (e.g., board size).
4. Alice starts match → `status = in-progress`.
   - Dave joins late → spectator.
5. M1 finishes → Alice chooses "Start next match".
   - New `match_id = M2`, linked to L1.
   - Bob, Carol, Dave rejoin lobby.
6. Alice ends M2 → clicking L1 shows "The game was ended".
