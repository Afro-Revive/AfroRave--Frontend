/**
 * @jest-environment-options {"url": "http://admin.localhost/", "customExportConditions": [""]}
 */
import { ROUTE_PATHS } from '@/config/route-map'
import { ADMIN_BASE, IS_ADMIN_HOST, isAdminHostname, mainSiteOrigin } from '@/lib/admin-host'

describe('isAdminHostname', () => {
  it.each(['admin.afrorevive.com', 'admin-dev.afrorevive.com', 'admin.localhost', 'ADMIN.afrorevive.com'])(
    'treats %s as the admin site',
    (hostname) => expect(isAdminHostname(hostname)).toBe(true),
  )

  it.each(['www.afrorevive.com', 'afrorevive.com', 'localhost', 'administrator.afrorevive.com', 'myadmin.afrorevive.com'])(
    'treats %s as the main site',
    (hostname) => expect(isAdminHostname(hostname)).toBe(false),
  )
})

describe('on the admin site', () => {
  it('puts the admin pages at the root', () => {
    expect(IS_ADMIN_HOST).toBe(true)
    expect(ADMIN_BASE).toBe('')
    expect(ROUTE_PATHS.admin_dashboard).toBe('/')
    expect(ROUTE_PATHS.admin_login).toBe('/login')
    expect(ROUTE_PATHS.admin_users).toBe('/users')
    expect(ROUTE_PATHS.admin_fees).toBe('/fees')
  })
})

describe('mainSiteOrigin', () => {
  const at = (url: string) => {
    const { protocol, hostname, port, origin } = new URL(url)
    return { protocol, hostname, port, origin }
  }

  it('links the admin site to www, since the bare domain only redirects', () => {
    expect(mainSiteOrigin(at('https://admin.afrorevive.com/events'), undefined)).toBe('https://www.afrorevive.com')
  })

  it('keeps the port locally', () => {
    expect(mainSiteOrigin(at('http://admin.localhost:4318/'), undefined)).toBe('http://localhost:4318')
  })

  it('uses VITE_MAIN_SITE_URL when set, without a trailing slash', () => {
    expect(mainSiteOrigin(at('https://admin-dev.afrorevive.com/'), 'https://staging.afrorevive.com/')).toBe(
      'https://staging.afrorevive.com',
    )
  })

  it('stays on the same site off the admin host', () => {
    expect(mainSiteOrigin(at('https://www.afrorevive.com/admin/events'), 'https://ignored.example')).toBe(
      'https://www.afrorevive.com',
    )
  })
})
