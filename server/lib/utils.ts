export function getDateRange(interval?: string): {
  startDate: string | undefined
  endDate: string | undefined
} {
  const currentDate = new Date()

  if (interval === 'week') {
    const startOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay()
    )
    const endOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + (6 - currentDate.getDay())
    )

    return { startDate: startOfWeek.toISOString(), endDate: endOfWeek.toISOString() }
  }

  if (interval === 'month') {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    return { startDate: startOfMonth.toISOString(), endDate: endOfMonth.toISOString() }
  }

  return { startDate: undefined, endDate: undefined }
}
