interface Page {
  href: string,
  label: string,
}

export const allPages: Page[] = [
  { href: '/user', label: 'Home' },
  { href: '/user/activity', label: 'Activity' }
]

const pages = ['Home', 'Activity'] as const
export type Pages = typeof pages[number]

