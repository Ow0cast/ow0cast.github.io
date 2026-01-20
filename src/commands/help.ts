import type { CommandContext } from '../lib/commandLoader';

export const name = 'help';
export const description = 'List available commands';

export async function run({ term, listCommands }: CommandContext) {
	const cmds = await listCommands();
	for (const c of cmds) {
		term.writeln(`${c.name}${c.description ? ` - ${c.description}` : ''}`);
	}
}

