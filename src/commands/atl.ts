import type { CommandContext } from '../lib/commandLoader';

export const name = 'atl';
export const description = 'Information about All Things Linux';

export async function run({ term }: CommandContext) {
	term.writeln(`All Things Linux is a 501(c)(3) non-profit organization with a mission to`);
    term.writeln(`empower the Linux ecosystem through education, collaboration, and support`);
    term.writeln(``);
    term.writeln(`For more information, see the following resources, and join us on Discord!`);
    term.writeln(``);
	term.writeln(`\x1b[0;34mhttps://allthingslinux.org\x1b[0m — \x1b[0;34mhttps://atl.wiki\x1b[0m\x1b[0m — \x1b[0;34mhttps://discord.gg/linux\x1b[0m`);
}

