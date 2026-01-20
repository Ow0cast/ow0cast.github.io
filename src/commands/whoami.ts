import type { CommandContext } from '../lib/commandLoader';

export const name = 'whoami';
export const description = 'Display user information';

export async function run({ term }: CommandContext) {
	term.writeln(`Hi. I'm \x1b[0;36mNikki\x1b[0m. I'm a 17 year old canadian who just so happens to really like`);
	term.writeln(`\x1b[0;32mfrying pans\x1b[0m. I'm a hobbyist developer, mainly focusing on messing around with`);
	term.writeln(`stupid stuff I find on the web. `);
	term.writeln(``);
	term.writeln(`Also see command 'atl'`);
}

