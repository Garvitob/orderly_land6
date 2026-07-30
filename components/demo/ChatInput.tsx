"use client";

import { useState } from "react";

/**
 * §8.4's handoff. Enter sends, the input is labelled, and the focus ring is
 * visible and never animated (§10.1).
 *
 * Empty or whitespace-only input does nothing and shows no error. Over 200
 * characters is accepted rather than rejected. All of that is handled by the
 * brain, not here: this component's only job is to hand a string over.
 */
export function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) return; // no error state, nothing happens
    onSend(text);
    setValue("");
  };

  return (
    <form className="chatinput" onSubmit={submit}>
      <label className="sr-only" htmlFor="demo-ask">
        Ask Orderly a question
      </label>
      <input
        id="demo-ask"
        className="chatinput-field"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
        placeholder="Ask for a recommendation"
        autoComplete="off"
      />
      <button type="submit" className="chatinput-send" aria-label="Send">
        <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true">
          <path
            d="M3 10h11M10 5l5 5-5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
