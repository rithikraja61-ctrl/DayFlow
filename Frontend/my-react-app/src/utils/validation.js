export function validateName(name) {
  if (!name.trim()) return 'Full name is required'
  if (name.trim().length < 2) return 'Enter your full name'
  return ''
}

export function validateOrg(org) {
  if (!org.trim()) return 'Organization name is required'
  if (org.trim().length < 2) return 'Enter a valid organization name'
  return ''
}

export function validateEmail(email) {
  if (!email.trim()) return 'Work email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email'
  return ''
}

export function passwordChecks(password) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
}

export function validatePassword(password) {
  if (!password) return 'Password is required'
  const c = passwordChecks(password)
  if (!Object.values(c).every(Boolean)) return 'Password does not meet security rules'
  return ''
}

export function validateConfirm(password, confirm) {
  if (!confirm) return 'Confirm your password'
  if (password !== confirm) return 'Passwords do not match'
  return ''
}
