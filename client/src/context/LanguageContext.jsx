import { useCallback, useEffect, useState } from "react";
import LanguageStore from "./LanguageStore";

const translations = {
  "Welcome to our portal": "हाम्रो पोर्टलमा स्वागत छ",
  "Working Together for a Better Dumkibas": "राम्रो दुम्किबासका लागि मिलेर काम गरौँ",
  "Access community notices, announcements, and reporting services through the Dumkibas Bazar Byabasthapan Samiti portal.":
    "दुम्किबास बजार व्यवस्थापन समितिको पोर्टलबाट सामुदायिक सूचना, घोषणा र प्रतिवेदन सेवाहरू प्रयोग गर्नुहोस्।",
  "Community updates and notices": "सामुदायिक जानकारी र सूचनाहरू",
  "Easy report submission": "सजिलो प्रतिवेदन पेस",
  "Organized community services": "व्यवस्थित सामुदायिक सेवाहरू",
  "MEMBER ACCESS": "सदस्य प्रवेश",
  "Sign in": "साइन इन",
  "Enter your account details to continue.": "अगाडि बढ्न आफ्नो खाता विवरण राख्नुहोस्।",
  "Email address": "इमेल ठेगाना",
  "Please provide a valid email address": "कृपया मान्य इमेल ठेगाना राख्नुहोस्।",
  "Please enter a valid email address.": "कृपया मान्य इमेल ठेगाना राख्नुहोस्।",
  "An account with this email already exists": "यो इमेलबाट खाता पहिले नै बनिसकेको छ।",
  Password: "पासवर्ड",
  "Enter your password": "आफ्नो पासवर्ड राख्नुहोस्",
  Hide: "लुकाउनुहोस्",
  Show: "देखाउनुहोस्",
  "Signing in...": "साइन इन हुँदैछ...",
  "Sign in to your account": "आफ्नो खातामा साइन इन गर्नुहोस्",
  "Don't have access yet?": "अझै पहुँच अनुमति छैन?",
  "Request Access": "पहुँच अनुरोध गर्नुहोस्",
  "Authorized community members only": "अधिकृत समुदायका सदस्यहरूका लागि मात्र",
  "All rights reserved.": "सर्वाधिकार सुरक्षित।",
  "Unable to connect to the server. Check your connection and try again.":
    "सर्भरमा जोडिन सकिएन। आफ्नो इन्टरनेट जाँच गरी फेरि प्रयास गर्नुहोस्।",
  "Unable to sign in. Please try again.": "साइन इन गर्न सकिएन। कृपया फेरि प्रयास गर्नुहोस्।",
  "Incorrect email or password. Check both and try again. If you have not requested an account, use Request Access below.":
    "इमेल वा पासवर्ड मिलेन। दुवै जाँच गरी फेरि प्रयास गर्नुहोस्। खाता अनुरोध गर्नुभएको छैन भने तलको पहुँच अनुरोध विकल्प प्रयोग गर्नुहोस्।",
  "Your access request is still pending. Please wait for admin approval.":
    "तपाईंको पहुँच अनुरोध अझै समीक्षामा छ। कृपया प्रशासकको स्वीकृतिको प्रतीक्षा गर्नुहोस्।",
  "Your access request was rejected by the administrator.":
    "प्रशासकले तपाईंको पहुँच अनुरोध अस्वीकार गर्नुभएको छ।",
  "Your account has been suspended. Please contact the administrator.":
    "तपाईंको खाता निलम्बन गरिएको छ। कृपया प्रशासकलाई सम्पर्क गर्नुहोस्।",
  "NEW MEMBER": "नयाँ सदस्य",
  "Join our community": "हाम्रो समुदायमा सहभागी हुनुहोस्",
  "Request Your Portal Access": "पोर्टल पहुँच अनुरोध गर्नुहोस्",
  "Create an access request to connect with community services, read announcements, and submit reports.":
    "सामुदायिक सेवामा जोडिन, घोषणा पढ्न र प्रतिवेदन पेस गर्न पहुँच अनुरोध गर्नुहोस्।",
  "How it works": "यसले कसरी काम गर्छ",
  "1. Complete the request form.": "१. अनुरोध फाराम भर्नुहोस्।",
  "2. The administrator reviews your request.": "२. प्रशासकले तपाईंको अनुरोध समीक्षा गर्नुहुन्छ।",
  "3. Access is available after approval.": "३. स्वीकृतिपछि पहुँच उपलब्ध हुन्छ।",
  "Fill in your details to submit your request.": "अनुरोध पेस गर्न आफ्नो विवरण भर्नुहोस्।",
  "Full name": "पूरा नाम",
  "Enter your full name": "आफ्नो पूरा नाम राख्नुहोस्",
  "Phone number": "फोन नम्बर",
  "Enter phone number": "फोन नम्बर राख्नुहोस्",
  Address: "ठेगाना",
  "Enter your address": "आफ्नो ठेगाना राख्नुहोस्",
  "Create password": "पासवर्ड बनाउनुहोस्",
  "Create a password": "पासवर्ड बनाउनुहोस्",
  "Use at least 6 characters.": "कम्तीमा ६ अक्षर प्रयोग गर्नुहोस्।",
  "Submitting request...": "अनुरोध पेस हुँदैछ...",
  "Submit Access Request": "पहुँच अनुरोध पेस गर्नुहोस्",
  "Already have an account?": "पहिले नै खाता छ?",
  "Your access request was submitted successfully.":
    "तपाईंको पहुँच अनुरोध सफलतापूर्वक पेस भयो।",
  "Access request submitted successfully. Please wait for admin approval.":
    "पहुँच अनुरोध सफलतापूर्वक पेस भयो। कृपया प्रशासकको स्वीकृतिको प्रतीक्षा गर्नुहोस्।",
  "Registration failed. Please try again.": "दर्ता असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।",
  "Request received": "अनुरोध प्राप्त भयो",
  "Your Request Is Under Review": "तपाईंको अनुरोध समीक्षामा छ",
  "Thank you for requesting access to the Dumkibas Bazar Byabasthapan Samiti portal. Your request has been submitted successfully.":
    "दुम्किबास बजार व्यवस्थापन समितिको पोर्टलमा पहुँच अनुरोध गर्नुभएकोमा धन्यवाद। तपाईंको अनुरोध सफलतापूर्वक पेस भयो।",
  "What happens next?": "अब के हुन्छ?",
  "The administrator will review your request. Please wait until your account is approved before signing in.":
    "प्रशासकले तपाईंको अनुरोध समीक्षा गर्नुहुनेछ। खाता स्वीकृत नभएसम्म साइन इन गर्न प्रतीक्षा गर्नुहोस्।",
  "Go to Login": "लगइनमा जानुहोस्",
  "Back to Home": "मुख्य पृष्ठमा फर्कनुहोस्",
  "Dashboard": "ड्यासबोर्ड",
  "My Reports": "मेरा प्रतिवेदनहरू",
  "My Complaints": "मेरा गुनासाहरू",
  "Notices": "सूचनाहरू",
  "Announcements": "घोषणाहरू",
  "Documents": "कागजातहरू",
  "My Profile": "मेरो प्रोफाइल",
  "Logout": "लगआउट",
  "Close menu": "मेनु बन्द गर्नुहोस्",
  "Open menu": "मेनु खोल्नुहोस्",
  "Welcome,": "स्वागत छ,",
  "User": "प्रयोगकर्ता",
  "Manage your reports, complaints, notices, and committee information.":
    "आफ्ना प्रतिवेदन, गुनासा, सूचना र समितिको जानकारी व्यवस्थापन गर्नुहोस्।",
  "View my reports →": "मेरा प्रतिवेदन हेर्नुहोस् →",
  "Create Report": "प्रतिवेदन बनाउनुहोस्",
  "Submit a new report to the administration.": "प्रशासनमा नयाँ प्रतिवेदन पेस गर्नुहोस्।",
  "Submit Complaint": "गुनासो पेस गर्नुहोस्",
  "Report an issue or problem in the bazaar.": "बजारको समस्या वा गुनासो जानकारी गराउनुहोस्।",
  "View Notices": "सूचनाहरू हेर्नुहोस्",
  "Read important committee notices.": "समितिका महत्त्वपूर्ण सूचनाहरू पढ्नुहोस्।",
  "Read the latest committee announcements.": "समितिका पछिल्ला घोषणाहरू पढ्नुहोस्।",
  Home: "मुख्य पृष्ठ",
  "Open navigation menu": "नेभिगेसन मेनु खोल्नुहोस्",
  "Close navigation menu": "नेभिगेसन मेनु बन्द गर्नुहोस्",
  "Dumkibas Bazar": "दुम्किबास बजार",
  "Byabasthapan Samiti": "व्यवस्थापन समिति",
  "Dumkibas Bazar Byabasthapan Samiti": "दुम्किबास बजार व्यवस्थापन समिति",
  "About Us": "हाम्रो बारेमा",
  Services: "सेवाहरू",
  Contact: "सम्पर्क",
  Login: "लगइन",
  "Community • Cooperation • Progress": "समुदाय • सहकार्य • प्रगति",
  "Working Together for a": "मिलेर काम गरौँ",
  "Better Dumkibas Bazar": "राम्रो दुम्किबास बजारका लागि",
  "Welcome to the official digital portal of Dumkibas Bazar Byabasthapan Samiti. Access community information, read important notices, and submit reports through one convenient platform.":
    "दुम्किबास बजार व्यवस्थापन समितिको आधिकारिक डिजिटल पोर्टलमा स्वागत छ। एउटै सुविधाजनक माध्यमबाट सामुदायिक जानकारी हेर्नुहोस्, महत्त्वपूर्ण सूचना पढ्नुहोस् र प्रतिवेदन पेस गर्नुहोस्।",
  "Access Member Portal →": "सदस्य पोर्टल खोल्नुहोस् →",
  "Secure access for approved community members.": "स्वीकृत समुदायका सदस्यहरूका लागि सुरक्षित पहुँच।",
  "A Better-Connected Community": "अझ जोडिएको समुदाय",
  "Helping community members stay informed and communicate with the committee more easily.":
    "समुदायका सदस्यहरूलाई जानकारीमा रहन र समितिसँग सजिलै सम्पर्क गर्न सहयोग गर्छ।",
  "Notices & Announcements": "सूचना तथा घोषणाहरू",
  "Stay informed about community updates.": "सामुदायिक जानकारीबारे अद्यावधिक रहनुहोस्।",
  "Reports & Complaints": "प्रतिवेदन तथा गुनासाहरू",
  "Submit concerns through the member portal.": "सदस्य पोर्टलबाट आफ्ना गुनासा पेस गर्नुहोस्।",
  "Community Cooperation": "सामुदायिक सहकार्य",
  "Support a more organized and connected bazaar.": "बजारलाई थप व्यवस्थित र जोडिएको बनाउन सहयोग गर्नुहोस्।",
  "About the Committee": "समितिबारे",
  "Serving Our Local Community": "हाम्रो स्थानीय समुदायको सेवा",
  "Dumkibas Bazar Byabasthapan Samiti works to support the organization and management of the local bazaar. This website provides a convenient place for approved members to access information and communicate with the committee.":
    "दुम्किबास बजार व्यवस्थापन समितिले स्थानीय बजारको संगठन र व्यवस्थापनमा सहयोग गर्छ। यस वेबसाइटबाट स्वीकृत सदस्यहरूले जानकारी लिन र समितिसँग सम्पर्क गर्न सक्छन्।",
  "Member Portal": "सदस्य पोर्टल",
  "Services at Your Fingertips": "तपाईंको पहुँचमा सेवाहरू",
  "Sign in to access the services available to approved members.":
    "स्वीकृत सदस्यहरूका लागि उपलब्ध सेवा प्रयोग गर्न साइन इन गर्नुहोस्।",
  "Read important updates and information published by the committee.":
    "समितिले प्रकाशित गरेका महत्त्वपूर्ण जानकारी र अद्यावधिक पढ्नुहोस्।",
  "Submit reports and track your own submitted concerns.":
    "प्रतिवेदन पेस गर्नुहोस् र आफ्ना पेस गरिएका गुनासाहरूको अवस्था हेर्नुहोस्।",
  "Secure Member Access": "सुरक्षित सदस्य पहुँच",
  "Request access and sign in after your account is approved.":
    "पहुँच अनुरोध गर्नुहोस् र खाता स्वीकृत भएपछि साइन इन गर्नुहोस्।",
  "Be Part of Our Community": "हाम्रो समुदायको हिस्सा बन्नुहोस्",
  "Request member access to use the online portal and stay connected with committee updates.":
    "अनलाइन पोर्टल प्रयोग गर्न सदस्य पहुँच अनुरोध गर्नुहोस् र समितिका अद्यावधिकसँग जोडिइरहनुहोस्।",
  "Community information and member services.": "सामुदायिक जानकारी र सदस्य सेवाहरू।",
  Complaints: "गुनासाहरू",
  "Submit an issue →": "समस्या पेस गर्नुहोस् →",
  "Read notices →": "सूचना पढ्नुहोस् →",
  Account: "खाता",
  Member: "सदस्य",
  member: "सदस्य",
  admin: "प्रशासक",
  "Quick Actions": "द्रुत कार्यहरू",
  "Open section →": "खण्ड खोल्नुहोस् →",
  "Account Information": "खाता जानकारी",
  Name: "नाम",
  Email: "इमेल",
  Role: "भूमिका",
  "Not available": "उपलब्ध छैन",
  "Back to Dashboard": "ड्यासबोर्डमा फर्कनुहोस्",
  "Submit a report to the Dumkibas Bazar Management Committee.":
    "दुम्किबास बजार व्यवस्थापन समितिमा प्रतिवेदन पेस गर्नुहोस्।",
  "Report Title": "प्रतिवेदनको शीर्षक",
  "Enter report title": "प्रतिवेदनको शीर्षक राख्नुहोस्",
  Category: "श्रेणी",
  "Select a category": "श्रेणी छान्नुहोस्",
  "Waste Management": "फोहोर व्यवस्थापन",
  "Road / Infrastructure": "सडक / पूर्वाधार",
  "Market Management": "बजार व्यवस्थापन",
  "Street / Vendor Issues": "सडक / व्यापारीका समस्या",
  Sanitation: "सरसफाइ",
  "Electricity / Lighting": "बिजुली / बत्ती",
  Water: "पानी",
  Security: "सुरक्षा",
  Other: "अन्य",
  Location: "स्थान",
  "Where did this issue occur?": "यो समस्या कहाँ भएको हो?",
  Description: "विवरण",
  "Describe the issue in detail...": "समस्याको विस्तृत विवरण लेख्नुहोस्...",
  "Submitting...": "पेस हुँदैछ...",
  "Submit Report": "प्रतिवेदन पेस गर्नुहोस्",
  "Failed to submit report": "प्रतिवेदन पेस गर्न असफल भयो",
  "Track your submitted issues and admin responses.":
    "आफूले पेस गरेका समस्या र प्रशासनका जवाफहरूको अवस्था हेर्नुहोस्।",
  "Refreshing...": "ताजा हुँदैछ...",
  "↻ Refresh": "↻ ताजा गर्नुहोस्",
  "Total Reports": "कुल प्रतिवेदन",
  All: "सबै",
  Draft: "मस्यौदा",
  Submitted: "पेस गरिएको",
  "Under Review": "समीक्षामा",
  "In Progress": "प्रगतिमा",
  Resolved: "समाधान गरिएको",
  "Search My Reports": "मेरा प्रतिवेदन खोज्नुहोस्",
  "Search title, category, location...": "शीर्षक, श्रेणी वा स्थान खोज्नुहोस्...",
  "Filter by Status": "अवस्थाअनुसार छान्नुहोस्",
  "All Statuses": "सबै अवस्थाहरू",
  "Clear filters": "फिल्टर हटाउनुहोस्",
  "Loading your reports...": "तपाईंका प्रतिवेदनहरू लोड हुँदैछन्...",
  "Failed to load your reports. Please try again.":
    "तपाईंका प्रतिवेदन लोड गर्न असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।",
  "Try again": "फेरि प्रयास गर्नुहोस्",
  "No reports yet": "अहिलेसम्म कुनै प्रतिवेदन छैन",
  "You have not submitted any reports yet.": "तपाईंले अहिलेसम्म कुनै प्रतिवेदन पेस गर्नुभएको छैन।",
  "Create Your First Report": "आफ्नो पहिलो प्रतिवेदन बनाउनुहोस्",
  "No matching reports": "मिल्दो प्रतिवेदन भेटिएन",
  "Try another search term or status filter.": "अर्को शब्द वा अवस्था छानेर खोज्नुहोस्।",
  "View report:": "प्रतिवेदन हेर्नुहोस्:",
  "Unknown": "अज्ञात",
  "Submitted:": "पेस गरिएको:",
  "Admin Response": "प्रशासनको जवाफ",
  "View Report Details →": "प्रतिवेदनको विवरण हेर्नुहोस् →",
  "Read the latest official notices from the committee.":
    "समितिका पछिल्ला आधिकारिक सूचनाहरू पढ्नुहोस्।",
  "Loading notices...": "सूचनाहरू लोड हुँदैछन्...",
  "Unable to load notices. Please try again.": "सूचना लोड गर्न सकिएन। कृपया फेरि प्रयास गर्नुहोस्।",
  "No notices yet": "अहिलेसम्म कुनै सूचना छैन",
  "Published notices will appear here.": "प्रकाशित सूचनाहरू यहाँ देखिनेछन्।",
  General: "सामान्य",
  "Published by": "प्रकाशक:",
  "Latest announcements from Dumkibas Bazar Byabasthapan Samiti.":
    "दुम्किबास बजार व्यवस्थापन समितिका पछिल्ला घोषणाहरू।",
  "Loading announcements...": "घोषणाहरू लोड हुँदैछन्...",
  "Unable to load announcements. Please try again.":
    "घोषणा लोड गर्न सकिएन। कृपया फेरि प्रयास गर्नुहोस्।",
  "No announcements have been published yet.": "अहिलेसम्म कुनै घोषणा प्रकाशित गरिएको छैन।",
  Report: "प्रतिवेदन",
  "Loading report...": "प्रतिवेदन लोड हुँदैछ...",
  "Back to My Reports": "मेरा प्रतिवेदनमा फर्कनुहोस्",
  "Failed to load report": "प्रतिवेदन लोड गर्न असफल भयो",
  "Submitted On": "पेस गरिएको मिति",
  "Administration Response": "प्रशासनको जवाफ",
  "No response from the administration yet.": "प्रशासनबाट अहिलेसम्म कुनै जवाफ आएको छैन।",
  Showing: "देखाइँदै",
  of: "मध्ये",
  reports: "प्रतिवेदनहरू",
  "Location:": "स्थान:",
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem("language") === "ne" ? "ne" : "en";
    } catch {
      return "en";
    }
  });

  const setLanguage = (nextLanguage) => {
    setLanguageState(nextLanguage);
    try {
      localStorage.setItem("language", nextLanguage);
    } catch (error) {
      console.error("Unable to save language preference:", error);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (text) => (language === "ne" ? translations[text] || text : text),
    [language]
  );

  return (
    <LanguageStore.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageStore.Provider>
  );
}
