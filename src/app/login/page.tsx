"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import BrandMark from "@/components/BrandMark";

export default function LoginPage() {
  const { signInEmail, signUpEmail, signInGoogle } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function getAuthMessage(err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";

    if (message.includes("auth/invalid-credential") || message.includes("auth/user-not-found") || message.includes("auth/wrong-password")) {
      return "These sign-in details don’t match an existing account. Try signing up or double-check your email and password.";
    }

    if (message.includes("auth/email-already-in-use")) {
      return "This email is already registered. Switch to Sign in and try again.";
    }

    if (message.includes("auth/operation-not-allowed")) {
      return "Email/password sign-in is not enabled in Firebase. Turn it on in the Firebase console for this project.";
    }

    return message;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        await signInEmail(email, password);
      } else {
        await signUpEmail(email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      const authMessage = getAuthMessage(err);
      setError(authMessage);
      if (mode === "signin" && authMessage.includes("signing up")) {
        setMode("signup");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      await signInGoogle();
      router.push("/dashboard");
    } catch (err) {
      setError(getAuthMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-card border border-border">
        <div className="mb-6 flex items-center gap-2">
          <BrandMark size="sm" />
          <div>
            <p className="text-lg font-semibold text-ink">Budgetly</p>
            <p className="text-xs text-muted">Money planning that feels calm</p>
          </div>
        </div>

        <h1 className="text-xl font-bold text-ink">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {mode === "signin"
            ? "Pick up where you left off and keep your plan moving."
            : "Start tracking your budget in minutes with a calmer, clearer workflow."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full rounded-lg border border-border py-2.5 text-sm font-semibold text-ink hover:bg-bg disabled:opacity-60"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-muted">
          {mode === "signin" ? "No account yet?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setError(null);
              setMode(mode === "signin" ? "signup" : "signin");
            }}
            className="font-semibold text-primary"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
        <p className="mt-4 text-center text-xs text-muted">
          <Link href="/" className="hover:text-primary">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
