import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Moon, Bell, Volume2, Globe } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2" size={20} />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="text-muted-foreground" size={20} />
              <div>
                <Label>Mode sombre</Label>
                <p className="text-sm text-muted-foreground">Activer le thème sombre</p>
              </div>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="text-muted-foreground" size={20} />
              <div>
                <Label>Notifications</Label>
                <p className="text-sm text-muted-foreground">Recevoir des rappels quotidiens</p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="text-muted-foreground" size={20} />
              <div>
                <Label>Sons</Label>
                <p className="text-sm text-muted-foreground">Activer les effets sonores</p>
              </div>
            </div>
            <Switch checked={sound} onCheckedChange={setSound} />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Globe className="text-muted-foreground" size={20} />
            <div>
              <Label>Langue</Label>
              <p className="text-sm text-muted-foreground">Français</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
