import { useState } from 'react'

export function useTempId() {
  const [lastTempId, setLastTempId] = useState(0)

  const generateTempId = () => {
    const newTempId = Date.now() * 1000 + lastTempId
    setLastTempId(prev => prev + 1)
    return newTempId
  }

  return generateTempId
}
