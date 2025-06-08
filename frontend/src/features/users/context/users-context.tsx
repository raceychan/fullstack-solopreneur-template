import React, { useState, useEffect, useCallback } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { User } from '../data/schema'
import { getProfilesApiV1ProfilesGet } from '@/client/sdk.gen'
import { UserProfileDto } from '@/client/types.gen'

type UsersDialogType = 'invite' | 'add' | 'edit' | 'delete'

interface UsersContextType {
  open: UsersDialogType | null
  setOpen: (str: UsersDialogType | null) => void
  currentRow: User | null
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>
  users: User[]
  loading: boolean
  error: string | null
  fetchUsers: () => Promise<void>
}

const UsersContext = React.createContext<UsersContextType | null>(null)

interface Props {
  children: React.ReactNode
}

function mapProfileToUser(profile: UserProfileDto): User {
  return {
    id: profile.id,
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    username: profile.username || '',
    email: profile.email,
    phoneNumber: profile.phone_number || '',
    status: profile.status,
    role: profile.role,
    createdAt: new Date(profile.gmt_created),
    updatedAt: new Date(profile.gmt_modified),
  }
}

export default function UsersProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getProfilesApiV1ProfilesGet()
      if (response.data && Array.isArray(response.data)) {
        const mappedUsers = response.data.map(mapProfileToUser)
        setUsers(mappedUsers)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <UsersContext value={{ 
      open, 
      setOpen, 
      currentRow, 
      setCurrentRow, 
      users, 
      loading, 
      error, 
      fetchUsers 
    }}>
      {children}
    </UsersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = React.useContext(UsersContext)

  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersContext>')
  }

  return usersContext
}
