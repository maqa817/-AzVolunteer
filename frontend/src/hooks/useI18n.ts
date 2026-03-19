'use client';
import { useState, useEffect, useCallback } from 'react';
import az from '../locales/az.json';
import en from '../locales/en.json';

const locales = { az, en };
type Locale = 'az' | 'en';

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split('.').reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return path;
  }, obj) as string ?? path;
}

export function useI18n() {
  const [locale, setLocale] = useState<Locale>('az');

  useEffect(() => {
    const stored = localStorage.getItem('language') as Locale;
    if (stored && (stored === 'az' || stored === 'en')) {
      setLocale(stored);
    }
  }, []);

  const changeLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem('language', newLocale);
    window.location.reload();
  }, []);

  const t = useCallback(
    (key: string): string => {
      const messages = locales[locale] as Record<string, unknown>;
      return getNestedValue(messages, key) || key;
    },
    [locale]
  );

  return { t, locale, changeLocale };
}
