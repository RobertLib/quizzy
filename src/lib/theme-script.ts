/**
 * Applies the stored theme before first paint so there is no light-mode flash.
 * Inlined into <head> by the root layout and the global error page. Mirrors
 * the SETTINGS_KEY used by src/lib/storage.ts.
 */
export const themeScript = `(function(){try{var s=localStorage.getItem('quizzy:settings:v1');var t=s?JSON.parse(s).theme:'system';var d=t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;
