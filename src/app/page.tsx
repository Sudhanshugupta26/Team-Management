"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        router.push("/dashboard");
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) return null;

  return (
    <div className="container mt-5 text-center">
      <h1 className="display-4 fw-bold">Welcome to TeamSync</h1>
      <p className="lead text-muted mb-5">
        Manage your projects, assign tasks, and track team progress all in one place.
      </p>
      <div className="d-flex justify-content-center gap-3">
        <Link href="/auth" className="btn btn-primary btn-lg">
          Get Started
        </Link>
      </div>
    </div>
  );
}
