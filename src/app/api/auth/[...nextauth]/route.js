// Simple NextAuth route for Vercel deployment
export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response(JSON.stringify({ 
    message: 'NextAuth endpoint',
    status: 'ok'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function POST() {
  return new Response(JSON.stringify({ 
    message: 'NextAuth endpoint',
    status: 'ok'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
