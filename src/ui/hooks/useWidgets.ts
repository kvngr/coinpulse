import React from "react";

import { type AddWidgetCommand } from "@application/ports/input/AddWidgetInputPort";
import { type MoveWidgetCommand } from "@application/ports/input/MoveWidgetInputPort";
import { AddWidgetUseCase } from "@application/use-cases/widget/AddWidgetUseCase";
import { MoveWidgetUseCase } from "@application/use-cases/widget/MoveWidgetUseCase";
import { RemoveWidgetUseCase } from "@application/use-cases/widget/RemoveWidgetUseCase";
import { type Widget } from "@domain/entities/Widget";
import { type Result } from "@shared/utils/result";
import { useWidgetStore, widgetStore } from "@ui/stores/widgetStore";

// Initialize use cases
const addWidgetUseCase = new AddWidgetUseCase(widgetStore);
const removeWidgetUseCase = new RemoveWidgetUseCase(widgetStore);
const moveWidgetUseCase = new MoveWidgetUseCase(widgetStore);

/**
 * Hook to manage widgets
 */
export const useWidgets = () => {
  const widgets = useWidgetStore((state) => state.widgets);

  const addWidget = React.useCallback(
    async (command: AddWidgetCommand): Promise<Result<Widget, Error>> => {
      return await addWidgetUseCase.execute(command);
    },
    [],
  );

  const removeWidget = React.useCallback(
    async (widgetId: string): Promise<Result<void, Error>> => {
      return await removeWidgetUseCase.execute(widgetId);
    },
    [],
  );

  const moveWidget = React.useCallback(
    async (command: MoveWidgetCommand): Promise<Result<Widget, Error>> => {
      return await moveWidgetUseCase.execute(command);
    },
    [],
  );

  const clearWidgets = React.useCallback(() => {
    widgetStore.clear();
  }, []);

  return {
    widgets,
    addWidget,
    removeWidget,
    moveWidget,
    clearWidgets,
  };
};
