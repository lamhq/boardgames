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

### **User**
Represents a person on the platform, either guest or registered.
- `id` (PK)  
- `display_name`  
- `is_guest` (boolean)  
- `auth_type` (enum: guest, phone, email, third_party)  
- `created_at`  
- `last_active_at`


### **Game**
Represents a type of boardgame.
- `id` (PK)  
- `name`  
- `default_settings`


### **Lobby**
Represents a staging area before a match.
- `id` (PK)  
- `game_id` (FK → Game)  
- `host_id` (FK → User)  
- `invite_link` (unique token/URL)  
- `status` (waiting, in-progress, finished, ended)  
- `created_at`  
- `updated_at`


### **Match**
Represents a single gameplay session.
- `id` (PK)  
- `lobby_id` (FK → Lobby)  
- `status` (waiting, in-progress, finished)  
- `settings` (snapshot of game settings at start)  
- `started_at`  
- `finished_at`


### **LobbyUsers** (relationship collection)
Links users to lobbies.
- `id` (PK)  
- `lobby_id` (FK → Lobby)  
- `user_id` (FK → User)  
- `role` (host, player, spectator)  
- `joined_at`


### **MatchUsers** (relationship collection)
Links users to matches.
- `id` (PK)  
- `match_id` (FK → Match)  
- `user_id` (FK → User)  
- `player_id` (unique per match, nullable if spectator)  
- `role` (player, spectator)  
- `joined_at`


## ⚙️ Workflows

1. **Browse Games** → query `Game`.  
2. **Create Lobby** → create `Lobby`, create `User` if guest, link via `LobbyUsers` (`role = host`).  
3. **Join Lobby** → create `User` if guest, link via `LobbyUsers`.  
   - If lobby `status = waiting` → role = player.  
   - If lobby `status = in-progress` → role = spectator.  
4. **Start Match** → create `Match`, link players via `MatchUsers` with `player_id`.  
5. **Spectators** → linked via `MatchUsers` with `role = spectator`.  
6. **Finish Match** → update `Match.status = finished`, users remain in lobby.  
7. **End Lobby** → update `Lobby.status = ended`, invite link invalid.  

Example Flow:

1. **Alice creates lobby**  
   - `Lobby L1` created for Tic Tac Toe, `host_id = Alice`.  
   - `Match M1` created, `status = waiting`, linked to L1.  

2. **Bob and Carol join**  
   - New `User` records (guest or registered).  
   - Added to `LobbyUsers` as players.  
   - Added to `MatchUsers` with unique `player_id`s.  

3. **Alice edits settings**  
   - Updates `Match.settings` before start.  

4. **Alice starts match**  
   - `M1.status = in-progress`.  
   - Dave joins late → added to `LobbyUsers` and `MatchUsers` as spectator (no `player_id`).  

5. **M1 finishes**  
   - `M1.status = finished`.  
   - Alice starts next match → `Match M2` created, linked to L1.  
   - Bob, Carol, Dave remain in lobby.  

6. **Alice ends M2**  
   - `M2.status = finished`.  
   - `Lobby L1.status = ended`.  
   - Invite link shows *“The game was ended.”*


## Architecture

The platform consists of the following main component:

### Web

The main web application where users interact and play games.

- Located in `apps/web`
- Displays games, matches, and invitations
- Handles player input and moves
- Shows spectator views
- Manages game settings (before match starts)

### Game API

A WebSocket API that handles realtime gameplay logic (moves, phases, state sync).

- Located in `apps/game-api`
- Processes game moves and validates game rules
- Manages game states and turn logic
- Handles game-specific business logic (e.g., tic-tac-toe rules)

### Platform API

A RESTful API that manages game entities (games, players, matches, lobbies).

- Located in `apps/platform-api`
- Manages match creation, status transitions (waiting → in-progress → finished → ended)
- Manages invitation links and their lifecycle
- Assigns player IDs to new players joining
- Manages player roles (host, player, spectator)
- Handles match state persistence and querying
