import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AppProvider } from "./contexts/AppContext";
import { BlogPage } from "./pages/BlogPage";
import { DonorIdPage } from "./pages/DonorIdPage";
import { EmergencyRequestPage } from "./pages/EmergencyRequestPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SearchPage } from "./pages/SearchPage";
import { AdminDashboard } from "./pages/dashboards/AdminDashboard";
import { BloodBankDashboard } from "./pages/dashboards/BloodBankDashboard";
import { DonorDashboard } from "./pages/dashboards/DonorDashboard";
import { HospitalDashboard } from "./pages/dashboards/HospitalDashboard";
import { NGODashboard } from "./pages/dashboards/NGODashboard";
import { PatientDashboard } from "./pages/dashboards/PatientDashboard";
import { VolunteerDashboard } from "./pages/dashboards/VolunteerDashboard";

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <AppProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
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
  ),
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
  // Placeholder - users should navigate to role-specific paths
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <p className="text-muted-foreground">Redirecting to your dashboard...</p>
    </div>
  );
}

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  requestRoute,
  searchRoute,
  blogRoute,
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
  return <RouterProvider router={router} />;
}
