"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // The Supabase client automatically processes the URL parameters (like code or access_token)
    // We listen for the SIGNED_IN event to trigger the redirect to the dashboard.
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || session) {
        router.push("/dashboard");
      }
    });

    // Fallback: Check if session is already established
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <h4>Verifying your account...</h4>
      <p className="text-muted">You will be redirected shortly.</p>
    </div>
  );
}
