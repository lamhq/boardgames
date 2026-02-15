# Functional Requirements

## Project Overview

Boardgames is an online multiplayer game platform that allows players from around the world to connect and play together easily.

It makes the gaming experience straightforward without requiring setup or purchasing, providing a "click-and-play" experience to users.

Currently it runs on web browsers (mobile and PC).


## Data model

- There are many **games** (tic-tac-toe, blackjack, ...)
- **Players** play a game by joining **matches** of that game
- Each player has a unique **player ID** (unique per match); players with no ID are **spectators**
- Each match in a game has a **match ID** (unique within the game)


## Key Features

### Inviting players

- All players can invite others to play together by getting an invitation link.
- The invitation link is the same regardless of who shares it.
- The first player that generates the invitation link is the host.
- When a match is finished, players can choose to start the next match without inviting again. The previous invitation link still works.
- When there are no players playing, clicking the invitation link will display "The game was ended."


### Joining a game

- When a match is in-progress, other players cannot join to play. They can join as spectators.
- If joined as a player (not a spectator), the player will be assigned a player ID (unique per match).


### Playing

- Game settings can be changed in each match, before it starts.
- Players must wait for the host to start the match.
- Only the host can change the game settings and kick other players.
- When a match is finished, to start the next match, a new match ID must be generated.
- For a game, there can be many matches happening at the same time
