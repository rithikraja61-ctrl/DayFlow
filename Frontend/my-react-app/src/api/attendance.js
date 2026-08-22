import { authHeaders } from './auth'

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...(options.headers || {}),
      },
    })
  } catch {
    throw new Error('Cannot reach the server. Start Docker backend on port 8088.')
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'Request failed')
  }
  return data
}

export async function clockIn() {
  return request('/api/attendance/clock-in', { method: 'POST' })
}

export async function clockOut() {
  return request('/api/attendance/clock-out', { method: 'POST' })
}

export async function todayAttendance() {
  return request('/api/attendance/today')
}

export async function companyAttendanceToday() {
  const data = await request('/api/attendance/company/today')
  return data.records ?? []
}
