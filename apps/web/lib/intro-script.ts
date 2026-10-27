const DAY_KEY = "thoadd-intro-day";

// Gira prima del primo disegno: se l'apertura è già stata vista oggi, parte la versione breve.
export const introScript = `try{var d=new Date().toISOString().slice(0,10);if(localStorage.getItem("${DAY_KEY}")===d)document.documentElement.classList.add("intro-short");localStorage.setItem("${DAY_KEY}",d)}catch(e){}`;
