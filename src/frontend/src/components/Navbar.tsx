import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface NavbarProps {
  isAdmin: boolean;
}

export function Navbar({ isAdmin }: NavbarProps) {
  const { clear, identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal = principal ? `${principal.slice(0, 5)}...` : "Guest";

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border"
      style={{ backgroundColor: "oklch(0.13 0 0)" }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-primary">J1</span>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-foreground leading-tight">
                MARKET
              </div>
              <div className="text-xs font-semibold text-foreground leading-tight">
                RESULTS
              </div>
            </div>
          </div>
          {isAdmin && (
            <span className="hidden md:block text-xs text-muted-foreground font-medium pl-3 border-l border-border">
              ADMIN
            </span>
          )}
        </div>

        {/* User info + logout */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-secondary text-foreground text-xs">
                {isAdmin ? "AD" : "US"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {isAdmin
                ? `Admin (${shortPrincipal})`
                : `User (${shortPrincipal})`}
            </span>
          </div>
          <Button
            data-ocid="nav.logout.button"
            variant="secondary"
            size="sm"
            onClick={clear}
            className="text-xs gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
