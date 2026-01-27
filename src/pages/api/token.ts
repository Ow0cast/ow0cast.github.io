export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
	const body = await request.json();
	const { code, code_verifier, redirect_uri } = body;

	if (!code || !code_verifier) {
		return new Response(
			JSON.stringify({ error: 'Missing required parameters' }),
			{
				status: 400,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			}
		);
	}

	const formData = new URLSearchParams();
	formData.append('grant_type', 'authorization_code');
	formData.append('client_id', 'term');
	formData.append('code', code);
	formData.append('redirect_uri', redirect_uri || 'https://owuh.dev/callback');
	formData.append('code_verifier', code_verifier);

	try {
		const response = await fetch(
			'https://auth.owuh.dev/realms/master/protocol/openid-connect/token',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: formData.toString(),
			}
		);

		const data = await response.json();

		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
			},
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ error: 'Failed to exchange token', message: error instanceof Error ? error.message : 'Unknown error' }),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			}
		);
	}
};

export const OPTIONS: APIRoute = () => {
	return new Response(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		},
	});
};
