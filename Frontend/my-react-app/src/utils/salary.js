/** DayFlow salary breakdown — matches Excalidraw HR rules */

export function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100
}

export function formatInr(n) {
  return round2(n).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * @param {number} monthlyWage
 * @param {{ workingDaysPerWeek?: number, hoursPerDay?: number, performanceBonusPct?: number, ltaPctOfWage?: number, standardAllowance?: number, professionalTax?: number }} opts
 */
export function calculateSalary(monthlyWage, opts = {}) {
  const wage = Math.max(0, Number(monthlyWage) || 0)
  const workingDaysPerWeek = opts.workingDaysPerWeek ?? 5
  const hoursPerDay = opts.hoursPerDay ?? 8
  const performanceBonusPct = opts.performanceBonusPct ?? 6.67
  const ltaPctOfWage = opts.ltaPctOfWage ?? 8.33
  const standardAllowance = opts.standardAllowance ?? round2(wage * 0.1817)
  const professionalTax = opts.professionalTax ?? 200

  // Core rules from wireframe
  const basic = round2(wage * 0.5) // 50% of month wage
  const hra = round2(basic * 0.5) // 50% of basic
  const performanceBonus = round2(wage * (performanceBonusPct / 100))
  const lta = round2(wage * (ltaPctOfWage / 100))

  const allocated = round2(basic + hra + standardAllowance + performanceBonus + lta)
  const fixedAllowance = round2(Math.max(0, wage - allocated))

  const employerPf = round2(basic * 0.12)
  const employeePf = round2(basic * 0.12)

  const gross = round2(basic + hra + standardAllowance + performanceBonus + lta + fixedAllowance)
  const totalDeductions = round2(employeePf + professionalTax)
  const net = round2(gross - totalDeductions)
  const yearlyWage = round2(wage * 12)

  const components = [
    { key: 'basic', label: 'Basic Salary', amount: basic, pctOfWage: wage ? round2((basic / wage) * 100) : 0, note: '50% of Month Wage' },
    { key: 'hra', label: 'House Rent Allowance (HRA)', amount: hra, pctOfWage: wage ? round2((hra / wage) * 100) : 0, note: '50% of Basic' },
    { key: 'standard', label: 'Standard Allowance', amount: standardAllowance, pctOfWage: wage ? round2((standardAllowance / wage) * 100) : 0, note: 'Fixed / configured' },
    { key: 'bonus', label: 'Performance Bonus', amount: performanceBonus, pctOfWage: performanceBonusPct, note: `${performanceBonusPct}% of Month Wage` },
    { key: 'lta', label: 'Leave Travel Allowance (LTA)', amount: lta, pctOfWage: ltaPctOfWage, note: `${ltaPctOfWage}% of Month Wage` },
    { key: 'fixed', label: 'Fixed Allowance', amount: fixedAllowance, pctOfWage: wage ? round2((fixedAllowance / wage) * 100) : 0, note: 'Residual to match Month Wage' },
  ]

  return {
    monthlyWage: wage,
    yearlyWage,
    workingDaysPerWeek,
    hoursPerDay,
    components,
    pf: {
      employer: employerPf,
      employee: employeePf,
      ratePct: 12,
    },
    professionalTax,
    gross,
    totalDeductions,
    net,
    componentsSum: round2(components.reduce((s, c) => s + c.amount, 0)),
    balanced: Math.abs(round2(components.reduce((s, c) => s + c.amount, 0)) - wage) < 0.02,
  }
}

const STORAGE_KEY = 'dayflow_salary_profiles'

export function loadSalaryProfile(loginId) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return all[loginId] || null
  } catch {
    return null
  }
}

export function saveSalaryProfile(loginId, profile) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    all[loginId] = profile
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    /* ignore */
  }
}
