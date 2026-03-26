import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, registerSchema } from "@/validations";
import type { LoginInput, RegisterInput } from "@/validations";
import axios from "axios";

// ── Password strength indicator ───────────────────────────────────────────────
function PasswordStrength({ value }: { value: string }) {
  if (!value) return null;
  const hasLength = value.length >= 8;
  const hasNumber = /\d/.test(value);

  let label: string;
  let color: string;
  let width: string;

  if (!hasLength) {
    label = "Weak";
    color = "bg-red-500";
    width = "w-1/3";
  } else if (!hasNumber) {
    label = "Medium";
    color = "bg-yellow-500";
    width = "w-2/3";
  } else {
    label = "Strong";
    color = "bg-green-500";
    width = "w-full";
  }

  return (
    <div className="mt-1.5">
      <div className="h-1 w-full rounded-full bg-white/10">
        <div
          className={`h-1 rounded-full transition-all duration-300 ${color} ${width}`}
        />
      </div>
      <p className="mt-1 text-xs text-white/40">{label}</p>
    </div>
  );
}

// ── Field error ───────────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-400">{message}</p>;
}

// ── Sign In Form ──────────────────────────────────────────────────────────────
function SignInForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setServerError("");
    try {
      await login(data);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as { message?: string })?.message;
        setServerError(typeof msg === "string" ? msg : "Invalid credentials.");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-4">
        <label className="mb-1.5 block text-sm text-white/60">Email</label>
        <input
          type="email"
          className="input-dark"
          placeholder="you@example.com"
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div className="mb-6">
        <label className="mb-1.5 block text-sm text-white/60">Password</label>
        <input
          type="password"
          className="input-dark"
          placeholder="••••••••"
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>

      {serverError && (
        <p className="mb-4 text-sm text-red-400">{serverError}</p>
      )}

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

// ── Sign Up Form ──────────────────────────────────────────────────────────────
function SignUpForm() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    setServerError("");
    try {
      await registerUser(data);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as { message?: string })?.message;
        setServerError(typeof msg === "string" ? msg : "Registration failed.");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-4">
        <label className="mb-1.5 block text-sm text-white/60">Name</label>
        <input
          type="text"
          className="input-dark"
          placeholder="Your name"
          {...register("name")}
        />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-sm text-white/60">Email</label>
        <input
          type="email"
          className="input-dark"
          placeholder="you@example.com"
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div className="mb-6">
        <label className="mb-1.5 block text-sm text-white/60">Password</label>
        <input
          type="password"
          className="input-dark"
          placeholder="••••••••"
          {...register("password", {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setPasswordValue(e.target.value),
          })}
        />
        <FieldError message={errors.password?.message} />
        <PasswordStrength value={passwordValue} />
      </div>

      {serverError && (
        <p className="mb-4 text-sm text-red-400">{serverError}</p>
      )}

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}

// ── AuthPage ──────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass w-full max-w-[420px] rounded-3xl p-8">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600">
            <Zap className="h-6 w-6 text-white" fill="currentColor" />
          </div>
          <span className="gradient-text text-2xl font-bold">Featurize</span>
        </div>

        {/* Tab switcher */}
        <div className="mb-8 flex rounded-xl bg-white/[0.04] p-1">
          <button
            type="button"
            onClick={() => setTab("signin")}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-150 ${
              tab === "signin"
                ? "bg-accent text-white shadow"
                : "text-white/50 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-150 ${
              tab === "signup"
                ? "bg-accent text-white shadow"
                : "text-white/50 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {tab === "signin" ? (
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }}
            >
              <SignInForm />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.18 }}
            >
              <SignUpForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
