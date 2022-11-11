module.exports = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 120,
	plugins: [require('prettier-plugin-tailwindcss'), require('@trivago/prettier-plugin-sort-imports')],
	pluginSearchDirs: ['.'],
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
	svelteAllowShorthand: false,
	tailwindConfig: './tailwind.config.cjs',
	importOrderSeparation: true,
	importOrder: [
		'@sveltejs/(.*)$',
		'^@prisma/(.*)$',
		'^$lib/(.*)$',
		'<THIRD_PARTY_MODULES>',
		'^$components/(.*)$',
		'^[./]'
	],
	importOrderSortSpecifiers: true
};
