import type { APIRoute } from 'astro'

export const post: APIRoute = async(context) => {
  const body = await context.request.json()

  const { email, code, shareCode } = body

  const referer = context.request.headers.get('referer')

  const response = await fetch(`${import.meta.env.API_URL}/login/loreg`, {
    headers: {
      'Content-Type': 'application/json',
      'App-Referer': referer as string,
    },
    method: 'POST',
    body: JSON.stringify({
      email,
      code,
      app_key: import.meta.env.APP_KEY,
      shareCode,
    }),
  })
  const text = await response.text()
  return new Response(text)
}
