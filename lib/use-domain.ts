import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

function useDomain() {
  const { query: { domain = '' } } = useRouter()
  const [state, setState] = useState(domain)

  useEffect(() => {
    setState(domain)
  }, [domain])

  return state
}

export default useDomain
