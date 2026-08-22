const STORAGE_KEY = 'dayflow_time_off_requests'
const ALLOCATION_KEY = 'dayflow_time_off_allocation'

export const TIME_OFF_TYPES = [
  { id: 'PAID', label: 'Paid Time Off' },
  { id: 'SICK', label: 'Sick Time Off' },
  { id: 'UNPAID', label: 'Unpaid Time Off' },
]

export const DEFAULT_ALLOCATION = {
  paidDays: 24,
  sickDays: 12,
}

export function publicHolidaysForYear(year) {
  return [
    { date: `${year}-01-26`, name: 'Republic Day' },
    { date: `${year}-03-14`, name: 'Holi' },
    { date: `${year}-08-15`, name: 'Independence Day' },
    { date: `${year}-10-02`, name: 'Gandhi Jayanti' },
    { date: `${year}-10-20`, name: 'Diwali' },
    { date: `${year}-12-25`, name: 'Christmas' },
  ]
}

export function loadAllocation() {
  try {
    const raw = localStorage.getItem(ALLOCATION_KEY)
    if (!raw) return { ...DEFAULT_ALLOCATION }
    return { ...DEFAULT_ALLOCATION, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_ALLOCATION }
  }
}

export function saveAllocation(allocation) {
  localStorage.setItem(ALLOCATION_KEY, JSON.stringify(allocation))
}

export function loadRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : seedIfEmpty()
  } catch {
    return []
  }
}

function seedIfEmpty() {
  const y = new Date().getFullYear()
  const seed = [
    {
      id: 'to-1',
      employeeName: 'Priya Sharma',
      employeeLoginId: 'priya.sharma',
      type: 'PAID',
      startDate: `${y}-10-28`,
      endDate: `${y}-10-28`,
      days: 1,
      status: 'PENDING',
      attachmentName: '',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'to-2',
      employeeName: 'Arjun Patel',
      employeeLoginId: 'arjun.patel',
      type: 'SICK',
      startDate: `${y}-08-12`,
      endDate: `${y}-08-13`,
      days: 2,
      status: 'PENDING',
      attachmentName: 'sick-note.pdf',
      createdAt: Date.now() - 43200000,
    },
    {
      id: 'to-3',
      employeeName: 'Meera Nair',
      employeeLoginId: 'meera.nair',
      type: 'PAID',
      startDate: `${y}-07-08`,
      endDate: `${y}-07-08`,
      days: 1,
      status: 'REJECTED',
      attachmentName: '',
      createdAt: Date.now() - 172800000,
    },
    {
      id: 'to-4',
      employeeName: 'Rahul Das',
      employeeLoginId: 'rahul.das',
      type: 'PAID',
      startDate: `${y}-05-13`,
      endDate: `${y}-05-14`,
      days: 2,
      status: 'APPROVED',
      attachmentName: '',
      createdAt: Date.now() - 259200000,
    },
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
  return seed
}

export function saveRequests(requests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
}

export function countWeekdays(startDate, endDate) {
  if (!startDate || !endDate) return 0
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 0

  let days = 0
  const cur = new Date(start)
  while (cur <= end) {
    const dow = cur.getDay()
    if (dow !== 0 && dow !== 6) days += 1
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

export function formatDateDisplay(iso) {
  if (!iso) return '—'
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}

export function typeLabel(typeId) {
  return TIME_OFF_TYPES.find((t) => t.id === typeId)?.label || typeId
}

export function usedDays(requests, loginId, type, statuses = ['APPROVED', 'PENDING']) {
  return requests
    .filter(
      (r) =>
        r.employeeLoginId === loginId && r.type === type && statuses.includes(r.status),
    )
    .reduce((sum, r) => sum + (Number(r.days) || 0), 0)
}

export function remainingBalance(requests, loginId, allocation = loadAllocation()) {
  return {
    paid: Math.max(0, allocation.paidDays - usedDays(requests, loginId, 'PAID')),
    sick: Math.max(0, allocation.sickDays - usedDays(requests, loginId, 'SICK')),
  }
}

const STATUS_RANK = { APPROVED: 3, PENDING: 2, REJECTED: 1 }

export function dateStatusMap(requests, loginId) {
  const map = new Map()
  requests
    .filter((r) => r.employeeLoginId === loginId)
    .forEach((r) => {
      const start = new Date(`${r.startDate}T00:00:00`)
      const end = new Date(`${r.endDate}T00:00:00`)
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return
      const cur = new Date(start)
      while (cur <= end) {
        const iso = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`
        const prev = map.get(iso)
        if (!prev || (STATUS_RANK[r.status] || 0) > (STATUS_RANK[prev] || 0)) {
          map.set(iso, r.status)
        }
        cur.setDate(cur.getDate() + 1)
      }
    })
  return map
}
