import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

import { Image } from "@ui/"
import { getImageURL } from '@lib/util'

const styles = StyleSheet.create({
    container: {
        padding:10,
        paddingBottom:0
    },
});

export default class MessageImage extends React.Component {
  render() {

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Image
            disabled={false}
            source={{ uri: getImageURL (this.props.currentMessage.body.substr(11), false) }}
            doubleTapEnabled={true} // by default double tap will zoom image
            onMove={(e, gestureState) => null}
            downloadable={true}
            imageStyle={{width:200}}
        />
      </View>
    );
  }
}


MessageImage.defaultProps = {
  currentMessage: {
    image: null,
  },
  containerStyle: {},
};

MessageImage.propTypes = {
  currentMessage: PropTypes.object,
};
