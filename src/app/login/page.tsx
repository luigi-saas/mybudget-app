"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { seedSmartBudgetTemplate } from "@/lib/firestore";
import BrandMark from "@/components/BrandMark";
import Modal from "@/components/Modal";

export default function LoginPage() {
  const { signInEmail, signUpEmail, signInGoogle } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);
  const [newUserId, setNewUserId] = useState<string | null>(null);
  const [income, setIncome] = useState("8500");
  const [incomeName, setIncomeName] = useState("Salary");
  const [budgetStyle, setBudgetStyle] = useState<"balanced" | "savings" | "flexible">("balanced");
  const [housingShare, setHousingShare] = useState<"25" | "30" | "35">("30");
  const [goalName, setGoalName] = useState("Emergency fund");

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
        router.push("/dashboard");
      } else {
        const result = await signUpEmail(email, password);
        setNewUserId(result.user.uid);
        setOnboardingStep(1);
        setShowOnboarding(true);
      }
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

  async function completeOnboarding() {
    if (!newUserId) {
      setOnboardingError("Something went wrong while setting up your account.");
      return;
    }

    setOnboardingError(null);
    setLoading(true);

    const shares =
      budgetStyle === "balanced"
        ? { fixedShare: 50, savingsShare: 20 }
        : budgetStyle === "savings"
        ? { fixedShare: 45, savingsShare: 25 }
        : { fixedShare: 55, savingsShare: 15 };

    try {
      await seedSmartBudgetTemplate(newUserId, Number(income || 8500), {
        fixedShare: shares.fixedShare,
        savingsShare: shares.savingsShare,
        housingBudget: Number(housingShare),
        goalName: goalName || "Emergency fund",
        incomeName: incomeName || "Salary",
      });
      setShowOnboarding(false);
      router.push("/dashboard");
    } catch (err) {
      setOnboardingError("Unable to create your budget. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function nextStep() {
    setOnboardingError(null);
    setOnboardingStep((current) => Math.min(current + 1, 3));
  }

  function prevStep() {
    setOnboardingError(null);
    setOnboardingStep((current) => Math.max(current - 1, 1));
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

      <Modal open={showOnboarding} onClose={() => setShowOnboarding(false)} title="Quick setup">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-bg px-4 py-3 text-sm text-muted">
            <span>Step {onboardingStep} of 3</span>
            <span className="font-semibold text-ink">
              {onboardingStep === 1 && "Income"}
              {onboardingStep === 2 && "Budget style"}
              {onboardingStep === 3 && "Goals & housing"}
            </span>
          </div>

          {onboardingStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-ink">
                Help us create a smart budget plan by telling us your monthly take-home income and how you label it.
              </p>
              <label className="block text-sm font-medium text-ink">Monthly income</label>
              <input
                type="number"
                min={0}
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-ink outline-none focus:border-primary"
              />
              <label className="block text-sm font-medium text-ink">Income label</label>
              <input
                type="text"
                value={incomeName}
                onChange={(e) => setIncomeName(e.target.value)}
                className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-ink outline-none focus:border-primary"
              />
            </div>
          )}

          {onboardingStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-ink">
                Pick the budgeting style that matches your financial goals. We’ll preset category shares for you.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { value: "balanced", title: "Balanced", description: "Stable spending with steady savings." },
                  { value: "savings", title: "Savings first", description: "Prioritize goals and build cash reserves." },
                  { value: "flexible", title: "Flexible", description: "More freedom with a relaxed planning rhythm." },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setBudgetStyle(option.value as typeof budgetStyle)}
                    className={`rounded-3xl border p-4 text-left transition ${
                      budgetStyle === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border bg-surface hover:border-primary"
                    }`}
                  >
                    <p className="text-sm font-semibold text-ink">{option.title}</p>
                    <p className="mt-2 text-xs text-muted">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {onboardingStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-ink">
                Finalize your starter plan with a savings goal and housing budget share.
              </p>
              <label className="block text-sm font-medium text-ink">Primary goal</label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-ink outline-none focus:border-primary"
              />
              <label className="block text-sm font-medium text-ink">Housing budget</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "25", label: "25%" },
                  { value: "30", label: "30%" },
                  { value: "35", label: "35%" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setHousingShare(option.value as typeof housingShare)}
                    className={`rounded-3xl border px-3 py-3 text-sm transition ${
                      housingShare === option.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-surface text-ink hover:border-primary"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {onboardingError && <p className="text-sm text-danger">{onboardingError}</p>}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={prevStep}
              disabled={onboardingStep === 1 || loading}
              className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50"
            >
              Back
            </button>
            {onboardingStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={completeOnboarding}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
              >
                {loading ? "Creating budget…" : "Create my plan"}
              </button>
            )}
          </div>
        </div>
      </Modal>
    </main>
  );
}
