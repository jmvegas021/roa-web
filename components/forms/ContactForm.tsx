"use client";

import { useState, useTransition } from "react";
import { createLead } from "@/lib/idx/actions";

interface ContactFormProps {
  listingId?: string;
  propertyAddress?: string;
  submitLabel?: string;
}

const fieldClassName =
  "mt-2 w-full border border-stone-700 bg-stone-950 px-4 py-3.5 text-base text-stone-50 placeholder:text-stone-400 transition duration-200 focus:border-gold focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export function ContactForm({
  listingId,
  propertyAddress,
  submitLabel = "Send inquiry",
}: ContactFormProps) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null
  );

  function handleSubmit(formData: FormData) {
    setResult(null);
    startTransition(async () => {
      const response = await createLead(formData);
      setResult(response);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5" noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      {listingId ? (
        <input type="hidden" name="listingId" value={listingId} />
      ) : null}
      {propertyAddress ? (
        <input type="hidden" name="propertyAddress" value={propertyAddress} />
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="firstName"
          name="firstName"
          label="First name"
          required
          autoComplete="given-name"
        />
        <Field
          id="lastName"
          name="lastName"
          label="Last name"
          required
          autoComplete="family-name"
        />
      </div>
      <Field
        id="email"
        name="email"
        label="Email"
        type="email"
        required
        autoComplete="email"
      />
      <Field
        id="phone"
        name="phone"
        label="Phone"
        type="tel"
        autoComplete="tel"
      />
      <div>
        <label
          htmlFor="message"
          className="block text-xs uppercase tracking-[0.16em] text-stone-400"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={fieldClassName}
          placeholder="Tell us what you’re looking for…"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center bg-gold px-6 py-3 text-xs uppercase tracking-[0.2em] text-stone-950 transition duration-200 hover:bg-accent-muted disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Sending…" : submitLabel}
      </button>

      {result ? (
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${result.ok ? "text-gold" : "text-red-300"}`}
        >
          {result.message}
        </p>
      ) : null}
    </form>
  );
}

interface FieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}

function Field({
  id,
  name,
  label,
  type = "text",
  required,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs uppercase tracking-[0.16em] text-stone-400"
      >
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className={fieldClassName}
      />
    </div>
  );
}
