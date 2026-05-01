"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Automatically sign out if they visit the login/signup page
    supabase.auth.signOut();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setError("Check your email for the confirmation link.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">{isLogin ? "Sign In" : "Sign Up"}</h2>
              
              {error && (
                <div className={`alert ${error.includes("Check your email") ? "alert-success" : "alert-danger"}`} role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? "Loading..." : (isLogin ? "Sign In" : "Sign Up")}
                </button>
              </form>
              
              <div className="text-center">
                <button 
                  className="btn btn-link text-decoration-none" 
                  onClick={() => setIsLogin(!isLogin)}
                  type="button"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
