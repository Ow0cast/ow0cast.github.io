export type CommandContext = {
	term: import('@xterm/xterm').Terminal;
	args: string[];
	pwd: string;
	setPwd: (nextPwd: string) => void;
	listCommands: () => Promise<LoadedCommandSummary[]>;
};

export type LoadedCommand = {
	name: string;
	description?: string;
	run: (ctx: CommandContext) => void | Promise<void>;
};

export type LoadedCommandSummary = Pick<LoadedCommand, 'name' | 'description'>;

type CommandModule = {
	// Named exports we expect each command file to provide.
	name?: string;
	description?: string;
	run?: LoadedCommand['run'];
};

// Use .ts files for client-side compatibility
const COMMAND_MODULES = import.meta.glob<CommandModule>('/src/commands/*.ts', { eager: false });

function filenameToCommandName(path: string) {
	const base = path.split('/').pop() ?? path;
	return base.replace(/\.(ts|js)$/, '');
}

export async function loadCommand(name: string): Promise<LoadedCommand | null> {
	const normalized = name.trim();
	if (!normalized) return null;

	for (const [path, loader] of Object.entries(COMMAND_MODULES)) {
		const fileName = filenameToCommandName(path);
		if (fileName !== normalized) continue;

		const mod = await loader();
		if (typeof mod.run !== 'function') return null;

		return {
			name: typeof mod.name === 'string' ? mod.name : fileName,
			description: typeof mod.description === 'string' ? mod.description : undefined,
			run: mod.run,
		};
	}

	return null;
}

export async function listCommands(): Promise<LoadedCommandSummary[]> {
	const entries = await Promise.all(
		Object.entries(COMMAND_MODULES).map(async ([path, loader]) => {
			const fileName = filenameToCommandName(path);
			const mod = await loader();
			return {
				name: typeof mod.name === 'string' ? mod.name : fileName,
				description: typeof mod.description === 'string' ? mod.description : undefined,
			};
		}),
	);

	return entries.sort((a, b) => a.name.localeCompare(b.name));
}


