import { useMemo, useState } from 'react'
import {
  calculateSalary,
  formatInr,
  loadSalaryProfile,
  saveSalaryProfile,
} from '../utils/salary'

export default function SalaryInfoTab({ loginId, editable = false }) {
  const saved = loadSalaryProfile(loginId)
  const [monthlyWage, setMonthlyWage] = useState(saved?.monthlyWage ?? 50000)
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState(saved?.workingDaysPerWeek ?? 5)
  const [hoursPerDay, setHoursPerDay] = useState(saved?.hoursPerDay ?? 8)
  const [performanceBonusPct, setPerformanceBonusPct] = useState(saved?.performanceBonusPct ?? 6.67)
  const [ltaPctOfWage, setLtaPctOfWage] = useState(saved?.ltaPctOfWage ?? 8.33)
  const [standardAllowance, setStandardAllowance] = useState(
    saved?.standardAllowance ?? Math.round(50000 * 0.1817 * 100) / 100,
  )
  const [professionalTax, setProfessionalTax] = useState(saved?.professionalTax ?? 200)
  const [savedMsg, setSavedMsg] = useState('')

  const result = useMemo(
    () =>
      calculateSalary(monthlyWage, {
        workingDaysPerWeek,
        hoursPerDay,
        performanceBonusPct,
        ltaPctOfWage,
        standardAllowance,
        professionalTax,
      }),
    [
      monthlyWage,
      workingDaysPerWeek,
      hoursPerDay,
      performanceBonusPct,
      ltaPctOfWage,
      standardAllowance,
      professionalTax,
    ],
  )

  function onWageChange(value) {
    const wage = Number(value) || 0
    setMonthlyWage(wage)
    if (!saved?.standardAllowanceLocked) {
      setStandardAllowance(Math.round(wage * 0.1817 * 100) / 100)
    }
  }

  function handleSave() {
    saveSalaryProfile(loginId, {
      monthlyWage,
      workingDaysPerWeek,
      hoursPerDay,
      performanceBonusPct,
      ltaPctOfWage,
      standardAllowance,
      professionalTax,
    })
    setSavedMsg('Salary structure saved for this profile.')
    setTimeout(() => setSavedMsg(''), 2500)
  }

  return (
    <div className="salary-tab">
      <p className="detail-hint">
        {editable
          ? 'Admin only — change Month Wage; components recalculate automatically. Component sum equals Month Wage.'
          : 'Salary breakdown (view only).'}
      </p>

      <div className="salary-top-grid">
        <label className="salary-field">
          <span>Month Wage</span>
          {editable ? (
            <input
              type="number"
              min="0"
              step="100"
              value={monthlyWage}
              onChange={(e) => onWageChange(e.target.value)}
            />
          ) : (
            <strong>₹ {formatInr(result.monthlyWage)}</strong>
          )}
        </label>
        <div className="salary-field">
          <span>Yearly Wage</span>
          <strong>₹ {formatInr(result.yearlyWage)}</strong>
        </div>
        <label className="salary-field">
          <span>Working days / week</span>
          {editable ? (
            <input
              type="number"
              min="1"
              max="7"
              value={workingDaysPerWeek}
              onChange={(e) => setWorkingDaysPerWeek(Number(e.target.value) || 5)}
            />
          ) : (
            <strong>{result.workingDaysPerWeek}</strong>
          )}
        </label>
        <label className="salary-field">
          <span>Hours / day</span>
          {editable ? (
            <input
              type="number"
              min="1"
              max="24"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value) || 8)}
            />
          ) : (
            <strong>{result.hoursPerDay} Hrs</strong>
          )}
        </label>
      </div>

      <div className="salary-columns">
        <section className="salary-panel">
          <h3>Salary Components</h3>
          <table className="salary-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Rule</th>
                <th>% of wage</th>
                <th>₹ / month</th>
              </tr>
            </thead>
            <tbody>
              {result.components.map((c) => (
                <tr key={c.key}>
                  <td>{c.label}</td>
                  <td className="salary-note">{c.note}</td>
                  <td>{c.pctOfWage.toFixed(2)}%</td>
                  <td>₹ {formatInr(c.amount)}</td>
                </tr>
              ))}
              <tr className="salary-total-row">
                <td colSpan={3}>
                  Total components {result.balanced ? '(balanced)' : '(check totals)'}
                </td>
                <td>₹ {formatInr(result.componentsSum)}</td>
              </tr>
            </tbody>
          </table>

          {editable ? (
            <div className="salary-config-row">
              <label>
                Performance Bonus %
                <input
                  type="number"
                  step="0.01"
                  value={performanceBonusPct}
                  onChange={(e) => setPerformanceBonusPct(Number(e.target.value) || 0)}
                />
              </label>
              <label>
                LTA % of wage
                <input
                  type="number"
                  step="0.01"
                  value={ltaPctOfWage}
                  onChange={(e) => setLtaPctOfWage(Number(e.target.value) || 0)}
                />
              </label>
              <label>
                Standard Allowance (₹)
                <input
                  type="number"
                  step="0.01"
                  value={standardAllowance}
                  onChange={(e) => setStandardAllowance(Number(e.target.value) || 0)}
                />
              </label>
            </div>
          ) : null}
        </section>

        <section className="salary-panel">
          <h3>PF &amp; Deductions</h3>
          <div className="detail-grid">
            <div className="detail-field">
              <span className="detail-label">Employer PF (12% of Basic)</span>
              <span className="detail-value">₹ {formatInr(result.pf.employer)}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Employee PF (12% of Basic)</span>
              <span className="detail-value">₹ {formatInr(result.pf.employee)}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Professional Tax</span>
              {editable ? (
                <input
                  type="number"
                  value={professionalTax}
                  onChange={(e) => setProfessionalTax(Number(e.target.value) || 0)}
                />
              ) : (
                <span className="detail-value">₹ {formatInr(result.professionalTax)}</span>
              )}
            </div>
            <div className="detail-field">
              <span className="detail-label">Gross</span>
              <span className="detail-value">₹ {formatInr(result.gross)}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Total deductions</span>
              <span className="detail-value">₹ {formatInr(result.totalDeductions)}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Net salary</span>
              <span className="detail-value salary-net">₹ {formatInr(result.net)}</span>
            </div>
          </div>
        </section>
      </div>

      <div className="salary-important">
        <strong>Important</strong>
        <ul>
          <li>Basic = 50% of Month Wage · HRA = 50% of Basic</li>
          <li>Fixed Allowance = Month Wage − (sum of other components)</li>
          <li>PF = 12% of Basic (employer + employee) · Professional Tax default ₹200</li>
          <li>Changing Month Wage recalculates all components automatically</li>
        </ul>
      </div>

      {editable ? (
        <button type="button" className="primary salary-save-btn" onClick={handleSave}>
          Save salary structure
        </button>
      ) : null}
      {savedMsg ? <p className="salary-saved-msg">{savedMsg}</p> : null}
    </div>
  )
}
