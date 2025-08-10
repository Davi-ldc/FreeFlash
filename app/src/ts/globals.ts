export const CONFIG = {
  // Timing
  DEBOUNCE_DELAY: 200,//milesegundos
  
  // Breakpoints
  MOBILE_BREAKPOINT: 991,
  
  //Debug
  DEBUG: true,
} as const;
//As const garante que ele seja imutável

export const isMobileOrTablet: boolean = window.matchMedia(`(max-width: ${CONFIG.MOBILE_BREAKPOINT}px)`).matches;

