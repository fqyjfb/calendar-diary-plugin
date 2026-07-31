import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Settings2 } from "lucide-react";

import { useDisclosure } from "@/hooks/use-disclosure";
import { useEventTypes } from "@/hooks/use-event-types";
import { useCreateEvent } from "@/hooks/use-events";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TimeInput } from "@/components/ui/time-input";
import { SingleDayPicker } from "@/components/ui/single-day-picker";
import { Form, FormField, FormLabel, FormItem, FormControl } from "@/components/ui/form";
import { FormMessageTranslated } from "@/calendar/components/form-message-translated";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogHeader, DialogClose, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { TypeManagerDialog } from "@/calendar/components/dialogs/type-manager-dialog";

import { eventSchema } from "@/calendar/schemas";

import type { TimeValue } from "react-aria-components";
import type { TEventFormData } from "@/calendar/schemas";
import type { SubmitHandler } from "react-hook-form";

interface IProps {
  children: React.ReactNode;
  startDate?: Date;
  startTime?: { hour: number; minute: number };
}

export function AddEventDialog({ children, startDate, startTime }: IProps) {
  const { t } = useTranslation('calendar');
  const { options: eventTypeOptions } = useEventTypes();
  const { isOpen, onClose, onToggle } = useDisclosure();
  const createEventMutation = useCreateEvent();

  const form = useForm<TEventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      type: undefined,
      color: undefined,
      startDate: startDate || new Date(),
      endDate: startDate || new Date(),
      startTime: startTime || { hour: 9, minute: 0 },
      endTime: startTime ? { hour: startTime.hour + 1, minute: startTime.minute } : { hour: 10, minute: 0 },
    },
  });

  const onSubmit: SubmitHandler<TEventFormData> = async (values: TEventFormData) => {
    try {
      const eventData = {
        title: values.title,
        description: values.description,
        startDate: values.startDate!.toISOString(),
        endDate: values.endDate!.toISOString(),
        color: values.color!,
        type: values.type,
      };

      await createEventMutation.mutateAsync(eventData);
      onClose();
      form.reset();
    } catch (_error) {
      // Error is handled by the mutation hook
    }
  };

  useEffect(() => {
    form.reset({
      title: "",
      description: "",
      type: undefined,
      color: undefined,
      startDate: startDate || new Date(),
      endDate: startDate || new Date(),
      startTime: startTime || { hour: 9, minute: 0 },
      endTime: startTime ? { hour: startTime.hour + 1, minute: startTime.minute } : { hour: 10, minute: 0 },
    });
  }, [startDate, startTime, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("events.addEvent")}</DialogTitle>
          <DialogDescription>
            {t("events.dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="event-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("events.type")}</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Select value={field.value ?? ""} onValueChange={field.onChange}>
                        <SelectTrigger className="flex-1" data-invalid={fieldState.invalid}>
                          <SelectValue placeholder={t("typeSelect.selectOption")} />
                        </SelectTrigger>

                        <SelectContent>
                          {eventTypeOptions.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <TypeManagerDialog
                        onTypeChange={(types) => {
                          if (field.value && !types.includes(field.value)) {
                            field.onChange("");
                          }
                        }}
                      >
                        <Button type="button" variant="outline" size="icon">
                          <Settings2 className="size-4" />
                        </Button>
                      </TypeManagerDialog>
                    </div>
                  </FormControl>
                  <FormMessageTranslated />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="title">{t("events.title")}</FormLabel>

                  <FormControl>
                    <Input id="title" placeholder={t("events.title")} data-invalid={fieldState.invalid} {...field} />
                  </FormControl>

                  <FormMessageTranslated />
                </FormItem>
              )}
            />

            <div className="flex items-start gap-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel htmlFor="startDate">{t("events.startDate")}</FormLabel>

                    <FormControl>
                      <SingleDayPicker
                        id="startDate"
                        value={field.value}
                        onSelect={date => field.onChange(date as Date)}
                        placeholder={t("events.startDate")}
                        data-invalid={fieldState.invalid}
                      />
                    </FormControl>

                    <FormMessageTranslated />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("events.startTime")}</FormLabel>

                    <FormControl>
                      <TimeInput value={field.value as TimeValue} onChange={field.onChange} hourCycle={12} data-invalid={fieldState.invalid} />
                    </FormControl>

                    <FormMessageTranslated />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-start gap-2">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("events.endDate")}</FormLabel>
                    <FormControl>
                      <SingleDayPicker
                        value={field.value}
                        onSelect={date => field.onChange(date as Date)}
                        placeholder={t("events.endDate")}
                        data-invalid={fieldState.invalid}
                      />
                    </FormControl>
                    <FormMessageTranslated />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("events.endTime")}</FormLabel>

                    <FormControl>
                      <TimeInput value={field.value as TimeValue} onChange={field.onChange} hourCycle={12} data-invalid={fieldState.invalid} />
                    </FormControl>

                    <FormMessageTranslated />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="color"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("events.color")}</FormLabel>
                  <FormControl>
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger data-invalid={fieldState.invalid}>
                        <SelectValue placeholder={t("typeSelect.selectOption")} />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="blue">
                          <div className="flex items-center gap-2">
                            <div className="size-3.5 rounded-full bg-blue-600" />
                            {t("colors.blue")}
                          </div>
                        </SelectItem>

                        <SelectItem value="green">
                          <div className="flex items-center gap-2">
                            <div className="size-3.5 rounded-full bg-green-600" />
                            {t("colors.green")}
                          </div>
                        </SelectItem>

                        <SelectItem value="red">
                          <div className="flex items-center gap-2">
                            <div className="size-3.5 rounded-full bg-red-600" />
                            {t("colors.red")}
                          </div>
                        </SelectItem>

                        <SelectItem value="yellow">
                          <div className="flex items-center gap-2">
                            <div className="size-3.5 rounded-full bg-yellow-600" />
                            {t("colors.yellow")}
                          </div>
                        </SelectItem>

                        <SelectItem value="purple">
                          <div className="flex items-center gap-2">
                            <div className="size-3.5 rounded-full bg-purple-600" />
                            {t("colors.purple")}
                          </div>
                        </SelectItem>

                        <SelectItem value="orange">
                          <div className="flex items-center gap-2">
                            <div className="size-3.5 rounded-full bg-orange-600" />
                            {t("colors.orange")}
                          </div>
                        </SelectItem>

                        <SelectItem value="gray">
                          <div className="flex items-center gap-2">
                            <div className="size-3.5 rounded-full bg-neutral-600" />
                            {t("colors.gray")}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessageTranslated />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("events.description")}</FormLabel>

                  <FormControl>
                    <Textarea {...field} value={field.value} placeholder={t("events.description")} data-invalid={fieldState.invalid} />
                  </FormControl>

                  <FormMessageTranslated />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t("common.cancel")}
            </Button>
          </DialogClose>

          <Button form="event-form" type="submit" disabled={createEventMutation.isPending}>
            {createEventMutation.isPending ? t("common.creating") : t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}