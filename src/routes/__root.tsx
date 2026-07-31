import { useEffect } from 'react'
import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import "@/styles/globals.css"

import { QueryProvider } from '@/components/query-provider'
import { ErrorBoundary } from '@/components/error-boundary'
import { Header } from '@/components/layout/header'
import { CustomDragLayer } from '@/calendar/components/dnd/custom-drag-layer'

import { inter } from "@/styles/fonts"
import { cn } from "@/lib/utils"

import { useThemeStore } from '@/stores/theme-store'

function RootComponent() {
  const { theme, applyTheme } = useThemeStore()

  useEffect(() => {
    applyTheme(theme)
  }, [theme, applyTheme])

  return (
    <QueryProvider>
      <ErrorBoundary>
        <DndProvider backend={HTML5Backend}>
          <div className={cn(inter.variable, "min-h-screen bg-background text-foreground")}>
            <Header />
            <main>
              <Outlet />
            </main>
          </div>
          <CustomDragLayer />
        </DndProvider>
      </ErrorBoundary>
    </QueryProvider>
  )
}

function RootErrorComponent({ error }: { error: Error }) {
  const { t } = useTranslation('calendar')
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-600">{t("errors.somethingWentWrong")}</h1>
        <p className="mb-4 text-muted-foreground">{error.message}</p>
        <button
          onClick={() => navigate({ to: '/calendar/month' })}
          className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          {t("common.back")}
        </button>
      </div>
    </div>
  )
}

function NotFoundComponent() {
  const { t } = useTranslation('calendar')
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">{t("notFound.title")}</h1>
        <p className="mb-4 text-muted-foreground">{t("notFound.description")}</p>
        <button
          onClick={() => navigate({ to: '/calendar/month' })}
          className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          {t("notFound.goHome")}
        </button>
      </div>
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: RootErrorComponent,
  notFoundComponent: NotFoundComponent,
})
