import { useCallback, useState } from 'react'

export function useApi<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const call = useCallback(
    async (...args: Args): Promise<Result> => {
      setLoading(true)
      setError(null)
      try {
        const res = await fn(...args)
        return res
      } catch (err) {
        setError(err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fn],
  )

  return { call, loading, error }
}
