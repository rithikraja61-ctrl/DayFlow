const USERS_KEY = 'dayflow_users'
const SESSION_KEY = 'dayflow_session'

const delay = () => new Promise((r) => setTimeout(r, 400))

function loadUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}

export async function registerHr({ email, password, name, organization }) {
  await delay()
  const users = loadUsers()
  const normalized = email.toLowerCase()
  if (users.some((u) => u.email === normalized)) {
    throw new Error('An account with this email already exists')
  }
  users.push({
    id: crypto.randomUUID(),
    name: (name || email.split('@')[0]).trim(),
    organization: (organization || 'Dayflow').trim(),
    email: normalized,
    password,
    role: 'HR',
  })
  saveUsers(users)
  return { ok: true, email: normalized }
}

export async function login({ email, password, role }) {
  await delay()
  const user = loadUsers().find((u) => u.email === email.toLowerCase())
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password')
  }
  if (role && user.role !== role) {
    throw new Error(`This account is not an ${role} account`)
  }
  const session = {
    id: user.id,
    name: user.name,
    organization: user.organization || '',
    email: user.email,
    role: user.role,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}
