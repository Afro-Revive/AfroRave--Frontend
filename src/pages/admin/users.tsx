import { useAdminUsers, useDeleteUser, useSetUserSuspension } from '@/hooks/use-admin'
import type { AdminAccountType, AdminUser } from '@/types/admin'
import { useState } from 'react'
import { ConfirmDialog } from './components/confirm-dialog'
import { DataTable, type Column } from './components/data-table'
import { formatDateTime, fullName } from './components/format'
import { FilterTabs, RowAction, SearchBox } from './components/list-controls'
import { PageHeader } from './components/page-header'
import { StatusPill, type PillTone } from './components/status-pill'
import { useListParams } from './components/use-list-params'

/** The API's account types, by the names the app uses. */
const ACCOUNT_TYPES: Record<AdminAccountType, { label: string; tone: PillTone }> = {
  User: { label: 'Fan', tone: 'blue' },
  Organizer: { label: 'Organizer', tone: 'amber' },
  Vendor: { label: 'Vendor', tone: 'green' },
  Admin: { label: 'Admin', tone: 'red' },
}

const ROLE_FILTERS: { value: AdminAccountType | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'User', label: 'Fans' },
  { value: 'Organizer', label: 'Organizers' },
  { value: 'Vendor', label: 'Vendors' },
  { value: 'Admin', label: 'Admins' },
]

/**
 * What else goes when the backend deletes an account, from the database's
 * cascade rules. It's more than the endpoint's docs say, so the dialog spells it out.
 */
const DELETE_CONSEQUENCES: Partial<Record<AdminAccountType, string>> = {
  User: 'Their tickets are deleted too. Their orders stay, but without a buyer.',
  Organizer: 'Every event they created is deleted too, with its guest lists.',
  Vendor: 'Their slots, applications and secured events are deleted too.',
}

type PendingAction ={ kind: 'suspend' | 'delete'; user: AdminUser }

export default function AdminUsersPage() {
  const list = useListParams<AdminAccountType>('role')
  const { data, isLoading, isFetching, isError } = useAdminUsers({
    pageNumber: list.pageNumber,
    pageSize: list.pageSize,
    searchQuery: list.searchQuery,
    role: list.filter || undefined,
  })
  const setSuspension = useSetUserSuspension()
  const deleteUser = useDeleteUser()
  const [pending, setPending] = useState<PendingAction | null>(null)

  const columns: Column<AdminUser>[] = [
    {
      header: 'Name',
      cell: (user) => <span className='whitespace-nowrap font-medium'>{fullName(user.firstName, user.lastName) || '—'}</span>,
    },
    { header: 'Email', cell: (user) => <span className='whitespace-nowrap text-white/80'>{user.email}</span> },
    { header: 'Phone', cell: (user) => user.phoneNumber || '—', className: 'whitespace-nowrap' },
    {
      header: 'Type',
      cell: (user) => {
        const type = ACCOUNT_TYPES[user.accountType] ?? { label: user.accountType, tone: 'gray' as const }
        return <StatusPill tone={type.tone}>{type.label}</StatusPill>
      },
    },
    {
      header: 'Status',
      cell: (user) =>
        user.active ? (
          <StatusPill tone='green'>Active</StatusPill>
        ) : (
          // Suspended, or never finished signing up: the API can't tell them apart.
          <span title='Suspended, or hasn’t finished signing up'>
            <StatusPill tone='red'>Inactive</StatusPill>
          </span>
        ),
    },
    { header: 'Joined', cell: (user) => formatDateTime(user.createdDate), className: 'whitespace-nowrap text-white/70' },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (user) =>
        // The backend refuses to delete admins, and suspending yourself would lock you out.
        user.accountType === 'Admin' ? (
          <span className='text-xs text-white/40'>—</span>
        ) : (
          <div className='flex justify-end gap-2'>
            <RowAction
              tone={user.active ? 'neutral' : 'success'}
              onClick={() => setPending({ kind: 'suspend', user })}>
              {user.active ? 'Suspend' : 'Reactivate'}
            </RowAction>
            <RowAction tone='danger' onClick={() => setPending({ kind: 'delete', user })}>
              Delete
            </RowAction>
          </div>
        ),
    },
  ]

  const closeDialog = () => setPending(null)
  const pendingName = pending ? fullName(pending.user.firstName, pending.user.lastName) || pending.user.email : ''

  return (
    <>
      <PageHeader title='Users' description='Every fan, organizer, vendor and admin account, newest first.'>
        <SearchBox value={list.searchText} onChange={list.setSearchText} placeholder='Search name, email or phone' />
      </PageHeader>

      <FilterTabs label='Account type' value={list.filter} options={ROLE_FILTERS} onChange={list.setFilter} />

      <DataTable
        columns={columns}
        page={data?.data}
        rowKey={(user) => user.userId}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        emptyMessage={list.searchQuery ? 'No users match that search.' : 'No users yet.'}
        onPageChange={list.setPage}
      />

      {pending?.kind === 'suspend' && (
        <ConfirmDialog
          open
          title={pending.user.active ? `Suspend ${pendingName}?` : `Reactivate ${pendingName}?`}
          description={
            pending.user.active ? (
              <p>They won&rsquo;t be able to log in until you reactivate the account.</p>
            ) : (
              <p>
                They&rsquo;ll be able to log in again. If they never finished signing up, this marks the account
                active too.
              </p>
            )
          }
          confirmLabel={pending.user.active ? 'Suspend' : 'Reactivate'}
          tone={pending.user.active ? 'danger' : 'neutral'}
          isPending={setSuspension.isPending}
          onClose={closeDialog}
          onConfirm={() =>
            setSuspension.mutate(
              { userId: pending.user.userId, isSuspended: pending.user.active },
              { onSettled: closeDialog },
            )
          }
        />
      )}

      {pending?.kind === 'delete' && (
        <ConfirmDialog
          open
          title={`Delete ${pendingName}?`}
          description={
            <>
              <p>
                This permanently removes <span className='break-all text-white'>{pending.user.email}</span>, with
                their wallet and watchlist. It can&rsquo;t be undone.
              </p>
              <p className='text-white'>{DELETE_CONSEQUENCES[pending.user.accountType] ?? DELETE_CONSEQUENCES.User}</p>
              <p className='text-white/50'>
                If they&rsquo;ve invited crew, checked in guests or scanned tickets, those records have to stay, so the
                account is deactivated instead, and you&rsquo;ll be told.
              </p>
            </>
          }
          confirmLabel='Delete user'
          isPending={deleteUser.isPending}
          onClose={closeDialog}
          onConfirm={() => deleteUser.mutate(pending.user.userId, { onSettled: closeDialog })}
        />
      )}
    </>
  )
}
