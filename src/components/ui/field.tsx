import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string | number;
  error?: string;
  required?: boolean;
};

export function InputField({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  error,
  required,
}: FieldProps) {
  return (
    <label className="space-y-2 text-sm text-slate-700">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className={cn(
          "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition",
          error ? "border-red-300" : "border-slate-200 focus:border-sky-500",
        )}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

type TextareaProps = {
  label: string;
  name: string;
  rows?: number;
  defaultValue?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
};

export function TextareaField({
  label,
  name,
  rows = 5,
  defaultValue,
  error,
  placeholder,
  required,
}: TextareaProps) {
  return (
    <label className="space-y-2 text-sm text-slate-700">
      <span className="font-medium">{label}</span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={cn(
          "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition",
          error ? "border-red-300" : "border-slate-200 focus:border-sky-500",
        )}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
