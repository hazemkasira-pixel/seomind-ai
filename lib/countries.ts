export interface Country {
  code: string
  nameAr: string
  nameEn: string
  dialCode: string
}

export const countries: Country[] = [
  { code: 'AF', nameAr: 'أفغانستان', nameEn: 'Afghanistan', dialCode: '+93' },
  { code: 'AL', nameAr: 'ألبانيا', nameEn: 'Albania', dialCode: '+355' },
  { code: 'DZ', nameAr: 'الجزائر', nameEn: 'Algeria', dialCode: '+213' },
  { code: 'AR', nameAr: 'الأرجنتين', nameEn: 'Argentina', dialCode: '+54' },
  { code: 'AU', nameAr: 'أستراليا', nameEn: 'Australia', dialCode: '+61' },
  { code: 'AT', nameAr: 'النمسا', nameEn: 'Austria', dialCode: '+43' },
  { code: 'BH', nameAr: 'البحرين', nameEn: 'Bahrain', dialCode: '+973' },
  { code: 'BD', nameAr: 'بنغلاديش', nameEn: 'Bangladesh', dialCode: '+880' },
  { code: 'BY', nameAr: 'بيلاروسيا', nameEn: 'Belarus', dialCode: '+375' },
  { code: 'BE', nameAr: 'بلجيكا', nameEn: 'Belgium', dialCode: '+32' },
  { code: 'BR', nameAr: 'البرازيل', nameEn: 'Brazil', dialCode: '+55' },
  { code: 'BG', nameAr: 'بلغاريا', nameEn: 'Bulgaria', dialCode: '+359' },
  { code: 'CA', nameAr: 'كندا', nameEn: 'Canada', dialCode: '+1' },
  { code: 'CL', nameAr: 'تشيلي', nameEn: 'Chile', dialCode: '+56' },
  { code: 'CN', nameAr: 'الصين', nameEn: 'China', dialCode: '+86' },
  { code: 'CO', nameAr: 'كولومبيا', nameEn: 'Colombia', dialCode: '+57' },
  { code: 'HR', nameAr: 'كرواتيا', nameEn: 'Croatia', dialCode: '+385' },
  { code: 'CZ', nameAr: 'جمهورية التشيك', nameEn: 'Czech Republic', dialCode: '+420' },
  { code: 'DK', nameAr: 'الدنمارك', nameEn: 'Denmark', dialCode: '+45' },
  { code: 'EG', nameAr: 'مصر', nameEn: 'Egypt', dialCode: '+20' },
  { code: 'EE', nameAr: 'إستونيا', nameEn: 'Estonia', dialCode: '+372' },
  { code: 'FI', nameAr: 'فنلندا', nameEn: 'Finland', dialCode: '+358' },
  { code: 'FR', nameAr: 'فرنسا', nameEn: 'France', dialCode: '+33' },
  { code: 'DE', nameAr: 'ألمانيا', nameEn: 'Germany', dialCode: '+49' },
  { code: 'GR', nameAr: 'اليونان', nameEn: 'Greece', dialCode: '+30' },
  { code: 'HK', nameAr: 'هونغ كونغ', nameEn: 'Hong Kong', dialCode: '+852' },
  { code: 'HU', nameAr: 'المجر', nameEn: 'Hungary', dialCode: '+36' },
  { code: 'IN', nameAr: 'الهند', nameEn: 'India', dialCode: '+91' },
  { code: 'ID', nameAr: 'إندونيسيا', nameEn: 'Indonesia', dialCode: '+62' },
  { code: 'IQ', nameAr: 'العراق', nameEn: 'Iraq', dialCode: '+964' },
  { code: 'IE', nameAr: 'أيرلندا', nameEn: 'Ireland', dialCode: '+353' },
  { code: 'IL', nameAr: 'إسرائيل', nameEn: 'Israel', dialCode: '+972' },
  { code: 'IT', nameAr: 'إيطاليا', nameEn: 'Italy', dialCode: '+39' },
  { code: 'JP', nameAr: 'اليابان', nameEn: 'Japan', dialCode: '+81' },
  { code: 'JO', nameAr: 'الأردن', nameEn: 'Jordan', dialCode: '+962' },
  { code: 'KW', nameAr: 'الكويت', nameEn: 'Kuwait', dialCode: '+965' },
  { code: 'LV', nameAr: 'لاتفيا', nameEn: 'Latvia', dialCode: '+371' },
  { code: 'LB', nameAr: 'لبنان', nameEn: 'Lebanon', dialCode: '+961' },
  { code: 'LY', nameAr: 'ليبيا', nameEn: 'Libya', dialCode: '+218' },
  { code: 'LT', nameAr: 'ليتوانيا', nameEn: 'Lithuania', dialCode: '+370' },
  { code: 'MY', nameAr: 'ماليزيا', nameEn: 'Malaysia', dialCode: '+60' },
  { code: 'MX', nameAr: 'المكسيك', nameEn: 'Mexico', dialCode: '+52' },
  { code: 'MA', nameAr: 'المغرب', nameEn: 'Morocco', dialCode: '+212' },
  { code: 'NL', nameAr: 'هولندا', nameEn: 'Netherlands', dialCode: '+31' },
  { code: 'NZ', nameAr: 'نيوزيلندا', nameEn: 'New Zealand', dialCode: '+64' },
  { code: 'NG', nameAr: 'نيجيريا', nameEn: 'Nigeria', dialCode: '+234' },
  { code: 'NO', nameAr: 'النرويج', nameEn: 'Norway', dialCode: '+47' },
  { code: 'OM', nameAr: 'عمان', nameEn: 'Oman', dialCode: '+968' },
  { code: 'PK', nameAr: 'باكستان', nameEn: 'Pakistan', dialCode: '+92' },
  { code: 'PS', nameAr: 'فلسطين', nameEn: 'Palestine', dialCode: '+970' },
  { code: 'PE', nameAr: 'بيرو', nameEn: 'Peru', dialCode: '+51' },
  { code: 'PH', nameAr: 'الفلبين', nameEn: 'Philippines', dialCode: '+63' },
  { code: 'PL', nameAr: 'بولندا', nameEn: 'Poland', dialCode: '+48' },
  { code: 'PT', nameAr: 'البرتغال', nameEn: 'Portugal', dialCode: '+351' },
  { code: 'QA', nameAr: 'قطر', nameEn: 'Qatar', dialCode: '+974' },
  { code: 'RO', nameAr: 'رومانيا', nameEn: 'Romania', dialCode: '+40' },
  { code: 'RU', nameAr: 'روسيا', nameEn: 'Russia', dialCode: '+7' },
  { code: 'SA', nameAr: 'المملكة العربية السعودية', nameEn: 'Saudi Arabia', dialCode: '+966' },
  { code: 'SG', nameAr: 'سنغافورة', nameEn: 'Singapore', dialCode: '+65' },
  { code: 'SK', nameAr: 'سلوفاكيا', nameEn: 'Slovakia', dialCode: '+421' },
  { code: 'ZA', nameAr: 'جنوب أفريقيا', nameEn: 'South Africa', dialCode: '+27' },
  { code: 'KR', nameAr: 'كوريا الجنوبية', nameEn: 'South Korea', dialCode: '+82' },
  { code: 'ES', nameAr: 'إسبانيا', nameEn: 'Spain', dialCode: '+34' },
  { code: 'LK', nameAr: 'سريلانكا', nameEn: 'Sri Lanka', dialCode: '+94' },
  { code: 'SE', nameAr: 'السويد', nameEn: 'Sweden', dialCode: '+46' },
  { code: 'CH', nameAr: 'سويسرا', nameEn: 'Switzerland', dialCode: '+41' },
  { code: 'TW', nameAr: 'تايوان', nameEn: 'Taiwan', dialCode: '+886' },
  { code: 'TH', nameAr: 'تايلاند', nameEn: 'Thailand', dialCode: '+66' },
  { code: 'TN', nameAr: 'تونس', nameEn: 'Tunisia', dialCode: '+216' },
  { code: 'TR', nameAr: 'تركيا', nameEn: 'Turkey', dialCode: '+90' },
  { code: 'UA', nameAr: 'أوكرانيا', nameEn: 'Ukraine', dialCode: '+380' },
  { code: 'AE', nameAr: 'الإمارات العربية المتحدة', nameEn: 'United Arab Emirates', dialCode: '+971' },
  { code: 'GB', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom', dialCode: '+44' },
  { code: 'US', nameAr: 'الولايات المتحدة', nameEn: 'United States', dialCode: '+1' },
  { code: 'VN', nameAr: 'فيتنام', nameEn: 'Vietnam', dialCode: '+84' },
  { code: 'YE', nameAr: 'اليمن', nameEn: 'Yemen', dialCode: '+967' },
]

// دالة للبحث عن دولة
export function searchCountries(query: string): Country[] {
  const lowerQuery = query.toLowerCase()
  return countries.filter(
    (country) =>
      country.nameAr.toLowerCase().includes(lowerQuery) ||
      country.nameEn.toLowerCase().includes(lowerQuery) ||
      country.code.toLowerCase().includes(lowerQuery)
  )
}