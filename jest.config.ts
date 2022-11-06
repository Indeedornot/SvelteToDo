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
		'^\\$lib/(.*)': '<rootDir>/src/lib/$1'
	}
};

export default config;
