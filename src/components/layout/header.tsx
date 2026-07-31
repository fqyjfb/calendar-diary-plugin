import { useTranslation } from "react-i18next";
import { Calendar } from "lucide-react";

import { ToggleTheme } from "@/components/layout/change-theme";
import { SettingsDialog } from "@/calendar/components/dialogs/settings-dialog";

export function Header() {
  const { t } = useTranslation("calendar");

  return (
    <header className="mx-auto flex h-[88px] w-full max-w-screen-2xl items-center justify-center">
      <div className="my-3 flex h-14 w-full items-center justify-between px-8">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 items-center justify-center rounded-full border p-3">
            <Calendar className="size-6 text-foreground" />
          </div>

          <div className="space-y-1">
            <p className="text-lg font-medium leading-6">{t("header.title")}</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <SettingsDialog />
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
}