import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Modal,
    Button,
    Dimensions,
    Platform,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    findNodeHandle,
    TouchableWithoutFeedback,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';
import ProgressBar from 'react-native-progress/Circle';



// additional imports
import { Icon } from 'react-native-elements'

// const and libs
import { Text } from '@ui/'
import { Card } from '@ui/cards/'
import { AppSizes, AppStyles } from '@theme/'
import { imageUploader } from '@lib/helper'


let options = {
    image: {
        title: 'Select Image',
        mediaType: 'photo',
        storageOptions: {
            skipBackup: true,
        },
    },
    video: {
        title: 'Select Video',
        mediaType: 'video',
        storageOptions: {
            skipBackup: true,
        }
    }
};

const toVerticalString = (str) => {
    let verStr = '';
    for (s of str) {
        verStr += s + '\n';
    }
    return verStr;
}

export default class Actions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            loading: false,
            assetType: 'image',
            asset: null,
            viewRef: 0,

            isUploading:true,
            uploadingProgress:0
        };

    }

    renderMedia = () => {
        const { assetType } = this.state;
        if (assetType === 'video') {
            return this.renderVideo();
        } else if (assetType === 'image') {
            return this.renderImage();
        } else {
            return;
        }
    }

    playVideo = () => {
        this.setState({
            rate: 1
        });
    }

    endVideo = () => {
        this.setState({
            rate: 0
        });
        this.player.seek(0);
    }

    renderVideo = () => {
        const { asset, rate } = this.state

        if (asset) {
            return (
                <TouchableWithoutFeedback
                    onPress={this.playVideo}
                >
                    <Video
                        source={{uri: asset.path}}
                        ref={ref => {
                            this.player = ref;
                          }}
                        onEnd={() => {this.endVideo()}}
                        resizeMode="cover"
                        rate={rate}
                        style={styles.video}
                    />
                </TouchableWithoutFeedback>
            );
        } else {
            return <ActivityIndicator />;
        }
    }

    renderImage = () => {

        const { loading, isUploading, uploadingProgress, asset, assetType } = this.state

        if (assetType === 'image') {
            return (
                <View style={[AppStyles.container]}>
                    <Image
                        source={asset}
                        style={AppStyles.fullImage}
                        ref={'uploadedImage'}
                        onLoadEnd={this.imageLoaded.bind(this)}>
                        <View style={[styles.overlay, AppStyles.centerAligned]} >
                            {isUploading &&
                                <View style={{top:-50}}>
                                    <ProgressBar progress={uploadingProgress} showsText size={120} />
                                    <Text style={[{color:'white', marginTop:5}, AppStyles.textCenterAligned]} h4>Uploading...</Text>
                                </View>
                            }
                            {!isUploading &&
                                <View style={{top:-50}}>
                                    <Icon type={'ionicon'} name={'md-checkmark-circle-outline'} color={'#86AC41'} size={120}/>
                                    <Text style={[{color:'white'}, AppStyles.textCenterAligned]} h4>Complete!</Text>
                                </View>
                            }
                        </View>
                    </Image>
                </View>
            )
        } else if (loading) {
            return <ActivityIndicator />;
        } else {
            return
        }
    }

    imageLoaded = () =>{
        this.setState({viewRef: findNodeHandle(this.refs.uploadedImage)})
    }



    setModalVisible = (visible = false) => {
        this.setState({modalVisible: visible});
    }

    showMediaPicker = (type) => {

        this.setState({
            assetType: type,
            asset: null,
            loading: true
        });

        ImagePicker.launchImageLibrary(options[type], (response) => {
            if (!response.didCancel && !response.error) {
                let source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                if (Platform.OS === 'ios') {
                    source = {
                        ...source,
                        path: response.uri.replace('file://', ''),
                        assetURL: response.origURL,
                        width: response.width,
                        height: response.height,
                    };
                } else {
                    source = {
                        ...source,
                        path: response.path,
                        width: response.width,
                        height: response.height,
                    };
                }

                this.setState({
                    asset: source,
                    loading: false,
                    isUploading: true
                });

                // show modal
                this.setModalVisible(true)

                // start uploading
                this.handleUploadImage()
            }
        });
    }


    onActionsPress = () => {
        const options = ['Send Picture', 'Send Video', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions({
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        this.showMediaPicker('image')
                        break;
                    case 1:
                        this.showMediaPicker('video')
                        break;
                    default:
                }
            });
    }

    handleUploadImage = async () => {
        const { asset } =this.state

        await imageUploader(asset.path)
            .uploadProgress((written, total) => {
                this.setState({uploadingProgress:written / total})
            })
            .then((res) => {
                this.setState({uploadingProgress:100, isUploading:false, uploadedImageId:res.data})
            })
            .catch((err) => {
                console.log(err)
            })
    }


    handleSend = () => {
        const { uploadedImageId } = this.state
        if (uploadedImageId) {
            this.props.onSend([{text:'[PHOTO-MSG]' + uploadedImageId}])
            this.setState({uploadedImageId})
            this.setModalVisible(false)
        }
    }


    renderIcon = () => {
        if (this.props.icon) {
            return this.props.icon();
        }
        return (
            <View
                style={[styles.wrapper, this.props.wrapperStyle]}
            >
                <Text
                    style={[styles.iconText, this.props.iconTextStyle]}
                >
                    +
                </Text>
            </View>
        );
    }

    renderNavBar = () => {
        const { isUploading } = this.state

        return (
            <View style={[styles.modalHeader, AppStyles.containerCentered]}>
                <View style={[AppStyles.row]}>
                    <TouchableOpacity
                        style={[AppStyles.flex1]}
                        onPress={()=>{this.setModalVisible(false)}}
                    >
                        <Text style={[styles.modalClose]} h4>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[AppStyles.flex1, AppStyles.rightAligned]}
                    >
                        <TouchableOpacity style={[AppStyles.row]}  onPress={() => {!isUploading && this.handleSend()}}>
                            <Text style={[styles.modalSend, { opacity:!isUploading ? 1 : 0.5}]} h4>Send</Text>
                            <Icon containerStyle={[styles.modalSendIcon, { opacity:!isUploading ? 1 : 0.5}]} name='send'/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        const { modalVisible } = this.state

        return (
            <TouchableOpacity
                style={[styles.container, this.props.containerStyle]}
                onPress={this.onActionsPress}
            >
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(false);
                      }}
                >
                    { this.renderNavBar() }

                    { this.renderMedia() }
                </Modal>
                {this.renderIcon()}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
    modalTitle: {
        textAlign: 'center',
        color: '#0A0A0A',
        fontSize: 18,
        width: 180,
        alignSelf: 'center',
    },
    modalClose: {
        textAlign: 'left',
        paddingLeft:16
    },
    modalSend: {
        textAlign: 'right',
        paddingRight:6
    },
    modalSendIcon:{
        paddingRight:16
    },
    modalHeader: {
        backgroundColor: '#EFEFF2',
        paddingTop: 0,
        top: 0,
        ...Platform.select({
            ios: {
                height: 64,
            },
            android: {
                height: 54,
            },
        }),
        right: 0,
        left: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: '#828287',
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: 0.8,
        backgroundColor: 'black',
    }
});

Actions.contextTypes = {
    actionSheet: React.PropTypes.func,
};

Actions.defaultProps = {
    onSend: () => {},
    options: {},
    icon: null,
    containerStyle: {},
    wrapperStyle: {},
    iconTextStyle: {},
};

Actions.propTypes = {
    onSend: React.PropTypes.func,
    options: React.PropTypes.object,
    icon: React.PropTypes.func,
    containerStyle: View.propTypes.style,
    wrapperStyle: View.propTypes.style,
    iconTextStyle: Text.propTypes.style,
};