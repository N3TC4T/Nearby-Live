import moment from 'moment';

const DEPRECATION_MESSAGE = 'isSameUser and isSameDay should be imported from the utils module instead of using the props functions';

export function isSameDay(currentMessage = {}, diffMessage = {}) {
    const currentCreatedAt = moment(currentMessage.date);
    const diffCreatedAt = moment(diffMessage.date);

    if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
        return false;
    }

    return currentCreatedAt.isSame(diffCreatedAt, 'day');
}

export function isSameUser(currentMessage = {}, diffMessage = {}) {
    return !!(diffMessage.dir && currentMessage.dir && diffMessage.dir === currentMessage.dir);
}

export function warnDeprecated(fn) {
    return (...args) => {
        console.warn(DEPRECATION_MESSAGE);
        return fn(...args);
    };
}
