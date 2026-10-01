import {
	Component,
	Slot,
	component,
	styleAttribute,
	create,
} from './component.js';
import { colorAttribute, css, font, type SurfaceColorValue } from './theme.js';

declare module './component.js' {
	interface Components {
		'c-badge': Badge;
	}
}

/**
 * Displays a notification dot or count over content in the default slot.
 * Use the named `badge` slot for a count or label. The indicator follows
 * the content's direction and moves to the left in RTL layouts.
 * Provide a meaningful accessible label when a dot conveys status.
 *
 * @tagName c-badge
 * @title Status & Notification Indicator
 * @icon notifications
 * @see Icon
 * @example
 * <div style="display:flex;gap:32px;padding:16px">
 * <c-badge>
 *   <c-icon name="notifications" alt="Notifications"></c-icon>
 *   <span slot="badge">999+</span>
 * </c-badge>
 * <c-badge size="small" aria-label="Unread notifications">
 *   <c-icon name="notifications"></c-icon>
 * </c-badge>
 * </div>
 * @example <caption>RTL Support</caption>
 * <div dir="rtl" style="display:flex;gap:32px;padding:16px">
 * <c-badge>
 *   <c-icon name="notifications" alt="Notifications"></c-icon>
 *   <span slot="badge">999+</span>
 * </c-badge>
 * <c-badge size="small" aria-label="Unread notifications">
 *   <c-icon name="notifications"></c-icon>
 * </c-badge>
 * </div>
 */
export class Badge extends Component {
	/**
	 * A small badge displays a notification dot. A large badge (default)
	 * displays the label supplied through the named `badge` slot.
	 *
	 * @attribute
	 * @demo
	 * <div style="display:flex;gap:32px;padding:16px">
	 * <c-badge size="small" aria-label="Unread messages"><c-icon name="notifications"></c-icon></c-badge>
	 * <c-badge size="large"><c-icon name="notifications" alt="Messages"></c-icon><span slot="badge">10</span></c-badge>
	 * </div>
	 */
	size?: 'small' | 'large';

	/**
	 * Sets the indicator's theme background and foreground colors.
	 * Defaults to the error color.
	 *
	 * @attribute
	 * @demo
	 * <div style="display:flex;gap:32px;padding:16px">
	 * <c-badge color="success"><c-icon name="notifications" alt="Status"></c-icon><span slot="badge">ON</span></c-badge>
	 * <c-badge color="primary-container"><c-icon name="notifications" alt="Updates"></c-icon><span slot="badge">3</span></c-badge>
	 * </div>
	 */
	color?: SurfaceColorValue;
}

component(Badge, {
	tagName: 'c-badge',
	init: [colorAttribute('color', 'error', '.badge'), styleAttribute('size')],
	augment: [
		css(`
			:host {
				box-sizing: border-box;
				display: inline-block;
				position: relative;
			}
			.badge {
				display: inline-block;
				text-align: center;
				position: absolute;
				${font('label-small')}
				padding: 0 4px 0 4px;
				margin-inline-start: -12px;
				min-width: 16px;
				height: 16px;
				border-radius: 16px;
				line-height: 16px;
				top: -2px;
				inset-inline-start: 100%;
			}
			:host([size="small"]) .badge {
				padding: 0;
				line-height: 0;
				min-width: 6px;
				height: 6px;
				top: 0;
				margin-inline-start: -6px;
			}
		`),
		Slot,
		() =>
			create(
				'span',
				{ className: 'badge' },
				create('slot', { name: 'badge' }),
			),
	],
});
