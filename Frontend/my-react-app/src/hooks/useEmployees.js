import { useEffect, useState } from 'react'
import { getSession } from '../api/auth'
import { listEmployees } from '../api/employees'
import { SAMPLE_EMPLOYEES, toDashboardEmployee } from '../data/mockEmployees'

export function useEmployees() {
  const session = getSession()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(session?.role === 'HR')
  const [error, setError] = useState('')
  const [usingSample, setUsingSample] = useState(false)

  useEffect(() => {
    if (session?.role !== 'HR') {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError('')
    setUsingSample(false)

    listEmployees()
      .then((rows) => {
        if (!cancelled) {
          setEmployees(rows.map(toDashboardEmployee))
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEmployees(SAMPLE_EMPLOYEES)
          setUsingSample(true)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [session?.role])

  return { employees, loading, error, usingSample, isHr: session?.role === 'HR' }
}
