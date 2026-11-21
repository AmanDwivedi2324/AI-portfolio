import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AuthProvider from "../contexts/AuthProvider";

/** Wraps every /admin route: auth session + keeps the CRM out of search engines. */
export default function AdminRoot() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.append(meta);
    const previousTitle = document.title;
    document.title = "Portfolio CRM";
    return () => {
      meta.remove();
      document.title = previousTitle;
    };
  }, []);

  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
