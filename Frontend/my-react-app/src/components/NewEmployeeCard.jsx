import { useNavigate } from 'react-router-dom'

export default function NewEmployeeCard() {
  const navigate = useNavigate()

  return (
    <button type="button" className="employee-card new-employee-card" onClick={() => navigate('/employees/new')}>
      <span className="new-employee-icon" aria-hidden="true">
        +
      </span>
      <span className="employee-name">New Employee</span>
      <span className="employee-dept">Add a team member</span>
    </button>
  )
}
