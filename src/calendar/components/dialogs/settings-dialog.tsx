import { useTranslation } from "react-i18next";
import { Settings } from "lucide-react";

import { useDisclosure } from "@/hooks/use-disclosure";

import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { ChangeBadgeVariantInput } from "@/calendar/components/change-badge-variant-input";
import { ChangeVisibleHoursInput } from "@/calendar/components/change-visible-hours-input";
import { ChangeWorkingHoursInput } from "@/calendar/components/change-working-hours-input";

export function SettingsDialog() {
  const { t } = useTranslation("calendar");
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("calendarSettings")}</DialogTitle>
          <DialogDescription>{t("settings.dialogDescription")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <ChangeBadgeVariantInput />
          <ChangeVisibleHoursInput />
          <ChangeWorkingHoursInput />
        </div>
      </DialogContent>
    </Dialog>
  );
}