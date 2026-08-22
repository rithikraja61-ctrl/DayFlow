const SESSION_KEY = 'dayflow_session'

async function post(path, body) {
  let res
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Cannot reach the server. Start the Spring Boot backend on port 8080.')
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'Request failed')
  }
  return data
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}

export function authHeaders() {
  const session = getSession()
  return session?.token ? { Authorization: `Bearer ${session.token}` } : {}
}

export async function registerHr(form) {
  return post('/api/auth/signup', {
    companyName: form.companyName.trim(),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    password: form.password,
    confirmPassword: form.confirmPassword,
  })
}

export async function login({ loginIdOrEmail, password, role }) {
  const data = await post('/api/auth/login', {
    loginIdOrEmail: loginIdOrEmail.trim(),
    password,
  })

  const expected = role === 'Employee' ? 'EMPLOYEE' : role === 'HR' ? 'HR' : null
  if (expected && data.role !== expected) {
    throw new Error(
      expected === 'HR'
        ? 'This account is not an HR account'
        : 'This account is not an Employee account',
    )
  }

  const session = {
    token: data.token,
    loginId: data.loginId,
    email: data.email,
    role: data.role,
    companyName: data.companyName,
    mustChangePassword: data.mustChangePassword,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}
