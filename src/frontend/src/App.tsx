import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";
import { AdminDashboard } from "./pages/AdminDashboard";
import { LoginPage } from "./pages/LoginPage";
import { UserPanel } from "./pages/UserPanel";

type Page = "dashboard" | "user";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const [currentPage, setCurrentPage] = useState<Page>("user");

  // Route to admin dashboard automatically if admin
  useEffect(() => {
    if (isAdmin) {
      setCurrentPage("dashboard");
    } else if (isAdmin === false) {
      setCurrentPage("user");
    }
  }, [isAdmin]);

  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "oklch(0.10 0 0)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <span className="text-4xl font-black text-primary">J1</span>
          <div className="flex gap-2">
            <Skeleton
              className="h-2 w-8 rounded-full"
              style={{ backgroundColor: "oklch(0.22 0 0)" }}
            />
            <Skeleton
              className="h-2 w-5 rounded-full"
              style={{ backgroundColor: "oklch(0.22 0 0)" }}
            />
            <Skeleton
              className="h-2 w-8 rounded-full"
              style={{ backgroundColor: "oklch(0.22 0 0)" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toaster theme="dark" richColors />
      </>
    );
  }

  if (isAdminLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "oklch(0.10 0 0)" }}
        data-ocid="app.loading_state"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl font-black text-primary">J1</span>
          <p className="text-sm text-muted-foreground">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "oklch(0.10 0 0)" }}
    >
      <Navbar
        isAdmin={!!isAdmin}
        currentPage={currentPage}
        onNavigate={(page) => {
          // Only allow navigating to dashboard if admin
          if (page === "dashboard" && !isAdmin) return;
          setCurrentPage(page);
        }}
      />
      <div className="flex-1">
        {currentPage === "dashboard" && isAdmin ? (
          <AdminDashboard />
        ) : (
          <UserPanel />
        )}
      </div>
      <Footer />
      <Toaster theme="dark" richColors />
    </div>
  );
}
