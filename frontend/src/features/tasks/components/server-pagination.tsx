import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useTasks } from '../context/tasks-context'

export function ServerPagination() {
  const { pagination, tasks } = useTasks()
  const { page, limit, hasNextPage, hasPreviousPage, nextPage, previousPage } = pagination

  return (
    <div className='flex items-center justify-between px-2'>
      <div className='text-muted-foreground flex-1 text-sm'>
        Page {page + 1} • {tasks.length} tasks shown
      </div>
      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          className='h-8 w-8 p-0'
          onClick={previousPage}
          disabled={!hasPreviousPage}
        >
          <span className='sr-only'>Go to previous page</span>
          <ChevronLeftIcon className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='h-8 w-8 p-0'
          onClick={nextPage}
          disabled={!hasNextPage}
        >
          <span className='sr-only'>Go to next page</span>
          <ChevronRightIcon className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}