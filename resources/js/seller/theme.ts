// Custom theme configuration for Flowbite components
export const customTheme = {
  button: {
    color: {
      primary: "text-white bg-primary-900 border border-transparent enabled:hover:bg-primary-950 focus:ring-4 focus:ring-primary-300 disabled:hover:bg-primary-900 dark:bg-primary-900 dark:enabled:hover:bg-primary-950 dark:focus:ring-primary-800 dark:disabled:hover:bg-primary-900",
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
};