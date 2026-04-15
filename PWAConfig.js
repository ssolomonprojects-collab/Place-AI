// ─────────────────────────────────────────────────────────────────────────────
// FILE 1: vite.config.js  (replace your existing vite.config.js)
// ─────────────────────────────────────────────────────────────────────────────
// npm install -D vite-plugin-pwa

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "PlaceAI — Smart Placement Prep",
        short_name: "PlaceAI",
        description: "AI-powered placement preparation for engineering students",
        theme_color: "#06061a",
        background_color: "#06061a",
        display: "standalone",
        start_url: "/dashboard",
        orientation: "portrait",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/logo\.clearbit\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "company-logos",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
});


// ─────────────────────────────────────────────────────────────────────────────
// FILE 2: index.html  — add these tags inside <head>
// ─────────────────────────────────────────────────────────────────────────────
/*
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PlaceAI — Smart Placement Prep</title>

    <!-- PWA: Manifest -->
    <link rel="manifest" href="/manifest.webmanifest" />

    <!-- iOS: Add to Home Screen -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="PlaceAI" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <!-- Theme color (Android Chrome toolbar + iOS Safari) -->
    <meta name="theme-color" content="#06061a" />

    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
*/


// ─────────────────────────────────────────────────────────────────────────────
// FILE 3: src/lib/supabase.js
// ─────────────────────────────────────────────────────────────────────────────
/*
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
*/


// ─────────────────────────────────────────────────────────────────────────────
// FILE 4: src/components/ProtectedRoute.jsx
// ─────────────────────────────────────────────────────────────────────────────
/*
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#06061a" }}>
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return session ? children : <Navigate to="/login" replace />;
}
*/


// ─────────────────────────────────────────────────────────────────────────────
// FILE 5: src/main.jsx  — App routing skeleton
// ─────────────────────────────────────────────────────────────────────────────
/*
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CompaniesPage from "./pages/Companies";
import ProgressPage from "./pages/Progress";
import RoadmapPage from "./pages/Roadmap";
import ChatPage from "./pages/Chat";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/companies" element={<ProtectedRoute><CompaniesPage /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
*/
