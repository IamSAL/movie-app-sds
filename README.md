# RUSSO VERSE - Movie Explorer

A simple movie explorer web app built with React, Vite, Supabase, and TailwindCSS.

## Demo:
Live: <https://tv.sk-salman.com/>

Video:  <https://drive.google.com/file/d/1tcILQ-bSQLDmvvC4_PvMDygZ6vBkJEBy/view?usp=sharing/>

## How to Run the Project

1. **Install dependencies**
   
   Make sure you have Node.js(tested in Node Nv20.19.0) and npm installed.
   
   Run:
   ```
   npm install
   ```

2. **Set up environment variables**
   
   Create a `.env` file in the root folder with these keys (replace values with your own if needed):
   ```
   VITE_TMDB_API_KEY=your_tmdb_api_key
   VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
   VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
(committed my .env file as its just a demo, no security issues)
3. **Start the development server**
   ```
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or the port shown in your terminal).

4. **Build for production**
   ```
   npm run build
   ```

5. **Preview the production build**
   ```
   npm run preview
   ```

## Basic Documentation

- **Tech Stack:**
  - React (frontend)
  - Vite (build tool)
  - Supabase (backend/auth/watchlist) (I had to use supabase because firestore requires paid google cloud account.)
  - TailwindCSS (styling)
  - Framer Motion (animations)
  - React Router (routing)

- **Main Features:**
  - Browse trending and now playing movies.
  - Search for movies.
  - View movie details and recommendations.
  - User authentication (login/signup with Supabase).
  - Add/remove movies to your watchlist (stored in Supabase).
  
  1. **Movie Search Page (`/search`)**
     - A search bar to search for movies by title.
     - Fetch and display search results from TMDB API.
     - Show each movie’s:
       - Poster
       - Title
       - Year
       - "Details" button (Full card is clickable)
       - “Heart” button to add to watchlist
     - Handle empty results, loading state, and API errors gracefully.

  2. **Movie Details Page (`/movie/:id`)**
     - When a user clicks “Details”, show a dedicated page for the movie.
     - Display:
       - Poster
       - Title
       - Genres
       - Plot summary
       - Release date
       - Ratings
     - Include buttons to:
       - Add/Remove from Watchlist (Heart)
       - Go back to Search Page

  3. **Watchlist Page (`/watchlist`)**
     - Show all movies the logged-in user has added to their watchlist.
     - Display at least:
       - Poster
       - Title
       - Year
       - “Remove” button(Heart)
     - Watchlist persists per user.
     - If using Supabase: watchlist is stored in the database by user ID.
     - If mocking: watchlist is stored in localStorage under a user_id key.

- **Project Structure:**
  - `src/pages/` — Main pages (Home, Search, MovieDetails, Watchlist, etc.)
  - `src/components/` — Reusable UI components (Navbar, MovieCard, etc.)
  - `src/services/` — API logic for TMDB and Supabase.
  - `src/contexts/` — React context for authentication.

- **Styling:**
  - TailwindCSS is configured in `tailwind.config.js` and used throughout the app.

- **API:**
  - Uses The Movie Database (TMDB) API for movie data.

---

Note: If you see SIGILL(Aw snap/browser hanging) error while running dev locally, browse from incognito mode. its a vite issue which I couldn't solve right now.