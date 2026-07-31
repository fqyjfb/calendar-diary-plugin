import { useState } from "react";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useCalendarPreferences } from "@/stores/calendar-store";

import { Button } from "@/components/ui/button";
import { TimeInput } from "@/components/ui/time-input";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

import type { TimeValue } from "@/components/ui/time-input";

export function ChangeVisibleHoursInput() {
  const { t } = useTranslation('calendar');
  const { visibleHours, setVisibleHours } = useCalendarPreferences();

  const [from, setFrom] = useState<TimeValue>({ hour: visibleHours.from, minute: 0 });
  const [to, setTo] = useState<TimeValue>({ hour: visibleHours.to, minute: 0 });

  const handleFromChange = (value: TimeValue | null) => {
    if (value) setFrom(value);
  };

  const handleToChange = (value: TimeValue | null) => {
    if (value) setTo(value);
  };

  const handleApply = () => {
    const toHour = to.hour === 0 ? 24 : to.hour;
    setVisibleHours({ from: from.hour, to: toHour });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold">{t("settings.visibleHours")}</p>

        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <Info className="size-3" />
            </TooltipTrigger>

            <TooltipContent className="max-w-80 text-center">
              <p>{t("settings.visibleHoursTooltip")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-4">
        <p>{t("common.from")}</p>
        <TimeInput id="start-time" hourCycle={12} value={from} onChange={handleFromChange} aria-label={t("settings.startTimeLabel")} />
        <p>{t("common.to")}</p>
        <TimeInput id="end-time" hourCycle={12} value={to} onChange={handleToChange} aria-label={t("settings.endTimeLabel")} />
      </div>

      <Button className="mt-4 w-fit" onClick={handleApply}>
        {t("common.apply")}
      </Button>
    </div>
  );
}