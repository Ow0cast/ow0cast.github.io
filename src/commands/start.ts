import type { CommandContext } from '../lib/commandLoader';

import { RemoteClient } from '../lib/remote';

export const name = 'start';
export const description = 'Connects to ursa-minor via ssh. Run `login` first';

export async function run({ term }: CommandContext) {
    const accessToken = sessionStorage.getItem('access_token');

    const client = new RemoteClient(accessToken);
    client.connect();
    client.onData = (text) => {
        window.term.write(text);
    }
    window.term.onData((data) => {
        client.sendInput(data);
    });
}

