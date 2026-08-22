import { authHeaders } from './auth'

async function get(path) {
  let res
  try {
    res = await fetch(path, { headers: { ...authHeaders() } })
  } catch {
    throw new Error('Cannot reach the server. Start the Spring Boot backend on port 8080.')
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'Request failed')
  }
  return data
}

/** HR-only: list employees for the logged-in company */
export async function listEmployees(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  const data = await get(`/api/employees${query}`)
  return data.employees ?? []
}
