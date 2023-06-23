export const useParam = (paramName: string) => {
  const queryString = window.location.search.slice(1)

  if (queryString) {
    const paramPairs = queryString.split('&')

    for (let i = 0; i < paramPairs.length; i++) {
      const pair = paramPairs[i].split('=')
      const name = decodeURIComponent(pair[0])
      const value = decodeURIComponent(pair[1] || '')

      if (name === paramName)
        return value
    }
  }
  return null
}
