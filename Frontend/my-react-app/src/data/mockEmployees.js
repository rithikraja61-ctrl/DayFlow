export const EMPLOYEE_STATUS = {
  present: { label: 'Logged in today', color: 'green' },
  absent: { label: 'Not logged in', color: 'red' },
  leave: { label: 'On leave', color: 'yellow' },
}

/** Map backend employee row to dashboard card shape */
export function toDashboardEmployee(row) {
  return {
    id: String(row.id),
    firstName: row.firstName,
    lastName: row.lastName,
    department: row.department ?? '—',
    email: row.email,
    loginId: row.loginId,
    phone: row.phone ?? '—',
    role: 'Employee',
    status: row.attendanceStatus ?? 'absent',
    joinDate: row.joinDate ?? '—',
    about: row.about ?? 'No description available.',
  }
}

export function getEmployeeById(id, employees = []) {
  return employees.find((e) => e.id === String(id)) ?? null
}
