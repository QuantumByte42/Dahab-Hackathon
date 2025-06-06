"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
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
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar")

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["ar"]] || key
  }

  const isRTL = language === "ar"

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr"
    document.documentElement.lang = language
  }, [isRTL, language])

  return <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
