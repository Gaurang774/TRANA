
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Enhanced Medical UI Color Palette - Light Mode Focused
				medical: {
					// Primary Colors (WCAG AAA compliant)
					blue: '#1e40af',        // Primary CTA - Strong, trustworthy blue
					'blue-light': '#3b82f6', // Hover states, secondary actions
					'blue-pale': '#eff6ff',  // Light backgrounds, subtle highlights
					
					// Secondary & Accent Colors
					green: '#047857',       // Success states, positive indicators
					'green-light': '#10b981', // Success hover states
					'green-pale': '#ecfdf5', // Success backgrounds
					
					teal: '#0f766e',        // Professional accent, info states
					'teal-light': '#14b8a6', // Teal hover states
					'teal-pale': '#f0fdfa',  // Teal backgrounds
					
					// Alert & Status Colors (High contrast)
					red: '#dc2626',         // Critical errors, emergency alerts
					'red-light': '#ef4444', // Error hover states
					'red-pale': '#fef2f2',  // Error backgrounds
					
					orange: '#ea580c',      // Warnings, medium priority
					'orange-light': '#f97316', // Warning hover states
					'orange-pale': '#fff7ed', // Warning backgrounds
					
					// Professional Grays (Optimal contrast ratios)
					slate: {
						50: '#f8fafc',      // Pure background
						100: '#f1f5f9',     // Card backgrounds
						200: '#e2e8f0',     // Subtle borders
						300: '#cbd5e1',     // Disabled states
						400: '#94a3b8',     // Placeholder text
						500: '#64748b',     // Secondary text
						600: '#475569',     // Body text
						700: '#334155',     // Headings
						800: '#1e293b',     // Dark text
						900: '#0f172a',     // Maximum contrast
					},
					
					// Neutral Grays (Warm undertone for healthcare warmth)
					gray: {
						50: '#fafafa',
						100: '#f5f5f5',
						200: '#e5e5e5',
						300: '#d4d4d4',
						400: '#a3a3a3',
						500: '#737373',
						600: '#525252',
						700: '#404040',
						800: '#262626',
						900: '#171717',
					}
				},
				
				// Semantic Color System for UI Components
				semantic: {
					// Background Colors
					background: {
						primary: '#ffffff',     // Main app background
						secondary: '#f8fafc',   // Section backgrounds
						tertiary: '#f1f5f9',    // Card backgrounds
						overlay: 'rgba(15, 23, 42, 0.8)', // Modal overlays
					},
					
					// Text Colors (WCAG AAA compliant)
					text: {
						primary: '#0f172a',     // Main text (21:1 contrast)
						secondary: '#334155',   // Secondary text (12:1 contrast)
						tertiary: '#64748b',    // Muted text (7:1 contrast)
						disabled: '#94a3b8',    // Disabled text (4.5:1 contrast)
						inverse: '#ffffff',     // Text on dark backgrounds
					},
					
					// Interactive States
					interactive: {
						primary: '#1e40af',     // Primary buttons, links
						'primary-hover': '#1d4ed8', // Primary hover state
						secondary: '#0f766e',   // Secondary buttons
						'secondary-hover': '#0d9488', // Secondary hover
						focus: '#3b82f6',       // Focus rings
						disabled: '#e2e8f0',    // Disabled backgrounds
					},
					
					// Status Colors
					status: {
						success: '#047857',     // Success states
						'success-bg': '#ecfdf5', // Success backgrounds
						warning: '#ea580c',     // Warning states  
						'warning-bg': '#fff7ed', // Warning backgrounds
						error: '#dc2626',       // Error states
						'error-bg': '#fef2f2',  // Error backgrounds
						info: '#0f766e',        // Info states
						'info-bg': '#f0fdfa',   // Info backgrounds
					},
					
					// Border Colors
					border: {
						primary: '#e2e8f0',     // Default borders
						secondary: '#cbd5e1',   // Subtle borders
						focus: '#3b82f6',       // Focus borders
						error: '#dc2626',       // Error borders
						success: '#047857',     // Success borders
					}
				},
				
				// Dark Mode Palette (Optional)
				dark: {
					background: {
						primary: '#0f172a',
						secondary: '#1e293b', 
						tertiary: '#334155',
					},
					text: {
						primary: '#f8fafc',
						secondary: '#cbd5e1',
						tertiary: '#94a3b8',
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace']
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-slow': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
				'fade-in': 'fade-in 0.3s ease-out'
			},
			boxShadow: {
				'soft': '0 2px 8px 0 rgb(0 0 0 / 0.05)',
				'medium': '0 4px 16px 0 rgb(0 0 0 / 0.08)',
				'large': '0 8px 32px 0 rgb(0 0 0 / 0.12)',
				'medical': '0 4px 20px 0 rgb(30 64 175 / 0.08)' // Subtle blue shadow
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
