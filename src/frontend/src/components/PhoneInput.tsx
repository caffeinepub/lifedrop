import { useEffect, useState } from "react";

const COUNTRY_CODES = [
  { code: "+91", label: "🇮🇳 +91 India" },
  { code: "+1", label: "🇺🇸 +1 USA / Canada" },
  { code: "+44", label: "🇬🇧 +44 UK" },
  { code: "+61", label: "🇦🇺 +61 Australia" },
  { code: "+971", label: "🇦🇪 +971 UAE" },
  { code: "+65", label: "🇸🇬 +65 Singapore" },
  { code: "+60", label: "🇲🇾 +60 Malaysia" },
  { code: "+966", label: "🇸🇦 +966 Saudi Arabia" },
  { code: "+49", label: "🇩🇪 +49 Germany" },
  { code: "+33", label: "🇫🇷 +33 France" },
  { code: "+81", label: "🇯🇵 +81 Japan" },
  { code: "+86", label: "🇨🇳 +86 China" },
  { code: "+7", label: "🇷🇺 +7 Russia" },
  { code: "+55", label: "🇧🇷 +55 Brazil" },
  { code: "+27", label: "🇿🇦 +27 South Africa" },
  { code: "+234", label: "🇳🇬 +234 Nigeria" },
  { code: "+254", label: "🇰🇪 +254 Kenya" },
  { code: "+20", label: "🇪🇬 +20 Egypt" },
  { code: "+92", label: "🇵🇰 +92 Pakistan" },
  { code: "+880", label: "🇧🇩 +880 Bangladesh" },
  { code: "+94", label: "🇱🇰 +94 Sri Lanka" },
  { code: "+977", label: "🇳🇵 +977 Nepal" },
  { code: "+64", label: "🇳🇿 +64 New Zealand" },
];

function parsePhoneValue(value: string): {
  countryCode: string;
  digits: string;
} {
  if (!value) return { countryCode: "+91", digits: "" };
  for (const c of COUNTRY_CODES.sort((a, b) => b.code.length - a.code.length)) {
    if (value.startsWith(c.code)) {
      const rest = value
        .slice(c.code.length)
        .replace(/\s+/g, "")
        .replace(/\D/g, "");
      return { countryCode: c.code, digits: rest };
    }
  }
  // fallback: treat whole thing as digits
  return { countryCode: "+91", digits: value.replace(/\D/g, "").slice(0, 10) };
}

interface PhoneInputProps {
  value: string;
  onChange: (fullNumber: string) => void;
  id?: string;
  required?: boolean;
  "data-ocid"?: string;
  className?: string;
  disabled?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  id,
  required,
  "data-ocid": dataOcid,
  className,
  disabled,
}: PhoneInputProps) {
  const parsed = parsePhoneValue(value);
  const [countryCode, setCountryCode] = useState(parsed.countryCode);
  const [digits, setDigits] = useState(parsed.digits);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const p = parsePhoneValue(value);
    setCountryCode(p.countryCode);
    setDigits(p.digits);
  }, [value]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setCountryCode(newCode);
    onChange(digits ? `${newCode} ${digits}` : newCode);
  };

  const handleDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setDigits(raw);
    setTouched(true);
    onChange(raw ? `${countryCode} ${raw}` : countryCode);
  };

  const showError = touched && digits.length > 0 && digits.length < 10;

  return (
    <div className={className}>
      <div className="flex">
        <select
          value={countryCode}
          onChange={handleCodeChange}
          disabled={disabled}
          className="flex-shrink-0 h-10 rounded-l-md border border-border bg-secondary text-foreground text-sm px-2 pr-6 focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
          style={{ minWidth: "72px" }}
          aria-label="Country code"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          placeholder="10-digit number"
          value={digits}
          onChange={handleDigitsChange}
          onBlur={() => setTouched(true)}
          maxLength={10}
          required={required}
          disabled={disabled}
          data-ocid={dataOcid}
          className="flex h-10 w-full rounded-r-md border border-l-0 border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      {showError && (
        <p className="text-xs text-red-500 mt-1">
          Phone number must be exactly 10 digits
        </p>
      )}
    </div>
  );
}

/** Extract only the 10-digit portion from a full phone string like "+91 9876543210" */
export function extractPhoneDigits(fullPhone: string): string {
  const parsed = parsePhoneValue(fullPhone);
  return parsed.digits;
}
