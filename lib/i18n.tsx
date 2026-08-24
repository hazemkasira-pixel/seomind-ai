'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import en from '@/translations/en.json'

type Translations = typeof en

const I18nContext = createContext<{
  language: 'en'
  t: (key: string) => any
}>({
  language: 'en',
  t: () => '',
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const t = (key: string): any => {
    const keys = key.split('.')
    let value: any = en
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }
    
    return value
  }

  return (
    <I18nContext.Provider value={{ language: 'en', t }}>
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