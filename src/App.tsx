import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Search from './pages/Search'
import Detail from './pages/Detail'
import Favorites from './pages/Favorites'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur border-b border-gray-800">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
              🎬 <span>Movie Finder</span>
            </Link>

            <div className="flex items-center gap-6 text-sm">
              <Link to="/" className="hover:text-amber-400 transition-colors">
                Home
              </Link>
              <Link to="/favorites" className="hover:text-amber-400 transition-colors">
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

        <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
          Built with React, TypeScript, and TMDB
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App