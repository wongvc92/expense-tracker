import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/auth.tsx";
import { BrowserRouter } from "react-router";
import { Toaster } from "./components/ui/sonner.tsx";
import Navbar from "./components/common/Navbar.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import { AppSidebar } from "./components/common/AppSidebar.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-center" />
      <AuthProvider>
        <SidebarProvider>
          <BrowserRouter>
            {/* Root layout container */}
            <div className="flex min-h-screen w-full">
              <AppSidebar />

              <main className="flex-grow">
                <Navbar />
                <App />
              </main>
            </div>
          </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
