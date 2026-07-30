"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

type Field = "name" | "restaurant" | "locations" | "pos" | "email";

const POS_OPTIONS = ["Toast", "Square", "Clover", "Shift4", "Other"] as const;

/** §8.14's error strings, in the host's voice. Verbatim. */
const ERRORS: Record<Field, string> = {
  name: "What should we call you?",
  restaurant: "Which restaurant are we setting up?",
  locations: "How many locations? Even a rough number helps.",
  pos: "Which POS are you on? It changes how we set you up.",
  email: "We need a work email to route your demo.",
};

/**
 * §8.14 LAST CALL. Answers: how do I start, and how long does it take?
 *
 * Full-bleed orange, the second and final orange moment. Every label and every
 * error string is INK, per the contrast rule: white on orange is only legal at
 * 18px bold and above, and these are not.
 *
 * No backend. preventDefault, validate, set success state. It posts nowhere and
 * fakes no network delay (§8.14, §14.3).
 */
export function LastCall() {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [done, setDone] = useState(false);
  const form = useRef<HTMLFormElement | null>(null);

  const validate = (data: FormData): Partial<Record<Field, string>> => {
    const next: Partial<Record<Field, string>> = {};
    const get = (k: Field) => String(data.get(k) ?? "").trim();

    if (!get("name")) next.name = ERRORS.name;
    if (!get("restaurant")) next.restaurant = ERRORS.restaurant;

    const loc = Number(get("locations"));
    if (!get("locations") || Number.isNaN(loc) || loc < 1)
      next.locations = ERRORS.locations;

    if (!get("pos")) next.pos = ERRORS.pos;

    const email = get("email");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = ERRORS.email;

    return next;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) return;

    setDone(true);
    toast.success("Demo requested", {
      description: "We will be in touch about Orderly.",
    });
  };

  // Typed against the elements it is actually attached to. The form is read off
  // the field rather than the event target, which is what makes one handler
  // serve both inputs and the select.
  const onBlurField =
    (name: Field) => (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const formEl = e.currentTarget.form;
      if (!formEl) return;
      const found = validate(new FormData(formEl));
      setErrors((prev) => ({ ...prev, [name]: found[name] }));
    };

  return (
    <section id="lastcall" className="lastcall">
      <div className="lastcall-inner">
        <div className="lastcall-copy">
          <h2 className="t-display lastcall-head">
            Ready to perfect your dine-in experience?
          </h2>
          <p className="t-subhead lastcall-sub">
            Let&rsquo;s make every table faster, calmer and easier to serve.
          </p>

          <div className="lastcall-figs">
            <div>
              <p className="t-figure lastcall-fig">
                <span className="tnum">24/7</span>
              </p>
              <p className="lastcall-figcap">support ready for you</p>
            </div>
            <div>
              <p className="t-figure lastcall-fig">Under 1 week</p>
              <p className="lastcall-figcap">implementation</p>
            </div>
          </div>
        </div>

        <form className="lcform" ref={form} onSubmit={onSubmit} noValidate>
          {(
            [
              { id: "name", label: "Name", type: "text" },
              { id: "restaurant", label: "Restaurant name", type: "text" },
              { id: "locations", label: "Number of locations", type: "number" },
            ] as const
          ).map((f) => (
            <div key={f.id} className="lcfield">
              <label className="t-label lclabel" htmlFor={f.id}>
                {f.label}
              </label>
              <input
                id={f.id}
                name={f.id}
                type={f.type}
                min={f.type === "number" ? 1 : undefined}
                className="lcinput"
                aria-invalid={Boolean(errors[f.id])}
                aria-describedby={errors[f.id] ? `${f.id}-err` : undefined}
                onBlur={onBlurField(f.id)}
              />
              {errors[f.id] ? (
                <p id={`${f.id}-err`} className="lcerr t-label">
                  {errors[f.id]}
                </p>
              ) : null}
            </div>
          ))}

          <div className="lcfield">
            <label className="t-label lclabel" htmlFor="pos">
              Current POS
            </label>
            <select
              id="pos"
              name="pos"
              className="lcinput"
              defaultValue=""
              aria-invalid={Boolean(errors.pos)}
              aria-describedby={errors.pos ? "pos-err" : undefined}
              onBlur={onBlurField("pos")}
            >
              <option value="">Choose one</option>
              {POS_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errors.pos ? (
              <p id="pos-err" className="lcerr t-label">
                {errors.pos}
              </p>
            ) : null}
          </div>

          <div className="lcfield">
            <label className="t-label lclabel" htmlFor="email">
              Work email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="lcinput"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-err" : undefined}
              onBlur={onBlurField("email")}
            />
            {errors.email ? (
              <p id="email-err" className="lcerr t-label">
                {errors.email}
              </p>
            ) : null}
          </div>

          <button type="submit" className={`lcsubmit ${done ? "is-done" : ""}`}>
            {done ? (
              <span className="lcsubmit-done">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    d="M4 12.8 L9.4 18 L20 6.6"
                    fill="none"
                    stroke="var(--basil)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Requested
              </span>
            ) : (
              "Get a demo"
            )}
          </button>

          {done ? (
            <p className="t-label lcdone">Demo requested. We will be in touch.</p>
          ) : (
            <p className="lcmicro">
              By submitting, you agree to be contacted about Orderly.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
