import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type PersistOptions,
  type StateStorage,
} from "zustand/middleware";

import { type WidgetStoreOutputPort } from "@application/ports/output/WidgetStoreOutputPort";
import {
  Widget,
  type WidgetConfig,
  type WidgetType,
} from "@domain/entities/Widget";
import { ContractAddress } from "@domain/value-objects/ContractAddress";
import { Position } from "@domain/value-objects/Position";
import { STORAGE_KEYS } from "@shared/constants";

type WidgetSnapshot = {
  id: string;
  type: WidgetType;
  contractAddress: string;
  position: { x: number; y: number };
  config: WidgetConfig;
};

type WidgetStoreState = {
  widgets: Widget[];
  getAll: () => Widget[];
  getById: (id: string) => Widget | null;
  add: (widget: Widget) => void;
  update: (widget: Widget) => void;
  remove: (id: string) => void;
  clear: () => void;
};

type WidgetStorePersist = { widgets: WidgetSnapshot[] };

function toSnapshot(widget: Widget): WidgetSnapshot {
  return {
    id: widget.id,
    type: widget.type,
    contractAddress: widget.contractAddress.value,
    position: widget.position.toJSON(),
    config: widget.config,
  };
}

function fromSnapshot(snapshot: WidgetSnapshot): Widget {
  return Widget.create(
    snapshot.id,
    snapshot.type,
    ContractAddress.create(snapshot.contractAddress),
    Position.create(snapshot.position.x, snapshot.position.y),
    snapshot.config,
  );
}

function isWidgetStorePersist(value: unknown): value is WidgetStorePersist {
  return (
    typeof value === "object" &&
    value !== null &&
    "widgets" in value &&
    Array.isArray(value.widgets)
  );
}

const safeStorage: StateStorage =
  typeof window === "undefined"
    ? {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      }
    : {
        getItem: (name) => localStorage.getItem(name),
        setItem: (name, value) => localStorage.setItem(name, value),
        removeItem: (name) => localStorage.removeItem(name),
      };

const persistOptions: PersistOptions<WidgetStoreState, WidgetStorePersist> = {
  name: STORAGE_KEYS.WIDGETS,
  version: 1,
  storage: createJSONStorage(() => safeStorage),

  partialize: (state) => ({
    widgets: state.widgets.map(toSnapshot),
  }),

  merge: (persisted, current) => {
    if (isWidgetStorePersist(persisted) === false) {
      return current;
    }

    return {
      ...current,
      widgets: persisted.widgets.map(fromSnapshot),
    };
  },
};

/**
 * Widget Store
 * Persists widgets to localStorage and manages widget state
 */
export const useWidgetStore = create<WidgetStoreState>()(
  persist(
    (set, get) => ({
      widgets: [],

      getAll: () => get().widgets,

      getById: (id: string) => {
        const widgets = get().widgets;
        return widgets.find((widget) => widget.id === id) ?? null;
      },

      add: (widget: Widget) => {
        set((state) => ({
          widgets: [...state.widgets, widget],
        }));
      },

      update: (widget: Widget) => {
        set((state) => ({
          widgets: state.widgets.map((currentWidget) =>
            currentWidget.id === widget.id ? widget : currentWidget,
          ),
        }));
      },

      remove: (id: string) => {
        set((state) => ({
          widgets: state.widgets.filter((widget) => widget.id !== id),
        }));
      },

      clear: () => {
        set({ widgets: [] });
      },
    }),
    persistOptions,
  ),
);

/**
 * Widget store instance for use cases (implements WidgetStoreOutputPort)
 */
export const widgetStore: WidgetStoreOutputPort = {
  getAll: () => useWidgetStore.getState().getAll(),
  getById: (id: string) => useWidgetStore.getState().getById(id),
  add: (widget: Widget) => useWidgetStore.getState().add(widget),
  update: (widget: Widget) => useWidgetStore.getState().update(widget),
  remove: (id: string) => useWidgetStore.getState().remove(id),
  clear: () => useWidgetStore.getState().clear(),
  subscribe: (callback: (widgets: Widget[]) => void) =>
    useWidgetStore.subscribe((state) => callback(state.widgets)),
};
