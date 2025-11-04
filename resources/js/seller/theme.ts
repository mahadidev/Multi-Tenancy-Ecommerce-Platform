// Custom theme configuration for Flowbite components
export const customTheme = {
  button: {
    color: {
      primary: "text-white bg-gray-900 border border-transparent enabled:hover:bg-black focus:ring-4 focus:ring-gray-700 disabled:hover:bg-gray-900 dark:bg-gray-800 dark:enabled:hover:bg-gray-900 dark:focus:ring-gray-700 dark:disabled:hover:bg-gray-800",
      info: "text-white bg-gray-700 border border-transparent enabled:hover:bg-gray-800 focus:ring-4 focus:ring-gray-600 disabled:hover:bg-gray-700 dark:bg-gray-600 dark:enabled:hover:bg-gray-700 dark:focus:ring-gray-600 dark:disabled:hover:bg-gray-600",
      blue: "text-white bg-gray-800 border border-transparent enabled:hover:bg-gray-900 focus:ring-4 focus:ring-gray-600 disabled:hover:bg-gray-800 dark:bg-gray-700 dark:enabled:hover:bg-gray-800 dark:focus:ring-gray-600 dark:disabled:hover:bg-gray-700",
    },
    outline: {
      color: {
        primary: "text-gray-900 bg-white border border-gray-900 enabled:hover:bg-gray-900 enabled:hover:text-white focus:ring-4 focus:ring-gray-300 disabled:hover:bg-white disabled:hover:text-gray-900 dark:text-gray-900 dark:bg-white dark:border-gray-900 dark:enabled:hover:bg-gray-900 dark:enabled:hover:text-white dark:focus:ring-gray-700 dark:disabled:hover:bg-white dark:disabled:hover:text-gray-900",
        info: "text-gray-700 bg-white border border-gray-700 enabled:hover:bg-gray-700 enabled:hover:text-white focus:ring-4 focus:ring-gray-200 disabled:hover:bg-white disabled:hover:text-gray-700 dark:text-gray-600 dark:bg-white dark:border-gray-600 dark:enabled:hover:bg-gray-600 dark:enabled:hover:text-white dark:focus:ring-gray-500 dark:disabled:hover:bg-white dark:disabled:hover:text-gray-600",
        blue: "text-gray-800 bg-white border border-gray-800 enabled:hover:bg-gray-800 enabled:hover:text-white focus:ring-4 focus:ring-gray-200 disabled:hover:bg-white disabled:hover:text-gray-800 dark:text-gray-700 dark:bg-white dark:border-gray-700 dark:enabled:hover:bg-gray-700 dark:enabled:hover:text-white dark:focus:ring-gray-500 dark:disabled:hover:bg-white dark:disabled:hover:text-gray-700",
      },
    },
    base: "group relative flex items-stretch justify-center p-0.5 text-center font-medium transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] focus:z-10 focus:outline-none rounded-lg",
    inner: {
      base: "flex items-stretch items-center justify-center px-4 py-2 text-sm rounded-md",
      position: {
        none: "",
        start: "rounded-r-none",
        middle: "rounded-none border-l-0 pl-0",
        end: "rounded-l-none border-l-0 pl-0",
      },
    },
  },
  badge: {
    root: {
      color: {
        info: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        blue: "bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-200",
      },
    },
  },
};