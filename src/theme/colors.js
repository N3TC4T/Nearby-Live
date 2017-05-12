/**
 * App Theme - Colors
 */

const app = {
    background: '#16253D',
    cardBackground: '#FFFFFF',
    listItemBackground: '#FFFFFF',
};

const brand = {
    brand: {
        primary: '#283655',
        secondary: '#4D648D',
    },
};

const text = {
    textPrimary: '#f1f1f1',
    textSecondary: '#777777',
    textCard:'#222222',
    headingPrimary: brand.brand.primary,
    headingSecondary: brand.brand.primary,
};

const borders = {
    border: '#dedfe3',
};

const tabbar = {
    tabbar: {
        background: '#283655',
        iconDefault: '#D0E1F9',
        iconSelected: '#fff',
    },
    tabbarTop:{
        background: '#283655',
        indicator: '#D8412F',
        icon: '#D0E1F9',
    }
};

export default {
    ...app,
    ...brand,
    ...text,
    ...borders,
    ...tabbar,
};
