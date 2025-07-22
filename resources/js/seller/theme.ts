import { createTheme, theme, type CustomFlowbiteTheme } from 'flowbite-react';
import { twMerge } from 'tailwind-merge';

const formFieldBaseClass =
	'border border-gray-300 bg-gray-50 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 read-only:focus:ring-0 read-only:focus:border-gray-300  read-only:bg-gray-100 read-only:cursor-not-allowed dark:read-only:focus:border-gray-600 dark:read-only:bg-gray-800';

const buttonBaseClass =
	'group relative flex items-stretch justify-center p-0.5 text-center font-medium transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] focus:z-10 focus:outline-none border border-transparent rounded-lg w-full px-0 py-px sm:w-auto';

export const customTheme: CustomFlowbiteTheme = createTheme({
	textInput: {
		field: {
			input: {
				base: twMerge(theme.textInput.field.input.base, 'outline-none'),
				sizes: {
					md: 'p-2.5 sm:text-sm',
				},
				colors: {
					primary: formFieldBaseClass,
					gray: formFieldBaseClass,
					light: formFieldBaseClass,
					info: formFieldBaseClass,
					failure: formFieldBaseClass,
					warning: formFieldBaseClass,
					success: formFieldBaseClass,
				},
			},
		},
	},
	select: {
		field: {
			select: {
				sizes: {
					md: twMerge(
						theme.select.field.select.sizes.md,
						'text-base sm:text-sm'
					),
				},
				colors: {
					primary: formFieldBaseClass,
					gray: formFieldBaseClass,
					light: formFieldBaseClass,
					info: formFieldBaseClass,
					failure: formFieldBaseClass,
					warning: formFieldBaseClass,
					success: formFieldBaseClass,
				},
			},
		},
	},
	textarea: {
		base: twMerge(theme.textarea.base, 'p-4'),
		colors: {
			primary: formFieldBaseClass,
			gray: formFieldBaseClass,
			light: formFieldBaseClass,
		},
	},
	button: {
		base: buttonBaseClass,
		color: {
			primary:
				'bg-gray-800 text-white focus:ring-4 focus:ring-gray-300 enabled:hover:bg-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:focus:ring-gray-700 dark:enabled:hover:bg-gray-700',
			secondary:
				'text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800',
			danger:
				'text-white bg-red-600 hover:bg-red-700 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800',
			outline:
				'border-gray-200 bg-white text-gray-900 focus:text-gray-700 focus:ring-4 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-600 dark:bg-transparent dark:text-gray-400 dark:enabled:hover:bg-gray-700 dark:enabled:hover:text-white',
		},
		size: {
			xs: 'px-3 py-2 text-xs',
			sm: 'px-4 py-2 text-sm',
			md: 'px-5 py-2.5 text-sm',
			lg: 'px-6 py-3 text-base',
			xl: 'px-7 py-3.5 text-base',
		},
		disabled: 'opacity-50 cursor-not-allowed',
		isProcessing:
			'relative cursor-wait opacity-75 pointer-events-none transition-all',
		inner: {
			base: 'flex items-center justify-center gap-2',
			position: {
				start: 'justify-start',
				middle: 'justify-center',
				end: 'justify-end',
				none: '', // Optional fallback
			},
		},
		spinnerSlot: 'absolute left-4 h-5 w-5',
	},
	sidebar: {
		root: {
			base: 'h-full',
			collapsed: {
				on: 'w-16',
				off: 'w-64',
			},
			inner:
				'h-full overflow-y-auto overflow-x-hidden rounded bg-white px-3 py-4 dark:bg-gray-800',
		},
		collapse: {
			button:
				'group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700',
			icon: {
				base: 'h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white',
				open: {
					off: '',
					on: 'text-gray-900',
				},
			},
			label: {
				base: 'ml-3 flex-1 whitespace-nowrap text-left',
				title: 'sr-only',
				icon: {
					base: 'h-6 w-6 transition delay-0 ease-in-out',
					open: {
						on: 'rotate-180',
						off: '',
					},
				},
			},
			list: 'space-y-2 py-2',
		},
		cta: {
			base: 'mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-700',
			color: {
				blue: 'bg-cyan-50 dark:bg-cyan-900',
				dark: 'bg-dark-50 dark:bg-dark-900',
				failure: 'bg-red-50 dark:bg-red-900',
				gray: 'bg-gray-50 dark:bg-gray-900',
				green: 'bg-green-50 dark:bg-green-900',
				light: 'bg-light-50 dark:bg-light-900',
				red: 'bg-red-50 dark:bg-red-900',
				purple: 'bg-purple-50 dark:bg-purple-900',
				success: 'bg-green-50 dark:bg-green-900',
				yellow: 'bg-yellow-50 dark:bg-yellow-900',
				warning: 'bg-yellow-50 dark:bg-yellow-900',
			},
		},
		item: {
			base: 'flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700',
			active: 'bg-gray-50 dark:bg-gray-700',
			collapsed: {
				insideCollapse: 'group w-full pl-8 transition duration-75',
				noIcon: 'font-bold',
			},
			content: {
				base: 'flex-1 whitespace-nowrap px-3',
			},
			icon: {
				base: 'h-6 w-6 shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white',
				active: 'text-gray-700 dark:text-gray-100',
			},
			label: '',
			listItem: '',
		},
		items: {
			base: '',
		},
		itemGroup: {
			base: 'mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700',
		},
		logo: {
			base: 'mb-5 flex items-center pl-2.5',
			collapsed: {
				on: 'hidden',
				off: 'self-center whitespace-nowrap text-xl font-semibold dark:text-white',
			},
			img: 'mr-3 h-6 sm:h-7',
		},
	},
	tabs: {
		base: 'flex flex-col gap-2',
		tablist: {
			base: 'flex text-center',
			variant: {
				default: 'flex-wrap border-b border-gray-200 dark:border-gray-700 bg-white',
				underline:
					'-mb-px flex-wrap border-b border-gray-200 dark:border-gray-700',
				pills:
					'flex-wrap space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400',
				fullWidth:
					'grid w-full grid-flow-col divide-x divide-gray-200 rounded-none text-sm font-medium shadow dark:divide-gray-700 dark:text-gray-400',
			},
			tabitem: {
				base: 'flex items-center justify-center rounded-t-lg p-4 text-sm font-medium first:ml-0 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500',
				variant: {
					default: {
						base: 'rounded-t-lg',
						active: {
							on: 'bg-gray-100 text-primary-600 dark:bg-gray-800 dark:text-primary-500',
							off: 'text-gray-500 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300',
						},
					},
					underline: {
						base: 'rounded-t-lg',
						active: {
							on: 'rounded-t-lg border-b-2 border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-500',
							off: 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300',
						},
					},
					pills: {
						base: '',
						active: {
							on: 'rounded-lg bg-primary-600 text-white',
							off: 'rounded-lg hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white',
						},
					},
					fullWidth: {
						base: 'ml-0 flex w-full rounded-none first:ml-0',
						active: {
							on: 'rounded-none bg-gray-100 p-4 text-gray-900 dark:bg-gray-700 dark:text-white',
							off: 'rounded-none bg-white hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white',
						},
					},
				},
				icon: 'mr-2 h-5 w-5',
			},
		},
		tabitemcontainer: {
			base: '',
			variant: {
				default: '',
				underline: '',
				pills: '',
				fullWidth: '',
			},
		},
		tabpanel: 'py-3',
	},
});
