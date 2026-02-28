# WhatsApp Clone

A full-stack real-time chat application built as a portfolio project. Features 1-on-1 and group messaging, voice notes, online/typing indicators, and a WhatsApp-accurate UI.

Two backend implementations are provided — choose whichever you prefer to run alongside the React frontend.

---

## Project Structure

```
whatsapp/
├── client/                  React frontend (shared by both backends)
├── server/                  Node.js / Express / Socket.io backend
└── whatsapp-youtube/        Java / Spring Boot backend (Maven)
```

---

## Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | 18 LTS or 20 LTS |
| npm | 9+ |
| MongoDB | 6+ (for Node backend) |
| JDK | 17+ (for Java backend) |
| Maven | 3.8+ (for Java backend) |

---

## Option A — Node.js Backend + React Frontend

### 1. Start MongoDB

Make sure a MongoDB instance is running locally on the default port (`27017`).

### 2. Configure environment variables

The file `server/.env` is already present with sensible defaults. **Change the JWT secret before deploying:**

```
MONGO_URI=mongodb://localhost:27017/whatsapp
JWT_SECRET=<your-secret-here>
PORT=5000
```

### 3. Run the server

```bash
cd server
npm install          # skip if already run
npm run dev          # uses nodemon; auto-restarts on save
```

The server starts on `http://localhost:5000`.

### 4. Run the client

```bash
cd client
npm install          # skip if already run
npm start
```

The app opens at `http://localhost:3000`.

---

## Option B — Java / Spring Boot Backend + React Frontend

### 1. Run the Spring Boot server

```bash
cd whatsapp-youtube
mvn spring-boot:run
```

Spring Boot starts on `http://localhost:8080` by default. It uses an **H2 in-memory database** out of the box — no external database needed for local development.

To switch to MySQL, edit `src/main/resources/application.properties` with your JDBC URL and credentials and add the MySQL dependency to `pom.xml`.

The H2 admin console is available at `http://localhost:8080/h2-console` while the server is running.

### 2. Run the client

> **Note:** The React client is wired to the Node backend by default (`http://localhost:5000`). To point it at the Java backend instead, update the `SERVER_URL` in `client/src/utils/api.js` to `http://localhost:8080`.

```bash
cd client
npm install
npm start
```

---

## Features

| Feature | Details |
|---|---|
| Authentication | Register / Login with email + password. JWT-based sessions persisted in localStorage. |
| 1-on-1 Chat | Real-time text messaging with read receipts and timestamps. |
| Group Chat | Create groups (3+ members), send messages, admin can add members later. |
| Voice Notes | Record and send voice messages via the browser microphone. Plays back with an animated waveform. |
| Online Status | Green dot indicator updates live as users connect / disconnect. |
| Typing Indicators | "is typing…" shown in the chat header with a 1.5 s debounce. |
| Profile | Edit display name and bio; avatar auto-generated from initials via DiceBear. |

---

## How to Test (end-to-end)

1. Start the backend (Node or Java) and the client.
2. Open two browser windows / private tabs.
3. Register two separate user accounts.
4. From one account, search for the other and start a private conversation — messages appear instantly in both tabs.
5. Click the new-group icon, search for and select both users, name the group, and create it — it appears in both sidebars live.
6. Click the mic icon to record a voice note, then stop — it plays back on both sides.
7. Watch typing indicators and online dots update in real time as you interact.

---

## Tech Stack

### Node Backend
Express · Socket.io · MongoDB (Mongoose) · bcryptjs · jsonwebtoken · Multer · UUID

### Java Backend
Spring Boot 3.2 · Spring Security · Spring Data JPA · H2 (default) / MySQL · jjwt · Spring WebSocket (STOMP) · SockJS

### Client
React 19 · React Router 7 · Tailwind CSS 3.4 · Axios · socket.io-client
