# StudyNanbar

StudyNanbar is a study companion that uses AI to provide personalized explanations based on a student's level and mood. By adjusting content to match how learners feel and understand, it makes complex topics easier to grasp.

## Features

- **Topic input** – Enter any subject you want explained
- **Level selector** – Choose *Beginner* or *Intermediate*
- **Mood selector** – Choose *Tired*, *Confused*, or *Curious*
- **AI-powered explanations** – Responses are tailored to your level and mood via Google Gemini
- **Simplify More** – Request an even simpler re-explanation with one click

## Folder Structure

```
/
├── frontend/   React + Vite single-page app
└── backend/    Node.js + Express API server
```

## Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) (free tier available)

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env and set your GEMINI_API_KEY
npm install
npm start
# Server runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env if your backend runs on a different URL
npm install
npm run dev
# App runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

### Backend (`backend/.env`)

| Variable        | Description                          | Default |
|-----------------|--------------------------------------|---------|
| `GEMINI_API_KEY` | Your Google Gemini API key          | —       |
| `PORT`          | Port for the Express server          | `5000`  |

### Frontend (`frontend/.env`)

| Variable           | Description              | Default                   |
|--------------------|--------------------------|---------------------------|
| `VITE_BACKEND_URL` | URL of the backend server | `http://localhost:5000` |

## Tech Stack

| Layer    | Technology                     |
|----------|-------------------------------|
| Frontend | React 19, Vite 8               |
| Backend  | Node.js, Express 4             |
| AI       | Google Gemini 1.5 Flash        |
