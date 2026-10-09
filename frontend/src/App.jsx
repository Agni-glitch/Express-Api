import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { EmptyState, LinkButton } from './components/ui.jsx'
import Home from './pages/Home.jsx'
import Movies from './pages/Movies.jsx'
import MovieDetail from './pages/MovieDetail.jsx'
import MovieForm from './pages/MovieForm.jsx'
import Genres from './pages/Genres.jsx'
import Stats from './pages/Stats.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Profile from './pages/Profile.jsx'
import AdminUsers from './pages/AdminUsers.jsx'

function NotFound() {
  return (
    <div className="space-y-6 text-center">
      <EmptyState title="Page not found">The page you are looking for doesn't exist.</EmptyState>
      <LinkButton to="/">Back to home</LinkButton>
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/movies/new" element={<MovieForm />} />
            <Route path="/movies/:id/edit" element={<MovieForm />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-500">
        Cineflix · React, Vite and Tailwind CSS on top of the Express movies API
      </footer>
    </div>
  )
}
