"use client";

import { useState, useTransition, type FormEvent } from "react";
import { createLead } from "@/lib/idx/actions";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { ParallaxBand } from "@/components/motion/ParallaxBand";
import { HERO_MEDIA } from "@/lib/content/hero-media";

const fieldClassName =
  "mt-2 w-full border border-stone-700 bg-stone-950/80 px-4 py-3.5 text-base text-stone-50 placeholder:text-stone-400 transition duration-200 focus:border-gold focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

/**
 * Home valuation lead — expert follow-up, not an instant AVM.
 * Reuses createLead with propertyAddress + message prefix.
 */
export function HomeValuation() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const address = String(formData.get("propertyAddress") ?? "").trim();
    const existingMessage = String(formData.get("message") ?? "").trim();
    formData.set(
      "message",
      existingMessage
        ? `Home valuation request: ${address}. ${existingMessage}`
        : `Home valuation request: ${address}`
    );

    setResult(null);
    startTransition(async () => {
      const response = await createLead(formData);
      setResult(response);
      if (response.ok) form.reset();
    });
  }

  return (
    <ParallaxBand
      imageSrc={HERO_MEDIA.posterSrc}
      imageAlt=""
      intensity={40}
      overlayClassName="bg-gradient-to-br from-stone-950/95 via-stone-950/88 to-roa-blue/40"
    >
      <div id="valuation" className="scroll-mt-28 px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-start lg:gap-20">
          <RevealOnScroll>
            <p className="text-xs uppercase tracking-[0.24em] text-gold">
              Sellers
            </p>
            <h2 className="font-display mt-4 text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.05] text-stone-50 text-balance">
              How much is your home worth?
            </h2>
            <p className="mt-5 max-w-md text-base leading-[1.7] text-stone-300">
              Request a confidential valuation from the Office of Kevin Shoun.
              We follow up with market context tailored to your address — not an
              automated estimate.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delayMs={80}>
            <form
              onSubmit={handleSubmit}
              className="space-y-5 border border-stone-700/80 bg-stone-950/70 p-6 backdrop-blur-sm sm:p-8"
              noValidate
            >
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <Field
                id="valuation-address"
                name="propertyAddress"
                label="Property address"
                required
                autoComplete="street-address"
                placeholder="Street, city, ZIP"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="valuation-firstName"
                  name="firstName"
                  label="First name"
                  required
                  autoComplete="given-name"
                />
                <Field
                  id="valuation-lastName"
                  name="lastName"
                  label="Last name"
                  required
                  autoComplete="family-name"
                />
              </div>

              <Field
                id="valuation-email"
                name="email"
                label="Email"
                type="email"
                required
                autoComplete="email"
              />
              <Field
                id="valuation-phone"
                name="phone"
                label="Phone"
                type="tel"
                autoComplete="tel"
              />

              <div>
                <label
                  htmlFor="valuation-message"
                  className="block text-xs uppercase tracking-[0.16em] text-stone-400"
                >
                  Notes{" "}
                  <span className="normal-case tracking-normal text-stone-400/70">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="valuation-message"
                  name="message"
                  rows={3}
                  className={fieldClassName}
                  placeholder="Timing, condition, or questions…"
                />
              </div>

              <p className="text-xs leading-relaxed text-stone-400">
                By submitting, you agree to be contacted by the Office of Kevin
                Shoun regarding your valuation request. We never sell your
                information.
              </p>

              <button
                type="submit"
                disabled={pending}
                className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center bg-gold px-6 py-3 text-xs uppercase tracking-[0.2em] text-stone-950 transition duration-200 hover:bg-accent-muted disabled:cursor-wait disabled:opacity-70"
              >
                {pending ? "Sending…" : "Request valuation"}
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
          </RevealOnScroll>
        </div>
      </div>
    </ParallaxBand>
  );
}

interface FieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}

function Field({
  id,
  name,
  label,
  type = "text",
  required,
  autoComplete,
  placeholder,
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
        placeholder={placeholder}
        className={fieldClassName}
      />
    </div>
  );
}
