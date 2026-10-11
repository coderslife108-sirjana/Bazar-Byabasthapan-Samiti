import { useContext } from "react";
import LanguageStore from "./LanguageStore";

export function useLanguage() {
  const context = useContext(LanguageStore);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
