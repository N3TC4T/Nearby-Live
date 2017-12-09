/**
 * App Theme - Colors
 */

const app = {
    background: '#FFFFFF',
    streamBackground: '#E9EBEE',
    cardBackground: '#FFFFFF',
    listItemBackground: '#FFFFFF'
};

const brand = {
    brand: {
        primary: '#232F3A',
        secondary: '#818F92'
    }
};

const text = {
    textPrimary: '#222222',
    textSecondary: '#535353',
    textCard: '#222222',
    headingPrimary: brand.brand.primary,
    headingSecondary: brand.brand.primary
};

const borders = {
    border: '#dedfe3'
};

const tabbar = {
    tabbar: {
        background: '#232F3A',
        iconDefault: '#818F92',
        iconSelected: '#FFFFFF',
        iconNew: '#008DCB'
    },
    tabbarTop: {
        background: '#232F3A',
        indicator: '#CB0000',
        icon: '#D0E1F9'
    }
};

const segment = {
    segmentButton: {
        selectedTextColor: '#364150',
        textColor: '#364150',
        background: '#FCFCFA',
        selectedBackground: '#dedfe3',
        borderColor: '#b3c1c4'
    }
};

export default {
    ...app,
    ...brand,
    ...text,
    ...borders,
    ...tabbar,
    ...segment
};
