import { RouterProvider } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Toaster } from "sonner";

import { router } from "./routes";
import { ThemeProvider } from "./components/theme/theme-provider";

export function App() {
  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="LucasFood-theme">
        <Helmet titleTemplate="%s | Lucas Food" />

        <Toaster richColors />

        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}
