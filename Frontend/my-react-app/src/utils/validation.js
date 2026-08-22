export function validateRequired(value, label) {
  if (!String(value || '').trim()) return `${label} is required`
  return ''
}

export function validateEmail(email) {
  if (!email.trim()) return 'Work email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email'
  return ''
}

export function validatePhone(phone) {
  if (!phone.trim()) return 'Phone is required'
  if (!/^\d{10}$/.test(phone.trim())) return 'Phone must be 10 digits'
  return ''
}

export function validateLoginId(value) {
  if (!String(value || '').trim()) return 'Login ID or email is required'
  return ''
}

export function passwordChecks(password) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  }
}

export function validatePassword(password) {
  if (!password) return 'Password is required'
  const c = passwordChecks(password)
  if (!c.length || !c.upper || !c.lower || !c.special) {
    return 'Use 8+ characters with uppercase, lowercase, and a special character (!@#$%^&*)'
  }
  return ''
}

export function validateConfirm(password, confirm) {
  if (!confirm) return 'Confirm your password'
  if (password !== confirm) return 'Passwords do not match'
  return ''
}
