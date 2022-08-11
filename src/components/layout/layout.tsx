import Head from 'next/head'
import Link from 'next/link'
import { FC } from 'react'
import classes from './layout.module.scss'
import classnames from 'classnames'
import { allPages, Pages } from '../../utils/pages'
import { Box, Button, Container, NavLink } from '@mantine/core'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

interface LayoutProps {
  children: JSX.Element
  activePage: Pages
  justHeader?: boolean
}

const Layout: FC<LayoutProps> = ({
  children,
  activePage,
  justHeader = false,
 }) => {
  const router = useRouter()

  const handleSignOut = () => {
    signOut()
    router.push('/')
  }

  if (justHeader) {
    return (
      <div className={classes.LayoutContainerNoSidebar}>
        <Head>

        </Head>
        <div className={classes.Header}>
          Header
        </div>
        <Container className={classes.Main} fluid={true}>
          {children}
        </Container>
      </div>
    )
  }
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
            // const linkStyles = classnames(classes.Link, {
            //   [classes.Active as string]: page.label === activePage
            // })
            return (
              <Link key={idx} href={page.href} passHref>
                {/* <a className={linkStyles}>{page.label}</a> */}
                <NavLink
                  component='a'
                  label={page.label}
                  active={router.pathname === page.href}
                  classNames={{
                    root: classes.NavLink
                  }}
                />
              </Link>
            )
          })
        }

        {/* <Button.Group orientation='vertical'> */}

        {/* </Button.Group> */}
        <Button variant='subtle' onClick={() => handleSignOut()}>Log out</Button>
      </div>
    </div>
  )
}

export default Layout
