import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

/**
 * Hook to translate dynamic content like product names, categories, and descriptions.
 * It uses a simple naming convention or prefix-based lookup if translations exist in the dictionary.
 * Otherwise, it provides a fallback.
 */
export function useDynamicTranslation() {
  const { t } = useTranslation();

  const translateProduct = (name: string | undefined | null) => {
    if (!name) return "";
    // Check if we have a direct translation key for this product name
    const key = `products.names.${name.toLowerCase().replace(/\s+/g, '_')}`;
    const translated = t(key, { defaultValue: name });
    return translated;
  };

  const translateCategory = (category: string | undefined | null) => {
    if (!category) return "";
    const key = `categories.names.${category.toLowerCase().replace(/\s+/g, '_').replace(/&/g, 'and')}`;
    return t(key, { defaultValue: category });
  };

  const translateDescription = (description: string | undefined | null, productName: string | undefined | null) => {
    if (!description) return "";
    const nameKey = productName ? productName.toLowerCase().replace(/\s+/g, '_') : 'default';
    const key = `products.descriptions.${nameKey}`;
    return t(key, { defaultValue: description });
  };

  return { translateProduct, translateCategory, translateDescription };
}

/**
 * Utility to get current language code
 */
export const getCurrentLang = () => i18n.language.split("-")[0];
