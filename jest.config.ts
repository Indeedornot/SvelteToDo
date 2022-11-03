import type { Config } from 'jest';

const config: Config = {
	transform: {
		'^.+\\.svelte$': [
			'svelte-jester',
			{
				preprocess: true
			}
		],
		'^.+\\.ts$': 'ts-jest',
		'^.+\\.js$': 'babel-jest'
	},
	moduleFileExtensions: ['js', 'ts', 'svelte'],
	moduleNameMapper: {
		//$lib
		// eslint-disable-next-line no-useless-escape
		'^\\$lib/(.*)': '<rootDir>/src/lib/$1'
	}
};

export default config;
