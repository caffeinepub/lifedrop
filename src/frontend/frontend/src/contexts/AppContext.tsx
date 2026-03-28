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
    // Nav
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
    leaderboard: "Leaderboard",
    notifications: "Notifications",
    // Hero
    tagline: "Save Lives. Donate Blood.",
    hero_subtitle:
      "Connect with blood donors, hospitals, and blood banks instantly. Every second counts.",
    emergency_btn: "🩸 Emergency Blood Request",
    become_donor: "Become a Donor",
    register_hospital: "Register Hospital",
    // Search
    find_donors: "Find Blood Donors",
    search_placeholder: "Search by city...",
    all_blood_groups: "All Blood Groups",
    available_only: "Available only",
    search_btn: "Search",
    no_donors: "No donors found",
    call: "Call",
    whatsapp: "WhatsApp",
    available: "Available",
    not_available: "Not Available",
    // Blood Requests
    blood_request_title: "Active Blood Requests",
    post_request: "Post Blood Request",
    patient_name: "Patient Name",
    hospital: "Hospital",
    city: "City",
    contact: "Contact",
    urgency: "Urgency",
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
    submit: "Submit",
    cancel: "Cancel",
    delete: "Delete",
    mark_received: "Mark as Received",
    // Camps
    camps_title: "Blood Donation Camps",
    upcoming_camps: "Upcoming Camps",
    post_camp: "Post a Camp",
    camp_name: "Camp Name",
    venue: "Venue",
    date: "Date",
    time: "Time",
    organizer: "Organizer",
    expected_donors: "Expected Donors",
    interested: "Interested",
    i_am_interested: "I am Interested",
    // Blog
    blog_title: "Blood Donation Awareness",
    read_more: "Read More",
    // Leaderboard
    leaderboard_title: "Top Donors Leaderboard",
    rank: "Rank",
    donor: "Donor",
    donations: "Donations",
    // Notifications
    no_notifications: "No notifications yet",
    mark_all_read: "Mark all as read",
    // Auth
    email: "Email",
    password: "Password",
    name: "Full Name",
    phone: "Phone Number",
    blood_group: "Blood Group",
    role: "Role",
    already_account: "Already have an account?",
    no_account: "Don't have an account?",
    // Dashboard
    welcome: "Welcome",
    profile: "Profile",
    settings: "Settings",
    save: "Save",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    // Footer
    about: "About",
    contact_us: "Contact Us",
    privacy: "Privacy Policy",
    terms: "Terms",
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
    leaderboard: "தரவரிசை",
    notifications: "அறிவிப்புகள்",
    tagline: "உயிர்களை காப்பாற்றுங்கள். இரத்தம் தானம் செய்யுங்கள்.",
    hero_subtitle:
      "இரத்த தானியர்கள், மருத்துவமனைகள் மற்றும் இரத்த வங்கிகளுடன் உடனடியாக இணையுங்கள்.",
    emergency_btn: "🩸 அவசர இரத்த கோரிக்கை",
    become_donor: "தானியராகுங்கள்",
    register_hospital: "மருத்துவமனை பதிவு",
    find_donors: "இரத்த தானியர்களை கண்டறியுங்கள்",
    search_placeholder: "நகரத்தை தேடுங்கள்...",
    all_blood_groups: "அனைத்து இரத்த வகைகள்",
    available_only: "கிடைக்கும் மட்டும்",
    search_btn: "தேடு",
    no_donors: "தானியர்கள் இல்லை",
    call: "அழை",
    whatsapp: "வாட்ஸ்அப்",
    available: "கிடைக்கும்",
    not_available: "கிடைக்காது",
    blood_request_title: "செயலில் உள்ள இரத்த கோரிக்கைகள்",
    post_request: "இரத்த கோரிக்கை பதிவிடு",
    patient_name: "நோயாளி பெயர்",
    hospital: "மருத்துவமனை",
    city: "நகரம்",
    contact: "தொடர்பு",
    urgency: "அவசரம்",
    low: "குறைவு",
    medium: "நடுத்தர",
    high: "அதிக",
    critical: "மிகவும் அவசரம்",
    submit: "சமர்பி",
    cancel: "ரத்து",
    delete: "நீக்கு",
    mark_received: "பெற்றதாக குறி",
    camps_title: "இரத்த தான முகாம்கள்",
    upcoming_camps: "வரவிருக்கும் முகாம்கள்",
    post_camp: "முகாம் பதிவிடு",
    camp_name: "முகாம் பெயர்",
    venue: "இடம்",
    date: "தேதி",
    time: "நேரம்",
    organizer: "ஏற்பாட்டாளர்",
    expected_donors: "எதிர்பார்க்கப்படும் தானியர்கள்",
    interested: "ஆர்வமுள்ளவர்கள்",
    i_am_interested: "எனக்கு ஆர்வம் உள்ளது",
    blog_title: "இரத்த தான விழிப்புணர்வு",
    read_more: "மேலும் படிக்க",
    leaderboard_title: "சிறந்த தானியர்கள் தரவரிசை",
    rank: "தரம்",
    donor: "தானியர்",
    donations: "தானங்கள்",
    no_notifications: "அறிவிப்புகள் இல்லை",
    mark_all_read: "அனைத்தையும் படித்ததாக குறி",
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    name: "முழு பெயர்",
    phone: "தொலைபேசி எண்",
    blood_group: "இரத்த வகை",
    role: "பங்கு",
    already_account: "ஏற்கெனவே கணக்கு உள்ளதா?",
    no_account: "கணக்கு இல்லையா?",
    welcome: "வரவேற்கிறோம்",
    profile: "சுயவிவரம்",
    settings: "அமைப்புகள்",
    save: "சேமி",
    loading: "ஏற்றுகிறது...",
    error: "பிழை",
    success: "வெற்றி",
    about: "பற்றி",
    contact_us: "தொடர்பு கொள்ளுங்கள்",
    privacy: "தனியுரிமை கொள்கை",
    terms: "விதிமுறைகள்",
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
    leaderboard: "लीडरबोर्ड",
    notifications: "सूचनाएं",
    tagline: "जीवन बचाएं। रक्त दान करें।",
    hero_subtitle:
      "रक्त दाताओं, अस्पतालों और ब्लड बैंकों से तुरंत जुड़ें। हर सेकंड मायने रखती है।",
    emergency_btn: "🩸 आपातकालीन रक्त अनुरोध",
    become_donor: "डोनर बनें",
    register_hospital: "अस्पताल पंजीकरण",
    find_donors: "रक्त दाता खोजें",
    search_placeholder: "शहर खोजें...",
    all_blood_groups: "सभी रक्त समूह",
    available_only: "केवल उपलब्ध",
    search_btn: "खोजें",
    no_donors: "कोई डोनर नहीं मिला",
    call: "कॉल करें",
    whatsapp: "WhatsApp",
    available: "उपलब्ध",
    not_available: "उपलब्ध नहीं",
    blood_request_title: "सक्रिय रक्त अनुरोध",
    post_request: "रक्त अनुरोध पोस्ट करें",
    patient_name: "मरीज़ का नाम",
    hospital: "अस्पताल",
    city: "शहर",
    contact: "संपर्क",
    urgency: "तात्कालिकता",
    low: "कम",
    medium: "मध्यम",
    high: "अधिक",
    critical: "अत्यंत तात्कालिक",
    submit: "जमा करें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    mark_received: "प्राप्त के रूप में चिह्नित करें",
    camps_title: "रक्तदान शिविर",
    upcoming_camps: "आगामी शिविर",
    post_camp: "शिविर पोस्ट करें",
    camp_name: "शिविर का नाम",
    venue: "स्थान",
    date: "तारीख",
    time: "समय",
    organizer: "आयोजक",
    expected_donors: "अपेक्षित दाता",
    interested: "रुचि रखने वाले",
    i_am_interested: "मुझे रुचि है",
    blog_title: "रक्तदान जागरूकता",
    read_more: "और पढ़ें",
    leaderboard_title: "शीर्ष दाता लीडरबोर्ड",
    rank: "रैंक",
    donor: "दाता",
    donations: "दान",
    no_notifications: "कोई सूचना नहीं",
    mark_all_read: "सभी को पढ़ा हुआ चिह्नित करें",
    email: "ईमेल",
    password: "पासवर्ड",
    name: "पूरा नाम",
    phone: "फ़ोन नंबर",
    blood_group: "रक्त समूह",
    role: "भूमिका",
    already_account: "पहले से खाता है?",
    no_account: "खाता नहीं है?",
    welcome: "स्वागत है",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    save: "सहेजें",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
    about: "के बारे में",
    contact_us: "हमसे संपर्क करें",
    privacy: "गोपनीयता नीति",
    terms: "नियम और शर्तें",
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
    leaderboard: "ಲೀಡರ್‌ಬೋರ್ಡ್",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    tagline: "ಜೀವಗಳನ್ನು ಉಳಿಸಿ. ರಕ್ತ ದಾನ ಮಾಡಿ.",
    hero_subtitle: "ರಕ್ತ ದಾನಿಗಳು, ಆಸ್ಪತ್ರೆಗಳು ಮತ್ತು ರಕ್ತ ಬ್ಯಾಂಕ್‌ಗಳೊಂದಿಗೆ ತಕ್ಷಣ ಸಂಪರ್ಕ ಸಾಧಿಸಿ.",
    emergency_btn: "🩸 ತುರ್ತು ರಕ್ತ ವಿನಂತಿ",
    become_donor: "ದಾನಿಯಾಗಿ",
    register_hospital: "ಆಸ್ಪತ್ರೆ ನೋಂದಣಿ",
    find_donors: "ರಕ್ತ ದಾನಿಗಳನ್ನು ಹುಡುಕಿ",
    search_placeholder: "ನಗರ ಹುಡುಕಿ...",
    all_blood_groups: "ಎಲ್ಲಾ ರಕ್ತ ಗುಂಪುಗಳು",
    available_only: "ಲಭ್ಯವಿರುವವರು ಮಾತ್ರ",
    search_btn: "ಹುಡುಕಿ",
    no_donors: "ದಾನಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    call: "ಕರೆ ಮಾಡಿ",
    whatsapp: "WhatsApp",
    available: "ಲಭ್ಯ",
    not_available: "ಲಭ್ಯವಿಲ್ಲ",
    blood_request_title: "ಸಕ್ರಿಯ ರಕ್ತ ವಿನಂತಿಗಳು",
    post_request: "ರಕ್ತ ವಿನಂತಿ ಪೋಸ್ಟ್ ಮಾಡಿ",
    patient_name: "ರೋಗಿಯ ಹೆಸರು",
    hospital: "ಆಸ್ಪತ್ರೆ",
    city: "ನಗರ",
    contact: "ಸಂಪರ್ಕ",
    urgency: "ತುರ್ತು",
    low: "ಕಡಿಮೆ",
    medium: "ಮಧ್ಯಮ",
    high: "ಹೆಚ್ಚು",
    critical: "ಅತ್ಯಂತ ತುರ್ತು",
    submit: "ಸಲ್ಲಿಸಿ",
    cancel: "ರದ್ದು",
    delete: "ಅಳಿಸಿ",
    mark_received: "ಸ್ವೀಕರಿಸಿದಂತೆ ಗುರುತಿಸಿ",
    camps_title: "ರಕ್ತದಾನ ಶಿಬಿರಗಳು",
    upcoming_camps: "ಮುಂಬರುವ ಶಿಬಿರಗಳು",
    post_camp: "ಶಿಬಿರ ಪೋಸ್ಟ್ ಮಾಡಿ",
    camp_name: "ಶಿಬಿರ ಹೆಸರು",
    venue: "ಸ್ಥಳ",
    date: "ದಿನಾಂಕ",
    time: "ಸಮಯ",
    organizer: "ಆಯೋಜಕ",
    expected_donors: "ನಿರೀಕ್ಷಿತ ದಾನಿಗಳು",
    interested: "ಆಸಕ್ತರು",
    i_am_interested: "ನನಗೆ ಆಸಕ್ತಿ ಇದೆ",
    blog_title: "ರಕ್ತದಾನ ಜಾಗೃತಿ",
    read_more: "ಇನ್ನಷ್ಟು ಓದಿ",
    leaderboard_title: "ಅಗ್ರ ದಾನಿಗಳ ಲೀಡರ್‌ಬೋರ್ಡ್",
    rank: "ಶ್ರೇಣಿ",
    donor: "ದಾನಿ",
    donations: "ದಾನಗಳು",
    no_notifications: "ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ",
    mark_all_read: "ಎಲ್ಲವನ್ನೂ ಓದಿದಂತೆ ಗುರುತಿಸಿ",
    email: "ಇಮೇಲ್",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    name: "ಪೂರ್ಣ ಹೆಸರು",
    phone: "ಫೋನ್ ಸಂಖ್ಯೆ",
    blood_group: "ರಕ್ತ ಗುಂಪು",
    role: "ಪಾತ್ರ",
    already_account: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
    no_account: "ಖಾತೆ ಇಲ್ಲವೇ?",
    welcome: "ಸ್ವಾಗತ",
    profile: "ಪ್ರೊಫೈಲ್",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    save: "ಉಳಿಸಿ",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    error: "ದೋಷ",
    success: "ಯಶಸ್ಸು",
    about: "ಬಗ್ಗೆ",
    contact_us: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ",
    privacy: "ಗೌಪ್ಯತಾ ನೀತಿ",
    terms: "ನಿಯಮಗಳು",
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
    leaderboard: "ലീഡർബോർഡ്",
    notifications: "അറിയിപ്പുകൾ",
    tagline: "ജീവൻ രക്ഷിക്കൂ. രക്തദാനം ചെയ്യൂ.",
    hero_subtitle: "രക്തദാതാക്കൾ, ആശുപത്രികൾ, ബ്ലഡ് ബാങ്കുകൾ എന്നിവരുമായി ഉടനടി ബന്ധപ്പെടുക.",
    emergency_btn: "🩸 അടിയന്തര രക്ത അഭ്യർത്ഥന",
    become_donor: "ദാതാവാകൂ",
    register_hospital: "ആശുപത്രി രജിസ്ട്രേഷൻ",
    find_donors: "രക്തദാതാക്കളെ കണ്ടെത്തുക",
    search_placeholder: "നഗരം തിരയുക...",
    all_blood_groups: "എല്ലാ രക്ത ഗ്രൂപ്പുകളും",
    available_only: "ലഭ്യമുള്ളവർ മാത്രം",
    search_btn: "തിരയുക",
    no_donors: "ദാതാക്കൾ കണ്ടെത്തിയില്ല",
    call: "വിളിക്കുക",
    whatsapp: "WhatsApp",
    available: "ലഭ്യം",
    not_available: "ലഭ്യമല്ല",
    blood_request_title: "സജീവ രക്ത അഭ്യർത്ഥനകൾ",
    post_request: "രക്ത അഭ്യർത്ഥന പോസ്റ്റ് ചെയ്യുക",
    patient_name: "രോഗിയുടെ പേര്",
    hospital: "ആശുപത്രി",
    city: "നഗരം",
    contact: "ബന്ധപ്പെടൽ",
    urgency: "അടിയന്തരം",
    low: "കുറഞ്ഞ",
    medium: "ഇടത്തരം",
    high: "ഉയർന്ന",
    critical: "അതീവ അടിയന്തരം",
    submit: "സമർപ്പിക്കുക",
    cancel: "റദ്ദാക്കുക",
    delete: "ഇല്ലാതാക്കുക",
    mark_received: "ലഭിച്ചതായി അടയാളപ്പെടുത്തുക",
    camps_title: "രക്തദാന ക്യാമ്പുകൾ",
    upcoming_camps: "വരാനിരിക്കുന്ന ക്യാമ്പുകൾ",
    post_camp: "ക്യാമ്പ് പോസ്റ്റ് ചെയ്യുക",
    camp_name: "ക്യാമ്പ് പേര്",
    venue: "സ്ഥലം",
    date: "തീയതി",
    time: "സമയം",
    organizer: "സംഘാടകൻ",
    expected_donors: "പ്രതീക്ഷിത ദാതാക്കൾ",
    interested: "താൽപ്പര്യമുള്ളവർ",
    i_am_interested: "എനിക്ക് താൽപ്പര്യമുണ്ട്",
    blog_title: "രക്തദാന അവബോധം",
    read_more: "കൂടുതൽ വായിക്കുക",
    leaderboard_title: "മികച്ച ദാതാക്കളുടെ ലീഡർബോർഡ്",
    rank: "റാങ്ക്",
    donor: "ദാതാവ്",
    donations: "ദാനങ്ങൾ",
    no_notifications: "അറിയിപ്പുകൾ ഇല്ല",
    mark_all_read: "എല്ലാം വായിച്ചതായി അടയാളപ്പെടുത്തുക",
    email: "ഇമെയിൽ",
    password: "പാസ്‌വേഡ്",
    name: "പൂർണ്ണ നാമം",
    phone: "ഫോൺ നമ്പർ",
    blood_group: "രക്ത ഗ്രൂപ്പ്",
    role: "റോൾ",
    already_account: "ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?",
    no_account: "അക്കൗണ്ട് ഇല്ലേ?",
    welcome: "സ്വാഗതം",
    profile: "പ്രൊഫൈൽ",
    settings: "ക്രമീകരണങ്ങൾ",
    save: "സംരക്ഷിക്കുക",
    loading: "ലോഡ് ചെയ്യുന്നു...",
    error: "പിശക്",
    success: "വിജയം",
    about: "കുറിച്ച്",
    contact_us: "ഞങ്ങളെ ബന്ധപ്പെടുക",
    privacy: "സ്വകാര്യതാ നയം",
    terms: "നിബന്ധനകൾ",
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
      return translations[language]?.[key] ?? translations.en[key] ?? key;
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
