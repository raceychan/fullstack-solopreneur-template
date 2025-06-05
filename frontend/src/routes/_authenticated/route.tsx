import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { getToken } from '@/context/auth-context' // utility function

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const token = getToken();
    if (!token) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.href },
      });
    }
  },
  component: AuthenticatedLayout,
})
