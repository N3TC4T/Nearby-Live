'use strict';

import React, { Component, PropTypes } from 'react';

import {
    CameraRoll,
    StyleSheet,
    View,
    Image,
    Animated,
    PanResponder,
    Platform,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Modal,
    InteractionManager
} from 'react-native';


import RNFetchBlob from 'react-native-fetch-blob'
import * as Progress from 'react-native-progress';

//components
import { BottomAlert } from '@ui/alerts/'
import { Icon } from 'react-native-elements';

// consts
import { AppSizes, AppStyles } from "@theme/"

// utils
import { backgroundValueCalculation } from '@lib/util';


const AnimatedImage = Animated.createAnimatedComponent(Image);
const DefaultIndicator = Progress.Circle;

const LAYOUT_ENUM = {
    X: 'x',
    Y: 'y'
};

const BACKGROUND_VALUES = {
    MAX: 100,
    MIN: 0
};

const DOUBLE_TAP_MILISECONDS = 200;


const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width:AppSizes.screen.width,
        height:AppSizes.screen.height,
        bottom: 0,
    },
    imageContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:5,
        height: 200,
        width:AppSizes.screen.width * 0.85,
        borderWidth:2,
        borderColor:'transparent'
    }
});

export default class ImageViewer extends Component {
    static propTypes = {
        // common
        source: Image.propTypes.source,
        disabled: PropTypes.bool,
        imageStyle: Image.propTypes.style,
        doubleTapEnabled: PropTypes.bool,

        // required if it's a local image
        imageWidth: PropTypes.number,
        imageHeight: PropTypes.number,

        // callbacks
        onMove: PropTypes.func,
        onPress: PropTypes.func,
        onClose: PropTypes.func,

        // back button
        closeOnBack: PropTypes.bool,

        // loading indicator threshold
        threshold: PropTypes.number,

        // downloadable
        downloadable:PropTypes.bool
    };

    static defaultProps = {
        doubleTapEnabled: true,
        imageStyle: {},
        imageWidth: AppSizes.screen.width,
        imageHeight: AppSizes.screen.height / 2,
        closeOnBack: true,
        threshold: 40,
        downloadable:false
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            openModal: false,
            scale: new Animated.Value(1),
            layout: new Animated.ValueXY({ x: 0, y: 0 }),
            backgroundOpacity: new Animated.Value(BACKGROUND_VALUES.MIN),
            mainImageOpacity: new Animated.Value(1),
            loading: false,
            progress: 0,
            thresholdReached: !props.threshold,
            DownloadAlert:{
                alertShow:false,
                alertText:'',
                alertType:'',
                alertHide:false
            }
        };

        this.panResponder = null;
        this.layoutListener = null;

        this._imageSize = {
            width: typeof props.source !== 'object' ? props.imageWidth : null,
            height: typeof props.source !== 'object' ? props.imageHeight : null,
        };

        this._layoutX = 0;
        this._layoutY = 0;
        this._lastMovedX = 0;
        this._lastMovedY = 0;
        this._modalClosing = 0;
        this._doubleTapTimeout = null;
        this._isScaled = false;
        this._isAnimatingToCenter = false;
        this._zoomedImageSize = {
            width: null,
            height: null
        };

        this.handleMove = this.handleMove.bind(this);
        this.handleRelease = this.handleRelease.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSetPanResponder = this.handleSetPanResponder.bind(this);
        this.handleLayoutChange = this.handleLayoutChange.bind(this);
    }

    componentWillMount() {
        const { source } = this.props;

        this.state.layout.x.addListener((animated) => this.handleLayoutChange(animated, LAYOUT_ENUM.X));
        this.state.layout.y.addListener((animated) => this.handleLayoutChange(animated, LAYOUT_ENUM.Y));

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this.handleSetPanResponder,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: this.handleMove,
            onPanResponderRelease: this.handleRelease,
            onPanResponderTerminate: this.handleRelease
        });

        if (typeof source === 'object' && typeof source.uri === 'string') {
            Image.prefetch(source.uri);
            Image.getSize(source.uri, (width, height) => {
                this._imageSize = { width, height };
            });
        }
    }

    componentDidMount() {
        if (this.props.threshold) {
            this._thresholdTimer = setTimeout(() => {
                this.setState({ thresholdReached: true });
                this._thresholdTimer = null;
            }, this.props.threshold);
        }
    }

    componentWillReceiveProps(props) {
        if (!this.props.source || !props.source || this.props.source.uri !== props.source.uri) {
            this.setState({
                loading: false,
                progress: 0,
            });
        }
    }

    componentWillUnmount() {
        if (this._thresholdTimer) {
            clearTimeout(this._thresholdTimer);
        }

        this.state.layout.x.removeAllListeners();
        this.state.layout.y.removeAllListeners();
    }


    bubbleEvent(propertyName, event) {
        if (typeof this.props[propertyName] === 'function') {
            this.props[propertyName](event);
        }
    }

    handleLoadStart = () => {
        if (!this.state.loading && this.state.progress !== 1) {
            this.setState({
                loading: true,
                progress: 0,
            });
        }
        this.bubbleEvent('onLoadStart');
    };

    handleProgress = (e) => {
        const progress = e.nativeEvent.loaded / e.nativeEvent.total;
        // RN is a bit buggy with these events, sometimes a loaded event and then a few
        // 100% progress – sometimes in an infinite loop. So we just assume 100% progress
        // actually means the image is no longer loading
        if (progress !== this.state.progress && this.state.progress !== 1) {
            this.setState({
                loading: progress < 1,
                progress: progress,
            });
        }
        this.bubbleEvent('onProgress', e);
    };

    handleError = (event) => {
        this.setState({
            loading: false,
        });
        this.bubbleEvent('onError', event);
    };

    handleLoad = (event) => {
        if (this.state.progress !== 1) {
            this.setState({
                loading: false,
                progress: 1,
            });
        }
        this.bubbleEvent('onLoad', event);
    };

    handleDownloadImage = () => {
        let uri = this.refs.originalImage.props.source.uri;
        if (Platform.OS === 'ios'){
            let promise = CameraRoll.saveToCameraRoll(uri, 'photo');
            promise.then(res => (
                this.setState({DownloadAlert:{
                    alertShow:true,
                    alertText:'Photo saved successfully!',
                    alertType:'success',
                    alertHide:true
                }})
            ))
        }else {
            const ret = RNFetchBlob.config({ fileCache : true,}).fetch('GET', uri)
            this.setState({DownloadAlert:{
                alertShow:true,
                alertText:'Downloading ...',
                alertType:'info',
                alertHide:false
            }});
            ret.then(res => {
                let promise = CameraRoll.saveToCameraRoll(res.path(), 'photo');
                promise.then(res => {
                    this.setState({DownloadAlert:{
                        alertShow:true,
                        alertText:'Photo saved successfully!',
                        alertType:'success',
                        alertHide:true
                    }})
                })
            });
        }

    };

    handleMove(e, gestureState) {
        if (typeof this.props.onMove === 'function') {
            this.props.onMove(e, gestureState);
        }

        const currentScaleSizes = {
            width: this._zoomedImageSize.width * 2,
            height: this._zoomedImageSize.height * 2
        };

        const modifiedGestureState = Object.assign({}, gestureState, {
            dx: this._lastMovedX + gestureState.dx,
            dy: this._lastMovedY + gestureState.dy
        });

        Animated.event([null, {
            dx: this.state.layout.x,
            dy: this.state.layout.y
        }])(e, modifiedGestureState);
    }

    handleLayoutChange(animated, axis) {
        switch(axis) {
            case LAYOUT_ENUM.X:
                this._layoutX = animated.value;
                break;
            case LAYOUT_ENUM.Y:
                this._layoutY = animated.value;
                break;
        }

        if (this._modalClosing || this._isScaled || this._isAnimatingToCenter) {
            return;
        }

        const value = backgroundValueCalculation(this._layoutY, this._layoutX, BACKGROUND_VALUES);

        Animated.timing(this.state.backgroundOpacity, {
            toValue: value,
            duration: 1
        }).start();
    }

    handleSetPanResponder() {
        const currMil = Date.now();

        if (!!this._doubleTapTimeout &&
            (currMil - this._doubleTapTimeout <= DOUBLE_TAP_MILISECONDS) &&
            this.props.doubleTapEnabled
        ) {
            const value = this._isScaled ? 1 : 2;
            this._isAnimatingToCenter = this._isScaled;
            this._isScaled = !this._isScaled;

            Animated.timing(this.state.scale, {
                toValue: value,
                duration: 100
            }).start(() => {
                this._isAnimatingToCenter = false;
                if (!this._isScaled) {
                    this._lastMovedY = 0;
                    this._lastMovedX = 0;
                }
            });
        }
        this._doubleTapTimeout = currMil;

        return true;
    }

    handleRelease() {
        const value = backgroundValueCalculation(this._layoutY, this._layoutX, BACKGROUND_VALUES);
        const resetAnimation = Animated.timing(this.state.layout, {
            toValue: { x: 0, y: 0 },
            duration: 150
        });

        if (this._isScaled) {
            this._lastMovedY = this._layoutY;
            this._lastMovedX = this._layoutX;
            return;
        }

        const resetBackgroundAnimation = Animated.timing(this.state.backgroundOpacity, {
            toValue: BACKGROUND_VALUES.MAX,
            duration: 150
        });

        const cleanBackgroundAnimation = Animated.sequence([
            Animated.timing(this.state.backgroundOpacity, {
                toValue: BACKGROUND_VALUES.MIN,
                duration: 150
            }),
            Animated.timing(this.state.mainImageOpacity, {
                toValue: 1,
                duration: 50
            })
        ]);

        const animations = [];
        animations.push(resetAnimation);

        const shouldCloseModal = value <= 0;

        if (!this._isAnimatingToCenter && shouldCloseModal) {
            this._modalClosing = true;
            animations.push(cleanBackgroundAnimation);
        }

        animations.forEach(animation => animation.start());
        if (!this._isAnimatingToCenter && shouldCloseModal) {
            InteractionManager.runAfterInteractions(() => this.toggleModal());
        }
    }

    toggleModal() {
        const shouldOpen = !this.state.openModal;

        if (this.props.disabled) {
            return;
        }
        if (typeof this.props.onPress === 'function') {
            this.props.onPress(shouldOpen);
        }
        if (shouldOpen) {
            this._modalClosing = false;
            this.state.backgroundOpacity.setValue(BACKGROUND_VALUES.MAX);
        } else {
            this.state.backgroundOpacity.setValue(BACKGROUND_VALUES.MIN);
            // call prop
            if(typeof this.props.onClose === 'function'){
                this.props.onClose()
            }
            this.setState({DownloadAlert:{}})
        }
        this.state.mainImageOpacity.setValue(shouldOpen ? 0 : 1);
        this.setState({
            openModal: shouldOpen
        });
    }

    render() {
        const {
            source,
            downloadable,
            imageStyle
        } = this.props;

        const {
            backgroundOpacity,
            openModal,
            scale,
            progress,
            thresholdReached,
            loading
        } = this.state;

        let content = this.props.children;

        if ((loading || progress < 1) && thresholdReached) {
            const IndicatorComponent = (typeof indicator === 'function' ? indicator : DefaultIndicator);
            content = (<IndicatorComponent progress={progress}  indeterminate={!loading || !progress}/>);
        }

        if (this._imageSize.width / AppSizes.screen.width > this._imageSize.height / AppSizes.screen.height) {
            this._zoomedImageSize.width = AppSizes.screen.width;
            this._zoomedImageSize.height = AppSizes.screen.width / this._imageSize.width * this._imageSize.height
        } else {
            this._zoomedImageSize.height = AppSizes.screen.height;
            this._zoomedImageSize.width = AppSizes.screen.height / this._imageSize.width * this._imageSize.height;
        }

        const interpolatedOpacity = backgroundOpacity.interpolate({
            inputRange: [BACKGROUND_VALUES.MIN, BACKGROUND_VALUES.MAX],
            outputRange: [0, 1],
        });

        const interpolatedColor = backgroundOpacity.interpolate({
            inputRange: [BACKGROUND_VALUES.MIN, BACKGROUND_VALUES.MAX],
            outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']
        })


        let width = this._imageSize.width * ( AppSizes.screen.width * 0.85 / this._imageSize.width);
        let height = this._imageSize.height * ( AppSizes.screen.height * 0.50/ this._imageSize.height);


        return (
            <Animated.View>
                <Animated.View style={[styles.imageContainer]}>
                    <TouchableWithoutFeedback
                        onPress={this.toggleModal}
                    >
                        <AnimatedImage
                            ref="originalImage"
                            source={source}
                            onLoadStart={this.handleLoadStart}
                            onProgress={this.handleProgress}
                            onError={this.handleError}
                            onLoad={this.handleLoad}
                            style={[
                              {
                                  opacity: this.state.mainImageOpacity ,
                                  width:width,
                                  height:height,
                              },
                              imageStyle,
                            ]}
                            resizeMode={'contain'}
                        >
                            {content}
                        </AnimatedImage>
                    </TouchableWithoutFeedback>
                </Animated.View>
                <Modal
                    visible={openModal}
                    animationType={'slide'}
                    onRequestClose={this.props.closeOnBack ? this.toggleModal : () => null}
                    transparent={true}
                >
                    <Animated.View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: interpolatedColor
                        }}
                    >
                        <Animated.View style={[AppStyles.overlayHeader, {opacity: interpolatedOpacity}]}>
                            <View style={{flex:1, alignItems: 'flex-start'}}>
                                <TouchableOpacity
                                    onPress={() => { this.toggleModal() }}
                                    activeOpacity={0.7}
                                    style={{ top: 2, left:2}}
                                    hitSlop={{ top: 7, right: 7, bottom: 7, left: 7 }}
                                >
                                    <Icon name={'arrow-back'} size={22} color={'#FFF'} />
                                </TouchableOpacity>
                            </View>
                            {downloadable &&
                            <View style={{flex:1, alignItems: 'flex-end'}}>
                                <TouchableOpacity
                                    onPress={() => { this.handleDownloadImage() }}
                                    activeOpacity={0.7}
                                    style={{ top: 2, right:10}}
                                    hitSlop={{ top: 7, right: 7, bottom: 7, left: 7 }}
                                >
                                    <Icon name={'download'} type={'foundation'} size={22} color={'#FFF'} />
                                </TouchableOpacity>
                            </View>
                            }
                        </Animated.View>
                        <AnimatedImage
                            source={source}
                            {...this.panResponder.panHandlers}
                            style={[
                                AppStyles.overlayImage,
                                this._zoomedImageSize,
                                {
                                    transform: [
                                        ...this.state.layout.getTranslateTransform(),
                                        { scale }
                                        ]
                                }
                                ]}
                        />
                    </Animated.View>

                    {this.state.DownloadAlert.alertShow &&
                    <BottomAlert
                        visible={this.state.DownloadAlert.alertShow}
                        message={this.state.DownloadAlert.alertText}
                        alertType={this.state.DownloadAlert.alertType}
                        hideAfter={this.state.DownloadAlert.alertHide}
                    />
                    }
                </Modal>
            </Animated.View>
        );
    }
}

