// app/login/SubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="
        w-full bg-[#1E3A8A] text-white py-2.5 rounded-lg font-semibold
        shadow cursor-pointer
        hover:bg-[#172E6B] transition-all duration-200
        disabled:opacity-60
      "
        >
            {pending ? "Sending code..." : "Continue"}
        </button>
    );
}
