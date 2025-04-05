import { RouterProvider } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Toaster } from "sonner";

import { router } from "./routes";
import { ThemeProvider } from "./components/theme/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";

export function App() {
  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="LucasFood-theme">
        <Helmet titleTemplate="%s | Lucas Food" />

        <Toaster richColors />

        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}
