interface Page {
  href: string,
  label: string,
}

export const allPages: Page[] = [
  { href: '/dashboard/user', label: 'Home' },
  { href: '/dashboard/activity', label: 'Activity' },
  { href: '/dashboard/workouts', label: 'Workouts'}
]

const pages = ['Home', 'Activity', 'Workouts'] as const
export type Pages = typeof pages[number]

