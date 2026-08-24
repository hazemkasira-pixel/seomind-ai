'use client'

import { useState, useMemo } from 'react'
import { countries } from '@/lib/countries'
import { Search, ChevronDown, Check } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface CountrySelectorProps {
  value?: string
  onChange: (countryCode: string) => void
}

export function CountrySelector({ value, onChange }: CountrySelectorProps) {
  const { t, language } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedCountry = useMemo(
    () => countries.find((c) => c.code === value),
    [value]
  )

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countries
    const query = searchQuery.toLowerCase()
    return countries.filter(
      (c) =>
        c.nameAr.toLowerCase().includes(query) ||
        c.nameEn.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const getCountryName = (country: typeof selectedCountry) => {
    if (!country) return language === 'ar' ? 'اختر الدولة المستهدفة' : 'Select target country'
    return language === 'ar' ? country.nameAr : country.nameEn
  }

  return (
    <div className="relative">
      {/* الزر الرئيسي */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-background hover:border-teal/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {selectedCountry ? (
            <>
              <span className="text-2xl">
                {getFlagEmoji(selectedCountry.code)}
              </span>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">
                  {language === 'ar' ? selectedCountry.nameAr : selectedCountry.nameEn}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? selectedCountry.nameEn : selectedCountry.nameAr}
                </p>
              </div>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">
              {language === 'ar' ? 'اختر الدولة المستهدفة' : 'Select target country'}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* القائمة المنسدلة */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute z-20 w-full mt-2 bg-card border border-border rounded-xl shadow-2xl max-h-96 overflow-hidden">
            {/* شريط البحث */}
            <div className="p-3 border-b border-border sticky top-0 bg-card z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'ابحث عن دولة...' : 'Search for a country...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-teal"
                  autoFocus
                />
              </div>
            </div>

            {/* قائمة الدول مع scrollbar مخصص */}
            <div className="overflow-y-auto max-h-80 custom-scrollbar">
              {filteredCountries.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {language === 'ar' ? 'لم يتم العثور على دولة' : 'No country found'}
                </div>
              ) : (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onChange(country.code)
                      setIsOpen(false)
                      setSearchQuery('')
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors ${
                      value === country.code ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getFlagEmoji(country.code)}
                      </span>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">
                          {language === 'ar' ? country.nameAr : country.nameEn}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {language === 'ar' ? country.nameEn : country.nameAr}
                        </p>
                      </div>
                    </div>
                    {value === country.code && (
                      <Check className="h-5 w-5 text-teal" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* CSS للـ scrollbar المخصص */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          margin: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #14b8a6, #7c3aed);
          border-radius: 4px;
          transition: all 0.2s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #0d9488, #6d28d9);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(180deg, #0f766e, #5b21b6);
        }
      `}</style>
    </div>
  )
}

// دالة مساعدة لتحويل كود الدولة إلى علم
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}