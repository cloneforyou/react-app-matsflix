import EventEmitter from 'event-emitter';

class SearchFocusEmitter extends EventEmitter {

}

export const EVENT_FOCUS = 'TEXT_SEARCH_FOCUS';
export const EVENT_BLUR = 'TEXT_SEARCH_BLUR';

export default new SearchFocusEmitter();