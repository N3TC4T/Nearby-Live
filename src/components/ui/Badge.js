/**
 * Badge - type
 *
 <Badge
 type={'gold')
 />
 *
 */
import React, { PropTypes } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

// Components
import { Text } from '@ui/';


const styles = StyleSheet.create({
    badge: {
        height:15,
        width:37,
        top:3,
        marginLeft:5,
        borderRadius: 20,
    },
    badgeGold:{
        backgroundColor:'#F9BA32'
    },
    badgeVip:{
        backgroundColor:'#006C84'
    },
    badgeStaff:{
        backgroundColor:'#E7472E'
    },
    badgeAdmin:{
        backgroundColor:'#C8000A'
    },
    badgeOwner:{
        backgroundColor:'#00b7d3'
    },
    text: {
        lineHeight: 14,
        fontSize: 10,
        color: 'white',
        textAlign:'center',
    }
})

const Badge = ({ type }) => (
    <View>
        {type == 'gold' &&
            <View style={[ styles.badge, styles.badgeGold]}>
                <Text style={[ styles.text ]} p>GOLD</Text>
            </View>
        }
        {type == 'vip staff' &&
            <View style={[ styles.badge, styles.badgeStaff]}>
                <Text style={[ styles.text ]} p>STAFF</Text>
            </View>
        }
        {type == 'staff' &&
            <View style={[ styles.badge, styles.badgeStaff]}>
                <Text style={[ styles.text ]} p>STAFF</Text>
            </View>
        }
        {type == 'vip admin' &&
            <View style={[ styles.badge, styles.badgeAdmin]}>
                <Text style={[ styles.text ]} p>ADMIN</Text>
            </View>
        }
        {type == 'admin' &&
        <View style={[ styles.badge, styles.badgeAdmin]}>
            <Text style={[ styles.text ]} p>ADMIN</Text>
        </View>
        }
        {type == 'vip' &&
            <View style={[ styles.badge, styles.badgeVip]}>
                <Text style={[ styles.text ]} p>VIP</Text>
            </View>
        }
        {type == 'owner' &&
        <View style={[ styles.badge, styles.badgeOwner]}>
            <Text style={[ styles.text ]} p>Owner</Text>
        </View>
        }
    </View>
)


Badge.propTypes = {
    type: PropTypes.string,
};

Badge.defaultProps = {
    type: '',
};

Badge.componentName = 'Badge';


/* Export Component ==================================================================== */
export default Badge;