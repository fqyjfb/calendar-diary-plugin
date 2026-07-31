import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useEventTypeStore } from "@/stores/event-types-store";

const DEFAULT_TYPES = ["work", "study", "life", "other"];

export interface EventTypeOption {
  value: string;
  label: string;
}

export function useEventTypes() {
  const { t } = useTranslation('calendar');
  const { customTypes, loaded, loadTypes, addType, renameType, removeType } = useEventTypeStore();

  useEffect(() => {
    if (!loaded) {
      loadTypes();
    }
  }, [loaded, loadTypes]);

  const allTypes = [...DEFAULT_TYPES, ...customTypes];

  const getLabel = useCallback((type: string) => {
    const translationKey = `eventTypes.${type}`;
    const translated = t(translationKey);
    return translated === translationKey ? type : translated;
  }, [t]);

  const options: EventTypeOption[] = allTypes.map((type) => ({
    value: type,
    label: getLabel(type),
  }));

  return { options, addType, renameType, removeType, getLabel, allTypes, isLoaded: loaded };
}