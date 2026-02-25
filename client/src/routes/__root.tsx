import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Nav from "../components/nav/Nav";
import Footer from "../components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
const client = new QueryClient();
const RootLayout = () => (
  <QueryClientProvider client={client}>
    <Nav />
    <Toaster />
    <main className="min-h-[calc(100vh-21rem)]">
      <Outlet />
    </main>
    <Footer />
    <TanStackRouterDevtools />
  </QueryClientProvider>
);

export const Route = createRootRoute({ component: RootLayout });
