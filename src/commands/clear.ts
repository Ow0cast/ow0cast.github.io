import type { CommandContext } from '../lib/commandLoader';

export const name = 'clear';
export const description = 'Clears the terminal buffer';

export function run({ term }: CommandContext) {
	term.writeln('owuh.dev — type \'help\' for a list of commands');
	term.clear();
}

