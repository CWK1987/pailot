import React, { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient.js";

/* ============================== I18N ============================== */
const STRINGS = {
  en: {
    langName: "English", pickLanguageTitle: "Welcome to pailot", pickLanguageSub: "Choose your language to get started",
    continue: "Continue", appName: "pailot", tagline: "Snap it. Learn it. Own it.",
    navHome: "Home", navUpload: "Upload", navResources: "Resources", navTutor: "AI Tutor", navBoard: "Leaderboard", navProfile: "Profile",
    greetingMorning: "Good morning", greetingAfternoon: "Good afternoon", greetingEvening: "Good evening",
    streakLabel: "day streak", xpLabel: "XP", dailyGoal: "Daily goal", minutesToday: "min today",
    yourMaterials: "Your study material", noMaterials: "No material yet. Upload your notes to get started.",
    uploadNew: "Upload new material", takePhoto: "Take a photo", chooseFile: "Choose a file", pasteText: "Paste text instead",
    processing: "pailot is reading your notes...", summaryReady: "Your summary is ready",
    tabSummary: "Summary", tabFlashcards: "Flashcards", tabQuiz: "Quiz", tabExam: "Exam",
    generateSummary: "Generate summary", generateFlashcards: "Generate flashcards", generateQuiz: "Generate quiz", generateExam: "Generate practice exam",
    startQuiz: "Start quiz", startExam: "Start exam", flipCard: "Tap to flip", knewIt: "Knew it", didntKnow: "Still learning",
    cardsDone: "cards done", question: "Question", of: "of", submitAnswer: "Submit answer", nextQuestion: "Next question",
    seeResults: "See results", correct: "Correct!", incorrect: "Not quite", quizComplete: "Quiz complete",
    score: "Score", xpEarned: "XP earned", backHome: "Back to home", tryAgain: "Try again",
    leaderboardTitle: "Leaderboard", leaderboardSub: "Top learners this week", you: "You",
    profileTitle: "Profile", freePlan: "Free plan", advancedPlan: "Advanced plan", premiumPlan: "Premium plan",
    upgradeNow: "Upgrade", perMonth: "/month", upgradeTitle: "Choose your plan", upgradeSub: "Learn faster with fewer limits",
    featureUploads3: "3 uploads per day", featureUploadsUnlimited: "Unlimited uploads & summaries",
    featureTutor5: "5 AI Tutor questions per day", featureTutorUnlimited: "Unlimited AI Tutor questions",
    featureQuizOnly: "Quizzes & flashcards", featureExams: "Full practice exams with marking",
    featureResourcesFree: "Free Resources only", featureResourcesFull: "Full Resources library access",
    featureResourcesEarly: "Early access to new past papers", featureOffline: "Download for offline use",
    featureBoardBasic: "Global leaderboard", featureBoardFull: "Class & school leaderboards",
    mostPopular: "Most popular", bestValue: "Best value", currentPlan: "Current plan",
    choosePlan: "Choose plan", payNow: "Pay now", cardNumber: "Card number",
    expiry: "Expiry", cvv: "CVV", nameOnCard: "Name on card", paySecure: "Payments are processed securely",
    paymentSuccess: "You're upgraded", paymentSuccessSub: "Welcome to your new plan. Let's keep learning.",
    done: "Done", tutorTitle: "AI Tutor", tutorSub: "Ask me anything about your schoolwork",
    tutorPlaceholder: "Type your question...",
    tutorWelcome: "Hi! I'm your AI Tutor. Ask me to explain a topic, help with homework, or quiz you on something you're learning.",
    send: "Send", thinking: "Thinking...", freeLimitReached: "You've used your free questions for today",
    freeLimitSub: "Upgrade for unlimited AI Tutor access", materialsLeft: "uploads left today",
    locked: "Locked feature", lockedSub: "Upgrade your plan to unlock this", lockedAdvanced: "Available on Advanced & Premium",
    lockedPremium: "Available on Premium only",
    whatsappTitle: "Use pailot on WhatsApp", whatsappSub: "Chat with your AI Tutor without an app",
    whatsappCta: "Open on WhatsApp", installApp: "Install pailot", installSub: "Add to your home screen for the full app feel",
    install: "Install", settings: "Settings", changeLanguage: "Change language", logout: "Log out",
    grade: "Grade / level", subject: "Subject", errorUpload: "Something went wrong reading that file. Try again?", retry: "Retry",
    chooseActionTitle: "What would you like to do first?", chooseActionSub: "You can always generate the others later from this material.",
    actionSummary: "Summarize it", actionFlashcards: "Make flashcards", actionQuiz: "Create a quiz", actionExam: "Build a practice exam",
    addAnotherPhoto: "Take another photo", addAnotherFile: "Add another file", itemsAdded: "added", removeItem: "Remove",
    fileTooLarge: "That file is too large. Try a smaller file, or fewer photos at once.",
    unsupportedFile: "That file type isn't supported. Try a PDF, Word document, text file, or photo.",
    resourcesTitle: "Resources", resourcesSub: "Past papers and study material from pailot",
    resourcesSearch: "Search resources...", resourcesEmpty: "No resources found",
    filterAll: "All", filterPapers: "Past papers", filterGuides: "Study guides", filterNotes: "Notes",
    resourceFree: "Free", resourceAdvanced: "Advanced+", resourcePremium: "Premium",
    viewResource: "View", downloadResource: "Download", newBadge: "New",
    speakNow: "Speak now", typeNotes: "Type your notes", speakInstead: "Speak instead",
    tapToSpeak: "Tap to start speaking", listening: "Listening...", tapToStop: "Tap to stop",
    micNotSupported: "Voice input isn't supported on this browser. Try Chrome on Android, or type instead.",
    micPermissionDenied: "Microphone access was denied. Check your browser settings to allow it.",
    speakOrType: "Speak or type your question", holdToTalk: "Hold to talk", quickActions: "Quick actions",
    typeYourNotesPlaceholder: "Type or paste your notes here...",
    heroTitle: "Turn any notes into a study session", heroSub: "Snap a photo, paste text, or speak — pailot summarizes it and builds quizzes, flashcards and exams for you.",
    heroCtaUpload: "Upload your first notes", heroCtaTutor: "Ask the AI Tutor",
    desktopUpgradeCta: "Go Premium", footerTagline: "Built for South African students.",
    suggestedPrompts: "Try asking", promptExplain: "Explain photosynthesis simply", promptHomework: "Help me with this homework question", promptQuiz: "Quiz me on the French Revolution",
    authWelcomeTitle: "Learn faster, in your language", authWelcomeSub: "Sign up to save your progress, join the leaderboard, and pick up right where you left off.",
    signUp: "Sign up", logIn: "Log in", forgotPassword: "Forgot password?", backToLogin: "Back to log in",
    fieldName: "Name", fieldSurname: "Surname", fieldEmail: "Email address", fieldPassword: "Password",
    haveAccount: "Already have an account?", noAccount: "Don't have an account?",
    resetPasswordTitle: "Reset your password", resetPasswordSub: "Enter your email and we'll send you a link to reset it.",
    sendResetLink: "Send reset link", resetLinkSent: "Check your email for a reset link.",
    setNewPasswordTitle: "Set a new password", setNewPasswordSub: "Choose a new password for your account.", newPassword: "New password", confirmPassword: "Confirm password",
    passwordsDontMatch: "Those passwords don't match.", passwordTooShort: "Password must be at least 6 characters.", saveNewPassword: "Save new password", passwordUpdated: "Password updated! Redirecting...",
    authErrorGeneric: "Something went wrong. Please check your details and try again.",
    authErrorExists: "An account with this email already exists.", authErrorInvalid: "Incorrect email or password.",
    signingUp: "Creating your account...", loggingIn: "Logging in...",
    profilePicture: "Profile picture", uploadPicture: "Upload picture", bioLabel: "Bio", bioPlaceholder: "Tell other learners a bit about yourself...",
    saveProfile: "Save changes", profileSaved: "Saved!",
    adminUploadTitle: "Upload resource", adminUploadSub: "Add a new past paper, study guide, or video for learners",
    adminFieldTitle: "Title", adminFieldType: "Type", adminFieldSubject: "Subject", adminFieldGrade: "Grade",
    adminFieldTier: "Who can access this", adminFieldFile: "File (PDF or video)", adminUploadBtn: "Upload resource",
    adminUploading: "Uploading...", adminUploadSuccess: "Resource uploaded", navAdmin: "Admin",
    typeVideo: "Video", allGrades: "All grades",
    logOutConfirm: "Log out",
    leaderboardLoading: "Loading leaderboard...", leaderboardEmptyReal: "No learners on the leaderboard yet — be the first!",
    weekly: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  },
  af: {
    langName: "Afrikaans", pickLanguageTitle: "Welkom by pailot", pickLanguageSub: "Kies jou taal om te begin",
    continue: "Gaan voort", appName: "pailot", tagline: "Neem 'n foto. Leer dit. Maak dit jou eie.",
    navHome: "Tuis", navUpload: "Laai op", navResources: "Hulpbronne", navTutor: "KI-Tutor", navBoard: "Ranglys", navProfile: "Profiel",
    greetingMorning: "Goeie môre", greetingAfternoon: "Goeie middag", greetingEvening: "Goeie naand",
    streakLabel: "dae aaneen", xpLabel: "XP", dailyGoal: "Daaglikse doelwit", minutesToday: "min vandag",
    yourMaterials: "Jou studiemateriaal", noMaterials: "Nog geen materiaal nie. Laai jou notas op om te begin.",
    uploadNew: "Laai nuwe materiaal op", takePhoto: "Neem 'n foto", chooseFile: "Kies 'n lêer", pasteText: "Plak teks eerder",
    processing: "pailot lees jou notas...", summaryReady: "Jou opsomming is reg",
    tabSummary: "Opsomming", tabFlashcards: "Flitskaarte", tabQuiz: "Kwis", tabExam: "Eksamen",
    generateSummary: "Skep opsomming", generateFlashcards: "Skep flitskaarte", generateQuiz: "Skep kwis", generateExam: "Skep oefeneksamen",
    startQuiz: "Begin kwis", startExam: "Begin eksamen", flipCard: "Tik om te draai", knewIt: "Ek het dit geweet", didntKnow: "Leer nog",
    cardsDone: "kaarte klaar", question: "Vraag", of: "van", submitAnswer: "Dien antwoord in", nextQuestion: "Volgende vraag",
    seeResults: "Sien resultate", correct: "Korrek!", incorrect: "Nie heeltemal nie", quizComplete: "Kwis voltooi",
    score: "Punte", xpEarned: "XP verdien", backHome: "Terug na tuis", tryAgain: "Probeer weer",
    leaderboardTitle: "Ranglys", leaderboardSub: "Top leerders hierdie week", you: "Jy",
    profileTitle: "Profiel", freePlan: "Gratis plan", advancedPlan: "Gevorderde plan", premiumPlan: "Premium plan",
    upgradeNow: "Gradeer op", perMonth: "/maand", upgradeTitle: "Kies jou plan", upgradeSub: "Leer vinniger met minder beperkings",
    featureUploads3: "3 oplaaie per dag", featureUploadsUnlimited: "Onbeperkte oplaaie en opsommings",
    featureTutor5: "5 KI-Tutor vrae per dag", featureTutorUnlimited: "Onbeperkte KI-Tutor vrae",
    featureQuizOnly: "Kwisse en flitskaarte", featureExams: "Volle oefeneksamens met punte",
    featureResourcesFree: "Slegs gratis hulpbronne", featureResourcesFull: "Volledige hulpbronbiblioteek",
    featureResourcesEarly: "Vroeë toegang tot nuwe vraestelle", featureOffline: "Laai af vir aflyn gebruik",
    featureBoardBasic: "Globale ranglys", featureBoardFull: "Klas- en skoolranglyste",
    mostPopular: "Gewildste", bestValue: "Beste waarde", currentPlan: "Huidige plan",
    choosePlan: "Kies plan", payNow: "Betaal nou", cardNumber: "Kaartnommer",
    expiry: "Vervaldatum", cvv: "CVV", nameOnCard: "Naam op kaart", paySecure: "Betalings word veilig verwerk",
    paymentSuccess: "Jy is opgegradeer", paymentSuccessSub: "Welkom by jou nuwe plan. Kom ons leer verder.",
    done: "Klaar", tutorTitle: "KI-Tutor", tutorSub: "Vra my enigiets oor jou skoolwerk",
    tutorPlaceholder: "Tik jou vraag...",
    tutorWelcome: "Hallo! Ek is jou KI-Tutor. Vra my om 'n onderwerp te verduidelik, help met huiswerk, of kwis jou oor iets wat jy leer.",
    send: "Stuur", thinking: "Dink...", freeLimitReached: "Jy het jou gratis vrae vir vandag gebruik",
    freeLimitSub: "Gradeer op vir onbeperkte KI-Tutor toegang", materialsLeft: "oplaaie oor vandag",
    locked: "Gesluite funksie", lockedSub: "Gradeer jou plan op om dit te ontsluit", lockedAdvanced: "Beskikbaar op Gevorderd & Premium",
    lockedPremium: "Slegs beskikbaar op Premium",
    whatsappTitle: "Gebruik pailot op WhatsApp", whatsappSub: "Gesels met jou KI-Tutor sonder 'n app",
    whatsappCta: "Maak oop op WhatsApp", installApp: "Installeer pailot", installSub: "Voeg by jou tuisskerm vir die volle app-gevoel",
    install: "Installeer", settings: "Instellings", changeLanguage: "Verander taal", logout: "Teken uit",
    grade: "Graad / vlak", subject: "Vak", errorUpload: "Iets het verkeerd geloop met die lêer. Probeer weer?", retry: "Probeer weer",
    chooseActionTitle: "Wat wil jy eerste doen?", chooseActionSub: "Jy kan later altyd die ander opsies ook skep vanaf hierdie materiaal.",
    actionSummary: "Som dit op", actionFlashcards: "Skep flitskaarte", actionQuiz: "Skep 'n kwis", actionExam: "Bou 'n oefeneksamen",
    addAnotherPhoto: "Neem nog 'n foto", addAnotherFile: "Voeg nog 'n lêer by", itemsAdded: "bygevoeg", removeItem: "Verwyder",
    fileTooLarge: "Daardie lêer is te groot. Probeer 'n kleiner lêer, of minder foto's op 'n slag.",
    unsupportedFile: "Daardie lêertipe word nie ondersteun nie. Probeer 'n PDF, Word-dokument, teksleer, of foto.",
    resourcesTitle: "Hulpbronne", resourcesSub: "Ou vraestelle en studiemateriaal van pailot",
    resourcesSearch: "Soek hulpbronne...", resourcesEmpty: "Geen hulpbronne gevind nie",
    filterAll: "Alles", filterPapers: "Ou vraestelle", filterGuides: "Studiegidse", filterNotes: "Notas",
    resourceFree: "Gratis", resourceAdvanced: "Gevorderd+", resourcePremium: "Premium",
    viewResource: "Bekyk", downloadResource: "Laai af", newBadge: "Nuut",
    speakNow: "Praat nou", typeNotes: "Tik jou notas", speakInstead: "Praat eerder",
    tapToSpeak: "Tik om te begin praat", listening: "Luister...", tapToStop: "Tik om te stop",
    micNotSupported: "Stemtoevoer word nie op hierdie blaaier ondersteun nie. Probeer Chrome op Android, of tik eerder.",
    micPermissionDenied: "Mikrofoontoegang is geweier. Gaan jou blaaier-instellings na om dit toe te laat.",
    speakOrType: "Praat of tik jou vraag", holdToTalk: "Hou om te praat", quickActions: "Vinnige aksies",
    typeYourNotesPlaceholder: "Tik of plak jou notas hier...",
    heroTitle: "Maak van enige notas 'n studiesessie", heroSub: "Neem 'n foto, plak teks, of praat — pailot som dit op en skep kwisse, flitskaarte en eksamens vir jou.",
    heroCtaUpload: "Laai jou eerste notas op", heroCtaTutor: "Vra die KI-Tutor",
    desktopUpgradeCta: "Gaan Premium", footerTagline: "Gebou vir Suid-Afrikaanse studente.",
    suggestedPrompts: "Probeer vra", promptExplain: "Verduidelik fotosintese eenvoudig", promptHomework: "Help my met hierdie huiswerkvraag", promptQuiz: "Kwis my oor die Franse Revolusie",
    authWelcomeTitle: "Leer vinniger, in jou taal", authWelcomeSub: "Registreer om jou vooruitgang te stoor, by die ranglys aan te sluit, en op te tel waar jy opgehou het.",
    signUp: "Registreer", logIn: "Teken in", forgotPassword: "Wagwoord vergeet?", backToLogin: "Terug na inteken",
    fieldName: "Naam", fieldSurname: "Van", fieldEmail: "E-posadres", fieldPassword: "Wagwoord",
    haveAccount: "Het jy reeds 'n rekening?", noAccount: "Het jy nie 'n rekening nie?",
    resetPasswordTitle: "Herstel jou wagwoord", resetPasswordSub: "Voer jou e-pos in en ons stuur vir jou 'n skakel om dit te herstel.",
    sendResetLink: "Stuur herstel-skakel", resetLinkSent: "Kyk jou e-pos vir 'n herstel-skakel.",
    setNewPasswordTitle: "Stel 'n nuwe wagwoord", setNewPasswordSub: "Kies 'n nuwe wagwoord vir jou rekening.", newPassword: "Nuwe wagwoord", confirmPassword: "Bevestig wagwoord",
    passwordsDontMatch: "Daardie wagwoorde stem nie ooreen nie.", passwordTooShort: "Wagwoord moet minstens 6 karakters wees.", saveNewPassword: "Stoor nuwe wagwoord", passwordUpdated: "Wagwoord opgedateer! Herlei tans...",
    authErrorGeneric: "Iets het verkeerd geloop. Gaan asseblief jou besonderhede na en probeer weer.",
    authErrorExists: "'n Rekening met hierdie e-pos bestaan reeds.", authErrorInvalid: "Verkeerde e-pos of wagwoord.",
    signingUp: "Skep jou rekening...", loggingIn: "Teken in...",
    profilePicture: "Profielfoto", uploadPicture: "Laai foto op", bioLabel: "Bio", bioPlaceholder: "Vertel ander leerders 'n bietjie van jouself...",
    saveProfile: "Stoor veranderinge", profileSaved: "Gestoor!",
    adminUploadTitle: "Laai hulpbron op", adminUploadSub: "Voeg 'n nuwe ou vraestel, studiegids, of video by vir leerders",
    adminFieldTitle: "Titel", adminFieldType: "Tipe", adminFieldSubject: "Vak", adminFieldGrade: "Graad",
    adminFieldTier: "Wie kan dit toegang", adminFieldFile: "Lêer (PDF of video)", adminUploadBtn: "Laai hulpbron op",
    adminUploading: "Laai op...", adminUploadSuccess: "Hulpbron opgelaai", navAdmin: "Admin",
    typeVideo: "Video", allGrades: "Alle grade",
    logOutConfirm: "Teken uit",
    leaderboardLoading: "Laai ranglys...", leaderboardEmptyReal: "Nog geen leerders op die ranglys nie — wees die eerste!",
    weekly: ["Ma","Di","Wo","Do","Vr","Sa","So"],
  },
  zu: {
    langName: "isiZulu", pickLanguageTitle: "Siyakwamukela ku-pailot", pickLanguageSub: "Khetha ulimi lwakho ukuqala",
    continue: "Qhubeka", appName: "pailot", tagline: "Thatha isithombe. Kufunde. Kube okwakho.",
    navHome: "Ikhaya", navUpload: "Layisha", navResources: "Izinsiza", navTutor: "Uthisha we-AI", navBoard: "Ibhodi Labaholi", navProfile: "Iphrofayela",
    greetingMorning: "Sawubona ekuseni", greetingAfternoon: "Sawubona ntambama", greetingEvening: "Sawubona kusihlwa",
    streakLabel: "izinsuku ezilandelana", xpLabel: "XP", dailyGoal: "Inhloso yansuku zonke", minutesToday: "imizuzu namuhla",
    yourMaterials: "Izincwadi zakho zokufunda", noMaterials: "Awukabi nezincwadi. Layisha amanothi akho ukuqala.",
    uploadNew: "Layisha izincwadi ezintsha", takePhoto: "Thatha isithombe", chooseFile: "Khetha ifayela", pasteText: "Faka umbhalo kunalokho",
    processing: "pailot ifunda amanothi akho...", summaryReady: "Isifinyezo sakho sesilungile",
    tabSummary: "Isifinyezo", tabFlashcards: "Amakhadi okufunda", tabQuiz: "Imibuzo", tabExam: "Ukuhlolwa",
    generateSummary: "Dala isifinyezo", generateFlashcards: "Dala amakhadi okufunda", generateQuiz: "Dala imibuzo", generateExam: "Dala ukuhlolwa kokuzilolonga",
    startQuiz: "Qala imibuzo", startExam: "Qala ukuhlolwa", flipCard: "Thepha ukuphendula", knewIt: "Bengikwazi", didntKnow: "Ngisafunda",
    cardsDone: "amakhadi aqediwe", question: "Umbuzo", of: "ku-", submitAnswer: "Thumela impendulo", nextQuestion: "Umbuzo olandelayo",
    seeResults: "Bona imiphumela", correct: "Kulungile!", incorrect: "Akuyilona", quizComplete: "Imibuzo iqediwe",
    score: "Amaphuzu", xpEarned: "XP ezitholiwe", backHome: "Buyela ekhaya", tryAgain: "Zama futhi",
    leaderboardTitle: "Ibhodi Labaholi", leaderboardSub: "Abafundi abaphambili kuleli sonto", you: "Wena",
    profileTitle: "Iphrofayela", freePlan: "Uhlelo lwamahhala", advancedPlan: "Uhlelo Eliphucukile", premiumPlan: "Uhlelo lwe-Premium",
    upgradeNow: "Thuthukisa", perMonth: "/ngenyanga", upgradeTitle: "Khetha uhlelo lwakho", upgradeSub: "Funda ngokushesha ngeminqamulajuqu emincane",
    featureUploads3: "Ukulayisha oku-3 ngosuku", featureUploadsUnlimited: "Ukulayisha nezifinyezo ezingenamkhawulo",
    featureTutor5: "Imibuzo emi-5 kuThisha we-AI ngosuku", featureTutorUnlimited: "Imibuzo engenamkhawulo kuThisha we-AI",
    featureQuizOnly: "Imibuzo namakhadi okufunda", featureExams: "Ukuhlolwa okugcwele kokuzilolonga okumakwa",
    featureResourcesFree: "Izinsiza zamahhala kuphela", featureResourcesFull: "Ukufinyelela okugcwele kwizinsiza",
    featureResourcesEarly: "Ukufinyelela kuqala kumaphepha okuhlolwa amasha", featureOffline: "Dawuniloda ukusebenzisa ngale kwe-inthanethi",
    featureBoardBasic: "Ibhodi labaholi lomhlaba", featureBoardFull: "Amabhodi labaholi bekilasi nesikole",
    mostPopular: "Okuthandwa kakhulu", bestValue: "Inani elingcono", currentPlan: "Uhlelo lwamanje",
    choosePlan: "Khetha uhlelo", payNow: "Khokha manje", cardNumber: "Inombolo yekhadi",
    expiry: "Iphelelwa isikhathi", cvv: "CVV", nameOnCard: "Igama elikhadini", paySecure: "Izinkokhelo zicutshungulwa ngokuphephile",
    paymentSuccess: "Usuthuthukisiwe", paymentSuccessSub: "Siyakwamukela ohlelweni lwakho olusha. Asiqhubeke sifunda.",
    done: "Kwenziwe", tutorTitle: "Uthisha we-AI", tutorSub: "Ngibuze noma ini ngomsebenzi wesikole",
    tutorPlaceholder: "Thayipha umbuzo wakho...",
    tutorWelcome: "Sawubona! Ngiyithisha yakho ye-AI. Ngicela ungichaze isihloko, ungisize nomsebenzi wesikole, noma ungihlole ngokuthile okufundayo.",
    send: "Thumela", thinking: "Ngicabanga...", freeLimitReached: "Usuzisebenzisile imibuzo yakho yamahhala yanamuhla",
    freeLimitSub: "Thuthukisa ukuthola ukufinyelela okungenamkhawulo kuThisha we-AI", materialsLeft: "ukulayisha okusele namuhla",
    locked: "Isici esivaliwe", lockedSub: "Thuthukisa uhlelo lwakho ukuvula lokhu", lockedAdvanced: "Kutholakala ku-Eliphucukile & Premium",
    lockedPremium: "Kutholakala ku-Premium kuphela",
    whatsappTitle: "Sebenzisa pailot ku-WhatsApp", whatsappSub: "Xoxa noThisha wakho we-AI ngaphandle kohlelo lokusebenza",
    whatsappCta: "Vula ku-WhatsApp", installApp: "Faka i-pailot", installSub: "Engeza esikrinini sasekhaya ukuthola umuzwa ophelele",
    install: "Faka", settings: "Izilungiselelo", changeLanguage: "Shintsha ulimi", logout: "Phuma",
    grade: "Ibanga / izinga", subject: "Isifundo", errorUpload: "Kube nesimo esingalungile sokufunda lelo fayela. Zama futhi?", retry: "Zama futhi",
    chooseActionTitle: "Yini ofuna ukuyenza kuqala?", chooseActionSub: "Ungakwazi ukwenza ezinye izinto ngokuhamba kwesikhathi kule ngxenye yezifundo.",
    actionSummary: "Yifingqe", actionFlashcards: "Yenza amakhadi okufunda", actionQuiz: "Yenza umbuzo", actionExam: "Yakha isivivinyo sokuzilolonga",
    addAnotherPhoto: "Thatha esinye isithombe", addAnotherFile: "Engeza elinye ifayela", itemsAdded: "engeziwe", removeItem: "Susa",
    fileTooLarge: "Leli fayela likhulu kakhulu. Zama ifayela elincane, noma izithombe ezimbalwa ngesikhathi.",
    unsupportedFile: "Loluhlobo lwefayela aluzesekelwa. Zama i-PDF, idokhumenti ye-Word, ifayela lombhalo, noma isithombe.",
    resourcesTitle: "Izinsiza", resourcesSub: "Amaphepha okuhlolwa amadala kanye nezincwadi ezivela ku-pailot",
    resourcesSearch: "Sesha izinsiza...", resourcesEmpty: "Azikho izinsiza ezitholakele",
    filterAll: "Konke", filterPapers: "Amaphepha amadala", filterGuides: "Izincwadi zokuqondisa", filterNotes: "Amanothi",
    resourceFree: "Mahhala", resourceAdvanced: "Eliphucukile+", resourcePremium: "Premium",
    viewResource: "Buka", downloadResource: "Dawuniloda", newBadge: "Okusha",
    speakNow: "Khuluma manje", typeNotes: "Thayipha amanothi akho", speakInstead: "Khuluma kunalokho",
    tapToSpeak: "Thepha ukuqala ukukhuluma", listening: "Ngilalele...", tapToStop: "Thepha ukumisa",
    micNotSupported: "Ukufaka ngezwi akusekelwe kuleli sizulazane. Zama u-Chrome ku-Android, noma uthayiphe kunalokho.",
    micPermissionDenied: "Ukufinyelela kumakrofoni kwenqatshelwe. Hlola izilungiselelo zesizulazane sakho ukukuvumela.",
    speakOrType: "Khuluma noma uthayiphe umbuzo wakho", holdToTalk: "Bamba ukukhuluma", quickActions: "Izenzo ezisheshayo",
    typeYourNotesPlaceholder: "Thayipha noma faka amanothi akho lapha...",
    heroTitle: "Phendula noma amanothi abe yisifundo", heroSub: "Thatha isithombe, faka umbhalo, noma khuluma — pailot iyifinyeza futhi yakhe imibuzo, amakhadi okufunda kanye nokuhlolwa.",
    heroCtaUpload: "Layisha amanothi akho okuqala", heroCtaTutor: "Buza uThisha we-AI",
    desktopUpgradeCta: "Yiba Premium", footerTagline: "Yakhelwe abafundi baseNingizimu Afrika.",
    suggestedPrompts: "Zama ukubuza", promptExplain: "Chaza ukukhiqizwa kokukhanya kalula", promptHomework: "Ngisize ngalo mbuzo womsebenzi wesikole", promptQuiz: "Ngihlole ku-French Revolution",
    authWelcomeTitle: "Funda ngokushesha, ngolimi lwakho", authWelcomeSub: "Bhalisa ukulondoloza inqubekelaphambili yakho, ujoyine ibhodi labaholi, futhi uqhubeke lapho oshiya khona.",
    signUp: "Bhalisa", logIn: "Ngena", forgotPassword: "Ukhohlwe iphasiwedi?", backToLogin: "Buyela ekungeneni",
    fieldName: "Igama", fieldSurname: "Isibongo", fieldEmail: "Ikheli le-imeyili", fieldPassword: "Iphasiwedi",
    haveAccount: "Usunayo i-akhawunti?", noAccount: "Awunayo i-akhawunti?",
    resetPasswordTitle: "Setha kabusha iphasiwedi yakho", resetPasswordSub: "Faka i-imeyili yakho futhi sizokuthumela isixhumanisi sokuyisetha kabusha.",
    sendResetLink: "Thumela isixhumanisi", resetLinkSent: "Hlola i-imeyili yakho ngesixhumanisi sokusetha kabusha.",
    setNewPasswordTitle: "Setha iphasiwedi entsha", setNewPasswordSub: "Khetha iphasiwedi entsha yeakhawunti yakho.", newPassword: "Iphasiwedi entsha", confirmPassword: "Qinisekisa iphasiwedi",
    passwordsDontMatch: "Lawo maphasiwedi awafani.", passwordTooShort: "Iphasiwedi kufanele ibe nezinhlamvu ezingaphezu kwezi-6.", saveNewPassword: "Gcina iphasiwedi entsha", passwordUpdated: "Iphasiwedi ibuyekeziwe! Iyaqondisa...",
    authErrorGeneric: "Kube nesimo esingalungile. Sicela uhlole imininingwane yakho uzame futhi.",
    authErrorExists: "I-akhawunti enale-imeyili ivele ikhona.", authErrorInvalid: "I-imeyili noma iphasiwedi engalungile.",
    signingUp: "Iyakha i-akhawunti yakho...", loggingIn: "Iyangena...",
    profilePicture: "Isithombe sephrofayela", uploadPicture: "Layisha isithombe", bioLabel: "Bio", bioPlaceholder: "Tshela abafundi abanye okuncane ngawe...",
    saveProfile: "Londoloza izinguquko", profileSaved: "Kulondoloziwe!",
    adminUploadTitle: "Layisha insiza", adminUploadSub: "Engeza iphepha lokuhlolwa elidala, incwadi yokuqondisa, noma ividiyo entsha",
    adminFieldTitle: "Isihloko", adminFieldType: "Uhlobo", adminFieldSubject: "Isifundo", adminFieldGrade: "Ibanga",
    adminFieldTier: "Ubani ongafinyelela lokhu", adminFieldFile: "Ifayela (PDF noma ividiyo)", adminUploadBtn: "Layisha insiza",
    adminUploading: "Iyalayisha...", adminUploadSuccess: "Insiza ilayishiwe", navAdmin: "Admin",
    typeVideo: "Ividiyo", allGrades: "Wonke amabanga",
    logOutConfirm: "Phuma",
    leaderboardLoading: "Ilayisha ibhodi labaholi...", leaderboardEmptyReal: "Akukho bafundi kubhodi labaholi okwamanje — yiba owokuqala!",
    weekly: ["Mso","Bi","Tha","Sin","Hla","Mgq","Son"],
  },
  xh: {
    langName: "isiXhosa", pickLanguageTitle: "Wamkelekile kwi-pailot", pickLanguageSub: "Khetha ulwimi lwakho ukuqalisa",
    continue: "Qhubeka", appName: "pailot", tagline: "Thabatha ifoto. Yifunde. Yenze yeyakho.",
    navHome: "Ikhaya", navUpload: "Layisha", navResources: "Izixhobo", navTutor: "Utitshala we-AI", navBoard: "Ibhodi Yabaphambili", navProfile: "Iprofayile",
    greetingMorning: "Molo kusasa", greetingAfternoon: "Molo emini", greetingEvening: "Molo ngorhatya",
    streakLabel: "iintsuku ezilandelelanayo", xpLabel: "XP", dailyGoal: "Injongo yemihla ngemihla", minutesToday: "imizuzu namhlanje",
    yourMaterials: "Izixhobo zakho zokufunda", noMaterials: "Awukabi nazixhobo. Layisha amanqaku akho ukuqalisa.",
    uploadNew: "Layisha izixhobo ezintsha", takePhoto: "Thabatha ifoto", chooseFile: "Khetha ifayile", pasteText: "Ncamathisela umbhalo endaweni yoko",
    processing: "pailot ifunda amanqaku akho...", summaryReady: "Isishwankathelo sakho sikulungele",
    tabSummary: "Isishwankathelo", tabFlashcards: "Amakhadi okufunda", tabQuiz: "Uvavanyo", tabExam: "Uviwo",
    generateSummary: "Yenza isishwankathelo", generateFlashcards: "Yenza amakhadi okufunda", generateQuiz: "Yenza uvavanyo", generateExam: "Yenza uviwo lokuzilolonga",
    startQuiz: "Qalisa uvavanyo", startExam: "Qalisa uviwo", flipCard: "Cofa ukujika", knewIt: "Ndibukwazi", didntKnow: "Ndisafunda",
    cardsDone: "amakhadi agqityiweyo", question: "Umbuzo", of: "kwi-", submitAnswer: "Ngenisa impendulo", nextQuestion: "Umbuzo olandelayo",
    seeResults: "Jonga iziphumo", correct: "Ichanekile!", incorrect: "Asiyiyo", quizComplete: "Uvavanyo lugqityiwe",
    score: "Amanqaku", xpEarned: "XP ezifumeneyo", backHome: "Buyela ekhaya", tryAgain: "Zama kwakhona",
    leaderboardTitle: "Ibhodi Yabaphambili", leaderboardSub: "Abafundi abaphambili kuveki", you: "Wena",
    profileTitle: "Iprofayile", freePlan: "Isicwangciso samahhala", advancedPlan: "Isicwangciso Esiphucukileyo", premiumPlan: "Isicwangciso se-Premium",
    upgradeNow: "Phucula", perMonth: "/ngenyanga", upgradeTitle: "Khetha isicwangciso sakho", upgradeSub: "Funda ngokukhawuleza neemida ezincinci",
    featureUploads3: "Ukulayisha oku-3 ngemini", featureUploadsUnlimited: "Ukulayisha nokushwankathela okungenammda",
    featureTutor5: "Imibuzo emi-5 kuTitshala we-AI ngemini", featureTutorUnlimited: "Imibuzo engenammda kuTitshala we-AI",
    featureQuizOnly: "Uvavanyo namakhadi okufunda", featureExams: "Uviwo olupheleleyo lokuzilolonga oluphawulwayo",
    featureResourcesFree: "Izixhobo zamahhala kuphela", featureResourcesFull: "Ukufikelela okupheleleyo kwizixhobo",
    featureResourcesEarly: "Ukufikelela kuqala kuphepha lovavanyo olutsha", featureOffline: "Khuphela ukusebenzisa ngaphandle kwe-intanethi",
    featureBoardBasic: "Ibhodi yabaphambili yehlabathi", featureBoardFull: "Iibhodi zabaphambili zeklasi nesikolo",
    mostPopular: "Othandwa kakhulu", bestValue: "Ixabiso elingcono", currentPlan: "Isicwangciso sangoku",
    choosePlan: "Khetha isicwangciso", payNow: "Hlawula ngoku", cardNumber: "Inombolo yekhadi",
    expiry: "Iphelelwa ixesha", cvv: "CVV", nameOnCard: "Igama elikhadini", paySecure: "Iintlawulo ziqhutywa ngokukhuselekileyo",
    paymentSuccess: "Uphuculwe", paymentSuccessSub: "Wamkelekile kwisicwangciso sakho esitsha. Masiqhubeke sifunda.",
    done: "Kwenziwe", tutorTitle: "Utitshala we-AI", tutorSub: "Ndibuze nantonina ngomsebenzi wesikolo",
    tutorPlaceholder: "Chwetheza umbuzo wakho...",
    tutorWelcome: "Molo! Ndingutitshala wakho we-AI. Ndicele undichazele umxholo, ndincede ngomsebenzi wesikolo, okanye undivavanye ngento oyifundayo.",
    send: "Thumela", thinking: "Ndicinga...", freeLimitReached: "Usebenzise imibuzo yakho yamahhala yanamhlanje",
    freeLimitSub: "Phucula ukufumana ukufikelela okungenammda kuTitshala we-AI", materialsLeft: "ukulayisha okuseleyo namhlanje",
    locked: "Isakhono esivaliweyo", lockedSub: "Phucula isicwangciso sakho ukuvula oku", lockedAdvanced: "Ifumaneka kwi-Esiphucukileyo & Premium",
    lockedPremium: "Ifumaneka kwi-Premium kuphela",
    whatsappTitle: "Sebenzisa pailot kwi-WhatsApp", whatsappSub: "Ncokola noTitshala wakho we-AI ngaphandle kwesixhobo",
    whatsappCta: "Vula kwi-WhatsApp", installApp: "Faka pailot", installSub: "Yongeza kwiskrini sasekhaya ukufumana umvakalelo opheleleyo",
    install: "Faka", settings: "Useto", changeLanguage: "Tshintsha ulwimi", logout: "Phuma",
    grade: "Ibanga / inqanaba", subject: "Isifundo", errorUpload: "Kubekho ingxaki ngokufunda elo fayile. Zama kwakhona?", retry: "Zama kwakhona",
    chooseActionTitle: "Yintoni ofuna ukuyenza kuqala?", chooseActionSub: "Usenokwenza ezinye izinto kamva kolu lwazi.",
    actionSummary: "Yishwankathele", actionFlashcards: "Yenza amakhadi okufunda", actionQuiz: "Yenza uvavanyo", actionExam: "Yakha uviwo lokuzilolonga",
    addAnotherPhoto: "Thatha enye ifoto", addAnotherFile: "Yongeza elinye ifayile", itemsAdded: "yongeziwe", removeItem: "Susa",
    fileTooLarge: "Le fayile inkulu kakhulu. Zama ifayile encinci, okanye iifoto ezimbalwa ngexesha elinye.",
    unsupportedFile: "Olu hlobo lwefayile aluxhaswanga. Zama i-PDF, uxwebhu lwe-Word, ifayile yombhalo, okanye ifoto.",
    resourcesTitle: "Izixhobo", resourcesSub: "Amaphepha amandulo kunye nezixhobo zokufunda ezivela ku-pailot",
    resourcesSearch: "Khangela izixhobo...", resourcesEmpty: "Akukho zixhobo zifunyenweyo",
    filterAll: "Konke", filterPapers: "Amaphepha amandulo", filterGuides: "Izikhokelo zokufunda", filterNotes: "Amanqaku",
    resourceFree: "Mahhala", resourceAdvanced: "Esiphucukileyo+", resourcePremium: "Premium",
    viewResource: "Jonga", downloadResource: "Khuphela", newBadge: "Entsha",
    speakNow: "Thetha ngoku", typeNotes: "Chwetheza amanqaku akho", speakInstead: "Thetha kunoko",
    tapToSpeak: "Cofa ukuqalisa ukuthetha", listening: "Ndimamele...", tapToStop: "Cofa ukumisa",
    micNotSupported: "Ukungenisa ngelizwi akuxhaswa kwiqonga eli. Zama uChrome kwi-Android, okanye uchwetheze kunoko.",
    micPermissionDenied: "Ukufikelela kwimakrofoni kwaliwe. Jonga useto lweqonga lakho ukukuvumela.",
    speakOrType: "Thetha okanye uchwetheze umbuzo wakho", holdToTalk: "Bamba ukuthetha", quickActions: "Izenzo ezikhawulezayo",
    typeYourNotesPlaceholder: "Chwetheza okanye ncamathisela amanqaku akho apha...",
    heroTitle: "Guqula nawaphi amanqaku abe yiseshini yokufunda", heroSub: "Thabatha ifoto, ncamathisela umbhalo, okanye uthethe — pailot iyishwankathela ize yenze uvavanyo, amakhadi nezivivinyo.",
    heroCtaUpload: "Layisha amanqaku akho okuqala", heroCtaTutor: "Buza uTitshala we-AI",
    desktopUpgradeCta: "Yiba Premium", footerTagline: "Yenzelwe abafundi baseMzantsi Afrika.",
    suggestedPrompts: "Zama ukubuza", promptExplain: "Cacisa i-photosynthesis ngokulula", promptHomework: "Ndincede ngalo mbuzo womsebenzi wesikolo", promptQuiz: "Ndivavanye nge-French Revolution",
    authWelcomeTitle: "Funda ngokukhawuleza, ngolwimi lwakho", authWelcomeSub: "Bhalisa ukugcina inkqubela yakho, ujoyine ibhodi yabaphambili, uqhubeke apho ushiye khona.",
    signUp: "Bhalisa", logIn: "Ngena", forgotPassword: "Ulibele iphasiwedi?", backToLogin: "Buyela kungena",
    fieldName: "Igama", fieldSurname: "Ifani", fieldEmail: "Idilesi ye-imeyile", fieldPassword: "Iphasiwedi",
    haveAccount: "Sele unayo i-akhawunti?", noAccount: "Awunayo i-akhawunti?",
    resetPasswordTitle: "Phinda usete iphasiwedi yakho", resetPasswordSub: "Faka i-imeyile yakho size sikuthumele ikhonkco lokuyiseta kwakhona.",
    sendResetLink: "Thumela ikhonkco", resetLinkSent: "Jonga i-imeyile yakho ngekhonkco lokuseta kwakhona.",
    setNewPasswordTitle: "Seta iphasiwedi entsha", setNewPasswordSub: "Khetha iphasiwedi entsha yeakhawunti yakho.", newPassword: "Iphasiwedi entsha", confirmPassword: "Qinisekisa iphasiwedi",
    passwordsDontMatch: "Loo maphasiwedi awafani.", passwordTooShort: "Iphasiwedi kufuneka ibe noonobumba abangama-6 ubuncinane.", saveNewPassword: "Gcina iphasiwedi entsha", passwordUpdated: "Iphasiwedi ihlaziyiwe! Iyalathisa...",
    authErrorGeneric: "Kubekho ingxaki. Nceda ujonge iinkcukacha zakho uzame kwakhona.",
    authErrorExists: "I-akhawunti ene-imeyile efanayo ikhona kakade.", authErrorInvalid: "I-imeyile okanye iphasiwedi engachanekileyo.",
    signingUp: "Iyenza i-akhawunti yakho...", loggingIn: "Iyangena...",
    profilePicture: "Umfanekiso wephrofayile", uploadPicture: "Layisha umfanekiso", bioLabel: "Bio", bioPlaceholder: "Xelela abafundi abanye okuncinci ngawe...",
    saveProfile: "Gcina utshintsho", profileSaved: "Kugciniwe!",
    adminUploadTitle: "Layisha isixhobo", adminUploadSub: "Yongeza iphepha lovavanyo elidala, isikhokelo, okanye ividiyo entsha",
    adminFieldTitle: "Isihloko", adminFieldType: "Uhlobo", adminFieldSubject: "Isifundo", adminFieldGrade: "Ibanga",
    adminFieldTier: "Ngubani onokufikelela oku", adminFieldFile: "Ifayile (PDF okanye ividiyo)", adminUploadBtn: "Layisha isixhobo",
    adminUploading: "Iyalayisha...", adminUploadSuccess: "Isixhobo silayishwe", navAdmin: "Admin",
    typeVideo: "Ividiyo", allGrades: "Amabanga onke",
    logOutConfirm: "Phuma",
    leaderboardLoading: "Ilayisha ibhodi yabaphambili...", leaderboardEmptyReal: "Akukho bafundi kwibhodi yabaphambili okwangoku — yiba owokuqala!",
    weekly: ["Mvu","Lwe","Tha","Sin","Hla","Mgq","Caw"],
  },
};

const LANGS = [
  { code: "en", label: "English", native: "English" },
  { code: "af", label: "Afrikaans", native: "Afrikaans" },
  { code: "zu", label: "isiZulu", native: "isiZulu" },
  { code: "xh", label: "isiXhosa", native: "isiXhosa" },
];

/* Plan tiers: "free" | "advanced" | "premium" */
const PLAN_LIMITS = {
  free: { uploadsPerDay: 3, tutorPerDay: 5, exams: false, resourceTier: 0, offline: false, boardFull: false },
  advanced: { uploadsPerDay: Infinity, tutorPerDay: Infinity, exams: true, resourceTier: 1, offline: false, boardFull: false },
  premium: { uploadsPerDay: Infinity, tutorPerDay: Infinity, exams: true, resourceTier: 2, offline: true, boardFull: true },
};

/* ============================== CALL CLAUDE ============================== */
/* Calls our own /api/claude serverless function (see /api/claude.js), which holds the
   real Anthropic API key server-side. Never point this directly at api.anthropic.com
   from browser code — the key would be exposed to anyone who opens dev tools. */
async function callClaude(messages, system, maxTokens = 1024) {
  const resp = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: maxTokens, system, messages }),
  });
  const data = await resp.json();
  return (data.content || []).map((b) => (b.type === "text" ? b.text : "")).filter(Boolean).join("\n");
}

function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const startArr = cleaned.indexOf("[");
  let from = start;
  if (start === -1 || (startArr !== -1 && startArr < start)) from = startArr;
  const lastBrace = cleaned.lastIndexOf("}");
  const lastBracket = cleaned.lastIndexOf("]");
  const to = Math.max(lastBrace, lastBracket);
  const slice = from !== -1 && to !== -1 ? cleaned.slice(from, to + 1) : cleaned;
  try { return JSON.parse(slice); } catch (e) { return null; }
}

/* ============================== SPEECH RECOGNITION ============================== */
/* Browser speech-to-text (Web Speech API) only ships language models for some locales.
   isiZulu and isiXhosa are not currently supported by Chrome/Android's recognizer, so we
   fall back to South African English recognition for those two and let the person know
   typing is the more reliable option for now. */
const SPEECH_LANG_MAP = { en: "en-ZA", af: "af-ZA", zu: "en-ZA", xh: "en-ZA" };
const SPEECH_NATIVE_SUPPORT = { en: true, af: true, zu: false, xh: false };

function useSpeechRecognition(langCode) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const isSupported = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const start = useCallback(() => {
    setError(null);
    setTranscript("");
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError("unsupported"); return; }
    const recognition = new SR();
    recognition.lang = SPEECH_LANG_MAP[langCode] || "en-ZA";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = (e) => {
      let finalText = "";
      for (let i = 0; i < e.results.length; i++) finalText += e.results[i][0].transcript + " ";
      setTranscript(finalText.trim());
    };
    recognition.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "permission-denied") setError("denied");
      else setError("error");
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    try { recognition.start(); setListening(true); } catch (e) { setError("error"); }
  }, [langCode]);

  const stop = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
  }, []);

  return { isSupported: !!isSupported, listening, transcript, error, start, stop, setTranscript };
}

/* ============================== RESPONSIVE LAYOUT HOOK ============================== */
const DESKTOP_BREAKPOINT = 900;
const TABLET_BREAKPOINT = 680;

function useViewport() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return {
    width,
    isDesktop: width >= DESKTOP_BREAKPOINT,
    isTablet: width >= TABLET_BREAKPOINT && width < DESKTOP_BREAKPOINT,
    isMobile: width < TABLET_BREAKPOINT,
  };
}

/* ============================== STYLE TOKENS ============================== */
const C = {
  ink: "#0d173b", inkSoft: "#16224d", paper: "#FFFFFF", paperDim: "#F2F4EF",
  green: "#84ac64", greenDeep: "#5E7E45", greenSoft: "rgba(132,172,100,0.14)",
  gold: "#E0B45C", goldDeep: "#BD8F35", teal: "#5FB8A6", tealDeep: "#3D8F7F",
  coral: "#D9694F", purple: "#8B7FD6", purpleDeep: "#5E51AD",
  line: "rgba(13,23,59,0.1)", lineLight: "rgba(255,255,255,0.14)",
};
const FONT_HEAD = "'Space Grotesk', 'Segoe UI', sans-serif";
const FONT_BODY = "'Inter', 'Segoe UI', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

function GoogleFonts() {
  return <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" />;
}

/* ============================== SPOTLIGHT REVEAL EFFECT ============================== */
/* A soft glow that follows the cursor (desktop) or the touch/drag point (mobile),
   revealing a faint grid texture and a colored aura underneath. Wrap any dark-background
   section in this to give it the "swipe to reveal" feel. Pure CSS + one mousemove/touchmove
   listener — no extra libraries needed. */
function Spotlight({ children, style, tone = "green", className }) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);

  const handleMove = (clientX, clientY) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const auraColor = tone === "green" ? "132,172,100" : tone === "gold" ? "224,180,92" : "95,184,166";

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseMove={(e) => { handleMove(e.clientX, e.clientY); setActive(true); }}
      onMouseLeave={() => setActive(false)}
      onTouchMove={(e) => { if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY); setActive(true); }}
      onTouchEnd={() => setActive(false)}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      {/* faint dot-grid texture, only visible where the glow reveals it */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
        opacity: active ? 1 : 0.35,
        maskImage: `radial-gradient(circle 220px at ${pos.x}% ${pos.y}%, black, transparent)`,
        WebkitMaskImage: `radial-gradient(circle 220px at ${pos.x}% ${pos.y}%, black, transparent)`,
        transition: "opacity 0.3s ease",
      }} />
      {/* colored aura glow that tracks the pointer */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(circle 320px at ${pos.x}% ${pos.y}%, rgba(${auraColor},0.28), transparent 70%)`,
        opacity: active ? 1 : 0.5,
        transition: "opacity 0.4s ease",
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

/* ============================== ICONS ============================== */
const Icon = {
  home: (p) => (<svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/></svg>),
  upload: (p) => (<svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>),
  tutor: (p) => (<svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="9" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="13" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="17" cy="11" r="1" fill="currentColor" stroke="none"/></svg>),
  board: (p) => (<svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21V9"/><path d="M16 21V13"/><path d="M12 21V5"/></svg>),
  profile: (p) => (<svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>),
  library: (p) => (<svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>),
  flame: (p) => (<svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="currentColor" stroke="none"><path d="M12 2c1 3-3 4.5-3 8a3 3 0 0 0 6 0c1 1 1.5 2.5 1.5 4a4.5 4.5 0 0 1-9 0C7.5 9 11 7 12 2z"/></svg>),
  bolt: (p) => (<svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="currentColor" stroke="none"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>),
  camera: (p) => (<svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/></svg>),
  file: (p) => (<svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>),
  chevronRight: (p) => (<svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>),
  chevronLeft: (p) => (<svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>),
  check: (p) => (<svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>),
  x: (p) => (<svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>),
  lock: (p) => (<svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>),
  crown: (p) => (<svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="currentColor" stroke="none"><path d="M3 8l3 3 6-6 6 6 3-3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/></svg>),
  send: (p) => (<svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="currentColor" stroke="none"><path d="M3 11l18-9-9 18-2-7z"/></svg>),
  download: (p) => (<svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>),
  type: (p) => (<svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>),
  mic: (p) => (<svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 11a7 7 0 0 1-14 0"/><path d="M12 18v4"/><path d="M9 22h6"/></svg>),
  search: (p) => (<svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>),
  star: (p) => (<svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="currentColor" stroke="none"><path d="M12 2.5l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 18.3l-6.2 3.2 1.2-6.8-5-4.9 6.9-1z"/></svg>),
  summary: (p) => (<svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4h10a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2z"/><path d="M11 9h6M11 13h6M11 17h3"/></svg>),
  cards: (p) => (<svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="7" width="14" height="10" rx="2"/><path d="M4 4h14a2 2 0 0 1 2 2"/></svg>),
  quizIcon: (p) => (<svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 4.7-1.2c.5.9.2 1.5-.6 2.2-.8.7-1.6 1.1-1.6 2.5"/><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none"/></svg>),
  examIcon: (p) => (<svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2v4M15 2v4"/><rect x="4" y="4" width="16" height="18" rx="2"/><path d="m9 14 2 2 4-4"/></svg>),
  plus: (p) => (<svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>),
  trash: (p) => (<svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16"/><path d="M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/></svg>),
  calculator: (p) => (<svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8"/><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01"/></svg>),
  paperclip: (p) => (<svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5 12.4 20a4.5 4.5 0 0 1-6.4-6.4l8.1-8.1a3 3 0 0 1 4.2 4.2l-8.1 8.1a1.5 1.5 0 0 1-2.1-2.1l7.4-7.4"/></svg>),
};

/* ============================== LOGO ============================== */
/* tone="dark" -> navy/green wordmark or icon for use on light (white/paper) backgrounds.
   tone="light" -> white/green wordmark or icon for use on dark (ink) backgrounds. */
function Logo({ tone = "dark", height = 28, iconOnly = false }) {
  const src = iconOnly
    ? (tone === "light" ? "/icon-light.png" : "/icon.png")
    : (tone === "light" ? "/logo-horizontal-light.png" : "/logo-horizontal.png");
  return <img src={src} alt="pailot" style={{ height, width: "auto", display: "block" }} draggable={false} />;
}

/* ============================== SHARED UI ============================== */
function Btn({ children, onClick, variant = "primary", style, disabled, full }) {
  const base = { fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 15, padding: "14px 22px", borderRadius: 14, border: "none", cursor: disabled ? "default" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "transform 0.12s ease, opacity 0.12s ease", opacity: disabled ? 0.5 : 1, width: full ? "100%" : "auto" };
  const variants = {
    primary: { background: C.green, color: C.ink },
    dark: { background: C.ink, color: C.paper },
    teal: { background: C.teal, color: C.ink },
    purple: { background: C.purple, color: "#fff" },
    outline: { background: "transparent", color: C.ink, border: `1.5px solid ${C.ink}` },
    ghost: { background: "rgba(21,25,43,0.06)", color: C.ink },
  };
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}>
      {children}
    </button>
  );
}

function Header({ title, sub, onBack, right, flush, large }) {
  return (
    <div style={{ padding: flush ? "0 0 16px" : "20px 20px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {onBack && (
            <button onClick={onBack} aria-label="Back" style={{ background: "none", border: "none", cursor: "pointer", color: C.ink, padding: 4, marginLeft: -6 }}>
              <Icon.chevronLeft size={22} />
            </button>
          )}
          <h1 style={{ fontFamily: FONT_HEAD, fontSize: large ? 32 : 24, fontWeight: 700, color: C.ink, margin: 0 }}>{title}</h1>
        </div>
        {right}
      </div>
      {sub && <p style={{ fontFamily: FONT_BODY, fontSize: large ? 15 : 14, color: "rgba(21,25,43,0.6)", margin: "4px 0 0 0" }}>{sub}</p>}
    </div>
  );
}

function PlanBadge({ plan }) {
  if (plan === "free") return null;
  const isPremium = plan === "premium";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: isPremium ? C.purple : C.green, color: isPremium ? "#fff" : C.ink, fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 11, padding: "3px 9px", borderRadius: 20 }}>
      <Icon.crown size={11} /> {isPremium ? "PREMIUM" : "ADVANCED"}
    </span>
  );
}

function LockedOverlay({ t, onUpgrade, requiredPlan }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.92)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 16, gap: 10, padding: 20, textAlign: "center" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.ink, color: requiredPlan === "premium" ? C.purple : C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon.lock size={18} />
      </div>
      <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: C.ink, margin: 0 }}>{t.locked}</p>
      <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: "rgba(21,25,43,0.6)", margin: 0 }}>{requiredPlan === "premium" ? t.lockedPremium : t.lockedAdvanced}</p>
      <Btn variant={requiredPlan === "premium" ? "purple" : "primary"} onClick={onUpgrade} style={{ marginTop: 4 }}>{t.upgradeNow}</Btn>
    </div>
  );
}

/* ============================== VOICE INPUT PANEL (shared) ============================== */
/* Reusable mic-to-text panel. Used by Upload (dictate notes) and AI Tutor (speak a question). */
function VoiceInputPanel({ t, lang, onTranscriptReady, autoSubmitLabel }) {
  const speech = useSpeechRecognition(lang);
  const nativeSupported = SPEECH_NATIVE_SUPPORT[lang];

  if (!speech.isSupported) {
    return (
      <div style={{ background: C.paperDim, borderRadius: 16, padding: "20px 18px", textAlign: "center" }}>
        <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: "rgba(21,25,43,0.65)", margin: 0, lineHeight: 1.5 }}>{t.micNotSupported}</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 16, padding: "20px 18px", textAlign: "center" }}>
      {!nativeSupported && (
        <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.greenDeep, margin: "0 0 14px", lineHeight: 1.4 }}>{t.micNotSupported}</p>
      )}
      <button
        onClick={() => (speech.listening ? speech.stop() : speech.start())}
        style={{
          width: 76, height: 76, borderRadius: "50%", border: "none", cursor: "pointer", margin: "0 auto 14px",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: speech.listening ? C.coral : C.ink, color: speech.listening ? "#fff" : C.green,
          transition: "all 0.2s ease", boxShadow: speech.listening ? "0 0 0 8px rgba(226,84,61,0.14)" : "none",
        }}
      >
        <Icon.mic size={30} />
      </button>
      <p style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13.5, color: speech.listening ? C.coral : C.ink, margin: "0 0 4px" }}>
        {speech.listening ? t.listening : t.tapToSpeak}
      </p>
      {speech.error === "denied" && <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.coral, margin: "8px 0 0" }}>{t.micPermissionDenied}</p>}
      {speech.transcript && (
        <div style={{ marginTop: 14, textAlign: "left" }}>
          <div style={{ background: C.paperDim, borderRadius: 12, padding: "12px 14px", marginBottom: 10 }}>
            <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: C.ink, margin: 0, lineHeight: 1.5 }}>{speech.transcript}</p>
          </div>
          <Btn variant="primary" full onClick={() => onTranscriptReady(speech.transcript)}>{autoSubmitLabel}</Btn>
        </div>
      )}
    </div>
  );
}

/* ============================== AUTH SCREEN ============================== */
/* Shown before language selection, so its copy is fixed in English/simple terms
   rather than driven by the i18n system (the person hasn't picked a language yet). */
/* ============================== SET NEW PASSWORD (after a recovery-link click) ============================== */
function SetNewPasswordScreen({ t, onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const inputStyle = { width: "100%", padding: "13px 14px", borderRadius: 12, border: `1px solid ${C.line}`, fontFamily: FONT_BODY, fontSize: 14, outline: "none", background: "#fff", boxSizing: "border-box" };
  const labelStyle = { fontFamily: FONT_BODY, fontSize: 12, color: "rgba(13,23,59,0.55)", display: "block", marginBottom: 5 };

  const submit = async () => {
    setError("");
    if (password.length < 6) { setError(t.passwordTooShort); return; }
    if (password !== confirm) { setError(t.passwordsDontMatch); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(onDone, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.paperDim, padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 380, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 20, padding: 28 }}>
        <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
          <Logo tone="dark" height={30} />
        </div>
        <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 20, color: C.ink, margin: "0 0 6px", textAlign: "center" }}>{t.setNewPasswordTitle}</h2>
        <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: "rgba(13,23,59,0.6)", margin: "0 0 22px", textAlign: "center" }}>{t.setNewPasswordSub}</p>

        {done ? (
          <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: C.greenDeep, textAlign: "center", margin: 0 }}>{t.passwordUpdated}</p>
        ) : (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>{t.newPassword}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>{t.confirmPassword}</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={inputStyle} />
            </div>
            {error && <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.coral, margin: "0 0 14px" }}>{error}</p>}
            <Btn variant="primary" full disabled={loading || !password || !confirm} onClick={submit}>{loading ? "..." : t.saveNewPassword}</Btn>
          </>
        )}
      </div>
    </div>
  );
}

function AuthScreen({ onAuthed }) {
  const [mode, setMode] = useState("signup"); // signup | login | reset
  const [form, setForm] = useState({ name: "", surname: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async () => {
    setError("");
    if (mode === "reset") {
      setLoading(true);
      const { error: err } = await supabase.auth.resetPasswordForEmail(form.email);
      setLoading(false);
      if (err) { setError(err.message); return; }
      setResetSent(true);
      return;
    }

    setLoading(true);
    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { name: form.name, surname: form.surname } },
      });
      setLoading(false);
      if (err) { setError(err.message.includes("already") ? "An account with this email already exists." : err.message); return; }
      if (data.user) onAuthed(data.user);
    } else {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      setLoading(false);
      if (err) { setError("Incorrect email or password."); return; }
      if (data.user) onAuthed(data.user);
    }
  };

  const inputStyle = { width: "100%", padding: "13px 14px", borderRadius: 12, border: `1px solid ${C.line}`, fontFamily: FONT_BODY, fontSize: 14, outline: "none", background: "#fff", boxSizing: "border-box" };
  const labelStyle = { fontFamily: FONT_BODY, fontSize: 12, color: "rgba(13,23,59,0.55)", display: "block", marginBottom: 5 };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: C.paper }}>
      <Spotlight tone="green" className="auth-hero" style={{ flex: 1, background: C.ink, display: "none", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <div style={{ maxWidth: 380, position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 24 }}>
            <Logo tone="light" height={44} />
          </div>
          <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 32, color: C.paper, lineHeight: 1.2, margin: "0 0 14px" }}>Learn faster, in your language.</h1>
          <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: 0 }}>Sign up to save your progress, join the leaderboard, and pick up right where you left off.</p>
        </div>
      </Spotlight>

      <style>{`@media (min-width: 900px) { .auth-hero { display: flex !important; } }`}</style>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <div style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}>
            <Logo tone="dark" height={32} />
          </div>

          {mode === "reset" ? (
            <>
              <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 22, color: C.ink, margin: "0 0 6px" }}>Reset your password</h2>
              <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: "rgba(13,23,59,0.6)", margin: "0 0 24px" }}>Enter your email and we'll send you a link to reset it.</p>
              {resetSent ? (
                <div style={{ background: C.greenSoft, borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: C.greenDeep, margin: 0 }}>Check your email for a reset link.</p>
                </div>
              ) : (
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Email address</label>
                  <input style={inputStyle} type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" />
                </div>
              )}
              {error && <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.coral, margin: "0 0 12px" }}>{error}</p>}
              {!resetSent && <Btn variant="primary" full onClick={submit} disabled={loading || !form.email}>{loading ? "Sending..." : "Send reset link"}</Btn>}
              <button onClick={() => { setMode("login"); setResetSent(false); setError(""); }} style={{ display: "block", width: "100%", textAlign: "center", marginTop: 18, background: "none", border: "none", color: "rgba(13,23,59,0.6)", fontFamily: FONT_BODY, fontSize: 13, cursor: "pointer" }}>← Back to log in</button>
            </>
          ) : (
            <>
              <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 22, color: C.ink, margin: "0 0 6px" }}>{mode === "signup" ? "Create your account" : "Welcome back"}</h2>
              <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: "rgba(13,23,59,0.6)", margin: "0 0 24px" }}>{mode === "signup" ? "Start learning with pailot today." : "Log in to continue learning."}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 6 }}>
                {mode === "signup" && (
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Name</label>
                      <input style={inputStyle} value={form.name} onChange={update("name")} placeholder="Thabo" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Surname</label>
                      <input style={inputStyle} value={form.surname} onChange={update("surname")} placeholder="Nkosi" />
                    </div>
                  </div>
                )}
                <div>
                  <label style={labelStyle}>Email address</label>
                  <input style={inputStyle} type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" />
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <input style={inputStyle} type="password" value={form.password} onChange={update("password")} placeholder="At least 6 characters" />
                </div>
              </div>

              {mode === "login" && (
                <button onClick={() => { setMode("reset"); setError(""); }} style={{ background: "none", border: "none", color: C.greenDeep, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 12.5, cursor: "pointer", padding: 0, margin: "8px 0 18px", display: "block" }}>Forgot password?</button>
              )}
              {mode === "signup" && <div style={{ height: 18 }} />}

              {error && <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.coral, margin: "0 0 14px" }}>{error}</p>}

              <Btn variant="primary" full onClick={submit} disabled={loading || !form.email || !form.password || (mode === "signup" && (!form.name || !form.surname))}>
                {loading ? (mode === "signup" ? "Creating your account..." : "Logging in...") : (mode === "signup" ? "Sign up" : "Log in")}
              </Btn>

              <button onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }} style={{ display: "block", width: "100%", textAlign: "center", marginTop: 18, background: "none", border: "none", color: "rgba(13,23,59,0.6)", fontFamily: FONT_BODY, fontSize: 13, cursor: "pointer" }}>
                {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
                <span style={{ color: C.greenDeep, fontWeight: 600 }}>{mode === "signup" ? "Log in" : "Sign up"}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================== LANGUAGE PICKER ============================== */
function LanguagePicker({ onPick }) {
  const [hovered, setHovered] = useState(null);
  return (
    <Spotlight tone="green" style={{ minHeight: 560, background: C.ink, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 28px" }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(132,172,100,0.18), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -40, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(95,184,166,0.14), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 28 }}>
          <Logo tone="light" height={40} />
        </div>
        <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 30, color: C.paper, lineHeight: 1.15, margin: "0 0 10px 0" }}>
          Welcome.<br/>Welkom.<br/>Siyakwamukela.<br/>Wamkelekile.
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: "rgba(255,255,255,0.65)", margin: "0 0 32px 0" }}>Choose your language to get started</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {LANGS.map((l) => (
            <button key={l.code} onClick={() => onPick(l.code)} onMouseEnter={() => setHovered(l.code)} onMouseLeave={() => setHovered(null)}
              style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 16, padding: "22px 14px", borderRadius: 16, border: `1.5px solid ${hovered === l.code ? C.green : "rgba(255,255,255,0.18)"}`, background: hovered === l.code ? "rgba(132,172,100,0.1)" : "rgba(255,255,255,0.04)", color: C.paper, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "all 0.15s ease" }}>
              <span>{l.native}</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 500, letterSpacing: 1 }}>{l.code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>
    </Spotlight>
  );
}

/* ============================== BOTTOM NAV ============================== */
function BottomNav({ t, screen, setScreen }) {
  const items = [
    { key: "home", label: t.navHome, icon: Icon.home },
    { key: "resources", label: t.navResources, icon: Icon.library },
    { key: "tutor", label: t.navTutor, icon: Icon.tutor },
    { key: "board", label: t.navBoard, icon: Icon.board },
    { key: "profile", label: t.navProfile, icon: Icon.profile },
  ];
  return (
    <div style={{ display: "flex", borderTop: `1px solid ${C.line}`, background: C.paper, position: "sticky", bottom: 0, zIndex: 30 }}>
      {items.map((it) => {
        const active = screen === it.key;
        return (
          <button key={it.key} onClick={() => setScreen(it.key)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 4px 12px", color: active ? C.ink : "rgba(21,25,43,0.4)" }}>
            <it.icon size={21} />
            <span style={{ fontFamily: FONT_BODY, fontSize: 10.5, fontWeight: active ? 600 : 500 }}>{it.label}</span>
            {active && <div style={{ width: 16, height: 2.5, borderRadius: 2, background: C.green, marginTop: 1 }} />}
          </button>
        );
      })}
    </div>
  );
}

function TopNav({ t, screen, setScreen, user, setShowUpgrade, onChangeLanguage, onOpenCalculator }) {
  const items = [
    { key: "home", label: t.navHome },
    { key: "resources", label: t.navResources },
    { key: "tutor", label: t.navTutor },
    { key: "board", label: t.navBoard },
  ];
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.line}` }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 76 }}>
        <button onClick={() => setScreen("home")} style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer" }}>
          <Logo tone="dark" height={38} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {items.map((it) => {
            const active = screen === it.key;
            return (
              <button key={it.key} onClick={() => setScreen(it.key)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: 10, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 14, color: active ? C.ink : "rgba(21,25,43,0.55)", position: "relative" }}>
                {it.label}
                {active && <div style={{ position: "absolute", bottom: -2, left: 16, right: 16, height: 2.5, borderRadius: 2, background: C.green }} />}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onOpenCalculator} aria-label="Calculator" style={{ width: 36, height: 36, borderRadius: "50%", background: C.paperDim, border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: C.ink, cursor: "pointer" }}><Icon.calculator size={16} /></button>
          <button onClick={onChangeLanguage} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: `1px solid ${C.line}`, borderRadius: 20, padding: "7px 12px", cursor: "pointer", fontFamily: FONT_BODY, fontSize: 12.5, color: "rgba(21,25,43,0.6)", fontWeight: 600 }}>
            {LANGS.find(l=>l.code===user.lang).code.toUpperCase()}
          </button>
          {user.plan !== "premium" && (
            <Btn variant="dark" onClick={() => setShowUpgrade(true)} style={{ padding: "9px 18px", fontSize: 13 }}><Icon.crown size={14} /> {t.desktopUpgradeCta}</Btn>
          )}
          <button onClick={() => setScreen("profile")} style={{ width: 38, height: 38, borderRadius: "50%", background: screen === "profile" ? C.ink : C.paperDim, color: screen === "profile" ? C.green : C.ink, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 14 }}>
            {user.name[0]}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================== HOME SCREEN ============================== */
function HomeScreen({ t, user, materials, setScreen, openMaterial, setShowUpgrade, openUploadMode, viewport }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.greetingMorning : hour < 18 ? t.greetingAfternoon : t.greetingEvening;
  const { isDesktop } = viewport;

  const quickActions = [
    { key: "camera", label: t.takePhoto, icon: Icon.camera, color: C.green, bg: "rgba(132,172,100,0.14)" },
    { key: "file", label: t.chooseFile, icon: Icon.file, color: C.tealDeep, bg: "rgba(45,191,158,0.12)" },
    { key: "speak", label: t.speakNow, icon: Icon.mic, color: C.coral, bg: "rgba(226,84,61,0.1)" },
    { key: "type", label: t.typeNotes, icon: Icon.type, color: C.purpleDeep, bg: "rgba(127,119,221,0.1)" },
  ];

  const StreakCard = (
    <Spotlight tone="green" style={{ background: C.ink, borderRadius: 20, padding: "22px 22px" }}>
      <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(132,172,100,0.22), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.coral, marginBottom: 4 }}>
            <Icon.flame size={20} />
            <span style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 22, color: C.paper }}>{user.streak}</span>
          </div>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "rgba(255,255,255,0.6)", margin: 0 }}>{t.streakLabel}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", color: C.green, marginBottom: 4 }}>
            <span style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 22, color: C.paper }}>{user.xp.toLocaleString()}</span>
            <Icon.bolt size={18} />
          </div>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "rgba(255,255,255,0.6)", margin: 0 }}>{t.xpLabel}</p>
        </div>
      </div>
      <div style={{ marginTop: 16, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{t.dailyGoal}</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.paper }}>{user.dailyMinutes}/{user.goalMinutes} {t.minutesToday}</span>
        </div>
        <div style={{ height: 8, borderRadius: 5, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
          <div style={{ width: Math.min(100, (user.dailyMinutes / user.goalMinutes) * 100) + "%", height: "100%", background: C.teal, borderRadius: 5, transition: "width 0.5s ease" }} />
        </div>
      </div>
    </Spotlight>
  );

  const QuickActions = (
    <div>
      <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 12.5, color: "rgba(21,25,43,0.45)", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 10px" }}>{t.quickActions}</p>
      <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr" : "1fr 1fr 1fr 1fr", gap: 8 }}>
        {quickActions.map((qa) => (
          <button key={qa.key} onClick={() => openUploadMode(qa.key)} style={{
            display: "flex", flexDirection: isDesktop ? "row" : "column", alignItems: "center", gap: isDesktop ? 12 : 7,
            background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: isDesktop ? "12px 14px" : "14px 6px", cursor: "pointer",
            textAlign: isDesktop ? "left" : "center", transition: "border-color 0.15s ease, transform 0.1s ease",
          }}
            onMouseEnter={(e) => isDesktop && (e.currentTarget.style.borderColor = qa.color)}
            onMouseLeave={(e) => isDesktop && (e.currentTarget.style.borderColor = C.line)}
          >
            <div style={{ width: 38, height: 38, borderRadius: 11, background: qa.bg, color: qa.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <qa.icon size={18} />
            </div>
            <span style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: isDesktop ? 13.5 : 10.5, color: C.ink, lineHeight: 1.2 }}>{qa.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const UpgradeBanner = user.plan !== "premium" && (
    <button onClick={() => setShowUpgrade(true)} style={{ width: "100%", background: "rgba(132,172,100,0.12)", border: `1.5px solid ${C.green}`, borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Icon.crown size={18} />
        <div style={{ textAlign: "left" }}>
          <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 14, color: C.ink, margin: 0 }}>{t.upgradeNow}</p>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: "rgba(21,25,43,0.55)", margin: "2px 0 0 0" }}>{t.choosePlan}</p>
        </div>
      </div>
      <Icon.chevronRight size={18} />
    </button>
  );

  const MaterialsList = (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: isDesktop ? 16 : 10 }}>
        <h2 style={{ fontFamily: FONT_HEAD, fontSize: isDesktop ? 19 : 17, fontWeight: 700, color: C.ink, margin: 0 }}>{t.yourMaterials}</h2>
        <button onClick={() => openUploadMode(null)} style={{ background: "none", border: "none", color: C.tealDeep, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>+ {t.uploadNew}</button>
      </div>
      {materials.length === 0 ? (
        <div style={{ border: `1.5px dashed ${C.line}`, borderRadius: 16, padding: isDesktop ? "48px 24px" : "32px 20px", textAlign: "center" }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: "rgba(21,25,43,0.5)", margin: "0 0 16px 0" }}>{t.noMaterials}</p>
          <Btn variant="dark" onClick={() => openUploadMode(null)}>{t.uploadNew}</Btn>
        </div>
      ) : (
        <div style={{ display: isDesktop ? "grid" : "flex", gridTemplateColumns: isDesktop ? "1fr 1fr" : undefined, flexDirection: isDesktop ? undefined : "column", gap: 10 }}>
          {materials.map((m) => (
            <button key={m.id} onClick={() => openMaterial(m.id)} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: "12px 14px", textAlign: "left", cursor: "pointer" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: C.paperDim, display: "flex", alignItems: "center", justifyContent: "center", color: C.greenDeep, flexShrink: 0 }}><Icon.file size={17} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 14, color: C.ink, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.title}</p>
                <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: "rgba(21,25,43,0.5)", margin: "2px 0 0 0" }}>{m.subject}</p>
              </div>
              <Icon.chevronRight size={16} />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 32px 60px" }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: "rgba(21,25,43,0.55)", margin: 0 }}>{greeting},</p>
          <h1 style={{ fontFamily: FONT_HEAD, fontSize: 32, fontWeight: 700, color: C.ink, margin: "2px 0 0 0" }}>{user.name}</h1>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 32, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {StreakCard}
            {QuickActions}
            {UpgradeBanner}
          </div>
          <div>{MaterialsList}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ padding: "20px 20px 4px" }}>
        <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: "rgba(21,25,43,0.55)", margin: 0 }}>{greeting},</p>
        <h1 style={{ fontFamily: FONT_HEAD, fontSize: 26, fontWeight: 700, color: C.ink, margin: "2px 0 0 0" }}>{user.name}</h1>
      </div>
      <div style={{ padding: "16px 20px 4px" }}>{QuickActions}</div>
      <div style={{ padding: "18px 20px 6px" }}>{StreakCard}</div>
      {UpgradeBanner && <div style={{ padding: "12px 20px 6px" }}>{UpgradeBanner}</div>}
      <div style={{ padding: "20px 20px 0" }}>{MaterialsList}</div>
    </div>
  );
}

/* ============================== FILE HANDLING HELPERS ============================== */
// Vercel serverless functions cap the request body at ~4.5MB, so we keep the combined
// base64 payload for a batch of photos/documents comfortably under that.
const MAX_BATCH_BASE64_CHARS = 3.2 * 1024 * 1024;
const FILE_ACCEPT = "image/*,.pdf,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.txt,.rtf,.csv,.md,text/plain";

let itemIdCounter = 0;
function nextItemId() { itemIdCounter += 1; return `item-${Date.now()}-${itemIdCounter}`; }

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// Downscale + recompress large photos in the browser before sending them to the API.
// Mobile camera photos are often 3-8MB — this keeps batches under the request size
// limit and makes OCR noticeably faster, with no visible loss in legibility.
function compressImageFile(file, maxDim = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve({ dataUrl, base64: dataUrl.split(",")[1], mime: "image/jpeg" });
    };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}

function classifyFile(file) {
  const name = (file.name || "").toLowerCase();
  const type = file.type || "";
  if (type.startsWith("image/")) return "image";
  if (type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || name.endsWith(".docx")) return "docx";
  if (type === "application/msword" || name.endsWith(".doc")) return "doc";
  if (type.startsWith("text/") || /\.(txt|md|csv|rtf)$/.test(name)) return "text";
  return "unknown";
}

// Turns a queued file into a normalized item: { id, kind: 'image'|'pdf'|'text', label, previewUrl, base64, mime, text }
async function buildItemFromFile(file) {
  const kind = classifyFile(file);
  if (kind === "image") {
    const { dataUrl, base64, mime } = await compressImageFile(file);
    return { id: nextItemId(), kind: "image", label: file.name, previewUrl: dataUrl, base64, mime, sizeChars: base64.length };
  }
  if (kind === "pdf") {
    const dataUrl = await readFileAsDataURL(file);
    const base64 = dataUrl.split(",")[1];
    return { id: nextItemId(), kind: "pdf", label: file.name, base64, mime: "application/pdf", sizeChars: base64.length };
  }
  if (kind === "docx") {
    const mammoth = await import("mammoth");
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    const text = (value || "").slice(0, 16000);
    return { id: nextItemId(), kind: "text", label: file.name, text, sizeChars: text.length };
  }
  if (kind === "doc" || kind === "text") {
    const text = (await readFileAsText(file)).slice(0, 16000);
    return { id: nextItemId(), kind: "text", label: file.name, text, sizeChars: text.length };
  }
  throw new Error("unsupported");
}

// Calls pailot once with everything collected so far (photos, documents, and/or plain
// text) and asks it to produce a faithful combined transcript plus a short title and
// subject guess — deliberately WITHOUT summarizing, so the person can choose what to
// generate first (summary, flashcards, quiz, or exam) on the next screen.
async function prepareMaterialFromItems(items, langCode) {
  const contentBlocks = [];
  const textPieces = [];
  for (const item of items) {
    if (item.kind === "image") contentBlocks.push({ type: "image", source: { type: "base64", media_type: item.mime, data: item.base64 } });
    else if (item.kind === "pdf") contentBlocks.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: item.base64 } });
    else if (item.kind === "text") textPieces.push(item.text);
  }
  if (textPieces.length) contentBlocks.push({ type: "text", text: `Extracted text from the uploaded material:\n\n${textPieces.join("\n\n---\n\n")}`.slice(0, 16000) });
  contentBlocks.push({ type: "text", text: "Read all of the study material provided above (it may include photos, documents, and/or already-extracted text). Combine it into one faithful transcript in its original wording — do NOT summarize or shorten it. Then respond ONLY with valid JSON, no preamble, no markdown fences, in this exact shape: {\"title\": \"short descriptive title (max 6 words)\", \"subject\": \"best-guess subject area\", \"transcript\": \"the combined transcript\"}" });

  const sys = `You are pailot, an educational assistant for South African students. Respond ONLY in ${LANGS.find((l) => l.code === langCode).label}.`;
  const text = await callClaude([{ role: "user", content: contentBlocks }], sys, 2200);
  const json = extractJson(text);
  if (!json || !json.transcript) throw new Error("parse failed");
  return { title: json.title || "Study material", subject: json.subject || "General", rawText: json.transcript };
}

/* ============================== UPLOAD SCREEN ============================== */
function UploadScreen({ t, user, onMaterialCreated, setShowUpgrade, fileInputRef, cameraInputRef, initialMode }) {
  const [stage, setStage] = useState("choose"); // choose | review | preparing | chooseAction | error
  const [pastedText, setPastedText] = useState("");
  const [showPaste, setShowPaste] = useState(initialMode === "type");
  const [showSpeak, setShowSpeak] = useState(initialMode === "speak");
  const [errorMsg, setErrorMsg] = useState("");
  const [items, setItems] = useState([]);
  const [itemWarning, setItemWarning] = useState("");
  const [pendingMaterial, setPendingMaterial] = useState(null);

  useEffect(() => {
    if (initialMode === "camera" && cameraInputRef.current) cameraInputRef.current.click();
    if (initialMode === "file" && fileInputRef.current) fileInputRef.current.click();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const limit = PLAN_LIMITS[user.plan].uploadsPerDay;
  const remaining = limit === Infinity ? null : Math.max(0, limit - user.uploadsToday);
  const blocked = remaining !== null && remaining <= 0;

  const batchChars = items.reduce((sum, it) => sum + (it.sizeChars || 0), 0);

  const addItem = (item) => {
    if (batchChars + (item.sizeChars || 0) > MAX_BATCH_BASE64_CHARS) {
      setItemWarning(t.fileTooLarge);
      return;
    }
    setItemWarning("");
    setItems((arr) => [...arr, item]);
    setStage("review");
  };

  const handleCameraCapture = async (file) => {
    if (!file) return;
    if (blocked) { setShowUpgrade(true); return; }
    try { addItem(await buildItemFromFile(file)); }
    catch (e) { setItemWarning(t.unsupportedFile); }
  };

  const handleFilesChosen = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    if (blocked) { setShowUpgrade(true); return; }
    setItemWarning("");
    for (const file of files) {
      try {
        const item = await buildItemFromFile(file);
        if (batchChars + item.sizeChars + items.reduce((s, i) => s + (i.sizeChars || 0), 0) > MAX_BATCH_BASE64_CHARS) {
          setItemWarning(t.fileTooLarge);
          continue;
        }
        setItems((arr) => [...arr, item]);
      } catch (e) { setItemWarning(t.unsupportedFile); }
    }
    setStage("review");
  };

  const removeItem = (id) => setItems((arr) => arr.filter((it) => it.id !== id));

  const runPrepare = useCallback(async (itemsForPrep) => {
    setStage("preparing"); setErrorMsg("");
    try {
      const result = await prepareMaterialFromItems(itemsForPrep, user.lang);
      setPendingMaterial(result);
      setStage("chooseAction");
    } catch (e) { setErrorMsg(t.errorUpload); setStage("error"); }
  }, [t, user.lang]);

  const continueFromReview = () => { if (items.length) runPrepare(items); };
  const continueFromPaste = () => { if (blocked) { setShowUpgrade(true); return; } runPrepare([{ id: nextItemId(), kind: "text", text: pastedText }]); };
  const continueFromSpeak = (text) => { if (blocked) { setShowUpgrade(true); return; } runPrepare([{ id: nextItemId(), kind: "text", text }]); };

  const pickAction = (actionKey) => {
    if (!pendingMaterial) return;
    onMaterialCreated({ title: pendingMaterial.title, subject: pendingMaterial.subject, rawText: pendingMaterial.rawText, summary: "" }, actionKey);
  };

  if (stage === "preparing") {
    return (
      <div style={{ minHeight: 420, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 18 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", border: `3px solid ${C.paperDim}`, borderTopColor: C.green, animation: "spin 0.9s linear infinite" }} />
        <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: "rgba(21,25,43,0.6)", textAlign: "center" }}>{t.processing}</p>
        <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div style={{ minHeight: 420, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 14, textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(226,84,61,0.12)", color: C.coral, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.x size={20} /></div>
        <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.ink, maxWidth: 260 }}>{errorMsg}</p>
        <Btn variant="dark" onClick={() => setStage("choose")}>{t.retry}</Btn>
      </div>
    );
  }

  if (stage === "chooseAction" && pendingMaterial) {
    const actions = [
      { key: "summary", label: t.actionSummary, icon: Icon.summary, color: C.green, bg: "rgba(132,172,100,0.14)" },
      { key: "flashcards", label: t.actionFlashcards, icon: Icon.cards, color: C.tealDeep, bg: "rgba(95,184,166,0.14)" },
      { key: "quiz", label: t.actionQuiz, icon: Icon.quizIcon, color: C.coral, bg: "rgba(217,105,79,0.12)" },
      { key: "exam", label: t.actionExam, icon: Icon.examIcon, color: C.purpleDeep, bg: "rgba(139,127,214,0.14)" },
    ];
    return (
      <div>
        <Header title={t.chooseActionTitle} sub={t.chooseActionSub} />
        <div style={{ padding: "0 20px 8px" }}>
          <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: "12px 14px", marginBottom: 16 }}>
            <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 14, color: C.ink, margin: 0 }}>{pendingMaterial.title}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "rgba(21,25,43,0.55)", margin: "2px 0 0 0" }}>{pendingMaterial.subject}</p>
          </div>
        </div>
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {actions.map((a) => (
            <button key={a.key} onClick={() => pickAction(a.key)} style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", cursor: "pointer", textAlign: "left" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: a.bg, color: a.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><a.icon size={20} /></div>
              <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: C.ink, margin: 0 }}>{a.label}</p>
              <Icon.chevronRight size={18} style={{ marginLeft: "auto", color: "rgba(21,25,43,0.3)" }} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (stage === "review") {
    return (
      <div>
        <Header title={t.uploadNew} sub={remaining !== null ? `${remaining} ${t.materialsLeft}` : null} />
        <input ref={fileInputRef} type="file" accept={FILE_ACCEPT} multiple style={{ display: "none" }} onChange={(e) => { handleFilesChosen(e.target.files); e.target.value = ""; }} />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={(e) => { handleCameraCapture(e.target.files[0]); e.target.value = ""; }} />

        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((it) => (
            <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: "10px 12px" }}>
              {it.kind === "image" ? (
                <img src={it.previewUrl} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: 8, background: C.paperDim, color: C.greenDeep, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon.file size={18} /></div>
              )}
              <p style={{ flex: 1, minWidth: 0, fontFamily: FONT_BODY, fontSize: 13, color: C.ink, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.label || t.itemsAdded}</p>
              <button onClick={() => removeItem(it.id)} aria-label={t.removeItem} style={{ background: "none", border: "none", cursor: "pointer", color: C.coral, padding: 4, flexShrink: 0 }}><Icon.trash size={16} /></button>
            </div>
          ))}

          {itemWarning && <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.coral, margin: "2px 0" }}>{itemWarning}</p>}

          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="outline" full onClick={() => cameraInputRef.current && cameraInputRef.current.click()}><Icon.camera size={16} /> {t.addAnotherPhoto}</Btn>
            <Btn variant="outline" full onClick={() => fileInputRef.current && fileInputRef.current.click()}><Icon.plus size={16} /> {t.addAnotherFile}</Btn>
          </div>

          <div style={{ height: 4 }} />
          <Btn variant="primary" full onClick={continueFromReview}>{t.continue}</Btn>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title={t.uploadNew} sub={remaining !== null ? `${remaining} ${t.materialsLeft}` : null} />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        <input ref={fileInputRef} type="file" accept={FILE_ACCEPT} multiple style={{ display: "none" }} onChange={(e) => { handleFilesChosen(e.target.files); e.target.value = ""; }} />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={(e) => { handleCameraCapture(e.target.files[0]); e.target.value = ""; }} />

        <button onClick={() => cameraInputRef.current && cameraInputRef.current.click()} style={{ display: "flex", alignItems: "center", gap: 14, background: C.ink, color: C.paper, borderRadius: 16, padding: "18px 18px", border: "none", cursor: "pointer", textAlign: "left" }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(132,172,100,0.18)", color: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon.camera size={20} /></div>
          <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, margin: 0 }}>{t.takePhoto}</p>
        </button>

        <button onClick={() => fileInputRef.current && fileInputRef.current.click()} style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 16, padding: "18px 18px", cursor: "pointer", textAlign: "left" }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: C.paperDim, color: C.greenDeep, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon.file size={20} /></div>
          <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: C.ink, margin: 0 }}>{t.chooseFile}</p>
        </button>

        {itemWarning && <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.coral, margin: "-4px 0 0" }}>{itemWarning}</p>}

        <button onClick={() => { setShowSpeak((s) => !s); setShowPaste(false); }} style={{ display: "flex", alignItems: "center", gap: 14, background: showSpeak ? C.paperDim : "#fff", border: `1px solid ${showSpeak ? C.ink : C.line}`, borderRadius: 16, padding: "18px 18px", cursor: "pointer", textAlign: "left" }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "#fff", color: C.coral, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon.mic size={20} /></div>
          <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: C.ink, margin: 0 }}>{t.speakInstead}</p>
        </button>

        {showSpeak && (
          <VoiceInputPanel
            t={t} lang={user.lang}
            autoSubmitLabel={t.continue}
            onTranscriptReady={continueFromSpeak}
          />
        )}

        <button onClick={() => { setShowPaste((s) => !s); setShowSpeak(false); }} style={{ display: "flex", alignItems: "center", gap: 14, background: showPaste ? C.paperDim : "#fff", border: `1px solid ${showPaste ? C.ink : C.line}`, borderRadius: 16, padding: "18px 18px", cursor: "pointer", textAlign: "left" }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "#fff", color: C.tealDeep, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon.type size={20} /></div>
          <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: C.ink, margin: 0 }}>{t.typeNotes}</p>
        </button>

        {showPaste && (
          <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 16, padding: 14 }}>
            <textarea value={pastedText} onChange={(e) => setPastedText(e.target.value)} placeholder={t.typeYourNotesPlaceholder} style={{ width: "100%", minHeight: 120, border: "none", outline: "none", fontFamily: FONT_BODY, fontSize: 14, resize: "vertical", background: "transparent" }} />
            <Btn variant="primary" full disabled={!pastedText.trim()} onClick={continueFromPaste}>{t.continue}</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== MATERIAL DETAIL ============================== */
function MaterialDetail({ t, user, material, updateMaterial, onBack, setShowUpgrade, onXpEarned, initialTab }) {
  const [tab, setTab] = useState(initialTab || "summary");
  const [autoStartTab] = useState(initialTab || null); // only the tab the person picked on the upload screen auto-generates
  const tabs = [
    { key: "summary", label: t.tabSummary },
    { key: "flashcards", label: t.tabFlashcards },
    { key: "quiz", label: t.tabQuiz },
    { key: "exam", label: t.tabExam },
  ];
  return (
    <div>
      <Header title={material.title} sub={material.subject} onBack={onBack} />
      <div style={{ display: "flex", gap: 6, padding: "0 20px 14px", overflowX: "auto" }}>
        {tabs.map((tb) => (
          <button key={tb.key} onClick={() => setTab(tb.key)} style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13, padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", whiteSpace: "nowrap", background: tab === tb.key ? C.ink : C.paperDim, color: tab === tb.key ? C.paper : "rgba(21,25,43,0.6)" }}>{tb.label}</button>
        ))}
      </div>
      <div style={{ padding: "0 20px 24px" }}>
        {tab === "summary" && <SummaryTab t={t} user={user} material={material} updateMaterial={updateMaterial} autoStart={autoStartTab === "summary"} />}
        {tab === "flashcards" && <FlashcardsTab t={t} user={user} material={material} updateMaterial={updateMaterial} setShowUpgrade={setShowUpgrade} onXpEarned={onXpEarned} autoStart={autoStartTab === "flashcards"} />}
        {tab === "quiz" && <QuizTab t={t} user={user} material={material} updateMaterial={updateMaterial} setShowUpgrade={setShowUpgrade} onXpEarned={onXpEarned} mode="quiz" autoStart={autoStartTab === "quiz"} />}
        {tab === "exam" && <QuizTab t={t} user={user} material={material} updateMaterial={updateMaterial} setShowUpgrade={setShowUpgrade} onXpEarned={onXpEarned} mode="exam" autoStart={autoStartTab === "exam"} />}
      </div>
    </div>
  );
}

function SummaryTab({ t, user, material, updateMaterial, autoStart }) {
  const [loading, setLoading] = useState(false);
  const startedRef = useRef(false);

  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const sys = `You are pailot, an educational assistant for South African students. Respond ONLY in ${LANGS.find((l) => l.code === user.lang).label}. Respond ONLY with valid JSON, no preamble, no markdown fences. Given raw study notes, produce a JSON object with this exact shape:
{"summary": "a clear, well-structured summary using short paragraphs and bullet points where useful, written for a student to revise from, 150-300 words"}`;
      const text = await callClaude([{ role: "user", content: `Study notes:\n${(material.rawText || "").slice(0, 12000)}` }], sys, 1200);
      const json = extractJson(text);
      if (json && json.summary) updateMaterial({ ...material, summary: json.summary });
    } catch (e) {}
    setLoading(false);
  }, [material, updateMaterial, user.lang]);

  useEffect(() => {
    if (autoStart && !startedRef.current && !material.summary) { startedRef.current = true; generate(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  if (!material.summary) return <GenerateGate t={t} label={t.generateSummary} onGenerate={generate} loading={loading} />;

  return (
    <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 16, padding: 18 }}>
      {material.summary.split("\n").filter(Boolean).map((line, i) => {
        const trimmed = line.trim();
        const isBullet = trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("•");
        return (
          <p key={i} style={{ fontFamily: FONT_BODY, fontSize: 14.5, lineHeight: 1.7, color: C.ink, margin: "0 0 10px 0", paddingLeft: isBullet ? 14 : 0, position: "relative" }}>
            {isBullet && <span style={{ position: "absolute", left: 0, color: C.greenDeep }}>•</span>}
            {trimmed.replace(/^[-*•]\s*/, "")}
          </p>
        );
      })}
    </div>
  );
}

function GenerateGate({ t, label, onGenerate, loading, locked, requiredPlan, onUpgrade }) {
  return (
    <div style={{ position: "relative", border: `1.5px dashed ${C.line}`, borderRadius: 16, padding: "28px 20px", textAlign: "center", minHeight: 140 }}>
      {locked && <LockedOverlay t={t} onUpgrade={onUpgrade} requiredPlan={requiredPlan} />}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: `3px solid ${C.paperDim}`, borderTopColor: C.green, animation: "spin 0.9s linear infinite" }} />
          <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
          <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: "rgba(21,25,43,0.55)" }}>{t.processing}</p>
        </div>
      ) : (
        <Btn variant="dark" onClick={onGenerate}>{label}</Btn>
      )}
    </div>
  );
}

function FlashcardsTab({ t, user, material, updateMaterial, setShowUpgrade, onXpEarned, autoStart }) {
  const [loading, setLoading] = useState(false);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState({});
  const cards = material.flashcards;
  const startedRef = useRef(false);

  const generate = async () => {
    setLoading(true);
    try {
      const sys = `You are pailot. Respond ONLY in ${LANGS.find(l=>l.code===user.lang).label}. Respond ONLY with valid JSON array, no preamble, no markdown fences. Create 8 flashcards from the study material. Shape: [{"front":"question or term","back":"answer or definition"}]`;
      const text = await callClaude([{ role: "user", content: `Study material:\n${material.summary}\n\n${material.rawText || ""}`.slice(0, 6000) }], sys, 1400);
      const json = extractJson(text);
      if (Array.isArray(json) && json.length) updateMaterial({ ...material, flashcards: json });
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    if (autoStart && !startedRef.current && (!cards || cards.length === 0)) { startedRef.current = true; generate(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  if (!cards || cards.length === 0) return <GenerateGate t={t} label={t.generateFlashcards} onGenerate={generate} loading={loading} />;

  const card = cards[idx];
  const doneCount = Object.keys(known).length;
  const mark = (knewIt) => {
    setKnown((k) => ({ ...k, [idx]: knewIt }));
    if (knewIt) onXpEarned(5);
    setTimeout(() => { setFlipped(false); setIdx((i) => Math.min(cards.length - 1, i + 1)); }, 250);
  };

  return (
    <div>
      <p style={{ fontFamily: FONT_MONO, fontSize: 12, color: "rgba(21,25,43,0.5)", marginBottom: 10 }}>{doneCount}/{cards.length} {t.cardsDone}</p>
      <div onClick={() => setFlipped((f) => !f)} style={{ minHeight: 200, borderRadius: 18, cursor: "pointer", background: flipped ? C.teal : C.ink, color: flipped ? C.ink : C.paper, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 28, transition: "background 0.2s ease" }}>
        <p style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 18, lineHeight: 1.4, margin: 0 }}>{flipped ? card.back : card.front}</p>
      </div>
      <p style={{ textAlign: "center", fontFamily: FONT_BODY, fontSize: 12, color: "rgba(21,25,43,0.45)", margin: "10px 0 18px" }}>{t.flipCard}</p>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn variant="outline" full onClick={() => mark(false)} style={{ borderColor: C.coral, color: C.coral }}>{t.didntKnow}</Btn>
        <Btn variant="teal" full onClick={() => mark(true)}>{t.knewIt}</Btn>
      </div>
    </div>
  );
}

function QuizTab({ t, user, material, updateMaterial, setShowUpgrade, onXpEarned, mode, autoStart }) {
  const key = mode === "exam" ? "exam" : "quiz";
  const locked = mode === "exam" && !PLAN_LIMITS[user.plan].exams;
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const questions = material[key];
  const startedGenRef = useRef(false);

  const generate = async () => {
    setLoading(true);
    try {
      const n = mode === "exam" ? 10 : 5;
      const sys = `You are pailot. Respond ONLY in ${LANGS.find(l=>l.code===user.lang).label}. Respond ONLY with valid JSON array, no preamble, no markdown fences. Create ${n} multiple-choice questions from the study material, mixing difficulty. Shape: [{"question":"...","options":["A text","B text","C text","D text"],"correctIndex":0,"explanation":"short explanation of the correct answer"}]`;
      const text = await callClaude([{ role: "user", content: `Study material:\n${material.summary}\n\n${material.rawText || ""}`.slice(0, 6000) }], sys, 2200);
      const json = extractJson(text);
      if (Array.isArray(json) && json.length) updateMaterial({ ...material, [key]: json });
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    if (autoStart && !locked && !startedGenRef.current && (!questions || questions.length === 0)) { startedGenRef.current = true; generate(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  if (locked) return <GenerateGate t={t} label={t.startExam} locked requiredPlan="advanced" onUpgrade={() => setShowUpgrade(true)} />;
  if (!questions || questions.length === 0) return <GenerateGate t={t} label={mode === "exam" ? t.generateExam : t.generateQuiz} onGenerate={generate} loading={loading} />;

  if (!started) {
    return (
      <div style={{ textAlign: "center", padding: "24px 10px" }}>
        <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: "rgba(21,25,43,0.6)", marginBottom: 16 }}>{questions.length} {t.question.toLowerCase()}s</p>
        <Btn variant="primary" onClick={() => setStarted(true)}>{mode === "exam" ? t.startExam : t.startQuiz}</Btn>
      </div>
    );
  }

  if (finished) {
    const xp = correctCount * (mode === "exam" ? 15 : 10);
    return (
      <div style={{ textAlign: "center", padding: "28px 10px" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(45,191,158,0.14)", color: C.tealDeep, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Icon.check size={28} /></div>
        <h3 style={{ fontFamily: FONT_HEAD, fontSize: 20, fontWeight: 700, color: C.ink, margin: "0 0 6px" }}>{t.quizComplete}</h3>
        <p style={{ fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700, color: C.ink, margin: "0 0 4px" }}>{correctCount}/{questions.length}</p>
        <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.greenDeep, margin: "0 0 24px" }}>+{xp} {t.xpEarned}</p>
        <Btn variant="outline" onClick={() => { setStarted(false); setQIdx(0); setSelected(null); setSubmitted(false); setCorrectCount(0); setFinished(false); }}>{t.tryAgain}</Btn>
      </div>
    );
  }

  const q = questions[qIdx];
  const submit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (selected === q.correctIndex) { setCorrectCount((c) => c + 1); onXpEarned(mode === "exam" ? 15 : 10); }
  };
  const next = () => {
    if (qIdx + 1 >= questions.length) { setFinished(true); return; }
    setQIdx((i) => i + 1); setSelected(null); setSubmitted(false);
  };

  return (
    <div>
      <p style={{ fontFamily: FONT_MONO, fontSize: 12, color: "rgba(21,25,43,0.5)", marginBottom: 12 }}>{t.question} {qIdx + 1} {t.of} {questions.length}</p>
      <p style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 17, color: C.ink, lineHeight: 1.4, marginBottom: 16 }}>{q.question}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {q.options.map((opt, i) => {
          let bg = "#fff", border = C.line, color = C.ink;
          if (submitted) {
            if (i === q.correctIndex) { bg = "rgba(45,191,158,0.12)"; border = C.teal; color = C.tealDeep; }
            else if (i === selected) { bg = "rgba(226,84,61,0.1)"; border = C.coral; color = C.coral; }
          } else if (i === selected) { border = C.ink; }
          return (
            <button key={i} disabled={submitted} onClick={() => setSelected(i)} style={{ textAlign: "left", padding: "13px 16px", borderRadius: 12, border: `1.5px solid ${border}`, background: bg, color, fontFamily: FONT_BODY, fontSize: 14, fontWeight: 500, cursor: submitted ? "default" : "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{opt}</span>
              {submitted && i === q.correctIndex && <Icon.check size={16} />}
              {submitted && i === selected && i !== q.correctIndex && <Icon.x size={16} />}
            </button>
          );
        })}
      </div>
      {submitted && q.explanation && (
        <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px", marginBottom: 18 }}>
          <p style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 12.5, color: selected === q.correctIndex ? C.tealDeep : C.coral, margin: "0 0 4px" }}>{selected === q.correctIndex ? t.correct : t.incorrect}</p>
          <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: "rgba(21,25,43,0.75)", margin: 0, lineHeight: 1.5 }}>{q.explanation}</p>
        </div>
      )}
      {!submitted ? <Btn variant="primary" full disabled={selected === null} onClick={submit}>{t.submitAnswer}</Btn> : <Btn variant="dark" full onClick={next}>{qIdx + 1 >= questions.length ? t.seeResults : t.nextQuestion}</Btn>}
    </div>
  );
}

/* ============================== RESOURCES SCREEN ============================== */
function ResourcesScreen({ t, user, setShowUpgrade, viewport, onOpenAdminUpload }) {
  const [filter, setFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const userTier = PLAN_LIMITS[user.plan].resourceTier;
  const { isDesktop } = viewport;

  const fetchResources = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
    setResources(error || !data ? [] : data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  const filters = [
    { key: "all", label: t.filterAll },
    { key: "papers", label: t.filterPapers },
    { key: "guides", label: t.filterGuides },
    { key: "notes", label: t.filterNotes },
    { key: "video", label: t.typeVideo },
  ];

  const tierMeta = [
    { label: t.resourceFree, color: C.teal, textColor: C.tealDeep, bg: "rgba(95,184,166,0.14)" },
    { label: t.resourceAdvanced, color: C.green, textColor: C.greenDeep, bg: "rgba(132,172,100,0.14)" },
    { label: t.resourcePremium, color: C.purple, textColor: C.purpleDeep, bg: "rgba(139,127,214,0.12)" },
  ];

  const gradeOptions = ["all", ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)];

  const filtered = resources.filter((r) =>
    (filter === "all" || r.type === filter) &&
    (gradeFilter === "all" || (r.grade || "").includes(gradeFilter.replace("Grade ", ""))) &&
    (!query || r.title.toLowerCase().includes(query.toLowerCase()) || (r.subject || "").toLowerCase().includes(query.toLowerCase()))
  );

  const outerPad = isDesktop ? { maxWidth: 1180, margin: "0 auto", padding: "36px 32px 60px" } : {};

  return (
    <div style={outerPad}>
      <Header
        title={t.resourcesTitle} sub={t.resourcesSub} flush={isDesktop} large={isDesktop}
        right={user.is_admin ? <Btn variant="primary" onClick={onOpenAdminUpload} style={{ padding: "9px 16px", fontSize: 13 }}>+ {t.adminUploadTitle}</Btn> : null}
      />
      <div style={{ display: "flex", gap: 10, padding: isDesktop ? "0 0 14px" : "0 20px 12px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: "10px 14px", flex: isDesktop ? "0 1 280px" : "1 1 100%" }}>
          <Icon.search size={16} color="rgba(13,23,59,0.4)" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.resourcesSearch} style={{ flex: 1, border: "none", outline: "none", fontFamily: FONT_BODY, fontSize: 14, background: "transparent" }} />
        </div>
        <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13, padding: "10px 14px", borderRadius: 14, border: `1px solid ${C.line}`, background: "#fff", color: C.ink, cursor: "pointer" }}>
          {gradeOptions.map((g) => <option key={g} value={g}>{g === "all" ? t.allGrades : g}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 6, padding: isDesktop ? "0 0 18px" : "0 20px 14px", overflowX: "auto" }}>
        {filters.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13, padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", whiteSpace: "nowrap", background: filter === f.key ? C.ink : C.paperDim, color: filter === f.key ? C.paper : "rgba(13,23,59,0.6)" }}>{f.label}</button>
        ))}
      </div>

      <div style={{ padding: isDesktop ? 0 : "0 20px" }}>
        {loading && <p style={{ textAlign: "center", fontFamily: FONT_BODY, fontSize: 13.5, color: "rgba(13,23,59,0.45)", padding: "24px 0" }}>...</p>}
        {!loading && filtered.length === 0 && (
          <p style={{ textAlign: "center", fontFamily: FONT_BODY, fontSize: 13.5, color: "rgba(13,23,59,0.45)", padding: "24px 0" }}>{t.resourcesEmpty}</p>
        )}
        <div style={{ display: isDesktop ? "grid" : "flex", gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : undefined, flexDirection: isDesktop ? undefined : "column", gap: 12 }}>
          {filtered.map((r) => {
            const meta = tierMeta[r.tier] || tierMeta[0];
            const isLocked = r.tier > userTier;
            return (
              <div key={r.id} style={{ position: "relative", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: "16px 18px", display: "flex", flexDirection: "column" }}>
                {isLocked && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.85)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <button onClick={() => setShowUpgrade(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: C.ink, color: C.paper, border: "none", borderRadius: 20, padding: "8px 16px", fontFamily: FONT_BODY, fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>
                      <Icon.lock size={13} /> {t.upgradeNow}
                    </button>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 10.5, padding: "2px 8px", borderRadius: 10, background: meta.bg, color: meta.textColor, textTransform: "uppercase", letterSpacing: 0.3 }}>{meta.label}</span>
                      {r.is_new && <span style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 10.5, padding: "2px 8px", borderRadius: 10, background: "rgba(217,105,79,0.12)", color: C.coral }}>{t.newBadge}</span>}
                    </div>
                    <p style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 14, color: C.ink, margin: 0 }}>{r.title}</p>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "rgba(13,23,59,0.5)", margin: "3px 0 0" }}>{r.subject} · {r.grade}</p>
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.paperDim, color: C.greenDeep, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {r.type === "papers" ? <Icon.file size={16} /> : r.type === "guides" ? <Icon.library size={16} /> : r.type === "video" ? <Icon.tutor size={16} /> : <Icon.type size={16} />}
                  </div>
                </div>
                {!isLocked && (
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <Btn variant="ghost" style={{ flex: 1, padding: "9px 14px", fontSize: 13 }} onClick={() => r.file_url && window.open(r.file_url, "_blank")}>{t.viewResource}</Btn>
                    <Btn variant="dark" style={{ flex: 1, padding: "9px 14px", fontSize: 13 }} onClick={() => r.file_url && window.open(r.file_url, "_blank")}><Icon.download size={14} /> {t.downloadResource}</Btn>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================== ADMIN UPLOAD MODAL ============================== */
/* Lets the site owner (anyone with is_admin = true on their profile) add new past
   papers, study guides, notes, or videos straight from the website — no coding,
   no Supabase dashboard needed for day-to-day content updates. */
function AdminUploadModal({ t, onClose, onUploaded }) {
  const [form, setForm] = useState({ title: "", type: "papers", subject: "", grade: "Grade 12", tier: 0 });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!form.title || !file) { setError("Please add a title and choose a file."); return; }
    setUploading(true); setError("");
    try {
      const ext = file.name.split(".").pop();
      const path = `${form.type}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("resources").upload(path, file);
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("resources").getPublicUrl(path);
      const { error: dbErr } = await supabase.from("resources").insert({
        title: form.title, type: form.type, subject: form.subject, grade: form.grade,
        tier: form.tier, file_url: urlData.publicUrl, is_new: true,
      });
      if (dbErr) throw dbErr;
      setSuccess(true);
      onUploaded();
      setTimeout(() => { setSuccess(false); setForm({ title: "", type: "papers", subject: "", grade: "Grade 12", tier: 0 }); setFile(null); }, 1400);
    } catch (e) {
      setError(e.message || "Upload failed. Please try again.");
    }
    setUploading(false);
  };

  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.line}`, fontFamily: FONT_BODY, fontSize: 14, outline: "none", background: "#fff", boxSizing: "border-box" };
  const labelStyle = { fontFamily: FONT_BODY, fontSize: 12, color: "rgba(13,23,59,0.55)", display: "block", marginBottom: 5 };
  const gradeOptions = ["All grades", ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`), "Grade 10-12", "Grade 11-12"];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,23,59,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
      <div style={{ background: C.paper, borderRadius: 22, width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto", padding: "24px 24px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 20, color: C.ink, margin: 0 }}>{t.adminUploadTitle}</h2>
            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: "rgba(13,23,59,0.6)", margin: "4px 0 0" }}>{t.adminUploadSub}</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: C.paperDim, border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><Icon.x size={14} /></button>
        </div>

        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.greenSoft, color: C.greenDeep, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}><Icon.check size={24} /></div>
            <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 16, color: C.ink, margin: 0 }}>{t.adminUploadSuccess}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={labelStyle}>{t.adminFieldTitle}</label>
              <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Mathematics Paper 1 — Nov 2026" />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>{t.adminFieldType}</label>
                <select style={inputStyle} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="papers">{t.filterPapers}</option>
                  <option value="guides">{t.filterGuides}</option>
                  <option value="notes">{t.filterNotes}</option>
                  <option value="video">{t.typeVideo}</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>{t.adminFieldGrade}</label>
                <select style={inputStyle} value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}>
                  {gradeOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t.adminFieldSubject}</label>
              <input style={inputStyle} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Mathematics" />
            </div>
            <div>
              <label style={labelStyle}>{t.adminFieldTier}</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ v: 0, l: "Free" }, { v: 1, l: "Advanced+" }, { v: 2, l: "Premium" }].map((opt) => (
                  <button key={opt.v} onClick={() => setForm({ ...form, tier: opt.v })} style={{ flex: 1, padding: "10px 8px", borderRadius: 10, border: `1.5px solid ${form.tier === opt.v ? C.ink : C.line}`, background: form.tier === opt.v ? C.ink : "#fff", color: form.tier === opt.v ? C.paper : C.ink, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>{opt.l}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t.adminFieldFile}</label>
              <input type="file" accept=".pdf,video/*" onChange={(e) => setFile(e.target.files[0])} style={{ width: "100%", fontFamily: FONT_BODY, fontSize: 13 }} />
            </div>

            {error && <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.coral, margin: 0 }}>{error}</p>}
            <Btn variant="primary" full onClick={submit} disabled={uploading}>{uploading ? t.adminUploading : t.adminUploadBtn}</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== AI TUTOR ============================== */
function TutorScreen({ t, user, onXpEarned, setShowUpgrade, incrementTutorUse, viewport, onOpenCalculator }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: t.tutorWelcome }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachItems, setAttachItems] = useState([]);
  const [itemWarning, setItemWarning] = useState("");
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const limit = PLAN_LIMITS[user.plan].tutorPerDay;
  const limitReached = limit !== Infinity && user.tutorQuestionsToday >= limit;
  const speech = useSpeechRecognition(user.lang);
  const { isDesktop } = viewport;

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, loading]);
  useEffect(() => { if (speech.transcript) setInput(speech.transcript); }, [speech.transcript]);

  const batchChars = attachItems.reduce((sum, it) => sum + (it.sizeChars || 0), 0);

  const handleCameraCapture = async (file) => {
    if (!file) return;
    if (limitReached) { setShowUpgrade(true); return; }
    try {
      const item = await buildItemFromFile(file);
      if (batchChars + item.sizeChars > MAX_BATCH_BASE64_CHARS) { setItemWarning(t.fileTooLarge); return; }
      setItemWarning("");
      setAttachItems((arr) => [...arr, item]);
    } catch (e) { setItemWarning(t.unsupportedFile); }
  };

  const handleFilesChosen = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    if (limitReached) { setShowUpgrade(true); return; }
    setItemWarning("");
    for (const file of files) {
      try {
        const item = await buildItemFromFile(file);
        if (batchChars + item.sizeChars + attachItems.reduce((s, i) => s + (i.sizeChars || 0), 0) > MAX_BATCH_BASE64_CHARS) { setItemWarning(t.fileTooLarge); continue; }
        setAttachItems((arr) => [...arr, item]);
      } catch (e) { setItemWarning(t.unsupportedFile); }
    }
  };

  const removeAttachItem = (id) => setAttachItems((arr) => arr.filter((it) => it.id !== id));

  const send = async (overrideText) => {
    const text = (overrideText !== undefined ? overrideText : input).trim();
    const hasAttachments = attachItems.length > 0;
    if ((!text && !hasAttachments) || loading) return;
    if (limitReached) { setShowUpgrade(true); return; }
    if (speech.listening) speech.stop();

    const attachmentsSnapshot = attachItems;
    const pastMessages = messages;
    setMessages((m) => [...m, { role: "user", content: text, attachments: attachmentsSnapshot }]);
    setInput(""); setAttachItems([]); setItemWarning(""); setLoading(true); incrementTutorUse();

    try {
      const sys = `You are the pailot AI Tutor, a warm, encouraging study assistant for a South African student. Respond ONLY in ${LANGS.find(l=>l.code===user.lang).label}. Explain concepts clearly and simply, use short paragraphs, and where helpful use a worked example. Keep answers focused and not too long. If asked something unrelated to school or learning, gently redirect to studying. If the student attaches a photo or document without asking a specific question, do not guess what they want — briefly ask what they'd like help with (for example: solve it and explain each step, check their work, or explain a concept in it) before working through the material.`;

      // Past turns are sent as lightweight text only — any photos/documents already
      // shown to the model are never re-sent on later turns, keeping every request small.
      const pastHistory = pastMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content || (m.attachments && m.attachments.length ? "[attached photo/document — already shared above]" : "") }));

      let currentContent = text;
      if (hasAttachments) {
        const blocks = [];
        const textPieces = [];
        for (const item of attachmentsSnapshot) {
          if (item.kind === "image") blocks.push({ type: "image", source: { type: "base64", media_type: item.mime, data: item.base64 } });
          else if (item.kind === "pdf") blocks.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: item.base64 } });
          else if (item.kind === "text") textPieces.push(item.text);
        }
        if (textPieces.length) blocks.push({ type: "text", text: `Extracted text from attached file(s):\n\n${textPieces.join("\n\n---\n\n")}`.slice(0, 12000) });
        blocks.push({ type: "text", text: text || "(No specific question yet — please ask what I'd like help with before proceeding.)" });
        currentContent = blocks;
      }

      const history = [...pastHistory, { role: "user", content: currentContent }];
      const reply = await callClaude(history, sys, 900);
      setMessages((m) => [...m, { role: "assistant", content: reply || "..." }]);
      onXpEarned(2);
    } catch (e) { setMessages((m) => [...m, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]); }
    setLoading(false);
  };

  const prompts = [t.promptExplain, t.promptHomework, t.promptQuiz];
  const canSend = (input.trim().length > 0 || attachItems.length > 0) && !loading;

  const ChatColumn = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
      <Header title={t.tutorTitle} sub={t.tutorSub} flush={isDesktop} large={isDesktop} />
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: isDesktop ? "0" : "0 20px", display: "flex", flexDirection: "column", gap: 12, minHeight: isDesktop ? 360 : undefined }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "82%", display: "flex", flexDirection: "column", gap: 6, alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
              {m.attachments && m.attachments.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {m.attachments.map((it) => (
                    it.kind === "image" ? (
                      <img key={it.id} src={it.previewUrl} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", border: `1px solid ${C.line}` }} />
                    ) : (
                      <div key={it.id} style={{ width: 56, height: 56, borderRadius: 10, background: "#fff", border: `1px solid ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.greenDeep, padding: 4, overflow: "hidden" }}>
                        <Icon.file size={16} />
                        <span style={{ fontFamily: FONT_BODY, fontSize: 8, color: C.ink, marginTop: 2, maxWidth: 48, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.label}</span>
                      </div>
                    )
                  ))}
                </div>
              )}
              {m.content && (
                <div style={{ padding: "11px 15px", borderRadius: 16, background: m.role === "user" ? C.ink : "#fff", color: m.role === "user" ? C.paper : C.ink, border: m.role === "user" ? "none" : `1px solid ${C.line}`, fontFamily: FONT_BODY, fontSize: 14, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{m.content}</div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "11px 15px", borderRadius: 16, background: "#fff", border: `1px solid ${C.line}`, fontFamily: FONT_BODY, fontSize: 13, color: "rgba(21,25,43,0.5)" }}>{t.thinking}</div>
          </div>
        )}
      </div>
      {limitReached ? (
        <div style={{ padding: isDesktop ? "14px 0 0" : "14px 20px 20px" }}>
          <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
            <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 14, color: C.ink, margin: "0 0 4px" }}>{t.freeLimitReached}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "rgba(21,25,43,0.6)", margin: "0 0 12px" }}>{t.freeLimitSub}</p>
            <Btn variant="primary" full onClick={() => setShowUpgrade(true)}>{t.upgradeNow}</Btn>
          </div>
        </div>
      ) : (
        <div style={{ padding: isDesktop ? "16px 0 0" : "12px 16px 18px" }}>
          <input ref={fileInputRef} type="file" accept={FILE_ACCEPT} multiple style={{ display: "none" }} onChange={(e) => { handleFilesChosen(e.target.files); e.target.value = ""; }} />
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={(e) => { handleCameraCapture(e.target.files[0]); e.target.value = ""; }} />

          {attachItems.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8, padding: "0 4px" }}>
              {attachItems.map((it) => (
                <div key={it.id} style={{ position: "relative" }}>
                  {it.kind === "image" ? (
                    <img src={it.previewUrl} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", border: `1px solid ${C.line}` }} />
                  ) : (
                    <div style={{ width: 48, height: 48, borderRadius: 10, background: "#fff", border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.greenDeep }}><Icon.file size={16} /></div>
                  )}
                  <button onClick={() => removeAttachItem(it.id)} aria-label={t.removeItem} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: C.coral, color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}><Icon.x size={9} /></button>
                </div>
              ))}
            </div>
          )}
          {itemWarning && <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.coral, margin: "0 0 6px 4px" }}>{itemWarning}</p>}
          {speech.listening && (
            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.coral, fontWeight: 600, margin: "0 0 6px", paddingLeft: 4 }}>{t.listening}</p>
          )}
          {speech.error === "denied" && (
            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.coral, margin: "0 0 6px", paddingLeft: 4 }}>{t.micPermissionDenied}</p>
          )}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={() => cameraInputRef.current && cameraInputRef.current.click()} aria-label={t.takePhoto} style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.ink, cursor: "pointer", flexShrink: 0 }}><Icon.camera size={16} /></button>
            <button onClick={() => fileInputRef.current && fileInputRef.current.click()} aria-label={t.chooseFile} style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.ink, cursor: "pointer", flexShrink: 0 }}><Icon.paperclip size={16} /></button>
            {speech.isSupported && (
              <button
                onClick={() => (speech.listening ? speech.stop() : speech.start())}
                aria-label={t.speakNow}
                style={{ width: 40, height: 40, borderRadius: "50%", background: speech.listening ? C.coral : "#fff", border: speech.listening ? "none" : `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: speech.listening ? "#fff" : C.ink, cursor: "pointer", flexShrink: 0, transition: "all 0.2s ease" }}
              >
                <Icon.mic size={16} />
              </button>
            )}
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={t.speakOrType} style={{ flex: 1, minWidth: 0, padding: "12px 16px", borderRadius: 24, border: `1px solid ${C.line}`, outline: "none", fontFamily: FONT_BODY, fontSize: 14, background: "#fff" }} />
            <button onClick={() => send()} disabled={!canSend} aria-label={t.send} style={{ width: 44, height: 44, borderRadius: "50%", background: C.green, border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: C.ink, cursor: canSend ? "pointer" : "default", opacity: canSend ? 1 : 0.5, flexShrink: 0 }}><Icon.send size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 32px 60px", height: "calc(100vh - 140px)", display: "flex" }}>
        <div style={{ flex: 1, maxWidth: 760 }}>{ChatColumn}</div>
        <div style={{ width: 280, marginLeft: 32, flexShrink: 0 }}>
          <button onClick={onOpenCalculator} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", marginTop: 44, marginBottom: 18 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: C.paperDim, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.calculator size={15} /></div>
            <span style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13.5, color: C.ink }}>Calculator</span>
          </button>
          <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 12.5, color: "rgba(21,25,43,0.45)", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 12px" }}>{t.suggestedPrompts}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {prompts.map((p) => (
              <button key={p} onClick={() => send(p)} disabled={loading || limitReached} style={{ textAlign: "left", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px", cursor: loading || limitReached ? "default" : "pointer", fontFamily: FONT_BODY, fontSize: 13, color: C.ink, lineHeight: 1.4, opacity: loading || limitReached ? 0.5 : 1 }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return ChatColumn;
}

/* ============================== LEADERBOARD ============================== */
function LeaderboardScreen({ t, user, setShowUpgrade }) {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFullBoard = PLAN_LIMITS[user.plan].boardFull;

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, surname, xp, avatar_url")
        .order("xp", { ascending: false })
        .limit(50);
      if (active) {
        setBoard(error || !data ? [] : data);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div>
      <Header title={t.leaderboardTitle} sub={t.leaderboardSub} />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        {loading && <p style={{ textAlign: "center", fontFamily: FONT_BODY, fontSize: 13.5, color: "rgba(13,23,59,0.45)", padding: "20px 0" }}>{t.leaderboardLoading}</p>}
        {!loading && board.length === 0 && (
          <p style={{ textAlign: "center", fontFamily: FONT_BODY, fontSize: 13.5, color: "rgba(13,23,59,0.45)", padding: "20px 0" }}>{t.leaderboardEmptyReal}</p>
        )}
        {board.map((entry, i) => {
          const isYou = entry.id === user.id;
          const fullName = `${entry.name || ""} ${entry.surname || ""}`.trim() || t.you;
          return (
            <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, background: isYou ? C.ink : "#fff", border: isYou ? "none" : `1px solid ${C.line}` }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_MONO, fontWeight: 700, fontSize: 12, flexShrink: 0, background: i === 0 ? C.green : i === 1 ? "rgba(13,23,59,0.12)" : i === 2 ? "rgba(217,105,79,0.15)" : "transparent", color: isYou ? C.paper : C.ink }}>{i + 1}</div>
              {entry.avatar_url ? (
                <img src={entry.avatar_url} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: isYou ? "rgba(255,255,255,0.15)" : C.paperDim, color: isYou ? C.paper : C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{fullName[0]}</div>
              )}
              <p style={{ flex: 1, fontFamily: FONT_BODY, fontWeight: isYou ? 700 : 500, fontSize: 14, color: isYou ? C.paper : C.ink, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{isYou ? `${fullName} (${t.you})` : fullName}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: isYou ? C.green : C.greenDeep, flexShrink: 0 }}>
                <Icon.bolt size={13} />
                <span style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 13, color: isYou ? C.paper : C.ink }}>{(entry.xp || 0).toLocaleString()}</span>
              </div>
            </div>
          );
        })}
        {!hasFullBoard && (
          <button onClick={() => setShowUpgrade(true)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(139,127,214,0.08)", border: `1.5px solid ${C.purple}`, borderRadius: 14, padding: "12px 16px", marginTop: 4, cursor: "pointer" }}>
            <span style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13, color: C.purpleDeep }}>{t.featureBoardFull}</span>
            <Icon.chevronRight size={16} color={C.purpleDeep} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================== PROFILE ============================== */
function ProfileScreen({ t, user, setShowUpgrade, onChangeLanguage, onProfileUpdated, onLogout }) {
  const planLabel = user.plan === "premium" ? t.premiumPlan : user.plan === "advanced" ? t.advancedPlan : t.freePlan;
  const [bio, setBio] = useState(user.bio || "");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const avatarInputRef = useRef(null);

  const uploadAvatar = async (file) => {
    if (!file) return;
    setAvatarUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("id", user.id);
      onProfileUpdated({ avatar_url: urlData.publicUrl });
    } catch (e) { /* swallow — could surface a toast in a future pass */ }
    setAvatarUploading(false);
  };

  const saveBio = async () => {
    setSaving(true);
    await supabase.from("profiles").update({ bio }).eq("id", user.id);
    onProfileUpdated({ bio });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div>
      <Header title={t.profileTitle} />
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
          <div style={{ position: "relative" }}>
            <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => uploadAvatar(e.target.files[0])} />
            <button onClick={() => avatarInputRef.current?.click()} style={{ width: 68, height: 68, borderRadius: "50%", border: "none", padding: 0, cursor: "pointer", overflow: "hidden", background: C.ink, color: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 24, position: "relative" }}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                user.name?.[0] || "?"
              )}
              <div style={{ position: "absolute", inset: 0, background: "rgba(13,23,59,0.45)", display: "flex", alignItems: "center", justifyContent: "center", opacity: avatarUploading ? 1 : 0, transition: "opacity 0.15s ease" }}>
                {avatarUploading ? <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#fff" }}>...</span> : null}
              </div>
            </button>
            <button onClick={() => avatarInputRef.current?.click()} style={{ position: "absolute", bottom: -2, right: -2, width: 24, height: 24, borderRadius: "50%", background: C.green, border: `2px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.ink }}>
              <Icon.camera size={11} />
            </button>
          </div>
          <div>
            <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 18, color: C.ink, margin: 0 }}>{user.name} {user.surname}</p>
            <div style={{ marginTop: 4 }}>{user.plan !== "free" ? <PlanBadge plan={user.plan} /> : <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "rgba(13,23,59,0.5)" }}>{planLabel}</span>}</div>
          </div>
        </div>

        {user.plan !== "premium" && (
          <button onClick={() => setShowUpgrade(true)} style={{ width: "100%", background: C.ink, border: "none", borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: C.green }}><Icon.crown size={18} /></span>
              <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 14, color: C.paper }}>{t.upgradeNow}</span>
            </div>
            <Icon.chevronRight size={16} color={C.paper} />
          </button>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
          <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 16px" }}>
            <p style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 20, color: C.ink, margin: 0 }}>{user.xp.toLocaleString()}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: "rgba(13,23,59,0.55)", margin: "2px 0 0" }}>{t.xpLabel}</p>
          </div>
          <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 16px" }}>
            <p style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 20, color: C.ink, margin: 0 }}>{user.streak}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: "rgba(13,23,59,0.55)", margin: "2px 0 0" }}>{t.streakLabel}</p>
          </div>
        </div>

        <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13, color: "rgba(13,23,59,0.5)", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 10px" }}>{t.bioLabel}</p>
        <textarea
          value={bio} onChange={(e) => setBio(e.target.value)} placeholder={t.bioPlaceholder}
          style={{ width: "100%", minHeight: 80, borderRadius: 14, border: `1px solid ${C.line}`, padding: "12px 14px", fontFamily: FONT_BODY, fontSize: 14, outline: "none", resize: "vertical", background: "#fff", boxSizing: "border-box", marginBottom: 10 }}
        />
        <Btn variant={saved ? "teal" : "dark"} onClick={saveBio} disabled={saving} style={{ marginBottom: 24 }}>
          {saving ? "..." : saved ? `✓ ${t.profileSaved}` : t.saveProfile}
        </Btn>

        <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13, color: "rgba(13,23,59,0.5)", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 10px" }}>{t.settings}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={onChangeLanguage} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", textAlign: "left" }}>
            <span style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 14, color: C.ink }}>{t.changeLanguage}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_BODY, fontSize: 13, color: "rgba(13,23,59,0.5)" }}>{LANGS.find(l=>l.code===user.lang).native} <Icon.chevronRight size={14} /></span>
          </button>
          <button onClick={onLogout} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", textAlign: "left" }}>
            <span style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 14, color: C.coral }}>{t.logOutConfirm}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================== UPGRADE / 3-PLAN MODAL ============================== */
function PlanCard({ t, plan, current, onSelect }) {
  const isAdvanced = plan === "advanced";
  const isPremium = plan === "premium";
  const price = isPremium ? 149 : isAdvanced ? 99 : 0;
  const name = isPremium ? t.premiumPlan : isAdvanced ? t.advancedPlan : t.freePlan;
  const accent = isPremium ? C.purple : isAdvanced ? C.green : "rgba(21,25,43,0.15)";
  const accentText = isPremium ? C.purpleDeep : isAdvanced ? C.greenDeep : "rgba(21,25,43,0.5)";
  const accentBg = isPremium ? "rgba(127,119,221,0.08)" : isAdvanced ? "rgba(132,172,100,0.08)" : "transparent";

  const features = plan === "free"
    ? [t.featureUploads3, t.featureTutor5, t.featureQuizOnly, t.featureResourcesFree, t.featureBoardBasic]
    : plan === "advanced"
    ? [t.featureUploadsUnlimited, t.featureTutorUnlimited, t.featureExams, t.featureResourcesFull, t.featureBoardBasic]
    : [t.featureUploadsUnlimited, t.featureTutorUnlimited, t.featureExams, t.featureResourcesFull, t.featureResourcesEarly, t.featureOffline, t.featureBoardFull];

  const isCurrent = current === plan;

  return (
    <div style={{ position: "relative", border: `2px solid ${isPremium ? C.purple : isAdvanced ? C.green : C.line}`, borderRadius: 18, padding: "18px 18px 16px", background: accentBg || "#fff" }}>
      {isAdvanced && <span style={{ position: "absolute", top: -11, left: 16, background: C.green, color: C.ink, fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 10.5, padding: "3px 10px", borderRadius: 10 }}>{t.mostPopular}</span>}
      {isPremium && <span style={{ position: "absolute", top: -11, left: 16, background: C.purple, color: "#fff", fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 10.5, padding: "3px 10px", borderRadius: 10 }}>{t.bestValue}</span>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: C.ink }}>{name}</span>
        <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 20, color: C.ink }}>{price === 0 ? "R0" : `R${price}`}<span style={{ fontSize: 12, fontWeight: 500, color: "rgba(21,25,43,0.5)" }}>{price > 0 ? t.perMonth : ""}</span></span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {features.map((f) => (
          <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
            <span style={{ color: accentText, marginTop: 2, flexShrink: 0 }}><Icon.check size={13} /></span>
            <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: "rgba(21,25,43,0.78)", lineHeight: 1.4 }}>{f}</span>
          </div>
        ))}
      </div>
      {plan === "free" ? (
        <Btn variant="ghost" full disabled={isCurrent}>{isCurrent ? t.currentPlan : t.choosePlan}</Btn>
      ) : (
        <Btn variant={isPremium ? "purple" : "primary"} full disabled={isCurrent} onClick={() => onSelect(plan)}>{isCurrent ? t.currentPlan : t.choosePlan}</Btn>
      )}
    </div>
  );
}

/* ============================== SCIENTIFIC CALCULATOR ============================== */
function CalculatorModal({ onClose }) {
  const [tokens, setTokens] = useState([]);
  const [degMode, setDegMode] = useState(true);
  const [error, setError] = useState(false);

  const prettyDisplay = (rawTokens) => {
    const raw = rawTokens.join("");
    if (!raw) return "0";
    return raw
      .replace(/Math\.PI/g, "π")
      .replace(/Math\.E/g, "e")
      .replace(/Math\.asin\(/g, "sin⁻¹(")
      .replace(/Math\.acos\(/g, "cos⁻¹(")
      .replace(/Math\.atan\(/g, "tan⁻¹(")
      .replace(/Math\.sin\(([^)]*Math\.PI\/180\*)?/g, "sin(")
      .replace(/Math\.cos\(([^)]*Math\.PI\/180\*)?/g, "cos(")
      .replace(/Math\.tan\(([^)]*Math\.PI\/180\*)?/g, "tan(")
      .replace(/Math\.log10\(/g, "log(")
      .replace(/Math\.log\(/g, "ln(")
      .replace(/Math\.sqrt\(/g, "√(")
      .replace(/\*\*2\b/g, "²")
      .replace(/\*\*\(-1\)/g, "⁻¹")
      .replace(/\*\*/g, "^")
      .replace(/\*/g, "×")
      .replace(/\//g, "÷");
  };

  const push = (token) => { setError(false); setTokens((arr) => [...arr, token]); };
  const backspace = () => { setError(false); setTokens((arr) => arr.slice(0, -1)); };
  const clearAll = () => { setError(false); setTokens([]); };

  const trig = (fn) => push(degMode ? `Math.${fn}(Math.PI/180*` : `Math.${fn}(`);

  const equals = () => {
    const raw = tokens.join("");
    if (!raw) return;
    try {
      // Safe by construction: `raw` is built exclusively from a fixed set of button
      // tokens below (digits, operators, Math.* calls) — never from free-typed text.
      // eslint-disable-next-line no-new-func
      const value = Function(`"use strict"; return (${raw});`)();
      if (typeof value !== "number" || !isFinite(value)) throw new Error("bad result");
      const rounded = Math.round(value * 1e10) / 1e10;
      setTokens([String(rounded)]);
    } catch (e) { setError(true); }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (/^[0-9.+\-]$/.test(e.key)) push(e.key);
      else if (e.key === "*") push("*");
      else if (e.key === "/") push("/");
      else if (e.key === "(" || e.key === ")") push(e.key);
      else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); equals(); }
      else if (e.key === "Backspace") backspace();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, degMode]);

  const rows = [
    [{ l: degMode ? "DEG" : "RAD", act: () => setDegMode((d) => !d), tone: "mode" }, { l: "sin", act: () => trig("sin") }, { l: "cos", act: () => trig("cos") }, { l: "tan", act: () => trig("tan") }, { l: "C", act: clearAll, tone: "op" }],
    [{ l: "x²", act: () => push("**2") }, { l: "xʸ", act: () => push("**") }, { l: "√", act: () => push("Math.sqrt(") }, { l: "ln", act: () => push("Math.log(") }, { l: "log", act: () => push("Math.log10(") }],
    [{ l: "7", act: () => push("7") }, { l: "8", act: () => push("8") }, { l: "9", act: () => push("9") }, { l: "(", act: () => push("(") }, { l: ")", act: () => push(")") }],
    [{ l: "4", act: () => push("4") }, { l: "5", act: () => push("5") }, { l: "6", act: () => push("6") }, { l: "×", act: () => push("*"), tone: "op" }, { l: "÷", act: () => push("/"), tone: "op" }],
    [{ l: "1", act: () => push("1") }, { l: "2", act: () => push("2") }, { l: "3", act: () => push("3") }, { l: "+", act: () => push("+"), tone: "op" }, { l: "−", act: () => push("-"), tone: "op" }],
    [{ l: "π", act: () => push("Math.PI") }, { l: "0", act: () => push("0") }, { l: ".", act: () => push(".") }, { l: "⌫", act: backspace, tone: "op" }, { l: "=", act: equals, tone: "equals" }],
  ];

  const keyStyle = (tone) => ({
    border: "none", borderRadius: 12, cursor: "pointer", fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 16, padding: "14px 0",
    background: tone === "equals" ? C.green : tone === "op" ? C.paperDim : tone === "mode" ? C.ink : "#fff",
    color: tone === "equals" ? C.ink : tone === "mode" ? C.paper : C.ink,
    border1: tone === "op" || tone === undefined ? `1px solid ${C.line}` : "none",
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(21,25,43,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }} onClick={onClose}>
      <div style={{ background: C.paperDim, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 420, padding: "10px 18px 26px" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 12px" }}><div style={{ width: 36, height: 4, borderRadius: 3, background: C.line }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.ink }}><Icon.calculator size={18} /><span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15 }}>Calculator</span></div>
          <button onClick={onClose} aria-label="Close" style={{ background: "#fff", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Icon.x size={13} /></button>
        </div>

        <div style={{ background: C.ink, borderRadius: 16, padding: "22px 18px", marginBottom: 12, minHeight: 74, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", overflowX: "auto" }}>
          <span style={{ fontFamily: FONT_MONO, fontWeight: 600, fontSize: tokens.length > 14 ? 20 : 28, color: error ? C.coral : C.paper, whiteSpace: "nowrap" }}>
            {error ? "Error" : prettyDisplay(tokens)}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rows.map((row, ri) => (
            <div key={ri} style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {row.map((b, bi) => (
                <button key={bi} onClick={b.act} style={{ ...keyStyle(b.tone), border: b.tone === "op" || b.tone === undefined ? `1px solid ${C.line}` : "none" }}>{b.l}</button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UpgradeModal({ t, currentPlan, onClose, onSuccess }) {
  const [stage, setStage] = useState("plan");
  const [selectedPlan, setSelectedPlan] = useState("advanced");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [paying, setPaying] = useState(false);

  const formatCardNumber = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
  const formatExpiry = (v) => v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(?=\d)/, "$1/");
  const price = selectedPlan === "premium" ? 149 : 99;

  const choose = (plan) => { setSelectedPlan(plan); setStage("pay"); };
  const pay = () => { setPaying(true); setTimeout(() => { setPaying(false); setStage("success"); }, 1400); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(21,25,43,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50 }}>
      <div style={{ background: C.paper, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 420, maxHeight: "90vh", overflowY: "auto", padding: "10px 0 28px" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 4px" }}><div style={{ width: 36, height: 4, borderRadius: 3, background: C.line }} /></div>

        {stage === "plan" && (
          <div style={{ padding: "16px 22px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div>
                <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 21, color: C.ink, margin: 0 }}>{t.upgradeTitle}</h2>
                <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: "rgba(21,25,43,0.6)", margin: "4px 0 0" }}>{t.upgradeSub}</p>
              </div>
              <button onClick={onClose} aria-label="Close" style={{ background: C.paperDim, border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><Icon.x size={14} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <PlanCard t={t} plan="free" current={currentPlan} onSelect={choose} />
              <PlanCard t={t} plan="advanced" current={currentPlan} onSelect={choose} />
              <PlanCard t={t} plan="premium" current={currentPlan} onSelect={choose} />
            </div>
            <div style={{ height: 8 }} />
          </div>
        )}

        {stage === "pay" && (
          <div style={{ padding: "16px 22px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <button onClick={() => setStage("plan")} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 4, cursor: "pointer", color: "rgba(21,25,43,0.5)", fontFamily: FONT_BODY, fontSize: 13, padding: 0 }}><Icon.chevronLeft size={15} /> {t.choosePlan}</button>
              <button onClick={onClose} aria-label="Close" style={{ background: C.paperDim, border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><Icon.x size={14} /></button>
            </div>
            <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 19, color: C.ink, margin: "10px 0 18px" }}>{t.payNow} — R{price}{t.perMonth}</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontFamily: FONT_BODY, fontSize: 12, color: "rgba(21,25,43,0.55)", display: "block", marginBottom: 5 }}>{t.cardNumber}</label>
                <input value={card.number} onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })} placeholder="4000 1234 5678 9010" style={{ width: "100%", padding: "13px 14px", borderRadius: 12, border: `1px solid ${C.line}`, fontFamily: FONT_MONO, fontSize: 14, outline: "none", background: "#fff" }} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontFamily: FONT_BODY, fontSize: 12, color: "rgba(21,25,43,0.55)", display: "block", marginBottom: 5 }}>{t.expiry}</label>
                  <input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} placeholder="MM/YY" style={{ width: "100%", padding: "13px 14px", borderRadius: 12, border: `1px solid ${C.line}`, fontFamily: FONT_MONO, fontSize: 14, outline: "none", background: "#fff" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontFamily: FONT_BODY, fontSize: 12, color: "rgba(21,25,43,0.55)", display: "block", marginBottom: 5 }}>{t.cvv}</label>
                  <input value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })} placeholder="123" style={{ width: "100%", padding: "13px 14px", borderRadius: 12, border: `1px solid ${C.line}`, fontFamily: FONT_MONO, fontSize: 14, outline: "none", background: "#fff" }} />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: FONT_BODY, fontSize: 12, color: "rgba(21,25,43,0.55)", display: "block", marginBottom: 5 }}>{t.nameOnCard}</label>
                <input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder="T. Nkosi" style={{ width: "100%", padding: "13px 14px", borderRadius: 12, border: `1px solid ${C.line}`, fontFamily: FONT_BODY, fontSize: 14, outline: "none", background: "#fff" }} />
              </div>
            </div>

            <p style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: "rgba(21,25,43,0.45)", textAlign: "center", margin: "16px 0" }}>{t.paySecure} · PayFast / Yoco</p>
            <Btn variant={selectedPlan === "premium" ? "purple" : "primary"} full onClick={pay} disabled={paying || card.number.length < 19}>{paying ? t.thinking : t.payNow}</Btn>
            <div style={{ height: 8 }} />
          </div>
        )}

        {stage === "success" && (
          <div style={{ padding: "24px 24px 4px", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: selectedPlan === "premium" ? "rgba(127,119,221,0.14)" : "rgba(45,191,158,0.14)", color: selectedPlan === "premium" ? C.purpleDeep : C.tealDeep, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}><Icon.crown size={26} /></div>
            <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 21, color: C.ink, margin: "0 0 6px" }}>{t.paymentSuccess}</h2>
            <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: "rgba(21,25,43,0.6)", margin: "0 0 22px" }}>{t.paymentSuccessSub}</p>
            <Btn variant={selectedPlan === "premium" ? "purple" : "primary"} full onClick={() => onSuccess(selectedPlan)}>{t.done}</Btn>
            <div style={{ height: 8 }} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== MAIN APP ============================== */
export default function pailotApp() {
  const [authChecked, setAuthChecked] = useState(false);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [screen, setScreen] = useState("home");
  const [activeMaterialId, setActiveMaterialId] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showAdminUpload, setShowAdminUpload] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [resourcesRefreshKey, setResourcesRefreshKey] = useState(0);
  const [materials, setMaterials] = useState([]);
  const [uploadMode, setUploadMode] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const viewport = useViewport();
  const { isDesktop } = viewport;

  // Local session-only gameplay state (resets per visit; xp/streak/plan are persisted to Supabase).
  const [sessionState, setSessionState] = useState({ dailyMinutes: 12, goalMinutes: 30, uploadsToday: 0, tutorQuestionsToday: 0 });

  const loadProfile = useCallback(async (userId) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) setProfile(data);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadProfile(data.session.user.id);
      setAuthChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === "PASSWORD_RECOVERY") setPasswordRecovery(true);
      setSession(newSession);
      if (newSession) loadProfile(newSession.user.id);
      else setProfile(null);
    });
    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  const t = STRINGS[profile?.lang || "en"];

  const handlePickLanguage = async (code) => {
    setProfile((p) => ({ ...p, lang: code }));
    if (session) await supabase.from("profiles").update({ lang: code }).eq("id", session.user.id);
  };

  const addXp = async (amount) => {
    const newXp = (profile?.xp || 0) + amount;
    setProfile((p) => ({ ...p, xp: newXp }));
    setSessionState((s) => ({ ...s, dailyMinutes: Math.min(s.goalMinutes, s.dailyMinutes + 1) }));
    if (session) await supabase.from("profiles").update({ xp: newXp }).eq("id", session.user.id);
  };

  const handlePlanChange = async (plan) => {
    setProfile((p) => ({ ...p, plan }));
    if (session) await supabase.from("profiles").update({ plan }).eq("id", session.user.id);
    setShowUpgrade(false);
  };

  const handleProfileUpdated = (patch) => setProfile((p) => ({ ...p, ...patch }));

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setScreen("home");
    setProfile(null);
  };

  const openUploadMode = (mode) => { setUploadMode(mode); setScreen("upload"); };

  const [activeMaterialInitialTab, setActiveMaterialInitialTab] = useState(null);

  const handleMaterialCreated = (m, initialTab) => {
    const id = Date.now().toString();
    setMaterials((arr) => [{ id, flashcards: [], quiz: [], exam: [], ...m }, ...arr]);
    setSessionState((s) => ({ ...s, uploadsToday: s.uploadsToday + 1 }));
    setActiveMaterialId(id);
    setActiveMaterialInitialTab(initialTab || "summary");
    setScreen("materialDetail");
  };

  const updateMaterial = (updated) => setMaterials((arr) => arr.map((m) => (m.id === updated.id ? updated : m)));
  const activeMaterial = materials.find((m) => m.id === activeMaterialId);

  // Build the user object the rest of the app's screens expect — merges the
  // persisted Supabase profile with this visit's session-only gameplay counters.
  const user = profile && {
    id: profile.id,
    name: profile.name || "",
    surname: profile.surname || "",
    bio: profile.bio || "",
    avatar_url: profile.avatar_url || null,
    plan: profile.plan || "free",
    xp: profile.xp || 0,
    streak: profile.streak || 0,
    lang: profile.lang || "en",
    is_admin: !!profile.is_admin,
    dailyMinutes: sessionState.dailyMinutes,
    goalMinutes: sessionState.goalMinutes,
    uploadsToday: sessionState.uploadsToday,
    tutorQuestionsToday: sessionState.tutorQuestionsToday,
  };

  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Logo tone="light" height={36} />
      </div>
    );
  }

  if (passwordRecovery) {
    return (
      <div style={{ fontFamily: FONT_BODY }}>
        <GoogleFonts />
        <SetNewPasswordScreen t={t} onDone={() => setPasswordRecovery(false)} />
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ fontFamily: FONT_BODY }}>
        <GoogleFonts />
        <AuthScreen onAuthed={() => { /* onAuthStateChange handles session + profile load */ }} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ minHeight: "100vh", background: C.paper, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Logo tone="dark" height={36} />
      </div>
    );
  }

  if (!profile.lang) {
    return (
      <div style={{ fontFamily: FONT_BODY, minHeight: "100vh", background: C.ink }}>
        <GoogleFonts />
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <LanguagePicker onPick={handlePickLanguage} />
        </div>
      </div>
    );
  }

  /* Screens that already implement their own full responsive layout (HomeScreen, ResourcesScreen,
     TutorScreen) render edge-to-edge. The rest (Upload, MaterialDetail, Leaderboard, Profile) get a
     centered max-width wrapper on desktop so they don't stretch awkwardly on a wide viewport. */
  const wrapDesktop = (node) => (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px 32px 60px" }}>{node}</div>
  );

  const screenNode = (() => {
    if (screen === "home") return <HomeScreen t={t} user={user} materials={materials} setScreen={setScreen} openMaterial={(id) => { setActiveMaterialId(id); setActiveMaterialInitialTab(null); setScreen("materialDetail"); }} setShowUpgrade={setShowUpgrade} openUploadMode={openUploadMode} viewport={viewport} />;
    if (screen === "upload") {
      const node = <UploadScreen key={uploadMode || "default"} t={t} user={user} onMaterialCreated={handleMaterialCreated} setShowUpgrade={setShowUpgrade} fileInputRef={fileInputRef} cameraInputRef={cameraInputRef} initialMode={uploadMode} />;
      return isDesktop ? wrapDesktop(node) : node;
    }
    if (screen === "materialDetail" && activeMaterial) {
      const node = <MaterialDetail key={activeMaterial.id} t={t} user={user} material={activeMaterial} updateMaterial={updateMaterial} onBack={() => setScreen("home")} setShowUpgrade={setShowUpgrade} onXpEarned={addXp} initialTab={activeMaterialInitialTab} />;
      return isDesktop ? wrapDesktop(node) : node;
    }
    if (screen === "resources") return <ResourcesScreen key={resourcesRefreshKey} t={t} user={user} setShowUpgrade={setShowUpgrade} viewport={viewport} onOpenAdminUpload={() => setShowAdminUpload(true)} />;
    if (screen === "tutor") return <TutorScreen t={t} user={user} onXpEarned={addXp} setShowUpgrade={setShowUpgrade} incrementTutorUse={() => setSessionState((s) => ({ ...s, tutorQuestionsToday: s.tutorQuestionsToday + 1 }))} viewport={viewport} onOpenCalculator={() => setShowCalculator(true)} />;
    if (screen === "board") {
      const node = <LeaderboardScreen t={t} user={user} setShowUpgrade={setShowUpgrade} />;
      return isDesktop ? wrapDesktop(node) : node;
    }
    if (screen === "profile") {
      const node = <ProfileScreen t={t} user={user} setShowUpgrade={setShowUpgrade} onChangeLanguage={() => setProfile((p) => ({ ...p, lang: null }))} onProfileUpdated={handleProfileUpdated} onLogout={handleLogout} />;
      return isDesktop ? wrapDesktop(node) : node;
    }
    return null;
  })();

  return (
    <div style={{ fontFamily: FONT_BODY, minHeight: "100vh", background: C.paperDim, display: "flex", flexDirection: "column" }}>
      <GoogleFonts />

      {isDesktop ? (
        <TopNav t={t} screen={["materialDetail"].includes(screen) ? "home" : screen} setScreen={(s) => { setUploadMode(null); setScreen(s); }} user={user} setShowUpgrade={setShowUpgrade} onChangeLanguage={() => setProfile((p) => ({ ...p, lang: null }))} onOpenCalculator={() => setShowCalculator(true)} />
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px 10px", borderBottom: `1px solid ${C.line}`, background: C.paper, position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Logo tone="dark" height={28} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setShowCalculator(true)} aria-label="Calculator" style={{ width: 32, height: 32, borderRadius: "50%", background: C.paperDim, border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: C.ink, cursor: "pointer" }}><Icon.calculator size={16} /></button>
            <PlanBadge plan={user.plan} />
          </div>
        </div>
      )}

      <div style={{ flex: 1, width: "100%" }}>{screenNode}</div>

      {!isDesktop && (
        <BottomNav t={t} screen={["materialDetail"].includes(screen) ? "home" : screen} setScreen={(s) => { setUploadMode(null); setScreen(s); }} />
      )}

      {showUpgrade && (
        <UpgradeModal t={t} currentPlan={user.plan} onClose={() => setShowUpgrade(false)} onSuccess={handlePlanChange} />
      )}

      {showAdminUpload && (
        <AdminUploadModal t={t} onClose={() => setShowAdminUpload(false)} onUploaded={() => setResourcesRefreshKey((k) => k + 1)} />
      )}

      {showCalculator && (
        <CalculatorModal onClose={() => setShowCalculator(false)} />
      )}
    </div>
  );
}




