"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
  isLoaded: boolean
}

const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    newSale: "New Sale",
    inventory: "Inventory",
    customers: "Customers",
    transactions: "Transactions",
    settings: "Settings",

    // Dashboard
    dailySales: "Daily Sales",
    totalGoldSold: "Total Gold Sold",
    recentTransactions: "Recent Transactions",

    // New Sale
    goldItemDetails: "Gold Item Details",
    goldType: "Gold Type",
    karat: "Karat",
    weight: "Weight (grams)",
    pricePerGram: "Price per Gram (JOD)",
    totalPrice: "Total Price",
    customerName: "Customer Name",
    paymentMethod: "Payment Method",
    cash: "Cash",
    card: "Card",
    deferred: "Deferred",
    completeSale: "Complete Sale",

    // Common
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    search: "Search",
    filter: "Filter",
    date: "Date",
    amount: "Amount",
    customer: "Customer",
    actions: "Actions",

    // Inventory
    addNewItem: "Add New Item",
    itemName: "Item Name",
    costPrice: "Cost Price",
    sellingPrice: "Selling Price",
    quantity: "Quantity",

    // Settings
    goldPrices: "Gold Prices per Karat",
    taxRate: "Tax Rate (%)",
    language: "Language",
    english: "English",
    arabic: "Arabic",

    goldStorePOS: "Gold Store POS",
    adminDashboard: "Admin Dashboard",
    adminUser: "Admin User",
    systemAdministrator: "System Administrator",
    navigation: "Navigation",

    //login
    welcomeBack: "Welcome Back",
    signInToContinue: "Sign in to your account to continue",
    emailAddress: "Email Address",
    enterEmail: "Enter your email",
    password: "Password",
    enterPassword: "Enter your password",
    signIn: "Sign In to Dashboard",
    signingIn: "Signing in...",
    secureAccess: "Secure access to your gold store management system",
    logout: "Logout",
    manageYour: "Manage Your",
    goldBusiness: "Gold Business",
    withPrecision: "with Precision",
    completeSolution: "Complete solution for jewelry stores with inventory management, sales tracking, and customer management.",
    inventoryManagement: "Inventory & Stock Management",
    salesAnalytics: "Sales Analytics & Reports",
    secureTransactions: "Secure Transaction Processing",
    premiumPos: "Premium Point of Sale",
    
  },
  ar: {
    // Navigation
    dashboard: "لوحة التحكم",
    newSale: "بيع جديد",
    inventory: "المخزون",
    customers: "العملاء",
    transactions: "المعاملات",
    settings: "الإعدادات",

    // Dashboard
    dailySales: "مبيعات اليوم",
    totalGoldSold: "إجمالي الذهب المباع",
    recentTransactions: "المعاملات الأخيرة",

    // New Sale
    goldItemDetails: "تفاصيل قطعة الذهب",
    goldType: "نوع الذهب",
    karat: "العيار",
    weight: "الوزن (جرام)",
    pricePerGram: "السعر للجرام (دينار)",
    totalPrice: "السعر الإجمالي",
    customerName: "اسم العميل",
    paymentMethod: "طريقة الدفع",
    cash: "نقدي",
    card: "بطاقة",
    deferred: "مؤجل",
    completeSale: "إتمام البيع",

    // Common
    add: "إضافة",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    search: "بحث",
    filter: "تصفية",
    date: "التاريخ",
    amount: "المبلغ",
    customer: "العميل",
    actions: "الإجراءات",

    // Inventory
    addNewItem: "إضافة قطعة جديدة",
    itemName: "اسم القطعة",
    costPrice: "سعر التكلفة",
    sellingPrice: "سعر البيع",
    quantity: "الكمية",

    // Settings
    goldPrices: "أسعار الذهب حسب العيار",
    taxRate: "معدل الضريبة (%)",
    language: "اللغة",
    english: "الإنجليزية",
    arabic: "العربية",

    //header
    goldStorePOS: "نقطة بيع الذهب",
    adminDashboard: "لوحة تحكم الإدارة",
    adminUser: "مدير النظام",
    systemAdministrator: "مسؤول النظام",
    navigation: "التنقل",

    //login
    welcomeBack: "مرحباً بعودتك",
    signInToContinue: "سجل دخول للمتابعة",
    emailAddress: "البريد الإلكتروني",
    enterEmail: "أدخل بريدك الإلكتروني",
    password: "كلمة المرور",
    enterPassword: "أدخل كلمة المرور",
    signIn: "تسجيل الدخول للوحة التحكم",
    signingIn: "جاري تسجيل الدخول...",
    secureAccess: "دخول آمن لنظام إدارة متجر الذهب",
    logout: "تسجيل خروج",
    manageYour: "أدر",
    goldBusiness: "تجارة الذهب",
    withPrecision: "بدقة عالية",
    completeSolution: "حل متكامل لمتاجر المجوهرات مع إدارة المخزون وتتبع المبيعات وإدارة العملاء.",
    inventoryManagement: "إدارة المخزون والبضائع",
    salesAnalytics: "تحليلات وتقارير المبيعات",
    secureTransactions: "معاملات آمنة ومضمونة",
    premiumPos: "نظام نقاط البيع المتميز",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start with Arabic to match server rendering
  const [language, setLanguageState] = useState<Language>('ar')
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage only after mount (client-side only)
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage)
    }
    setIsLoaded(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('preferred-language', lang)
    // Update document immediately when language changes
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  const isRTL = language === "ar"

  // Update document properties only after hydration
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.dir = isRTL ? "rtl" : "ltr"
      document.documentElement.lang = language
    }
  }, [isRTL, language, isLoaded])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
