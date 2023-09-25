import type { APIRoute } from 'astro'

export const post: APIRoute = async(context) => {
  const body = await context.request.json()

  const { token, price } = body

  const response = await fetch(`${import.meta.env.API_URL}/api/gpt/getPayOrder`, {
    headers: {
      'Content-Type': 'application/json',
      'Token': token,
      'Appkey': import.meta.env.APP_KEY,
    },
    method: 'post',
    body: JSON.stringify({
      price,
      wallet_type: 'word',
      app_key: import.meta.env.APP_KEY,
    }),
  })
  const text = await response.text()
  return new Response(text)
}
