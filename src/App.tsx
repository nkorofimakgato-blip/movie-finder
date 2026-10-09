import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Search from './pages/Search'
import Detail from './pages/Detail'
import Favorites from './pages/Favorites'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
        <header className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur border-b border-white/10">
          <nav className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
            <Link
              to="/"
              className="text-xl font-black flex items-center gap-2 text-white hover:text-amber-400 transition-colors"
            >
              🎬 <span>Mkansi Movie Finder</span>
            </Link>

            <div className="flex items-center gap-8 text-sm font-medium">
              <Link
                to="/"
                className="text-gray-300 hover:text-amber-400 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/favorites"
                className="text-gray-300 hover:text-amber-400 transition-colors"
              >
                Favorites
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/:type/:id" element={<Detail />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>

        <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-500">
          Mkansi Movie Finder · Built with React, TypeScript, and TMDB
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App