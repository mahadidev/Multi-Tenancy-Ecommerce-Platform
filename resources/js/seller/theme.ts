import { createTheme, theme, type CustomFlowbiteTheme } from 'flowbite-react';
import { twMerge } from 'tailwind-merge';

export const customTheme: CustomFlowbiteTheme = createTheme({
	toggleSwitch: {
		root: {
			base: 'group flex rounded-lg focus:outline-none',
			active: {
				on: 'cursor-pointer',
				off: 'cursor-not-allowed opacity-50',
			},
			label:
				'ms-3 mt-0.5 text-start text-sm font-medium text-gray-900 dark:text-gray-300',
		},
		toggle: {
			base: 'relative rounded-full border after:absolute after:rounded-full after:bg-white after:transition-all group-focus:ring-4 group-focus:ring-primary-500/25',
			checked: {
				on: 'after:translate-x-full after:border-white rtl:after:-translate-x-full',
				off: 'border-gray-200 bg-gray-200 dark:border-gray-600 dark:bg-gray-700',
				color: {
					default: 'border-blue-700 bg-blue-700',
					blue: 'border-blue-700 bg-blue-700',
					dark: 'bg-dark-700 border-dark-900',
					failure: 'border-red-900 bg-red-700',
					gray: 'border-gray-600 bg-gray-500',
					green: 'border-green-700 bg-green-600',
					light: 'bg-light-700 border-light-900',
					red: 'border-red-900 bg-red-700',
					purple: 'border-purple-900 bg-purple-700',
					success: 'border-green-500 bg-green-500',
					yellow: 'border-yellow-400 bg-yellow-400',
					warning: 'border-yellow-600 bg-yellow-600',
					cyan: 'border-blue-500 bg-blue-500',
					lime: 'border-lime-400 bg-lime-400',
					indigo: 'border-indigo-400 bg-indigo-400',
					teal: 'bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4',
					info: 'border-blue-600 bg-blue-600',
					pink: 'border-pink-600 bg-pink-600',
				},
			},
			sizes: {
				sm: 'h-5 w-9 min-w-9 after:left-px after:top-px after:h-4 after:w-4 rtl:after:right-px',
				md: 'h-6 w-11 min-w-11 after:left-px after:top-px after:h-5 after:w-5 rtl:after:right-px',
				lg: 'h-7 w-14 min-w-14 after:left-1 after:top-0.5 after:h-6 after:w-6 rtl:after:right-1',
			},
		},
	},
	checkbox: {
		root: {
			base: 'h-4 w-4 rounded border border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700',
			color: {
				default:
					'text-primary-600 focus:ring-primary-600 dark:ring-offset-gray-800 dark:focus:ring-primary-600',
				dark: 'text-gray-800 focus:ring-gray-800 dark:ring-offset-gray-800 dark:focus:ring-gray-800',
				failure:
					'text-red-900 focus:ring-red-900 dark:ring-offset-red-900 dark:focus:ring-red-900',
				gray: 'text-gray-900 focus:ring-gray-900 dark:ring-offset-light-900 dark:focus:ring-light-900',
				info: 'text-cyan-800 focus:ring-cyan-800 dark:ring-offset-gray-800 dark:focus:ring-cyan-800',
				light:
					'text-gray-900 focus:ring-gray-900 dark:ring-offset-gray-900 dark:focus:ring-gray-900',
				purple:
					'text-purple-600 focus:ring-purple-600 dark:ring-offset-purple-600 dark:focus:ring-purple-600',
				success:
					'text-green-800 focus:ring-green-800 dark:ring-offset-green-800 dark:focus:ring-green-800',
				warning:
					'text-yellow-400 focus:ring-yellow-400 dark:ring-offset-yellow-400 dark:focus:ring-yellow-400',
				blue: 'text-blue-700 focus:ring-blue-600 dark:ring-offset-blue-700 dark:focus:ring-blue-700',
				cyan: 'text-cyan-600 focus:ring-cyan-600 dark:ring-offset-cyan-600 dark:focus:ring-cyan-600',
				green:
					'text-green-600 focus:ring-green-600 dark:ring-offset-green-600 dark:focus:ring-green-600',
				indigo:
					'text-indigo-700 focus:ring-indigo-700 dark:ring-offset-indigo-700 dark:focus:ring-indigo-700',
				lime: 'text-lime-700 focus:ring-lime-700 dark:ring-offset-lime-700 dark:focus:ring-lime-700',
				pink: 'text-pink-600 focus:ring-pink-600 dark:ring-offset-pink-600 dark:focus:ring-pink-600',
				red: 'text-red-600 focus:ring-red-600 dark:ring-offset-red-600 dark:focus:ring-red-600',
				teal: 'text-teal-600 focus:ring-teal-600 dark:ring-offset-teal-600 dark:focus:ring-teal-600',
				yellow:
					'text-yellow-400 focus:ring-yellow-400 dark:ring-offset-yellow-400 dark:focus:ring-yellow-400',
			},
		},
	},
	modal: {
		content: {
			inner: twMerge(theme.modal.content.inner, 'dark:bg-gray-800'),
		},
		header: {
			base: twMerge(
				theme.modal.header.base,
				'items-center dark:border-gray-700'
			),
			title: twMerge(theme.modal.header.title, 'font-semibold'),
			close: {
				base: twMerge(
					theme.modal.header.close.base,
					'hover:bg-gray-200 dark:hover:bg-gray-700'
				),
			},
		},
		footer: {
			base: twMerge(theme.modal.footer.base, 'dark:border-gray-700'),
		},
	},
	progress: {
		color: {
			blue: 'bg-primary-600',
			dark: 'bg-gray-900 dark:bg-white',
		},
		size: {
			md: 'h-2',
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
					gray: twMerge(
						theme.select.field.select.colors.gray,
						'focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500'
					),
				},
			},
		},
	},
	sidebar: {
		root: {
			inner: twMerge(theme.sidebar.root.inner, 'bg-white'),
		},
		collapse: {
			button: twMerge(
				theme.sidebar.collapse.button,
				'text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
			),
		},
		item: {
			base: twMerge(
				theme.sidebar.collapse.button,
				'text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
			),
			label:
				'ml-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 p-1 text-sm font-medium text-primary-800',
		},
	},
	accordion: {
		root: {
			base: 'divide-y divide-gray-200 border-gray-200 dark:divide-gray-700 dark:border-gray-700',
			flush: {
				off: 'rounded-lg border',
				on: 'border-b',
			},
		},
		content: {
			base: 'p-4 first:rounded-t-lg last:rounded-b-lg dark:bg-gray-700',
		},
		title: {
			arrow: {
				base: 'h-6 w-6 shrink-0',
				open: {
					off: '',
					on: 'rotate-180',
				},
			},
			base: 'flex w-full items-center justify-between p-5 text-left font-medium text-gray-500 first:rounded-t-lg last:rounded-b-lg dark:text-gray-400',
			flush: {
				off: 'hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-800',
				on: 'bg-transparent dark:bg-transparent',
			},
			heading: '',
			open: {
				off: '',
				on: 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white',
			},
		},
	},
	textarea: {
		base: twMerge(theme.textarea.base, 'p-4'),
		colors: {
			primary:
				'border-gray-300 bg-gray-50 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500',
			gray: twMerge(
				theme.textarea.colors.gray,
				'text-base focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:focus:border-blue-500 dark:focus:ring-blue-500'
			),
		},
	},
	textInput: {
		field: {
			input: {
				base: twMerge(theme.textInput.field.input.base, 'outline-none'),
				sizes: {
					md: 'p-2.5 sm:text-sm',
				},
				colors: {
					primary:
						'border-gray-300 bg-gray-50 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500',
					gray: 'border-gray-300 bg-gray-50 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500',
					info: 'border-cyan-500 bg-cyan-50 text-cyan-900 placeholder-cyan-700 focus:border-cyan-500 focus:ring-cyan-500 dark:border-cyan-400 dark:bg-cyan-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-500',
					failure:
						'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500',
					warning:
						'border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400 dark:bg-yellow-100 dark:focus:border-yellow-500 dark:focus:ring-yellow-500',
					success:
						'border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-green-100 dark:focus:border-green-500 dark:focus:ring-green-500',
				},
			},
		},
	},
	card: {
		root: {
			base: twMerge(theme.card.root.base, 'border-none shadow'),
			children: 'p-4 sm:p-6 xl:p-8',
		},
	},
	button: {
		inner: {
			base: 'flex items-center transition-all duration-200',
			position: {
				none: '',
				start: 'rounded-r-none',
				middle: 'rounded-none',
				end: 'rounded-l-none',
			},
			outline: 'border border-transparent',
			isProcessingPadding: {
				xs: 'pl-8',
				sm: 'pl-10',
				md: 'pl-12',
				lg: 'pl-16',
				xl: 'pl-20',
			},
		},
		color: {
			primary:
				'border border-transparent bg-gray-800 text-white focus:ring-4 focus:ring-gray-300 enabled:hover:bg-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:focus:ring-gray-700 dark:enabled:hover:bg-gray-700',
			gray: 'border border-gray-200 bg-white text-gray-900 focus:text-gray-700 focus:ring-4 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-600 dark:bg-transparent dark:text-gray-400 dark:enabled:hover:bg-gray-700 dark:enabled:hover:text-white',
			dark: 'border border-transparent bg-gray-800 text-white focus:ring-4 focus:ring-gray-300 enabled:hover:bg-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-gray-800 dark:enabled:hover:bg-gray-700',
			failure:
				'border border-transparent bg-red-700 text-white focus:ring-4 focus:ring-red-300 enabled:hover:bg-red-800 dark:bg-red-600 dark:focus:ring-red-900 dark:enabled:hover:bg-red-700',
			info: 'border border-transparent bg-cyan-700 text-white focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-cyan-800 dark:bg-cyan-600 dark:focus:ring-cyan-800 dark:enabled:hover:bg-cyan-700',
			light:
				'border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700',
			purple:
				'border border-transparent bg-purple-700 text-white focus:ring-4 focus:ring-purple-300 enabled:hover:bg-purple-800 dark:bg-purple-600 dark:focus:ring-purple-900 dark:enabled:hover:bg-purple-700',
			success:
				'border border-transparent bg-green-700 text-white focus:ring-4 focus:ring-green-300 enabled:hover:bg-green-800 dark:bg-green-600 dark:focus:ring-green-800 dark:enabled:hover:bg-green-700',
			warning:
				'border border-transparent bg-yellow-400 text-white focus:ring-4 focus:ring-yellow-300 enabled:hover:bg-yellow-500 dark:focus:ring-yellow-900',
			blue: 'border border-transparent bg-blue-700 text-white focus:ring-4 focus:ring-blue-300 enabled:hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
			cyan: 'border border-cyan-300 bg-white text-cyan-900 focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-cyan-100 dark:border-cyan-600 dark:bg-cyan-600 dark:text-white dark:focus:ring-cyan-700 dark:enabled:hover:border-cyan-700 dark:enabled:hover:bg-cyan-700',
			green:
				'border border-green-300 bg-white text-green-900 focus:ring-4 focus:ring-green-300 enabled:hover:bg-green-100 dark:border-green-600 dark:bg-green-600 dark:text-white dark:focus:ring-green-700 dark:enabled:hover:border-green-700 dark:enabled:hover:bg-green-700',
			indigo:
				'border border-indigo-300 bg-white text-indigo-900 focus:ring-4 focus:ring-indigo-300 enabled:hover:bg-indigo-100 dark:border-indigo-600 dark:bg-indigo-600 dark:text-white dark:focus:ring-indigo-700 dark:enabled:hover:border-indigo-700 dark:enabled:hover:bg-indigo-700',
			lime: 'border border-lime-300 bg-white text-lime-900 focus:ring-4 focus:ring-lime-300 enabled:hover:bg-lime-100 dark:border-lime-600 dark:bg-lime-600 dark:text-white dark:focus:ring-lime-700 dark:enabled:hover:border-lime-700 dark:enabled:hover:bg-lime-700',
			pink: 'border border-pink-300 bg-white text-pink-900 focus:ring-4 focus:ring-pink-300 enabled:hover:bg-pink-100 dark:border-pink-600 dark:bg-pink-600 dark:text-white dark:focus:ring-pink-700 dark:enabled:hover:border-pink-700 dark:enabled:hover:bg-pink-700',
			red: 'border border-red-300 bg-white text-red-900 focus:ring-4 focus:ring-red-300 enabled:hover:bg-red-100 dark:border-red-600 dark:bg-red-600 dark:text-white dark:focus:ring-red-700 dark:enabled:hover:border-red-700 dark:enabled:hover:bg-red-700',
			teal: 'border border-teal-300 bg-white text-teal-900 focus:ring-4 focus:ring-teal-300 enabled:hover:bg-teal-100 dark:border-teal-600 dark:bg-teal-600 dark:text-white dark:focus:ring-teal-700 dark:enabled:hover:border-teal-700 dark:enabled:hover:bg-teal-700',
			yellow:
				'border border-yellow-300 bg-white text-yellow-900 focus:ring-4 focus:ring-yellow-300 enabled:hover:bg-yellow-100 dark:border-yellow-600 dark:bg-yellow-600 dark:text-white dark:focus:ring-yellow-700 dark:enabled:hover:border-yellow-700 dark:enabled:hover:bg-yellow-700',
		},
	},
});
