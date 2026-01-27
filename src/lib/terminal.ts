import { Terminal } from '@xterm/xterm';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { loadCommand, listCommands } from './commandLoader';

const el = document.getElementById('terminal');
if (!el) {
	throw new Error('Terminal mount element #terminal not found');
}

const term = new Terminal({
	convertEol: true,
	cursorBlink: true,
});

window.term = term;

// Resize terminal to fill container
function resizeTerminal() {
	if (!el) return;
	const rect = el.getBoundingClientRect();
	const cols = Math.floor(rect.width / 9); // Approximate char width
	const rows = Math.floor(rect.height / 17); // Approximate char height
	term.resize(Math.max(cols, 1), Math.max(rows, 1));
}

// Initial resize
resizeTerminal();

// Resize on window resize
window.addEventListener('resize', resizeTerminal);

let commandBuffer = '';
let pwd = '~';

function prompt() {
	term.write(`\r\n${pwd} ❯ `);
}

async function runLine(line: string) {
	const trimmed = line.trim();
	if (!trimmed) return;

	const [name, ...args] = trimmed.split(/\s+/);
	const cmd = await loadCommand(name);

	if (!cmd) {
		term.writeln(`command not found: ${name}`);
		return;
	}

	try {
		await cmd.run({
			term,
			args,
			pwd,
			setPwd: (next) => (pwd = next),
			listCommands,
		});
	} catch (err) {
		term.writeln(`error running ${name}: ${String(err)}`);
	}
}

term.onData(async (data) => {
	if (window.connected) return;
	switch (data) {
		case '\u0003': // Ctrl+C
			term.write('^C');
			commandBuffer = '';
			if (window.connected) return;
			prompt();
			return;

		case '\r': // Enter
			term.write('\r\n');
			if (window.connected) return;
			await runLine(commandBuffer);
			commandBuffer = '';
			prompt();
			return;

		case '\u007F': // Backspace
			if (commandBuffer.length > 0) {
				commandBuffer = commandBuffer.slice(0, -1);
				term.write('\b \b');
			}
			return;

		default:
			// printable characters only
			if (data >= ' ' && data !== '\x7F') {
				commandBuffer += data;
				term.write(data);
			}
	}
});

term.loadAddon(new WebLinksAddon());

term.open(el);
term.writeln('owuh.dev — type \'help\' for a list of commands');
prompt();


