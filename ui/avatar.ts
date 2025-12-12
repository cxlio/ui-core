import {
	Component,
	component,
	attribute,
	get,
	getShadow,
} from './component.js';
import { combineLatest } from './rx.js';
import { Size, sizeAttribute, css, getIcon, font } from './theme.js';

declare module './component' {
	interface Components {
		'c-avatar': Avatar;
	}
}

export const avatarBaseStyles = css(`
:host {
	box-sizing: border-box;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 100%;
	overflow-y: hidden;
	vertical-align: middle;
	position: relative;
	${font('title-large')}
}
svg,img { width: 100%; height: 100%; }
`);

/**
 * The `c-avatar` component presents a user avatar as a circular element that can display an image,
 * text (such as initials), or a fallback icon. The component is typically used to visually represent
 * users or entities in interfaces such as user lists, comment threads, or profile menus.
 *
 * @tagName c-avatar
 * @title Avatar Component
 * @icon person
 * @example
 *   <c-avatar aria-label="user avatar"></c-avatar>
 *   <c-avatar aria-label="user avatar size 2" size="2"></c-avatar>
 *   <c-avatar aria-label="user avatar GB" text="GB"></c-avatar>
 */
export class Avatar extends Component {
	/**
	 * Controls the size of the avatar. The size applies to the width, height,
	 * and font size if text is displayed within the avatar.
	 *
	 * @attribute
	 */
	size?: Size;

	/**
	 * URL of an image to be displayed in the avatar's background.
	 * If not provided, `text` or a default icon will be used.
	 *
	 * @attribute
	 */
	src = '';

	/**
	 * Text to display inside the avatar if no image is provided.
	 * Typically used for initials.
	 *
	 * @attribute
	 */
	text = '';
}

component(Avatar, {
	tagName: 'c-avatar',
	init: [
		sizeAttribute(
			'size',
			size => `{
				width: ${30 + size * 8}px;
				height: ${30 + size * 8}px;
				font-size: ${18 + size * 4}px;
			}`,
		),
		attribute('src'),
		attribute('text'),
	],
	augment: [
		avatarBaseStyles,
		host => {
			let icon: Text | HTMLImageElement | SVGSVGElement | undefined;

			return combineLatest(get(host, 'src'), get(host, 'text')).raf(
				([src, text]) => {
					icon?.remove();
					if (src) {
						icon = new Image();
						icon.alt = host.text;
						icon.src = src;
					} else if (text) {
						icon = new Text(text);
					} else icon = getIcon('person');

					getShadow(host).append(icon);
				},
			);
		},
	],
});
