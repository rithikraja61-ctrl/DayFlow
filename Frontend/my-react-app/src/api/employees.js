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

export async function listEmployees(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  const data = await request(`/api/employees${query}`)
  return data.employees ?? []
}

export async function getEmployee(id) {
  return request(`/api/employees/${id}`)
}

export async function createEmployee(form) {
  return request('/api/employees', {
    method: 'POST',
    body: JSON.stringify({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      department: form.department?.trim() || null,
      designation: form.designation?.trim() || null,
    }),
  })
}
