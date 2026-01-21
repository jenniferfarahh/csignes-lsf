import { GoogleLogin } from "@react-oauth/google";
import { apiPost } from "@/lib/apiPost";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Se connecter</h1>
        <p className="text-sm text-muted-foreground">
          Connecte-toi avec Google pour sauvegarder ton progrès.
        </p>

        <GoogleLogin
          onSuccess={async (cred) => {
            const idToken = cred.credential;
            if (!idToken) return;

            // 1) Appel backend (crée User + UserProgress)
            const res = await apiPost<{ accessToken: string }>(
              "/api/auth/google",
              { idToken }
            );

            // 2) Sauvegarde du token via AuthContext
            setAccessToken(res.accessToken);

            // 3) Redirection propre (sans reload)
            navigate("/");
          }}
          onError={() => {
            alert("Erreur lors de la connexion Google");
          }}
        />
      </div>
    </div>
  );
}
