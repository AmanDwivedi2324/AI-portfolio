import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PortfolioLayout from "./layouts/PortfolioLayout";
import Home from "./pages/Home";
import { ADMIN_COLLECTIONS } from "./constants/adminCollections";

// The CRM is loaded on demand, so visitors never download it.
const AdminRoot = lazy(() => import("./layouts/AdminRoot"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const LoginPage = lazy(() => import("./pages/admin/LoginPage"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const ProfilePage = lazy(() => import("./pages/admin/ProfilePage"));
const CollectionPage = lazy(() => import("./pages/admin/CollectionPage"));
const MessagesPage = lazy(() => import("./pages/admin/MessagesPage"));
const AccountPage = lazy(() => import("./pages/admin/AccountPage"));

const toastStyle = {
  background: "#111113",
  color: "#f5f5f4",
  border: "1px solid rgba(255,255,255,0.12)",
  fontSize: "14px",
};

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" toastOptions={{ style: toastStyle }} />
      <Suspense fallback={<div className="min-h-svh bg-ink" />}>
        <Routes>
          <Route path="/" element={<PortfolioLayout />}>
            <Route index element={<Home />} />
          </Route>

          <Route path="/admin" element={<AdminRoot />}>
            <Route path="login" element={<LoginPage />} />
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              {Object.entries(ADMIN_COLLECTIONS).map(([key, config]) => (
                <Route key={key} path={key} element={<CollectionPage key={key} config={config} />} />
              ))}
              <Route path="messages" element={<MessagesPage />} />
              <Route path="account" element={<AccountPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
