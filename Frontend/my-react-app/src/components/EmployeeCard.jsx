import { useNavigate } from 'react-router-dom'
import { EMPLOYEE_STATUS } from '../data/mockEmployees'

function avatarInitials(employee) {
  return `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase()
}

export default function EmployeeCard({ employee }) {
  const navigate = useNavigate()
  const status = EMPLOYEE_STATUS[employee.status] ?? EMPLOYEE_STATUS.absent

  return (
    <button
      type="button"
      className="employee-card"
      onClick={() => navigate(`/dashboard/employees/${employee.id}`)}
    >
      <span className={`status-dot status-${status.color}`} title={status.label} aria-label={status.label} />
      <span className="employee-avatar">{avatarInitials(employee)}</span>
      <span className="employee-name">
        {employee.firstName} {employee.lastName}
      </span>
      <span className="employee-dept">{employee.department}</span>
    </button>
  )
}
