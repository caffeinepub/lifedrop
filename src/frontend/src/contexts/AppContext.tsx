import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { UserProfile } from "../backend.d";
import { addNotificationGlobal } from "../hooks/useNotifications";

// ─── Language ────────────────────────────────────────────────
export type Language = "en" | "ta" | "hi" | "kn" | "ml";

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
    camps: "Camps",
    blood_requests: "Blood Requests",
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
    camps: "முகாம்கள்",
    blood_requests: "இரத்த கோரிக்கைகள்",
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
    camps: "शिविर",
    blood_requests: "रक्त अनुरोध",
    tagline: "जीवन बचाएं। रक्त दान करें।",
    hero_subtitle:
      "रक्त दाताओं, अस्पतालों और ब्लड बैंकों से तुरंत जुड़ें। हर सेकंड मायने रखती है।",
    emergency_btn: "🩸 आपातकालीन रक्त अनुरोध",
    become_donor: "डोनर बनें",
    register_hospital: "अस्पताल पंजीकरण",
  },
  kn: {
    home: "ಮುಖಪುಟ",
    donate: "ರಕ್ತದಾನ",
    emergency: "ತುರ್ತು",
    login: "ಲಾಗಿನ್",
    logout: "ಲಾಗ್‌ಔಟ್",
    search_donors: "ದಾನಿಗಳನ್ನು ಹುಡುಕಿ",
    register: "ನೋಂದಣಿ",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    blog: "ಬ್ಲಾಗ್",
    camps: "ಶಿಬಿರಗಳು",
    blood_requests: "ರಕ್ತ ವಿನಂತಿಗಳು",
    tagline: "ಜೀವಗಳನ್ನು ಉಳಿಸಿ. ರಕ್ತ ದಾನ ಮಾಡಿ.",
    hero_subtitle: "ರಕ್ತ ದಾನಿಗಳು, ಆಸ್ಪತ್ರೆಗಳು ಮತ್ತು ರಕ್ತ ಬ್ಯಾಂಕ್‌ಗಳೊಂದಿಗೆ ತಕ್ಷಣ ಸಂಪರ್ಕ ಸಾಧಿಸಿ.",
    emergency_btn: "🩸 ತುರ್ತು ರಕ್ತ ವಿನಂತಿ",
    become_donor: "ದಾನಿಯಾಗಿ",
    register_hospital: "ಆಸ್ಪತ್ರೆ ನೋಂದಣಿ",
  },
  ml: {
    home: "ഹോം",
    donate: "രക്തദാനം",
    emergency: "അടിയന്തരം",
    login: "ലോഗിൻ",
    logout: "ലോഗ്ഔട്ട്",
    search_donors: "ദാതാക്കളെ കണ്ടെത്തുക",
    register: "രജിസ്റ്റർ",
    dashboard: "ഡാഷ്ബോർഡ്",
    blog: "ബ്ലോഗ്",
    camps: "ക്യാമ്പുകൾ",
    blood_requests: "രക്ത അഭ്യർത്ഥനകൾ",
    tagline: "ജീവൻ രക്ഷിക്കൂ. രക്തദാനം ചെയ്യൂ.",
    hero_subtitle: "രക്തദാതാക്കൾ, ആശുപത്രികൾ, ബ്ലഡ് ബാങ്കുകൾ എന്നിവരുമായി ഉടനടി ബന്ധപ്പെടുക.",
    emergency_btn: "🩸 അടിയന്തര രക്ത അഭ്യർത്ഥന",
    become_donor: "ദാതാവാകൂ",
    register_hospital: "ആശുപത്രി രജിസ്ട്രേഷൻ",
  },
};

// ─── Camp Announcement ────────────────────────────────────────
export type CampAnnouncement = {
  id: string;
  name: string;
  venue: string;
  date: string;
  time: string;
  expectedDonors: number;
  organizer: string;
  contact: string;
  postedBy: "NGO" | "Blood Bank";
  postedAt: string;
  status: "upcoming" | "active" | "completed";
  posterImage?: string;
  interestedCount: number;
  interestedByDevice: string[];
};

// ─── Registered User (localStorage) ─────────────────────────
export interface RegisteredUserEntry {
  name: string;
  role: string;
  city: string;
  bloodGroup?: string;
  registeredAt: string;
}

const STORAGE_KEY_PROFILE = "lifedrop_user_profile";
const STORAGE_KEY_USERS = "lifedrop_registered_users";
const STORAGE_KEY_CAMPS = "lifedrop_camps";

function loadCamps(): CampAnnouncement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CAMPS);
    return raw ? (JSON.parse(raw) as CampAnnouncement[]) : [];
  } catch {
    return [];
  }
}

function saveCamps(camps: CampAnnouncement[]): void {
  localStorage.setItem(STORAGE_KEY_CAMPS, JSON.stringify(camps));
}

export function getStoredProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfileToStorage(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
}

export function getRegisteredUsers(): RegisteredUserEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    return raw ? (JSON.parse(raw) as RegisteredUserEntry[]) : [];
  } catch {
    return [];
  }
}

export function addRegisteredUser(entry: RegisteredUserEntry): void {
  const existing = getRegisteredUsers();
  existing.unshift(entry);
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(existing));
  window.dispatchEvent(new CustomEvent("lifedrop_user_registered"));
}

// ─── Context Types ────────────────────────────────────────────
interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  userProfile: UserProfile | null;
  isLoadingProfile: boolean;
  setUserProfile: (profile: UserProfile | null) => void;
  refetchProfile: () => void;
  camps: CampAnnouncement[];
  addCamp: (camp: CampAnnouncement) => void;
  deleteCamp: (id: string) => void;
  markInterested: (campId: string, deviceId: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("lifedrop_lang") as Language) ?? "en";
  });

  const [userProfile, setUserProfileState] = useState<UserProfile | null>(() =>
    getStoredProfile(),
  );

  const [camps, setCamps] = useState<CampAnnouncement[]>(() => loadCamps());

  // Persist camps to localStorage whenever they change
  useEffect(() => {
    saveCamps(camps);
  }, [camps]);

  const addCamp = useCallback((camp: CampAnnouncement) => {
    setCamps((prev) => {
      const next = [camp, ...prev];
      saveCamps(next);
      return next;
    });
    addNotificationGlobal(
      `🏕️ New blood donation camp: "${camp.name}" at ${camp.venue} on ${camp.date}`,
      "info",
    );
  }, []);

  const deleteCamp = useCallback((id: string) => {
    setCamps((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveCamps(next);
      return next;
    });
  }, []);

  const markInterested = useCallback((campId: string, deviceId: string) => {
    setCamps((prev) => {
      const next = prev.map((c) => {
        if (c.id !== campId) return c;
        if (c.interestedByDevice.includes(deviceId)) return c;
        return {
          ...c,
          interestedCount: c.interestedCount + 1,
          interestedByDevice: [...c.interestedByDevice, deviceId],
        };
      });
      saveCamps(next);
      return next;
    });
  }, []);

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

  const setUserProfile = useCallback((profile: UserProfile | null) => {
    setUserProfileState(profile);
    if (profile) {
      saveProfileToStorage(profile);
    } else {
      localStorage.removeItem(STORAGE_KEY_PROFILE);
    }
  }, []);

  const refetchProfile = useCallback(() => {
    setUserProfileState(getStoredProfile());
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        userProfile,
        isLoadingProfile: false,
        setUserProfile,
        refetchProfile,
        camps,
        addCamp,
        deleteCamp,
        markInterested,
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
