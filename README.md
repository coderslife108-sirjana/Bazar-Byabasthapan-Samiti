# Dumkibas Bazar Byabasthapan Samiti

This project is the existing MERN committee portal. It includes role-based access, notices with image/PDF attachments and publication/expiry dates, and private member messaging.

## Requirements

- Node.js 20.19+ (or 22.12+)
- MongoDB running locally or a MongoDB Atlas connection string

## Configure the server

1. Open a terminal in the project folder:

   ```powershell
   cd server
   ```

2. Create `server/.env` with your own MongoDB URI and a long, random JWT secret:

   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/dumkibas_bazar
   JWT_SECRET=replace-this-with-a-long-random-secret
   PORT=5000
   ```

   For MongoDB Atlas, use the connection string from your Atlas project instead of the local URI. Keep `.env` private and do not commit it.

3. Install dependencies and start the API:

   ```powershell
   npm install
   npm run dev
   ```

   The API is available at `http://localhost:5000`.

## Configure the client

Open a second terminal in the project folder:

```powershell
cd client
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). The development server proxies `/api` requests to the API on port 5000.

## First administrator

If the database has no administrator, create one by sending a `POST` request to `http://localhost:5000/api/admin/create-first-admin` with JSON fields `name`, `email`, `phone`, `address`, and `password`. Choose a unique email and a strong password. The endpoint allows creation only while the database has no admin account.

## Roles and features

- **Admin:** approves members, manages user roles and accounts, and manages notices, reports, and announcements.
- **Notice Manager / Secretary:** manages notices and sends private member messages; cannot manage accounts or permissions. Existing `staff` accounts continue to work as notice managers.
- **Member:** views published notices and their private inbox.

Admins assign roles from **Admin → Users**. Notice managers and admins can publish now or schedule notices for later, set expiry dates, attach one image or PDF (maximum 10 MB), and send individual private messages. Messages include inbox/sent views, unread counts, and read status.

Uploaded notice files are stored locally under `server/uploads/notices` and served through `/api/uploads`. Back up this folder alongside MongoDB, and use persistent storage if deploying to an environment with an ephemeral filesystem. Use HTTPS and a production-grade MongoDB deployment for public hosting.
