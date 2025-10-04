export const CONFIG = {
	// Timing
	DEBOUNCE_DELAY: 200,

	//Debug
	DEBUG: true,

	// Breakpoints
	MOBILE_BREAKPOINT: 991,
} as const
//As const garante que ele seja imutável

export const getCurrentBreakpoint = (): 'mobile' | 'desktop' => {
	return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT ? 'mobile' : 'desktop'
}
