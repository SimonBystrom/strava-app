interface Page {
  href: string,
  label: string,
}

export const allPages: Page[] = [
  { href: '/', label: 'Back to First page' },
  { href: '/dashboard/user', label: 'Home' },
  { href: '/dashboard/activity', label: 'Activity' },
  { href: '/dashboard/workouts', label: 'Workouts'}
]

const pages = ['Home', 'Activity', 'Workouts', 'Back to First page'] as const
export type Pages = typeof pages[number]

