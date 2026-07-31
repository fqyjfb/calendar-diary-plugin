import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Import existing types and API functions
import type { IEvent } from '@/calendar/interfaces'
import { getEvents, createEvent, updateEvent, deleteEvent } from '@/calendar/requests'

// Query keys factory for better organization and type safety
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown> = {}) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: number) => [...eventKeys.details(), id] as const,
}

// Query hooks with enhanced error handling and caching
export const useEvents = (filters: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: getEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors, but not for 4xx errors
      if (failureCount >= 3) return false;
      if (error instanceof Error && error.message.includes('4')) return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}

export const useEvent = (id: number) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => getEvents().then(events => events.find(event => event.id === id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  })
}
// Mutation hooks with optimistic updates and error handling
export const useCreateEvent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createEvent,
    onMutate: async (newEvent) => {
      await queryClient.cancelQueries({ queryKey: eventKeys.all })

      const previousLists = queryClient.getQueriesData<IEvent[]>({ queryKey: eventKeys.lists() })

      const optimisticEvent: IEvent = {
        ...(newEvent as Omit<IEvent, 'id'>),
        id: Date.now(),
      }

      queryClient.setQueriesData<IEvent[]>({ queryKey: eventKeys.lists() }, (old) => {
        if (!old) return [optimisticEvent]
        return [...old, optimisticEvent]
      })

      return { previousLists, optimisticEvent }
    },
    onSuccess: (createdEvent, _variables, context) => {
      queryClient.setQueriesData<IEvent[]>({ queryKey: eventKeys.lists() }, (old) => {
        if (!old) return [createdEvent]
        const filtered = context?.optimisticEvent
          ? old.filter(e => e.id !== context.optimisticEvent.id)
          : old
        return [...filtered, createdEvent]
      })
    },
    onError: (_error, _newEvent, context) => {
      if (context?.previousLists) {
        for (const [key, data] of context.previousLists) {
          queryClient.setQueryData(key, data)
        }
      }
    },
  })
}

export const useUpdateEvent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateEvent,
    onMutate: async (updatedEvent) => {
      await queryClient.cancelQueries({ queryKey: eventKeys.all })
      await queryClient.cancelQueries({ queryKey: eventKeys.detail(updatedEvent.id) })

      const previousLists = queryClient.getQueriesData<IEvent[]>({ queryKey: eventKeys.lists() })
      const previousDetail = queryClient.getQueryData<IEvent | undefined>(eventKeys.detail(updatedEvent.id))

      queryClient.setQueriesData<IEvent[]>({ queryKey: eventKeys.lists() }, (old) => {
        if (!old) return old
        return old.map(event => (event.id === updatedEvent.id ? updatedEvent : event))
      })

      queryClient.setQueryData(eventKeys.detail(updatedEvent.id), updatedEvent)

      return { previousLists, previousDetail }
    },
    onSuccess: (updatedEvent) => {
      queryClient.setQueryData(eventKeys.detail(updatedEvent.id), updatedEvent)
    },
    onError: (_error, updatedEvent, context) => {
      if (context?.previousLists) {
        for (const [key, data] of context.previousLists) {
          queryClient.setQueryData(key, data)
        }
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(eventKeys.detail(updatedEvent.id), context.previousDetail)
      }
    },
  })
}

export const useDeleteEvent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteEvent,
    onMutate: async (eventId) => {
      await queryClient.cancelQueries({ queryKey: eventKeys.all })

      const previousLists = queryClient.getQueriesData<IEvent[]>({ queryKey: eventKeys.lists() })

      if (previousLists.length > 0) {
        queryClient.setQueriesData<IEvent[]>({ queryKey: eventKeys.lists() }, (old) =>
          old ? old.filter(event => event.id !== eventId) : []
        )
      }

      return { previousLists }
    },
    onSuccess: (_, deletedEventId) => {
      queryClient.removeQueries({ queryKey: eventKeys.detail(deletedEventId) })
    },
    onError: (_error, _deletedEventId, context) => {
      if (context?.previousLists) {
        for (const [key, data] of context.previousLists) {
          queryClient.setQueryData(key, data)
        }
      }
    },
  })
}

// Utility hook for bulk operations
export const useBulkUpdateEvents = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (events: IEvent[]) => {
      // Process multiple updates in parallel
      const updatePromises = events.map(event => updateEvent(event))
      return Promise.all(updatePromises)
    },
    onSuccess: () => {
      // Invalidate all event-related queries after bulk update
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
    },
    onError: (_error) => {
      // Error is handled by the UI layer
      // Invalidate to ensure data consistency after failed bulk operation
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
    },
  })
}