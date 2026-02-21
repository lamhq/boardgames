# Functional Requirements

## Project Overview

Boardgames is an online multiplayer game platform that allows players from around the world to connect and play together easily.

It makes the gaming experience straightforward without requiring setup or purchasing, providing a "click-and-play" experience to users.

Currently it runs on web browsers (mobile and PC).


## Core Concepts

- **User**: a person who accesses the platform, with a registered account or as a guest.
- **Game**: type of boardgame the system supports (tic-tac-toe, blackjack, etc.).
- **Lobby**: an area for users to join before starting a match.
- **Match**: the actual gameplay session, uniquely identified by `match_id`.
- **Player**: a user who joins a lobby and is assigned a `player_id` when a match starts.
- **Spectator**: a user who joins to watch but does not get a `player_id`.


## Key Features

### Browsing games

- The first screen when user access the platform is the game list screen, users can browse available games and select what to play.


### Creating lobbies

When select a game to play:
- If user is not logged in yet, user may be prompted to log in or continue without an account.
- A lobby for that game is created 
- User become the owner (**host**) of the lobby
- User is navigated to the game lobby screen

In the game lobby, the user can:
- Enter their name
- Invite other players to play together by sharing an invitation link
- Change game settings (host only, before match starts)
- Start the match when ready (host only)


### Inviting players

- Players in a game lobby can invite others to play together by sharing an invitation link.
- Each lobby has a unique invitation link.
- When there are no players in a lobby, clicking the invitation link will display "The game was ended."
- Users do not need to register or log in to join. They can simply click the link and enter their name to join the lobby as a player or spectator.


### Joining lobbies

- When joining a lobby, if user is not logged in yet, user may be prompted to log in or continue without an account.
- After joining a lobby, users can see the game lobby screen with the list of players, game settings, and the lobby status (waiting, in-progress).
- If a match is in-progress, users can only choose to join as spectators. They can see the game but cannot play.


### Playing

- Only the host can start the match. Other players must wait for the host to start the match.
- When starting a match, a new match is created in the system with status in-progress.
- For a lobby, there can be one active match at a time.
- When a match is finished, players are returned to the lobby, and the match status is updated to finished.


### Creating accounts

A temporary guest account is created for users who choose to continue without logging in.

For users who choose to log in, they can create a permanent account with:
- phone number (use OTP for verification and login)
- email and password
- third-party authentication (Google, Facebook, etc.)

In both cases, users is navigated to the lobby screen after registration/authentication.