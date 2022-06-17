interface Page {
  href: string,
  label: string,
}

export const allPages: Page[] = [
  { href: '/user', label: 'Home' },
  { href: '/user/activity', label: 'Activity' },
  { href: '/', label: 'Back to First page'}
]

const pages = ['Home', 'Activity', 'Back to First page'] as const
export type Pages = typeof pages[number]

