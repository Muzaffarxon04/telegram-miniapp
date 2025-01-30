/* eslint-disable @typescript-eslint/no-explicit-any */
import translations from "../localization";
const translate = (key: string, ...args: any) => {
  const language = localStorage.getItem("language") || "uz";
    // Kalitni nuqta bo'yicha ajratamiz
    const keys = key.split(".");
    // Asosiy obyektga kirishni boshlaymiz
    let result:any = translations[language];
  
    // Har bir kalit bo'yicha obyektni chuqurroq tekshiramiz
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Agar kalit mavjud bo'lmasa, asosiy kalitni qaytaramiz
        return key;
      }
    }
  
    // Agar natija funksiya bo'lsa, args bilan chaqiramiz
    if (typeof result === "function") {
      return result(...args);
    }
  
    // Agar natija oddiy matn bo'lsa, uni qaytaramiz
    return result;
  };

  export default translate;