import { useEffect, useState } from "react";

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "min" | "max"> {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}

/** Number input that lets the user freely type any digits.
 *  Empty/invalid is allowed while editing; on blur it clamps to [min,max] (defaults to min). */
export function QtyInput({ value, onChange, min = 1, max, className, ...rest }: Props) {
  const [text, setText] = useState(String(value));

  // Sync from outside (e.g. +/- buttons) only when not actively editing
  useEffect(() => {
    setText(String(value));
  }, [value]);

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={text}
      onFocus={(e) => e.currentTarget.select()}
      onClick={(e) => e.currentTarget.select()}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "");
        setText(digits);
        if (digits === "") return;
        const n = parseInt(digits, 10);
        if (Number.isNaN(n)) return;
        const clamped = max != null ? Math.min(max, n) : n;
        if (clamped >= min) onChange(clamped);
      }}
      onBlur={() => {
        const n = parseInt(text, 10);
        const fallback = Number.isNaN(n) ? min : Math.max(min, max != null ? Math.min(max, n) : n);
        setText(String(fallback));
        onChange(fallback);
      }}
      className={className}
      {...rest}
    />
  );
}
