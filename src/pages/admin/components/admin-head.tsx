import { Helmet } from 'react-helmet-async'

/** Keeps every admin page out of search results, on either address. */
export function AdminHead() {
  return (
    <Helmet>
      <title>Afrorevive Admin</title>
      <meta name='robots' content='noindex, nofollow' />
    </Helmet>
  )
}
