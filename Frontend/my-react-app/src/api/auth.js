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
    throw new Error('Cannot reach the server. Start Docker (port 8088) or Spring Boot backend.')
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(
      data.message || data.error || (res.status === 400 ? 'Invalid Login Id or Password' : `Request failed (${res.status})`),
    )
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
        ? 'This email is registered as Employee. Use Employee Portal, or sign up a new HR account.'
        : 'This email is registered as HR. Use the HR / Admin portal to sign in.',
    )
  }

  const session = {
    token: data.token,
    loginId: data.loginId,
    email: data.email,
    role: data.role,
    companyName: data.companyName,
    mustChangePassword: Boolean(data.mustChangePassword),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

const COMPANY_LOGO_KEY = 'dayflow_company_logo'

export function saveCompanyLogo(previewUrl) {
  if (previewUrl) localStorage.setItem(COMPANY_LOGO_KEY, previewUrl)
}

export function getCompanyLogo() {
  return localStorage.getItem(COMPANY_LOGO_KEY)
}

/** Dev only — open dashboard UI while backend is offline */
export function startDevUiSession() {
  if (!import.meta.env.DEV) return null
  const session = {
    token: 'dev-ui-token',
    loginId: 'DF-HR-DEV',
    email: 'hr.dev@dayflow.com',
    role: 'HR',
    companyName: 'DayFlow Demo',
    mustChangePassword: false,
    devUi: true,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}
