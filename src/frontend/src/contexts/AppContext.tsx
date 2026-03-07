import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { UserProfile } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

// ─── Language ────────────────────────────────────────────────
export type Language = "en" | "ta" | "hi";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    home: "Home",
    donate: "Donate Blood",
    emergency: "Emergency",
    login: "Login",
    logout: "Logout",
    search_donors: "Find Donors",
    register: "Register",
    dashboard: "Dashboard",
    blog: "Blog",
    tagline: "Save Lives. Donate Blood.",
    hero_subtitle:
      "Connect with blood donors, hospitals, and blood banks instantly. Every second counts.",
    emergency_btn: "🩸 Emergency Blood Request",
    become_donor: "Become a Donor",
    register_hospital: "Register Hospital",
  },
  ta: {
    home: "முகப்பு",
    donate: "இரத்தம் தானம்",
    emergency: "அவசரம்",
    login: "உள்நுழைவு",
    logout: "வெளியேறு",
    search_donors: "தானியர்களை தேடு",
    register: "பதிவு செய்",
    dashboard: "டாஷ்போர்டு",
    blog: "வலைப்பதிவு",
    tagline: "உயிர்களை காப்பாற்றுங்கள். இரத்தம் தானம் செய்யுங்கள்.",
    hero_subtitle:
      "இரத்த தானியர்கள், மருத்துவமனைகள் மற்றும் இரத்த வங்கிகளுடன் உடனடியாக இணையுங்கள்.",
    emergency_btn: "🩸 அவசர இரத்த கோரிக்கை",
    become_donor: "தானியராகுங்கள்",
    register_hospital: "மருத்துவமனை பதிவு",
  },
  hi: {
    home: "होम",
    donate: "रक्तदान",
    emergency: "आपातकाल",
    login: "लॉगिन",
    logout: "लॉगआउट",
    search_donors: "डोनर खोजें",
    register: "पंजीकरण",
    dashboard: "डैशबोर्ड",
    blog: "ब्लॉग",
    tagline: "जीवन बचाएं। रक्त दान करें।",
    hero_subtitle:
      "रक्त दाताओं, अस्पतालों और ब्लड बैंकों से तुरंत जुड़ें। हर सेकंड मायने रखती है।",
    emergency_btn: "🩸 आपातकालीन रक्त अनुरोध",
    become_donor: "डोनर बनें",
    register_hospital: "अस्पताल पंजीकरण",
  },
};

// ─── Context Types ────────────────────────────────────────────
interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  userProfile: UserProfile | null;
  isLoadingProfile: boolean;
  refetchProfile: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("lifedrop_lang") as Language) ?? "en";
  });

  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lifedrop_lang", lang);
  }, []);

  const t = useCallback(
    (key: string) => {
      return translations[language][key] ?? translations.en[key] ?? key;
    },
    [language],
  );

  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useQuery<UserProfile | null>({
    queryKey: ["userProfile", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching && !!identity,
  });

  // Invalidate profile when identity changes
  useEffect(() => {
    if (identity) {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    }
  }, [identity, queryClient]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        userProfile: userProfile ?? null,
        isLoadingProfile,
        refetchProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
