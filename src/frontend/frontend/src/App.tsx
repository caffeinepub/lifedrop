import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { AmbientBackground } from "./components/AmbientBackground";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { RegisteredUsersSidebar } from "./components/RegisteredUsersSidebar";
import { SplashScreen } from "./components/SplashScreen";
import { AppProvider } from "./contexts/AppContext";
import { BlogPage } from "./pages/BlogPage";
import { BloodRequestsPage } from "./pages/BloodRequestsPage";
import { CampsPage } from "./pages/CampsPage";
import { DonorIdPage } from "./pages/DonorIdPage";
import { EmergencyRequestPage } from "./pages/EmergencyRequestPage";
import { HomePage } from "./pages/HomePage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { LoginPage } from "./pages/LoginPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SearchPage } from "./pages/SearchPage";
import { AdminDashboard } from "./pages/dashboards/AdminDashboard";
import { BloodBankDashboard } from "./pages/dashboards/BloodBankDashboard";
import { DonorDashboard } from "./pages/dashboards/DonorDashboard";
import { HospitalDashboard } from "./pages/dashboards/HospitalDashboard";
import { NGODashboard } from "./pages/dashboards/NGODashboard";
import { PatientDashboard } from "./pages/dashboards/PatientDashboard";
import { VolunteerDashboard } from "./pages/dashboards/VolunteerDashboard";

// ─── App Shell with sidebar ─────────────────────────────────
function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AppProvider>
      <AmbientBackground />
      <div className="min-h-screen flex flex-col relative z-10">
        <Navbar />
        <div className="flex flex-1 overflow-hidden relative">
          {/* Main content */}
          <div
            className="flex-1 overflow-y-auto min-w-0 transition-all duration-300"
            style={{ minHeight: "calc(100vh - 4rem)" }}
          >
            <Outlet />
            <Footer />
          </div>

          {/* Desktop sidebar */}
          <div
            className="hidden lg:flex flex-col transition-all duration-300 flex-shrink-0 relative"
            style={{
              width: sidebarOpen ? "260px" : "0px",
              overflow: "hidden",
            }}
          >
            {sidebarOpen && (
              <div
                className="h-full w-[260px] flex flex-col sticky top-16"
                style={{ height: "calc(100vh - 4rem)" }}
              >
                <RegisteredUsersSidebar />
              </div>
            )}
          </div>

          {/* Sidebar toggle button (desktop) */}
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="hidden lg:flex items-center justify-center fixed right-0 top-1/2 -translate-y-1/2 z-50 w-5 h-12 rounded-l-lg transition-all hover:opacity-100 opacity-60"
            style={{
              backgroundColor: "oklch(0.13 0.005 20)",
              border: "1px solid oklch(var(--neon-red) / 0.2)",
              borderRight: "none",
              right: sidebarOpen ? "260px" : "0px",
            }}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            data-ocid="sidebar.toggle"
          >
            {sidebarOpen ? (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronLeft className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.13 0.005 20)",
            border: "1px solid oklch(0.22 0.01 20)",
            color: "oklch(0.95 0.01 20)",
          },
        }}
      />
    </AppProvider>
  );
}

// Root layout
const rootRoute = createRootRoute({
  component: AppShell,
});

// Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});
const requestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/request",
  component: EmergencyRequestPage,
});
const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: SearchPage,
});
const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: BlogPage,
});
const campsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/camps",
  component: CampsPage,
});
const bloodRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blood-requests",
  component: BloodRequestsPage,
});
const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: LeaderboardPage,
});
const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: NotificationsPage,
});
const donorIdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/donor-id/$id",
  component: DonorIdPage,
});
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardRedirect,
});
const donorDashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/donor",
  component: DonorDashboard,
});
const patientDashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/patient",
  component: PatientDashboard,
});
const hospitalDashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/hospital",
  component: HospitalDashboard,
});
const bloodbankDashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/bloodbank",
  component: BloodBankDashboard,
});
const ngoDashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/ngo",
  component: NGODashboard,
});
const volunteerDashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/volunteer",
  component: VolunteerDashboard,
});
const adminDashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/admin",
  component: AdminDashboard,
});

function DashboardRedirect() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <p className="text-muted-foreground">Redirecting to your dashboard...</p>
    </div>
  );
}

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  requestRoute,
  searchRoute,
  blogRoute,
  campsRoute,
  bloodRequestsRoute,
  leaderboardRoute,
  notificationsRoute,
  donorIdRoute,
  dashboardRoute,
  donorDashRoute,
  patientDashRoute,
  hospitalDashRoute,
  bloodbankDashRoute,
  ngoDashRoute,
  volunteerDashRoute,
  adminDashRoute,
]);

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-4">🩸</div>
      <h1 className="font-display text-3xl font-black mb-4">Page Not Found</h1>
      <a href="/" className="text-primary underline">
        Back to Home
      </a>
    </div>
  ),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return <RouterProvider router={router} />;
}
