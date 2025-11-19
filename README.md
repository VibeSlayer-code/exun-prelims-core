# Nixun React Application

This is a React version of the Nixun UI, converted from the original HTML files while maintaining exact design parity.

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Navigate to the react-version directory:
```bash
cd react-version
```

2. Install dependencies:
```bash
npm install
```

### Running the Development Server

Start the Vite development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Building for Production

Create an optimized production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
react-version/
├── public/
│   └── assets/          # Static assets (images, icons)
├── src/
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Signup.jsx
│   │   ├── Signup.css
│   │   ├── Search.jsx
│   │   ├── Search.css
│   │   ├── Services.jsx
│   │   ├── Services.css
│   │   ├── Knowledge.jsx
│   │   ├── Knowledge.css
│   │   ├── Map.jsx
│   │   └── Map.css
│   ├── App.jsx          # Main app component with routing
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── package.json
└── vite.config.js       # Vite configuration
```

## Features

### Pages

- **Home** (`/`) - Landing page with navigation to all services
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - User registration
- **Search** (`/search`) - AI-powered medical research conversion for tiny humans
- **Services** (`/services`) - Service portal for investigations and more
- **Knowledge** (`/knowledge`) - Educational resources with AI chat features
- **Map** (`/map`) - Interactive 3D underground city map with Three.js

### Technologies Used

- React 18
- Vite (build tool)
- React Router DOM (routing)
- Three.js (3D graphics for map)
- Google Gemini AI API (search and knowledge features)

## Backend Integration

The application expects a backend API running at `http://127.0.0.1:5000` for:
- User login: `POST /check_user`
- User registration: `POST /add_user`

## Notes

- All UI designs match the original HTML files exactly
- Navigation uses React Router for client-side routing
- Assets are served from the `public/assets` directory
- The Map page features a full 3D interactive map built with Three.js
