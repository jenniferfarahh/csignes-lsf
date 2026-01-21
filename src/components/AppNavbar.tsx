import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut } from "lucide-react";
import logo from "@/assets/logo.png";

export default function AppNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const initials = useMemo(() => {
    const f = (user?.firstName?.trim()?.[0] ?? "U").toUpperCase();
    const l = (user?.lastName?.trim()?.[0] ?? "").toUpperCase();
    return `${f}${l}`;
  }, [user]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  // This function toggles between light and dark theme.

  const onLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };
  // This function logs the user out and redirects to the login page.

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        {/* Left: Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
          <img
            src={logo}
            alt="CSignes"
            className="
              h-20 md:h-24 lg:h-28
              w-auto
              translate-y-1.5
              transition-all duration-300 ease-out
              hover:scale-110
              hover:drop-shadow-[0_16px_40px_rgba(236,72,153,0.45)]
              cursor-pointer
            "
          />
          </div>


        {/* Right: Theme + Avatar */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Changer le thème">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {/* Avatar */}
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="w-9 h-9 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center"
              aria-label="Menu utilisateur"
            >
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-sm font-semibold">{initials}</span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-background shadow-lg p-2">
                <div className="px-2 py-2">
                  <div className="font-semibold text-sm">
                    {(user?.firstName ?? "").trim()} {(user?.lastName ?? "").trim()}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</div>
                </div>

                <div className="h-px bg-border my-2" />

                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted text-sm font-medium"
                >
                  <LogOut size={16} />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
