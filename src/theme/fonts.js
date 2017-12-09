/**
 * App Theme - Fonts
 */
import {Platform} from 'react-native';

import Sizes from './sizes';

const guidelineBaseWidth = 350;

const scale = size => Sizes.screen.width / guidelineBaseWidth * size;

const base = {
    size: scale(18),
    lineHeight: 18,
    ...Platform.select({
        ios: {
            family: 'Roboto-Regular',
            familyLight: 'Roboto-Light',
            familyBold: 'Roboto-Medium'
        },
        android: {
            family: 'Roboto-Regular',
            familyLight: 'Roboto-Light',
            familyBold: 'Roboto-Medium'
        }
    })
};

export default {
    base: {...base},
    subtext: {size: scale(13), family: base.familyLight},
    p: {...base, size: scale(15), family: base.familyLight},
    h1: {...base, size: scale(26), family: base.familyBold},
    h2: {...base, size: scale(24), family: base.familyBold},
    h3: {...base, size: scale(20), family: base.familyBold},
    h4: {...base, size: scale(18), family: base.familyBold},
    h5: {...base, size: scale(15), family: base.familyBold}
};
