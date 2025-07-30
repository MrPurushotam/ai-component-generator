# Multi Component Generator

A full-stack web application for generating, managing, and iterating React components through conversational AI. Users can chat with an AI to create components, view chat history, and manage their sessions. The project uses Next.js for the frontend and Node.js/Express with Prisma for the backend, integrating Google OAuth for authentication and Gemini AI for code generation.

## Features

- **Conversational UI:** Chat with an AI to generate React components from text or image prompts.
- **Component Generation:** Supports functional/class components, TypeScript, and modern CSS.
- **Image-to-Component:** Upload images to generate matching React components.
- **Iterative Refinement:** Modify generated components through follow-up prompts.
- **Chat History:** View and manage all previous chat sessions and generated components.
- **Authentication:** Secure login via Google OAuth.
- **Responsive Design:** Modern, mobile-friendly UI built with Tailwind CSS.
- **Backend API:** RESTful endpoints for authentication, chat management, and AI integration.

## Tech Stack

- **Frontend:** Next.js, React, Redux Toolkit, Tailwind CSS
- **Backend:** Node.js, Express, Prisma ORM, Google Gemini AI API
- **Database:** PostgreSQL (via Prisma)
- **Authentication:** Google OAuth 2.0, JWT (cookie-based)
- **Deployment:** Vercel (frontend), Vercel/Node (backend)

## Folder Structure

```
frontend/
  ├── app/                # Next.js app directory
  ├── components/         # React components (Navbar, Footer, Chat, History, Login, etc.)
  ├── lib/                # Providers, API utilities
  ├── store/              # Redux slices (auth, chat)
  ├── public/             # Static assets
  └── README.md           # This file

backend/
  ├── src/
      ├── routes/         # Express routes (auth, chats)
      ├── middleware/     # Auth middleware
      ├── utils/          # Prisma client, Gemini AI service, system prompt
      ├── api/            # Vercel API entry
      └── index.js        # Express app entry
  └── prisma/             # Prisma schema and migrations
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- Google Cloud account (for Gemini AI and OAuth credentials)
- Vercel account (for deployment)

### Environment Variables

Create `.env` files in both `frontend` and `backend` directories. Example for backend:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
GOOGLE_CLIENT_ID=your-google-client-id
GEMINI_API_KEY=your-gemini-api-key
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Running Locally

- Start backend (`localhost:5000` by default)
- Start frontend (`localhost:3000` by default)
- Access the app at [http://localhost:3000](http://localhost:3000)

## Usage

- **Login:** Sign in with Google to start a session.
- **Chat:** Use the chat interface to generate React components via AI.
- **History:** View and manage all your previous chats and generated components.
- **Component Iteration:** Refine components by sending follow-up prompts.

## API Endpoints

- `POST /auth/google` — Google OAuth login
- `GET /auth/` — Get current user info
- `POST /auth/logout` — Logout
- `POST /chat/create` — Create new chat session
- `POST /chat/:chatId` — Send prompt/image to AI
- `GET /chat/history` — List all user chats
- `GET /chat/history/:chatId` — Get messages for a chat
- `PUT /chat/edit/:chatId` — Edit chat title
- `DELETE /chat/:chatId` — Delete chat

## Customization

- **AI System Prompt:** See `backend/src/utils/systemPrompt.js` for detailed AI instructions.
- **Component Styling:** Uses Tailwind CSS, but you can add custom styles as needed.
- **Database:** Prisma schema can be extended for more features.

## Deployment

- **Frontend:** Deploy to Vercel or any Next.js-compatible host.
- **Backend:** Deploy to Vercel (serverless) or Node.js server.

## License

MIT

## Credits

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Google Gemini AI](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
