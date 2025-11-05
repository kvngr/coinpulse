import { type Widget } from "@domain/entities/Widget";

/**
 * Output Port - Widget Store Interface
 * Defines contract for widget persistence
 */
export interface WidgetStoreOutputPort {
  /**
   * Get all widgets
   */
  getAll(): Widget[];

  /**
   * Get widget by ID
   */
  getById(id: string): Widget | null;

  /**
   * Add a new widget
   */
  add(widget: Widget): void;

  /**
   * Update existing widget
   */
  update(widget: Widget): void;

  /**
   * Remove widget
   */
  remove(id: string): void;

  /**
   * Clear all widgets
   */
  clear(): void;

  /**
   * Subscribe to widget changes
   */
  subscribe(callback: (widgets: Widget[]) => void): () => void;
}
