# TRANA - Smart Healthcare Command Center

TRANA is a premium, standalone healthcare dashboard designed for real-time emergency tracking, ambulance dispatch, and hospital bed management.

## Features

- **Premium UI**: HSL-based healthcare palette with glassmorphism and micro-animations.
- **Inter-City Navigation**: Mobile-optimized route planning with turn-by-turn overlays.
- **Mock Backend**: Fully functional in-memory database (Auth, Patients, Ambulances, Beds).
- **Google Maps Integration**: Live map search, photo mode (satellite), and current location detection.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **Icons**: Lucide React
- **Maps**: Google Maps JavaScript API

## Getting Started

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure Environment**
   Create a `.env` file based on `.env.example` and add your Google Maps API Key:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
4. **Run the development server**
   ```bash
   npm run dev
   ```

## Note

This project is a standalone demonstration template. All data is managed in-memory via a mock client for high-speed performance and zero-config deployment.
