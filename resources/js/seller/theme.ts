import { createTheme, theme, type CustomFlowbiteTheme } from 'flowbite-react';
import { twMerge } from 'tailwind-merge';

const formFieldBaseClass =
	'border border-gray-300 bg-gray-50 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500';

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
});
