// Query keys for crew queries
export const crewKeys = {
  all: ['crew'] as const,
  invite: (inviteCode: string) => [...crewKeys.all, 'invite', inviteCode] as const,
}
