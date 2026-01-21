import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Index from "@/pages/Index";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/auth/AuthContext";
import AppLayout from "./components/AppLayout";

export default function App() {
  const { accessToken } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={accessToken ? <Navigate to="/" replace /> : <Login />}
        />

        <Route
          path="/"
          element={
            <RequireAuth>
              <AppLayout>
                <Index />
              </AppLayout>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
