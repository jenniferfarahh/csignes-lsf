import { GoogleLogin } from "@react-oauth/google";
import { setToken } from "@/lib/auth";
import { apiPost } from "@/lib/apiPost";

export default function Login() {
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

            // Optionnel mais propre: ping backend pour créer userProgress
            const res = await apiPost<{ accessToken: string }>("/api/auth/google", { idToken });

            setToken(res.accessToken); // on stocke
            window.location.href = "/"; // redirect home
          }}
          onError={() => {
            alert("Erreur Google login");
          }}
        />
      </div>
    </div>
  );
}
