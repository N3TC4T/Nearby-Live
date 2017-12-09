import {AppConfig} from '@constants/';

const getImageURL = (imageID, lowSize) => {
    if (!imageID) {return `${AppConfig.urls.imageCDN}1/120`;}

    if (lowSize) {
        return `${AppConfig.urls.imageCDN + imageID}/120`;
    }
    return `${AppConfig.urls.imageCDN + imageID}/500`;
};

const getPitagorasZ = (x, y) => (
    Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
);

const backgroundValueCalculation = (x, y, BACKGROUND_VALUES) => (
    4 / 3 * BACKGROUND_VALUES.MAX - getPitagorasZ(x, y)
);

export {
    getImageURL,
    backgroundValueCalculation
};
