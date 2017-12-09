import moment from 'moment';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    TouchableOpacity,
    FlatList,
    View,
    Platform,
    StyleSheet,
    TextInput,
    InteractionManager
} from 'react-native';

// Consts and Libs
import AppAPI from '@lib/api';
import {getImageURL} from '@lib/util';
import {AppStyles, AppSizes, AppFonts, AppColors} from '@theme/';

// Components
import Error from '@components/general/Error';
import {Image as ImageViewer, Icon, Avatar, Badge, Text} from '@ui/';

/* Component Styles ==================================================================== */

const styles = StyleSheet.create({
    container: {
        marginLeft: AppSizes.paddingSml,
        marginRight: AppSizes.paddingSml,
        marginTop: AppSizes.paddingSml
    },
    commentHeader: {
        paddingTop: 10

    },
    commentHeaderContainer: {
        paddingLeft: 8
    },
    commentContent: {
        marginTop: 2,
        marginBottom: 8,
        marginLeft: 42,
        paddingTop: 7
    },
    commentImage: {
        paddingTop: 10
    },
    commenterLocation: {
        color: 'gray',
        fontSize: AppFonts.base.size * 0.55
    },
    commenterName: {
        fontFamily: AppFonts.base.familyBold,
        fontSize: AppFonts.base.size * 0.75
    },
    commentText: {
        fontFamily: AppFonts.base.family,
        fontSize: AppFonts.base.size * 0.90,
        color: AppColors.textPrimary
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#f2f2f2'
    },
    inputContainer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#b2b2b2',
        backgroundColor: '#FFFFFF'
    },
    primary: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    textInput: {
        flex: 1,
        height: 40,
        marginLeft: 10,
        fontSize: 16,
        lineHeight: 16,
        marginTop: Platform.select({
            ios: 6,
            android: 0
        }),
        marginBottom: Platform.select({
            ios: 5,
            android: 3
        })
    },
    sendContainer: {
        top: 2,
        width: 26,
        height: 20,
        marginRight: 10,
        marginBottom: 15
    },
    actionContainer: {
        top: 1,
        width: 26,
        height: 20,
        marginLeft: 10,
        marginBottom: 15
    }
});

/* Component ==================================================================== */
class CommentsListing extends Component {
    static componentName = 'CommentsListing';

    static propTypes = {
        post: PropTypes.object.isRequired,
        getComments: PropTypes.func.isRequired,
        leaveComment: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            isRefreshing: true,
            isEditable: true,
            error: null
        };

        this.state.dataSource = this.props.post.comments;
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchComments(true);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.post.comments !== this.props.post.comments) {
            this.setState({
                dataSource: nextProps.post.comments
            });
        }
    }

    onSend = () => {
        const {isEditable} = this.state;

        /* eslint no-underscore-dangle: "off" */

        if (this.textInput._lastNativeText && isEditable) {
            const {post, user} = this.props;

            // create temp comment object
            const comment = {
                txt: this.textInput._lastNativeText,
                pImg: user.profile.img,
                pid: user.profile.id,
                name: user.profile.name
            };

            // make text editable false
            this.setState({isEditable: false});

            // send comment
            this.props.leaveComment(post.id, Object.assign({}, comment))
                .finally(() => {
                    // if success send make text editable with empty value
                    this.textInput.clear();
                    // make it editable
                    this.setState({isEditable: false});
                    // in the end we refetch comments
                    this.fetchComments();
                });
        }

        // todo: need to catch error and give retry to user
    };

    /**
     * Fetch Comments from API
     */
    fetchComments = async() => {
        this.setState({isRefreshing: true, error: null});

        await this.props.getComments()
            .then(() => {
                this.setState({
                    isRefreshing: false,
                    error: null
                });
            }).catch((err) => {
                const error = AppAPI.handleError(err);
                this.setState({
                    isRefreshing: false,
                    error
                });
            });
    };

    renderInput = () => {
        const {isEditable} = this.state;

        return (
            <View style={[styles.inputContainer]}>
                <View style={[styles.primary]}>
                    <TouchableOpacity
                        style={[styles.actionContainer]}
                        onPress={() => { console.log('attach'); }}
                    >
                        <View style={[AppStyles.flex1]}>
                            <Icon size={22} color='grey' type='material' name='add-a-photo' />
                        </View>
                    </TouchableOpacity>
                    <TextInput
                        ref={(textInput) => { this.textInput = textInput; }}
                        placeholder='Comment'
                        placeholderTextColor='grey'
                        multiline
                        style={[styles.textInput]}
                        enablesReturnKeyAutomatically
                        underlineColorAndroid='transparent'
                        editable={isEditable}
                    />
                    <TouchableOpacity
                        style={[styles.sendContainer]}
                        onPress={this.onSend}
                    >
                        <View style={[AppStyles.flex1]}>
                            <Icon size={24} color='grey' type='ionicon' name='md-send' />

                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    renderItem = (comment) => {
        const {post} = this.props;

        const obj = comment.item;

        return (
            <View>
                <View style={[AppStyles.flex1, styles.container]}>
                    <View style={[AppStyles.row]}>

                        <Avatar source={{uri: getImageURL(obj.pImg, true)}} />

                        <View style={[styles.commentHeaderContainer]}>
                            <View style={[AppStyles.row]}>
                                <Text h5>{obj.name}</Text>
                                {obj.pid === post.pid &&
                                    <Badge type='owner' />
                                }
                            </View>

                            <Text style={[styles.commenterLocation]}>
                                {moment(obj.date).fromNow()}  @ {obj.loc}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.commentContent, AppStyles.leftAligned]}>
                        {obj.img ? (
                            <View style={[AppStyles.row, styles.commentImage]}>
                                <ImageViewer
                                    disabled={false}
                                    source={{uri: getImageURL(obj.img)}}
                                    doubleTapEnabled
                                    downloadable
                                    containerStyle={{width: 200, height: 200}}
                                />

                            </View>
                        ) : (
                            <View style={[AppStyles.row]}>
                                <Text p>{obj.txt}</Text>
                            </View>
                        )}

                    </View>
                </View>

            </View>

        );
    }

    render = () => {
        const {isRefreshing, dataSource, error} = this.state;

        if (error) {return <Error text={error} tryAgain={() => { this.fetchComments(); }} />;}

        return (
            <View style={[AppStyles.container]}>
                <FlatList
                    renderItem={comment => this.renderItem(comment)}
                    ItemSeparatorComponent={() => (<View style={styles.separator}/>)}
                    data={dataSource}
                    refreshing={isRefreshing}
                    onRefresh={() => { this.fetchComments(true); }}
                    keyExtractor={item => item.id}
                />

                { this.renderInput() }
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default CommentsListing;
