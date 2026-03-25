import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const FEATURES = [
  "Real-time market result updates",
  "Admin dashboard with full CRUD",
  "Auto-refresh every 5 seconds",
];

export function LoginPage() {
  const { login, isLoggingIn, isInitializing } = useInternetIdentity();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "oklch(0.10 0 0)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div
          className="rounded-2xl border border-border p-10 shadow-card flex flex-col items-center gap-8"
          style={{ backgroundColor: "oklch(0.17 0 0)" }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <span className="text-3xl font-black text-primary-foreground">
                J1
              </span>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                MARKET RESULTS
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Live data platform
              </p>
            </div>
          </div>

          <div className="w-full space-y-2">
            {FEATURES.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <TrendingUp className="h-4 w-4 text-primary shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Button
            data-ocid="login.primary_button"
            onClick={login}
            disabled={isLoggingIn || isInitializing}
            className="w-full h-12 text-base font-bold bg-primary text-primary-foreground hover:opacity-90 rounded-xl"
          >
            {isLoggingIn || isInitializing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Connecting...
              </>
            ) : (
              "Login with Internet Identity"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Secure authentication via Internet Identity.
            <br />
            Your privacy is protected.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
