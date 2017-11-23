/**
 * Error Screen
 *
 <Error text={'Server is down'} />
 *
 */
import React  from 'react';
import PropTypes from 'prop-types';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

// Consts and Libs
import { AppStyles, AppColors, AppFonts } from '@theme/';

// Components
import { Spacer, Text } from '@ui/';


const styles = StyleSheet.create({
    buttonTry: {
        alignItems: 'center',
        justifyContent: 'center',
        padding:5,
        height: 30,
        borderColor: AppColors.brand.secondary,
        borderWidth:1.3,
        borderRadius:0.5,
    },
    buttonTryText: {
        color: AppColors.textSecondary,
        fontFamily: AppFonts.familyBold
    },
})

/* Component ==================================================================== */
const Error = ({ text, tryAgain }) => (
    <View style={[AppStyles.container, AppStyles.containerCentered]}>
        <Image
            style={{width:60, height:60}}
            source={{uri:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADH0lEQVRoge2Z7ZWiMBSGnxIoISXQwaSDtQPpQDqQDtYOpIOdDkwH2IF2MHYw++MmS8AwBAjqOetzTo4OZnLvm4+bmwBv3jyVHPjwSvZcd6azBS7Ad6CcEIF9MuAXsB8oH4Ba2e8OR+AGVAHDOfCJCCrsMwU0tELNQHG/X4DfhDsjGRUiwhnR1ugR2Hn1SuCLVmgZ6Vhu655pR1cv8niAL0QM9vMbGYEaEdh4dc/Aoff//hrK6Yrrry9l23WC1DyX78lto7k1+g1seo7cvGcVMmV8DK3zhVc379VVve8G6cRijuN9NPcLu4+hO2ImUCeGW+BZaW0eZ7b5jwwR4xcff8RApkV/ak1FIRHNt3EjgZgh9oiI2jPoi5pLhoyEzypiMmQh+mtjg8znpaPRR9POAtdRRarGD0h0UoioP9ZAlcqAR0E3uPRD/GwU4rS2f58QUTpcfRWMtTsLF+81beRyQ60WODUHRbczJ1HZT20b2SMLLxSOH0HNjFHxNy733S8xbJF0JjZTVkhn6R9+nxwhD9zvwFtbYhxrgCuylmIW6oY20bwxHAlD6dCPXGinVm6dOVvnxhzT1ikn+Mx4dDOeg05UiNL6FoWiO4SftoSMhtB0hTSkEzIp2DhHfCO+Iwe6wkKckZ5rkKkyZtg5f2J8k42OXpV1xFHYxvfImeSL7oY1RIFMhSmLvWLcSUPkRlxxH5lK2ojVz4kejWGBkFfC8BbyWhieLEQhV0E7hq+K9oxHOEOkEE26fCpDsgH/mujK8FWRYTwFiQ6/ijSnvg2yl7iUI8X91eTs+8qyMOuy5Iq016sl4ls0B7p3V7G406N/uZeSholJ49wDVIacG9YQoZg55Q3tbckrUDMzmmqec6wNoVhw1IWFh/6EnFi4tylk4T4zUSyJOwqMUpBmX5lD8gu6GjmHPFKMO2LXqRuueZyY1UQ4amSodyP1lrCje1G+GgWy+JK+XbJtuYvyImG7o0YN7QsZtbAtl5uZhW3NRtMKapBpEfsydEeb3hseeyk+SI4kc1e67+FDxT+XpErvV0EhvVsNFM1rpD1v3vxX/AV8yQ/cbldKoAAAAABJRU5ErkJggg=="}}
        />

        <Spacer size={10} />

        <Text style={[AppStyles.textCenterAligned, {color:AppColors.textSecondary}]} h3>{text}</Text>

        <Spacer size={20} />

        {!!tryAgain &&
            <TouchableOpacity style={styles.buttonTry}
                              onPress={tryAgain}
                              activeOpacity={1} >

                <Text style={[styles.buttonTryText]}>TRY AGAIN</Text>
            </TouchableOpacity>
        }
    </View>
);

Error.propTypes = { text: PropTypes.string, tryAgain: PropTypes.func };
Error.defaultProps = { text: 'Woops, Something went wrong.', tryAgain: null };
Error.componentName = 'Error';

/* Export Component ==================================================================== */
export default Error;

