# Admin Chat Feature Walkthrough

I have implemented a real-time chat feature for the Admin panel using **Socket.IO** and the existing **Message** table.

## Features
- **Real-time Messaging:** Uses Socket.IO for instant communication.
- **User List:** Displays users who have sent messages, ordered by recency.
- **Persistent History:** Fetches message history from the Supabase `Message` table.
- **Light Design:** Clean, white-themed UI with Neo-pop accents.

## Implementation Details

### 1. Socket.IO Server (`pages/api/socket/io.ts`)
Since this is a Next.js App Router project, I used the API Route injection pattern to spin up the Socket.IO server.
- The server listens on `/api/socket/io`.
- It handles `join_room` and `send_message` events.
- Rooms are named `chat_{USER_ID}` to allow 1-on-1 communication between the Admin and a specific User.

### 2. Admin Chat Page (`app/(protected)/admin/chat/page.tsx`)
- Fetches the list of active conversations server-side.
- Authorization check ensures only logged-in users (Admins) can access.

### 3. Chat Client (`app/(protected)/admin/chat/ChatClient.tsx`)
- connects to the Socket.IO server.
- Manages real-time state (messages, online status).
- Sends messages to the API and emits socket events.

### 4. Server Actions (`app/(protected)/admin/chat/actions.ts`)
- `getChatUsers()`: Aggregates `Message` table data to find recent conversations.
- `getMessagesForUser(userId)`: Fetches chat history.
- `saveMessage(...)`: Persists new messages to the database.

## How to Test

1.  **Start the Server:**
    ```bash
    npm run dev
    ```
2.  **Navigate to the Chat Page:**
    Go to `http://localhost:3000/admin/chat`.
3.  **Simulate a User:**
    Since the mobile app might not be running, you can manually insert a message into the `Message` table in Supabase to see a user appear in the list.
    ```sql
    INSERT INTO "Message" ("content", "senderId", "type", "createdAt", "ticketId")
    VALUES ('Hello Admin!', 'SOME_VALID_USER_UUID', 'TEXT', NOW(), 0);
    ```
4.  **Chat:**
    - Click on the user in the sidebar.
    - Type a message and hit Send.
    - The message should appear immediately and be saved to the database.

## Mobile Integration Note
For the mobile app to connect, it should use a Socket.IO client:
```javascript
const socket = io('YOUR_DOMAIN', {
  path: '/api/socket/io',
});

socket.emit('join_room', 'chat_MY_USER_ID');

socket.on('receive_message', (data) => {
  console.log('New Message:', data);
});
```
