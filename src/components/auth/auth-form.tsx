"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction, registerAction } from "@/actions/auth";
import { initialActionState } from "@/actions/types";
import { FormMessage } from "@/components/ui/form-message";
import { InputField } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction] = useActionState(action, initialActionState);

  useEffect(() => {
    if (state.status === "success" && state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [router, state.redirectTo, state.status]);

  return (
    <form action={formAction} className="space-y-5 rounded-[28px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/70 backdrop-blur">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-950">
          {mode === "login" ? "Welcome back" : "Create your workspace"}
        </h1>
        <p className="text-sm text-slate-600">
          {mode === "login"
            ? "Sign in to review assignments, submissions, and AI evaluation results."
            : "Spin up a role-based AutoGradeX account in one step."}
        </p>
      </div>

      {mode === "register" ? (
        <InputField
          label="Full name"
          name="name"
          placeholder="Shreya Chakraborty"
          error={state.fieldErrors?.name?.[0]}
          required
        />
      ) : null}

      <InputField
        label="Email address"
        name="email"
        type="email"
        placeholder="name@college.edu"
        error={state.fieldErrors?.email?.[0]}
        required
      />

      <InputField
        label="Password"
        name="password"
        type="password"
        placeholder="Minimum 8 characters"
        error={state.fieldErrors?.password?.[0]}
        required
      />

      {mode === "register" ? (
        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-medium">Role</span>
          <select
            name="role"
            defaultValue="STUDENT"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm"
          >
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Admin</option>
          </select>
          {state.fieldErrors?.role?.[0] ? (
            <span className="text-xs text-red-600">{state.fieldErrors.role[0]}</span>
          ) : null}
        </label>
      ) : null}

      <FormMessage state={state} />

      <SubmitButton className="w-full">
        {mode === "login" ? "Sign in" : "Create account"}
      </SubmitButton>

      <p className="text-sm text-slate-600">
        {mode === "login" ? "Need an account? " : "Already registered? "}
        <Link className="font-semibold text-sky-700" href={mode === "login" ? "/auth/register" : "/auth/login"}>
          {mode === "login" ? "Create one" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
