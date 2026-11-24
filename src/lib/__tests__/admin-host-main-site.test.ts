/**
 * @jest-environment-options {"url": "http://localhost/", "customExportConditions": [""]}
 */
import { ROUTE_PATHS } from '@/config/route-map'
import { ADMIN_BASE, IS_ADMIN_HOST } from '@/lib/admin-host'

describe('on the main site', () => {
  it('keeps the admin pages under /admin', () => {
    expect(IS_ADMIN_HOST).toBe(false)
    expect(ADMIN_BASE).toBe('/admin')
    expect(ROUTE_PATHS.admin_dashboard).toBe('/admin')
    expect(ROUTE_PATHS.admin_login).toBe('/admin/login')
    expect(ROUTE_PATHS.admin_users).toBe('/admin/users')
    // The fan site's own pages are untouched.
    expect(ROUTE_PATHS.home).toBe('/')
    expect(ROUTE_PATHS.events).toBe('/events')
  })
})
