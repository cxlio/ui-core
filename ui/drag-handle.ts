import { styleAttribute, component, Component, Slot } from './component.js';
import { DragDropEvent, dragEffects } from './drag.js';
import { css } from './theme.js';
import { getTarget } from './util.js';

/**
 * Draggable handle element that captures pointer gestures and moves a specified
 * target element. Applies attributes for drag state that can be used to
 * style active, hovered, or dragging-over states.
 *
 * You can pass a CSS selector string or an HTMLElement via the `target` prop
 * to control which element moves. By default the host itself moves.
 *
 * @tagName c-drag-handle
 * @title Draggable Handle Component
 * @icon drag_handle
 * @alpha
 */
export class DragHandle extends Component {
	/**
	 * Reflects whether this handle is currently in an active drag operation.
	 * When true, the `dragging` attribute is present on the host for styling.
	 */
	readonly dragging = false;

	/**
	 * Reflects whether another draggable handle is dragged over this one.
	 * When true, the `dragover` attribute is present on the host for styling.
	 */
	readonly dragover = false;

	/**
	 * CSS selector string or direct HTMLElement reference that will be moved
	 * when this handle is dragged. If omitted, the host element is used.
	 */
	target?: HTMLElement | string;

	static {
		component(DragHandle, {
			tagName: 'c-drag-handle',
			init: [styleAttribute('dragging'), styleAttribute('dragover')],
			augment: [
				Slot,
				css(`
:host { display: block; cursor:grab; position: relative; touch-action: none; }
:host([dragging]) { z-index: 10 }
		`),
				$ =>
					getTarget($, 'target').switchMap(moveTarget =>
						dragEffects({ target: $, moveTarget, delay: 150 }).tap(
							ev => $.handleDrag?.(ev),
						),
					),
			],
		});
	}

	// override in subclasses if needed
	protected handleDrag?(_ev: DragDropEvent): void;
}
