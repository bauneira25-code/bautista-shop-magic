import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl gradient-text">404</h1>
        <p className="mt-4 text-muted-foreground">No encontramos esa página.</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#ff5722" },
      { title: "NEIBA — Marketplace futurista" },
      { name: "description", content: "Compras grupales, mayoristas y productos personalizables con IA." },
      { property: "og:site_name", content: "NEIBA" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "NEIBA — Marketplace futurista" },
      { property: "og:description", content: "Compras grupales, mayoristas y productos personalizables con IA." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors position="top-center" theme="light" />
    </QueryClientProvider>
  );
}
