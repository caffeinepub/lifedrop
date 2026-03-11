import { useEffect, useState } from "react";

const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳" },
  { code: "+1", flag: "🇺🇸" },
  { code: "+44", flag: "🇬🇧" },
  { code: "+61", flag: "🇦🇺" },
  { code: "+971", flag: "🇦🇪" },
  { code: "+65", flag: "🇸🇬" },
  { code: "+60", flag: "🇲🇾" },
  { code: "+966", flag: "🇸🇦" },
  { code: "+49", flag: "🇩🇪" },
  { code: "+33", flag: "🇫🇷" },
  { code: "+81", flag: "🇯🇵" },
  { code: "+86", flag: "🇨🇳" },
  { code: "+7", flag: "🇷🇺" },
  { code: "+55", flag: "🇧🇷" },
  { code: "+27", flag: "🇿🇦" },
  { code: "+234", flag: "🇳🇬" },
  { code: "+254", flag: "🇰🇪" },
  { code: "+20", flag: "🇪🇬" },
  { code: "+92", flag: "🇵🇰" },
  { code: "+880", flag: "🇧🇩" },
  { code: "+94", flag: "🇱🇰" },
  { code: "+977", flag: "🇳🇵" },
  { code: "+64", flag: "🇳🇿" },
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

  const selectedEntry = COUNTRY_CODES.find((c) => c.code === countryCode);

  return (
    <div className={`w-full ${className ?? ""}`}>
      <div className="flex w-full min-w-0">
        {/* Country selector — compact: flag + code only */}
        <div className="relative flex-shrink-0" style={{ width: "80px" }}>
          <select
            value={countryCode}
            onChange={handleCodeChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label="Country code"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <div className="h-14 flex items-center justify-center gap-1 rounded-l-md border border-border bg-secondary text-foreground text-sm font-semibold px-2 pointer-events-none select-none">
            <span className="text-base">{selectedEntry?.flag}</span>
            <span>{countryCode}</span>
          </div>
        </div>
        {/* 10-digit number input — takes remaining width */}
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
          className="h-14 min-w-0 flex-1 rounded-r-md border border-l-0 border-border bg-secondary px-4 py-3 text-lg font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 tracking-widest box-border"
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
