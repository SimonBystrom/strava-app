interface Page {
  href: string,
  label: string,
}

export const allPages: Page[] = [
  { href: '/dashboard/user', label: 'Home' },
  { href: '/dashboard/activity', label: 'Activity' },
]

const pages = ['Home', 'Activity', 'Back to First page'] as const
export type Pages = typeof pages[number]

