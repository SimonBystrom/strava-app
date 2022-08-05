
import Head from 'next/head'
import Link from 'next/link'
import { FC } from 'react'
import classes from './layout.module.scss'
import classnames from 'classnames'
import { allPages, Pages } from '../../utils/pages'
import { Container } from '@mantine/core'

interface LayoutProps {
  children: JSX.Element
  activePage: Pages
}

const Layout: FC<LayoutProps> = ({children, activePage}) => {
  return(
    <div className={classes.LayoutContainer}>
      <Head>

      </Head>
      <div className={classes.Header}>
        Header
      </div>
      <Container className={classes.Main} fluid={true}>
        {children}
      </Container>
      <div className={classes.Sidebar}>
        {
          allPages.map((page, idx) => {
            const linkStyles = classnames(classes.Link, {
              [classes.Active as string]: page.label === activePage
            })
            return (
              <Link key={idx} href={page.href}>
                <a className={linkStyles}>{page.label}</a>
              </Link>
            )
          })
        }
      </div>
    </div>
  )
}

export default Layout
