import type { Setter } from 'solid-js'

export const convertReadableStreamToAccessor = async(stream: ReadableStream, setter: Setter<string>) => {
  let text = ''
  try {
    const reader = stream.getReader()
    const decoder = new TextDecoder('utf-8')
    let done = false
    while (!done) {
      const { value, done: readerDone } = await reader.read()
      if (value) {
        const char = decoder.decode(value, { stream: true })
        if (char) {
          text += char
          setter(text)
        }
      }
      done = readerDone
    }
    updateInfo()
    return text
  } catch (error) {
    return text
  }
}

const updateInfo = async() => {
  setTimeout(async() => {
    const response = await fetch('/api/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: localStorage.getItem('token'),
      }),
    })
    const responseJson = await response.json()
    if (responseJson.code === 200)
      localStorage.setItem('user', JSON.stringify(responseJson.data))
  }, 2000)
}
