const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

interface TimeDivision {
  amount: number
  name: Intl.RelativeTimeFormatUnit
}

const divisions: TimeDivision[] = [
  { amount: 60, name: 'second' },
  { amount: 60, name: 'minute' },
  { amount: 24, name: 'hour' },
  { amount: 7, name: 'day' },
  { amount: 4.34524, name: 'week' },
  { amount: 12, name: 'month' },
  { amount: Number.POSITIVE_INFINITY, name: 'year' },
]

export function formatRelativeTime(
  date: Date | string | number,
  now = Date.now()
): string {
  const dateMs = new Date(date).getTime()
  let seconds = (dateMs - now) / 1000

  for (const { amount, name } of divisions) {
    if (Math.abs(seconds) < amount) {
      return formatter.format(Math.round(seconds), name)
    }
    seconds /= amount
  }

  return formatter.format(Math.round(seconds / 31536000), 'year')
}
