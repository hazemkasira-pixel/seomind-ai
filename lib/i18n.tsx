'use client'

import React, { createContext, useContext, ReactNode } from 'react'

const I18nContext = createContext<any>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  // دالة ترجمة مؤقتة ترجع المفتاح كما هو لتجنب أي أخطاء
  const t = (key: string): string => key

  return (
    <I18nContext.Provider value={{ language: 'en', setLanguage: () => {}, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider')
  }
  return context
}