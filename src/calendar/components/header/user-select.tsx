import { useTranslation } from "react-i18next";

import { useCalendarType } from "@/stores/calendar-store";
import { useEventTypes } from "@/hooks/use-event-types";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TypeSelect() {
  const { selectedType, setSelectedType } = useCalendarType();
  const { options: eventTypeOptions } = useEventTypes();
  const { t } = useTranslation('calendar');

  return (
    <Select value={selectedType} onValueChange={(value) => setSelectedType(value as typeof selectedType)}>
      <SelectTrigger className="flex-1 md:w-48">
        <SelectValue />
      </SelectTrigger>

      <SelectContent align="end">
        <SelectItem value="all">
          {t("typeSelect.all")}
        </SelectItem>

        {eventTypeOptions.map(type => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}