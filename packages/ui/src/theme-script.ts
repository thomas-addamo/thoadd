export const THEME_KEY = "thoadd-theme";

// Gira prima del primo disegno: tema salvato, altrimenti quello del sistema. Niente lampi.
export const themeScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;
