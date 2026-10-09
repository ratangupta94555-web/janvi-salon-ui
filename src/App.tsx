import React, { useEffect, useState } from "react";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminLogin from "./components/Admin/AdminLogin";
import PublicLayout from "./components/layouts/PublicLayout";
import LandingPage from "./pages/LandingPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";

const ADMIN_SESSION_KEY = "janvi-admin-session";

function App() {
  const normalizePath = (pathname: string) => {
    const normalized = pathname.replace(/\/+$/, "") || "/";
    return normalized === "/admin" ? "/admin/dashboard" : normalized;
  };
  const [path, setPath] = useState(() =>
    normalizePath(window.location.pathname),
  );
  const [adminAuthenticated, setAdminAuthenticated] = useState(
    () => window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "active",
  );
  const [requestedAdminPath, setRequestedAdminPath] = useState(() =>
    pathIsAdmin(window.location.pathname)
      ? normalizeInitialAdminPath(window.location.pathname)
      : "/admin/dashboard",
  );
  const authenticateAdmin = () => {
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, "active");
    setAdminAuthenticated(true);
    const target = requestedAdminPath;
    window.history.replaceState({}, "", target);
    setPath(target);
  };
  const logoutAdmin = () => {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminAuthenticated(false);
    window.history.replaceState({}, "", "/login");
    setPath("/login");
  };
  useEffect(() => {
    const onPop = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    if (pathIsAdmin(path) && !adminAuthenticated) {
      setRequestedAdminPath(path);
      window.history.replaceState({}, "", "/login");
      setPath("/login");
      return;
    }
    if (path === "/login" && adminAuthenticated) {
      const target = requestedAdminPath;
      window.history.replaceState({}, "", target);
      setPath(target);
    }
  }, [path, adminAuthenticated, requestedAdminPath]);
  const navigate = (to: string) => {
    const normalized = normalizePath(to);
    if (pathIsAdmin(normalized) && !adminAuthenticated) {
      setRequestedAdminPath(normalized);
      window.history.pushState({}, "", "/login");
      setPath("/login");
      return;
    }
    window.history.pushState({}, "", normalized);
    setPath(normalized);
  };
  if (path === "/login") {
    return (
      <AdminLogin
        navigate={navigate}
        onAuthenticated={authenticateAdmin}
      />
    );
  }
  if (pathIsAdmin(path)) {
    return (
      <AdminDashboard
        pathname={path}
        onLogout={logoutAdmin}
        onNavigate={navigate}
      />
    );
  }
  const pageProps = { navigate };
  let page: React.ReactNode;
  switch (path) {
    case "/appointments":
      page = <AppointmentsPage {...pageProps} />;
      break;
    case "/about":
      page = <AboutPage {...pageProps} />;
      break;
    case "/services":
      page = <ServicesPage {...pageProps} />;
      break;
    case "/gallery":
      page = <GalleryPage {...pageProps} />;
      break;
    case "/contact":
      page = <ContactPage {...pageProps} />;
      break;
    case "/faq":
      page = <FAQPage {...pageProps} />;
      break;
    default:
      page = <LandingPage {...pageProps} />;
  }
  return (
    <PublicLayout path={path} navigate={navigate}>
      {page}
    </PublicLayout>
  );
}

function pathIsAdmin(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function normalizeInitialAdminPath(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return normalized === "/admin" ? "/admin/dashboard" : normalized;
}

export default App;
