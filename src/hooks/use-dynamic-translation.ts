import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

/**
 * Hook to translate dynamic content like product names, categories, and descriptions.
 * It uses a simple naming convention or prefix-based lookup if translations exist in the dictionary.
 * Otherwise, it provides a fallback.
 */
export function useDynamicTranslation() {
  const { t } = useTranslation();

  const translateProduct = (name: string) => {
    // Check if we have a direct translation key for this product name
    const key = `products.names.${name.toLowerCase().replace(/\s+/g, '_')}`;
    const translated = t(key, { defaultValue: name });
    return translated;
  };

  const translateCategory = (category: string) => {
    const key = `categories.names.${category.toLowerCase().replace(/\s+/g, '_').replace(/&/g, 'and')}`;
    return t(key, { defaultValue: category });
  };

  const translateDescription = (description: string, productName: string) => {
    const key = `products.descriptions.${productName.toLowerCase().replace(/\s+/g, '_')}`;
    return t(key, { defaultValue: description });
  };

  return { translateProduct, translateCategory, translateDescription };
}

/**
 * Utility to get current language code
 */
export const getCurrentLang = () => i18n.language.split("-")[0];
