import { parseISO } from "date-fns";
import { Calendar, Clock, Pencil, Trash2, Text, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getDateLocale } from "@/lib/date-locale";
import { formatDate } from "@/lib/date-formats";
import { useDeleteEvent } from "@/hooks/use-events";
import { useEventTypes } from "@/hooks/use-event-types";

import { Button } from "@/components/ui/button";
import { EditEventDialog } from "@/calendar/components/dialogs/edit-event-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import type { IEvent } from "@/calendar/interfaces";

interface IProps {
  event: IEvent;
  children: React.ReactNode;
}

export function EventDetailsDialog({ event, children }: IProps) {
  const { t, i18n } = useTranslation('calendar');
  const locale = getDateLocale(i18n.language);
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  const deleteMutation = useDeleteEvent();
  const { getLabel } = useEventTypes();

  const handleDelete = () => {
    deleteMutation.mutate(event.id);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
            <DialogDescription>{t("events.viewEventDetails")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Tag className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">{t("events.type")}</p>
                <p className="text-sm text-muted-foreground">{getLabel(event.type)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">{t("events.startDate")}</p>
                <p className="text-sm text-muted-foreground">{formatDate(startDate, "dateTimeWithTime", i18n.language, locale)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">{t("events.endDate")}</p>
                <p className="text-sm text-muted-foreground">{formatDate(endDate, "dateTimeWithTime", i18n.language, locale)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Text className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">{t("events.description")}</p>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" size="sm" disabled={deleteMutation.isPending}>
                  <Trash2 className="size-4" />
                  {t("events.deleteEvent")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("events.deleteEvent")}</AlertDialogTitle>
                  <AlertDialogDescription>{t("events.deleteConfirm")}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending}>
                    {deleteMutation.isPending ? t("common.deleting") : t("common.confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <EditEventDialog event={event}>
              <Button type="button" variant="outline" size="sm">
                <Pencil className="size-4" />
                {t("common.edit")}
              </Button>
            </EditEventDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}