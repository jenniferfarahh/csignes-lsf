import { useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const initials = useMemo(() => {
    const f = user?.firstName?.trim()?.[0]?.toUpperCase() ?? "";
    const l = user?.lastName?.trim()?.[0]?.toUpperCase() ?? "";
    return (f + l) || "?";
  }, [user]);

  if (!user) return null;

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid #ddd",
          overflow: "hidden",
          cursor: "pointer",
          background: "#fff",
        }}
        aria-label="Menu utilisateur"
      >
        {user.picture ? (
          <img src={user.picture} alt="Avatar" style={{ width: "100%", height: "100%" }} />
        ) : (
          <span style={{ fontWeight: 700 }}>{initials}</span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 46,
            width: 220,
            border: "1px solid #ddd",
            borderRadius: 10,
            background: "white",
            padding: 10,
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            zIndex: 50,
          }}
        >
          <div style={{ padding: "6px 8px" }}>
            <div style={{ fontWeight: 700 }}>
              {user.firstName ?? ""} {user.lastName ?? ""}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{user.email}</div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "10px 0" }} />

          <button
            onClick={onLogout}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "8px 10px",
              borderRadius: 8,
              border: "none",
              background: "#f5f5f5",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
