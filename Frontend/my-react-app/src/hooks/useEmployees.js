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
  const [tick, setTick] = useState(0)

  function reload() {
    setTick((t) => t + 1)
  }

  useEffect(() => {
    if (session?.role !== 'HR') {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError('')

    if (session?.devUi) {
      setEmployees(SAMPLE_EMPLOYEES)
      setUsingSample(true)
      setLoading(false)
      return
    }

    listEmployees()
      .then((rows) => {
        if (!cancelled) {
          setEmployees(rows.map(toDashboardEmployee))
          setUsingSample(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setEmployees(SAMPLE_EMPLOYEES)
          setUsingSample(true)
          setError(err.message)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [session?.role, session?.devUi, tick])

  return {
    employees,
    loading,
    error,
    usingSample,
    isHr: session?.role === 'HR',
    reload,
  }
}
