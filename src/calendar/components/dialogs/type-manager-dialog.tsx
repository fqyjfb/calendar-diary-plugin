import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import { useEventTypeStore } from "@/stores/event-types-store";
import { useEventTypes } from "@/hooks/use-event-types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface IProps {
  children?: React.ReactNode;
  onTypeChange?: (types: string[]) => void;
}

const DEFAULT_TYPES = ["work", "study", "life", "other"];

export function TypeManagerDialog({ children, onTypeChange }: IProps) {
  const { t } = useTranslation('calendar');
  const { options, addType, renameType, removeType } = useEventTypes();
  const [showAdd, setShowAdd] = useState(false);
  const [newTypeValue, setNewTypeValue] = useState("");
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = async () => {
    if (!newTypeValue.trim()) return;
    await addType(newTypeValue);
    setNewTypeValue("");
    setShowAdd(false);
    const { customTypes } = useEventTypeStore.getState();
    onTypeChange?.([...DEFAULT_TYPES, ...customTypes]);
  };

  const handleRename = async (oldType: string) => {
    if (!editValue.trim()) return;
    await renameType(oldType, editValue);
    setEditingType(null);
    setEditValue("");
    const { customTypes } = useEventTypeStore.getState();
    onTypeChange?.([...DEFAULT_TYPES, ...customTypes]);
  };

  const handleDelete = async (type: string) => {
    await removeType(type);
    const { customTypes } = useEventTypeStore.getState();
    onTypeChange?.([...DEFAULT_TYPES, ...customTypes]);
  };

  const customs = options
    .map((o) => o.value)
    .filter((v) => !DEFAULT_TYPES.includes(v));

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("typeManager.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{t("typeManager.defaultTypes")}</p>
            <div className="flex flex-wrap gap-2">
              {options
                .filter((o) => DEFAULT_TYPES.includes(o.value))
                .map((o) => (
                  <span
                    key={o.value}
                    className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium"
                  >
                    {o.label}
                  </span>
                ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{t("typeManager.customTypes")}</p>

            {customs.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("typeManager.noCustomTypes")}</p>
            ) : (
              <div className="space-y-2">
                {customs.map((type) => {
                  const option = options.find((o) => o.value === type);
                  const label = option?.label || type;
                  return (
                    <div
                      key={type}
                      className="flex items-center gap-2 rounded-md border px-3 py-2"
                    >
                      {editingType === type ? (
                        <>
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-8 flex-1"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleRename(type);
                              if (e.key === "Escape") setEditingType(null);
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleRename(type)}
                          >
                            {t("common.confirm")}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingType(null)}
                          >
                            <X className="size-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-sm">{label}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingType(type);
                              setEditValue(type);
                            }}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(type)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {showAdd ? (
              <div className="flex gap-2">
                <Input
                  placeholder={t("typeManager.placeholder")}
                  value={newTypeValue}
                  onChange={(e) => setNewTypeValue(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd();
                    if (e.key === "Escape") {
                      setShowAdd(false);
                      setNewTypeValue("");
                    }
                  }}
                />
                <Button type="button" onClick={handleAdd}>
                  {t("typeManager.add")}
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAdd(true)}
              >
                <Plus className="size-4" />
                {t("typeManager.addNewType")}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}