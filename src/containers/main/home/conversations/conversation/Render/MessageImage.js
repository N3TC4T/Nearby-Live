import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View
} from 'react-native';

import {Image} from '@ui/';
import {getImageURL} from '@lib/util';

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingBottom: 0
    }
});

// Todo: Fix me
// eslint-disable-next-line
export default class MessageImage extends React.Component {
    render() {
        return (
            <View style={[styles.container]}>
                <Image
                    disabled={false}
                    source={{uri: getImageURL(this.props.currentMessage.body.substr(11), false)}}
                    doubleTapEnabled // by default double tap will zoom image
                    downloadable
                    imageStyle={{width: 200}}
                />
            </View>
        );
    }
}

MessageImage.defaultProps = {
    currentMessage: {
        image: null
    }
};

MessageImage.propTypes = {
    currentMessage: PropTypes.object
};
