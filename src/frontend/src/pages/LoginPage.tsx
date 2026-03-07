import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * /login now redirects to /register since there is no login/logout concept.
 */
export function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    void navigate({ to: "/register", replace: true });
  }, [navigate]);

  return null;
}
