/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: 'rgb(var(--color-primary) / <alpha-value>)',
				secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
				accent: 'rgb(var(--color-accent) / <alpha-value>)',
				'font-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
				'font-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
				'font-accent': 'rgb(var(--color-text-accent) / <alpha-value>)'
			}
		},
		screens: {
			sm: '0px',
			xs: '380px',
			md: '544px',
			lg: '768px'
		}
	},
	plugins: [
		function ({ addVariant }) {
			addVariant('child', '& > *');
			addVariant('child-hover', '& > *:hover');
		}
	]
};
