import { component, event } from './component.js';
import { Autocomplete } from './autocomplete.js';

import { trigger } from './dom.js';

type SearchEvent = CustomEvent<string>;

/**
 * Emits a cancellable `search` event when a search is requested, passing the
 * current term in `event.detail`.
 *
 * Behavioral edge cases:
 * - The component does not wait for async results; consumers must update the
 *   option list in response to the event.
 *
 * @title Dynamic autocomplete
 * @icon search
 * @role listbox
 * @see Autocomplete
 * @alpha
 *
 **/
export class AutocompleteDynamic extends Autocomplete {
	onsearch?: (ev: SearchEvent) => void;

	protected doSearch(term: string) {
		trigger(this as AutocompleteDynamic, 'search', { detail: term });
		return this.options[0];
	}
}

component<AutocompleteDynamic>(AutocompleteDynamic, {
	tagName: 'c-autocomplete-dynamic',
	init: [event('search')],
});
