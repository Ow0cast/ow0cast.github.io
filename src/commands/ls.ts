import type { CommandContext } from '../lib/commandLoader';

export const name = 'ls';
export const description = 'Print a very real directory listing';

export function run({ term }: CommandContext) {
	term.writeln(['about.txt', 'projects/', 'contact.md'].join('\r\n'));
}

