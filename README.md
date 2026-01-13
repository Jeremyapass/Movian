# 🎬 Movian

**Film Social Media for Films Enthusiast**

Movian adalah platform social media yang diperuntukkan bagi para film enthusiast untuk mengeksplorasi, mengelola, dan berbagi pengalaman menonton film dan series favorit mereka. Dibangun dengan Next.js 16 dan diperkuat dengan TanStack Query untuk data management yang optimal.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Authentication Flow](#-authentication-flow)
- [API Strategy](#-api-strategy)
- [Database & CRUD Operations](#-database--crud-operations)
- [State Management](#-state-management)
- [Middleware & Security](#-middleware--security)
- [Environment Variables](#-environment-variables)
- [License](#-license)

---

## ✨ Features

- 🔐 **Authentication System** - Sign up, login, email verification dengan Supabase Auth
- 🎥 **Movie & Series Catalog** - Browse trending, popular, top rated, dan upcoming films
- 🔍 **Advanced Search** - Search movies dan series dengan hasil real-time
- 📂 **Genre Filtering** - Explore films berdasarkan genre
- ⭐ **Reviews & Ratings** - Beri rating dan review untuk film favorit
- ❤️ **Favorites** - Simpan film favorit ke koleksi pribadi
- 📝 **Watchlist Management** - Buat dan kelola multiple watchlist (private/public)
- 👤 **User Profile** - Customize profile dengan avatar dan cover picture
- 🎨 **Responsive UI** - Fully responsive dengan Tailwind CSS dan Radix UI
- 🚀 **Optimized Performance** - SSR untuk data fetching, caching strategy, dan lazy loading

---

## 🛠 Tech Stack

### Frontend

- **Framework:** [Next.js 16.1.1](https://nextjs.org/) (App Router dengan Turbopack)
- **UI Library:** [React 19.2.3](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) + [tw-animate-css](https://www.npmjs.com/package/tw-animate-css)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) (Dialog, Dropdown, Popover, Slider)
- **Animations:** [GSAP](https://greensock.com/gsap/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend & Database

- **BaaS:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication:** Supabase Auth (Email/Password + OAuth)
- **Storage:** Supabase Storage (Avatar & Cover Pictures)

### Data Fetching & State

- **Server State:** [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Data Provider:** Context API dengan custom hooks

### External APIs

- **Movie Data:** [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api)

### Developer Tools

- **Linting:** ESLint 9
- **Build Tool:** Next.js Turbopack
- **DevTools:** TanStack Query DevTools

---

## 🏗 Architecture

Movian menggunakan arsitektur modern dengan pemisahan concern yang jelas:

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Side                         │
├─────────────────────────────────────────────────────────────┤
│  Components (Atoms/Molecules/Organisms)                     │
│  Providers (State Management via Context)                   │
│  Custom Hooks (hookAPI - TanStack Query)                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App Router                     │
├─────────────────────────────────────────────────────────────┤
│  Middleware (proxy.js - Route Protection)                   │
│  API Routes (SSR for TMDB - API Key Protection)             │
│  Server Components (Data Fetching)                          │
└─────────────┬───────────────────────────────────────────────┘
              │
              ├──────────────────┬──────────────────┐
              ▼                  ▼                  ▼
    ┌──────────────────┐  ┌─────────────┐  ┌──────────────┐
    │  Supabase Auth   │  │  Supabase   │  │  TMDB API    │
    │  (Authentication)│  │  Database   │  │  (via SSR)   │
    └──────────────────┘  └─────────────┘  └──────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ dan npm/yarn/pnpm
- Akun [Supabase](https://supabase.com/)
- API Key dari [TMDB](https://www.themoviedb.org/settings/api)

### Installation

1. **Clone repository**

   ```bash
   git clone https://github.com/yourusername/movian.git
   cd movian
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   Buat file `.env.local` di root project:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # TMDB API Configuration
   API_KEY_TMDB=your_tmdb_api_key
   API_URL_TMDB=https://api.themoviedb.org/3
   TMDB_SESSION_ID=your_tmdb_session_id
   ```

4. **Setup Supabase Database**

   Jalankan migration SQL di Supabase SQL Editor (lihat section [Database Schema](#database-schema))

5. **Run development server**

   ```bash
   npm run dev
   ```

6. **Open browser**
   ```
   http://localhost:3000
   ```

---

## 📂 Project Structure

```
movian/
├── public/                      # Static assets
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # Auth pages (login, signup)
│   │   ├── api/                 # API Routes
│   │   │   └── TMDB/            # SSR Endpoints untuk TMDB
│   │   │       ├── genre/       # Genre endpoints
│   │   │       ├── movieList/   # Movie list endpoints
│   │   │       ├── movies/      # Movie detail endpoints
│   │   │       ├── search/      # Search endpoints
│   │   │       ├── series/      # Series endpoints
│   │   │       └── seriesList/  # Series list endpoints
│   │   ├── auth/                # Auth callback route
│   │   ├── favorite/            # Favorite page
│   │   ├── genre/               # Genre pages
│   │   ├── movies/              # Movies pages
│   │   ├── profile/             # Profile page
│   │   ├── search-result/       # Search result page
│   │   ├── series/              # Series pages
│   │   ├── watchlist/           # Watchlist pages
│   │   ├── globals.css          # Global styles
│   │   ├── layout.jsx           # Root layout
│   │   └── page.jsx             # Homepage
│   │
│   ├── components/              # React Components
│   │   ├── Atoms/               # Atomic components
│   │   ├── Molecules/           # Molecular components
│   │   ├── Organism/            # Organism components
│   │   ├── Skeletons/           # Loading skeletons
│   │   └── ui/                  # Radix UI components
│   │
│   ├── hookAPI/                 # Custom hooks untuk API calls
│   │   ├── SUPABASE/
│   │   │   ├── authSchema/      # Auth hooks (login, signup, etc)
│   │   │   └── publicSchema/    # Public schema hooks
│   │   │       ├── account/     # Account management
│   │   │       ├── favorite/    # Favorite CRUD
│   │   │       ├── movieCache/  # Movie cache
│   │   │       ├── review/      # Review CRUD
│   │   │       └── watchlist/   # Watchlist CRUD
│   │   ├── TMDB/                # TMDB API hooks
│   │   └── axiosInstance.js     # Axios configuration
│   │
│   ├── provider/                # Context providers
│   │   ├── favoriteProvider.js
│   │   ├── genreProvider.js
│   │   ├── mainProvider.js
│   │   ├── moviesProvider.js
│   │   ├── profileProvider.js
│   │   ├── rootProvider.js      # Root provider
│   │   ├── searchProvider.js
│   │   ├── seriesProvider.js
│   │   ├── tanstackProvider.js  # TanStack Query provider
│   │   └── watchlistProvider.js
│   │
│   ├── lib/                     # Utility functions
│   │   ├── cropImage.js         # Image cropping utility
│   │   ├── ratingUtils.js       # Rating calculations
│   │   ├── supabaseClient.js    # Supabase client
│   │   └── utils.js             # General utilities
│   │
│   ├── fonts/                   # Custom fonts
│   └── proxy.js                 # Middleware untuk route protection
│
├── components.json              # shadcn/ui configuration
├── next.config.mjs              # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.mjs           # PostCSS configuration
└── package.json                 # Dependencies
```

---

## 🔐 Authentication Flow

Movian menggunakan **Supabase Auth** dengan multiple authentication methods:

### Sign Up Flow

1. User mengisi form registrasi di `/signup`
2. Hook `useSIgnUp` mengirim data ke Supabase Auth
3. Supabase mengirim email verification
4. User klik link di email → redirect ke `/auth/callback`
5. Callback route verifikasi OTP token
6. User redirect ke homepage dengan session aktif

### Login Flow

1. User login di `/login` (email/password atau OAuth)
2. Hook `useSignIn` atau `useSignInOAuth` authenticate user
3. Supabase membuat session dan set cookies
4. Middleware (`proxy.js`) validate session
5. User dapat mengakses protected routes

### Protected Routes

Routes yang memerlukan authentication (dihandle oleh `proxy.js`):

- `/watchlist/*` - Watchlist management
- `/profile/*` - User profile
- `/favorite/*` - User favorites

Jika user tidak authenticated, akan di-redirect ke `/login?redirect={original_path}`

---

## 🌐 API Strategy

### TMDB API (Server-Side Rendering)

Untuk **menyembunyikan API key** TMDB dari client, semua request ke TMDB API di-proxy melalui Next.js API Routes:

#### Flow:

```
Client → /api/TMDB/movies/[endpoint] → TMDB API (dengan API key)
```

#### Contoh Implementation:

**File:** `src/app/api/TMDB/movies/get-movies-detail/[movies_id]/route.js`

```javascript
export async function GET(req, context) {
  const { movies_id } = await context.params;

  const { data } = await axios.get(
    `${process.env.API_URL_TMDB}/movie/${movies_id}`,
    {
      params: {
        api_key: process.env.API_KEY_TMDB, // API key tidak terexpose ke client
      },
    }
  );

  return Response.json(data);
}
```

**Client-side hook:** `src/hookAPI/TMDB/movies/useGetMoviesDetail.js`

```javascript
export const useGetMoviesDetail = (moviesId) => {
  return useQuery({
    queryKey: ["movies-detail", moviesId],
    queryFn: () => axios.get(`/api/TMDB/movies/get-movies-detail/${moviesId}`),
  });
};
```

#### Benefits:

- ✅ API key tersimpan aman di server (environment variables)
- ✅ Rate limiting dapat di-implement di server
- ✅ Caching dengan Next.js Cache-Control headers
- ✅ Error handling terpusat

---

## 💾 Database & CRUD Operations

### Supabase PostgreSQL Schema

Movian menggunakan Supabase sebagai database dengan schema berikut:

#### Tables:

- **`account`** - User profile information (avatar, cover picture, bio)
- **`favorite`** - User's favorite movies/series
- **`watchlist`** - User's custom watchlists
- **`watchlist_film`** - Films in each watchlist
- **`review`** - User reviews and ratings
- **`movie_cache`** - Cached movie data dari TMDB

#### CRUD Operations

Semua CRUD operations menggunakan **TanStack Query** dengan custom hooks:

##### Create Operations (useMutation)

```javascript
// Example: Add to Favorites
useAddFavorite() → supabase.from('favorite').insert()
```

**Hooks:**

- `useAddFavorite` - Tambah film ke favorites
- `useAddWatchlist` - Buat watchlist baru
- `useAddWatchlistFilm` - Tambah film ke watchlist
- `useAddReview` - Buat review baru

##### Read Operations (useQuery)

```javascript
// Example: Get Favorites
useGetFavorite() → supabase.from('favorite').select()
```

**Hooks:**

- `useGetAccountDetail` - Get user profile
- `useGetFavorite` - Get user favorites
- `useGetWatchlist` - Get user watchlists
- `useGetReview` - Get reviews

##### Update Operations (useMutation)

```javascript
// Example: Update Profile
useUpdateAccountDetail() → supabase.from('account').update()
```

**Hooks:**

- `useUpdateAccountDetail` - Update profile info
- `useUpdateAccountCoverPicture` - Update cover picture
- `useUpdateWatchlist` - Update watchlist details

##### Delete Operations (useMutation)

```javascript
// Example: Delete Favorite
useDeleteFavorite() → supabase.from('favorite').delete()
```

**Hooks:**

- `useDeleteFavorite` - Remove from favorites
- `useDeleteWatchlist` - Delete watchlist
- `useDeleteWatchlistFilm` - Remove film dari watchlist
- `useDeleteReview` - Delete review

#### Row Level Security (RLS)

Supabase RLS policies memastikan:

- User hanya bisa akses data mereka sendiri
- Public watchlist dapat diakses siapa saja
- Private watchlist hanya bisa diakses owner

---

## 🎯 State Management

Movian menggunakan **hybrid state management**:

### 1. Server State (TanStack Query)

Untuk data dari API (TMDB & Supabase):

- Automatic caching
- Background refetching
- Optimistic updates
- Query invalidation

**Provider:** `src/provider/tanstackProvider.js`

### 2. Client State (Context API)

Untuk global state sharing antar components:

**Providers:**

- `rootProvider.js` - Global user data, toast notifications
- `mainProvider.js` - Homepage state (trending, popular movies)
- `moviesProvider.js` - Movies page state
- `seriesProvider.js` - Series page state
- `genreProvider.js` - Genre filtering state
- `favoriteProvider.js` - Favorites state
- `watchlistProvider.js` - Watchlist state
- `profileProvider.js` - Profile state
- `searchProvider.js` - Search state

**Pattern:**

```javascript
// Provider
export const MovieProvider = ({ children }) => {
  const { data, isLoading } = useGetMovies();

  return (
    <MovieContext.Provider value={{ data, isLoading }}>
      {children}
    </MovieContext.Provider>
  );
};

// Consumer
export const useMovies = () => useContext(MovieContext);
```

---

## 🛡 Middleware & Security

### Proxy Middleware (`src/proxy.js`)

Middleware ini melindungi protected routes dengan:

1. **Route Protection**

   - Intercept request ke protected paths
   - Verify Supabase session
   - Redirect ke login jika tidak authenticated

2. **Session Management**

   - Handle Supabase cookies
   - Maintain session across requests

3. **Protected Routes:**

   ```javascript
   const protectedRoutes = ["/watchlist", "/profile", "/favorite"];
   ```

4. **Redirect dengan original path:**
   ```
   /watchlist → /login?redirect=/watchlist
   ```

### Security Best Practices

- ✅ API keys di environment variables (tidak di-commit ke git)
- ✅ SSR untuk TMDB API (hide API key dari client)
- ✅ Supabase RLS untuk database security
- ✅ CORS configuration di Next.js
- ✅ Secure cookie handling untuk session

---

## 🔧 Environment Variables

Buat file `.env.local` di root project:

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================
# Get these from: https://supabase.com/dashboard/project/_/settings/api

NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# TMDB API CONFIGURATION
# ============================================
# Get API key from: https://www.themoviedb.org/settings/api

API_KEY_TMDB=your_tmdb_api_key_here
API_URL_TMDB=https://api.themoviedb.org/3
TMDB_SESSION_ID=your_tmdb_session_id (optional)
```

### How to Get Keys:

#### Supabase:

1. Buat project di [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to Project Settings → API
3. Copy `URL` dan `anon public` key

#### TMDB API:

1. Buat akun di [TMDB](https://www.themoviedb.org/)
2. Go to Settings → API → Request API Key
3. Fill form untuk API key (gratis untuk non-commercial use)
4. Copy API key (v3 auth)

---

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server dengan Turbopack

# Production
npm run build        # Build untuk production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

---

## 🎨 Component Library

Movian menggunakan **Atomic Design Pattern**:

### Atoms

Komponen terkecil dan reusable:

- Buttons (Primary, Secondary, Outline, Ghost)
- Input, Textarea
- Cards (Movie Card, Series Card, Review Card)
- Dialogs, Popovers

### Molecules

Kombinasi beberapa atoms:

- Navbar dengan search bar
- Footer
- Carousel layouts
- Film filters

### Organisms

Komponen kompleks:

- Page layouts
- Feature sections

### UI Components (Radix)

- Dialog - Modal windows
- Dropdown Menu - Dropdowns
- Popover - Tooltip popover
- Slider - Range slider
- Button - Button primitives

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set environment variables di Vercel dashboard
4. Deploy!

### Environment Variables di Vercel

Tambahkan semua env variables di Project Settings → Environment Variables

---

## 🤝 Contributing

Project ini saat ini **proprietary** dengan All Rights Reserved license. Anda dapat melihat kode, tetapi tidak boleh:

- Copy atau redistribute kode
- Modify atau adapt kode
- Gunakan untuk personal/commercial projects

Untuk permissions, hubungi: jeremyapascal@gmail.com

---

## 📄 License

**Copyright (c) 2026 Jeremyapass**

All rights reserved.

See [LICENSE.MD](LICENSE.MD) for full license text.

---

## 📧 Contact

- **Author:** Jeremyapass
- **Email:** jeremyapascal@gmail.com
- **Project Link:** [GitHub - Movian](https://github.com/yourusername/movian)

---

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) - Movie data API
- [Supabase](https://supabase.com/) - Backend as a Service
- [Vercel](https://vercel.com/) - Hosting platform
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [TanStack Query](https://tanstack.com/query) - Data synchronization

---

<div align="center">
  <p>Made with ❤️ by Jeremyapass</p>
  <p><strong>Happy Watching! 🍿</strong></p>
</div>
