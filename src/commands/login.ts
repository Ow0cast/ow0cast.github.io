import type { CommandContext } from '../lib/commandLoader';

export const name = 'login';
export const description = 'Logs in to a local machine.';

async function getChallenge(verifier: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(verifier);
	const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashString = String.fromCharCode(...hashArray);
	const base64 = btoa(hashString)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
	return base64;
}

function getVerifier(length: number) {
	const array = new Uint8Array(length);
	window.crypto.getRandomValues(array);
	// Base64URL encode
	return btoa(String.fromCharCode(...array))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
}

export async function run({ term }: CommandContext) {
	const verifier = getVerifier(64);
	const challenge = await getChallenge(verifier);

	sessionStorage.setItem('verifier', verifier);   
    const authUrl = `https://auth.owuh.dev/realms/master/protocol/openid-connect/auth` +
        `?client_id=term` +
        `&response_type=code` +
        `&scope=openid` +
        `&redirect_uri=https://owuh.dev/callback` +
        `&state=${window.crypto.randomUUID()}` +
        `&code_challenge=${challenge}` + 
        `&code_challenge_method=S256`;

    window.location.href = authUrl;

}

