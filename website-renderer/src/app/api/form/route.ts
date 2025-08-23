import { NextRequest, NextResponse } from 'next/server';

const LARAVEL_API_BASE = process.env.LARAVEL_API_BASE || 'http://localhost:8000/api';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get('subdomain');
  const formId = searchParams.get('formId');

  if (!subdomain || !formId) {
    return NextResponse.json({ error: 'Subdomain and formId are required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    
    const apiUrl = `${LARAVEL_API_BASE}/website/${subdomain}/forms/${formId}/submit`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}