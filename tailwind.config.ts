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
				// Healthcare Professional Color System
				medical: {
					// Primary Medical Blue
					blue: '#1E3A8A',        // Deep Medical Blue - Primary
					'blue-light': '#3B82F6', // Bright Blue - Secondary
					'blue-pale': '#EFF6FF',  // Light Blue Background
					'blue-accent': '#93C5FD', // Light Blue Accent
					
					// Medical Success & Health
					green: '#10B981',       // Medical Green - Success
					'green-light': '#34D399', // Light Green
					'green-pale': '#ECFDF5', // Success backgrounds
					
					// Medical Warning & Alerts
					amber: '#F59E0B',       // Amber Alert - Warning
					'amber-light': '#FCD34D', // Light Amber
					'amber-pale': '#FFFBEB', // Warning backgrounds
					
					// Medical Error & Critical
					red: '#EF4444',         // Medical Red - Error/Critical
					'red-light': '#F87171', // Light Red
					'red-pale': '#FEF2F2',  // Error backgrounds
					
					// Professional Grays
					slate: {
						25: '#FCFCFD',      // Ultra light background
						50: '#F8FAFC',      // Cool white background
						100: '#F1F5F9',     // Light surface
						200: '#E2E8F0',     // Subtle borders
						300: '#CBD5E1',     // Medium borders
						400: '#94A3B8',     // Disabled text
						500: '#64748B',     // Secondary text
						600: '#475569',     // Primary text
						700: '#334155',     // Dark text
						800: '#1E293B',     // Darker text
						900: '#0F172A',     // Darkest text
					}
				},
				
				// Semantic Healthcare Colors
				healthcare: {
					// Status Colors
					emergency: '#DC2626',    // Emergency/Critical
					urgent: '#EA580C',       // Urgent
					routine: '#059669',      // Routine/Normal
					scheduled: '#0D9488',    // Scheduled
					completed: '#10B981',    // Completed
					cancelled: '#6B7280',    // Cancelled
					
					// Patient Status
					'stable': '#10B981',     // Patient stable
					'critical': '#DC2626',   // Critical condition
					'improving': '#059669',  // Improving
					'monitoring': '#F59E0B', // Under monitoring
					
					// Department Colors
					cardiology: '#DC2626',   // Heart/Cardiology
					neurology: '#7C3AED',    // Brain/Neurology
					pediatrics: '#F59E0B',   // Pediatrics
					emergency: '#EF4444',    // Emergency
					general: '#6B7280',      // General medicine
					
					// Priority Levels
					'priority-high': '#DC2626',
					'priority-medium': '#F59E0B',
					'priority-low': '#10B981',
					'priority-routine': '#6B7280'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'Courier New', 'monospace'],
				medical: ['Inter', 'system-ui', 'sans-serif'] // Medical-grade typography
			},
			fontSize: {
				'medical-xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
				'medical-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
				'medical-base': ['1rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
				'medical-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
				'medical-xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.025em' }],
			},
			keyframes: {
				// Existing animations
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
				// Healthcare-specific animations
				'pulse-medical': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-right': {
					'0%': {
						opacity: '0',
						transform: 'translateX(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'heartbeat': {
					'0%, 100%': {
						transform: 'scale(1)'
					},
					'50%': {
						transform: 'scale(1.05)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-medical': 'pulse-medical 2s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'slide-in-right': 'slide-in-right 0.4s ease-out',
				'heartbeat': 'heartbeat 1.5s ease-in-out infinite'
			},
			boxShadow: {
				'medical': '0 4px 20px 0 rgba(30, 58, 138, 0.08)',
				'medical-lg': '0 8px 32px 0 rgba(30, 58, 138, 0.12)',
				'trust': '0 4px 16px 0 rgba(16, 185, 129, 0.08)',
				'alert': '0 4px 16px 0 rgba(239, 68, 68, 0.08)'
			},
			spacing: {
				'medical': '1.5rem',
				'medical-lg': '2rem',
				'medical-xl': '3rem'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
