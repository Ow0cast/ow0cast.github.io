import type { CommandContext } from '../lib/commandLoader';

export const name = 'accurotate';
export const description = 'Provided by https://accuratelinuxgraphs.com';

export async function run({ term }: CommandContext) {
	const body = document.body;
	const isActive = body.classList.contains('accurotate-active');
	
	if (isActive) {
		body.classList.remove('accurotate-active');
		term.writeln('accurotate: disabled');
	} else {
		body.classList.add('accurotate-active');
		term.writeln('accurotate: enabled');
	}
}

