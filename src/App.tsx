import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Index from "./pages/Index";
import { RequireAuth } from "@/components/RequireAuth";
import { isLoggedIn } from "@/lib/auth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* si déjà loggé, /login redirige vers / */}
        <Route
          path="/login"
          element={isLoggedIn() ? <Navigate to="/" replace /> : <Login />}
        />

        {/* Home protégée */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Index />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
