import { NextResponse } from 'next/server';

export async function POST() {
  const apiKey = process.env.TELNYX_API_KEY;
  const credentialId = process.env.TELNYX_CREDENTIAL_ID;

  if (!apiKey || !credentialId) {
    return NextResponse.json({ error: 'Missing Telnyx configuration' }, { status: 500 });
  }

  try {
    const response = await fetch(`https://api.telnyx.com/v2/telephony_credentials/${credentialId}/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.detail || 'Failed to fetch token');
    }

    const token = await response.text(); // The API returns the token as a raw string
    return NextResponse.json({ token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
