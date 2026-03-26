import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";
import { AdminDashboard } from "./pages/AdminDashboard";
import { LoginPage } from "./pages/LoginPage";
import { UserPanel } from "./pages/UserPanel";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();

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
      <Navbar isAdmin={!!isAdmin} />
      <div className="flex-1">
        {isAdmin ? (
          <Tabs defaultValue="admin" className="w-full">
            <div
              className="border-b border-border"
              style={{ backgroundColor: "oklch(0.13 0 0)" }}
            >
              <div className="max-w-6xl mx-auto px-4">
                <TabsList className="h-auto bg-transparent p-0 gap-0 rounded-none">
                  <TabsTrigger
                    value="admin"
                    data-ocid="nav.admin_panel.tab"
                    className="relative px-5 py-3 text-sm font-semibold rounded-none border-b-2 border-transparent bg-transparent text-muted-foreground transition-colors data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Admin Panel
                  </TabsTrigger>
                  <TabsTrigger
                    value="user"
                    data-ocid="nav.user_panel.tab"
                    className="relative px-5 py-3 text-sm font-semibold rounded-none border-b-2 border-transparent bg-transparent text-muted-foreground transition-colors data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    User Panel
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            <TabsContent value="admin" className="mt-0">
              <AdminDashboard />
            </TabsContent>
            <TabsContent value="user" className="mt-0">
              <UserPanel />
            </TabsContent>
          </Tabs>
        ) : (
          <UserPanel />
        )}
      </div>
      <Footer />
      <Toaster theme="dark" richColors />
    </div>
  );
}
