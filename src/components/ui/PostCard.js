/**
 * Post View Screen
 *  - The individual post screen
 */
import moment from 'moment';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    ViewPropTypes,
    TouchableWithoutFeedback,
    Animated,
    View,
    TouchableOpacity,
    Clipboard
} from 'react-native';

// Actions
import {Actions} from 'react-native-router-flux';

// Consts and Libs
import {AppSizes, AppStyles} from '@theme/';
import {AppConfig} from '@constants/';
import {getImageURL} from '@lib/util';

// Components
import {Image as ImageViewer, Avatar, Badge, Text, Icon} from '@ui/';
import {Toast} from '@ui/alerts/';

// Todo: Move component to another file
/* Component ==================================================================== */
class AnimatedLike extends Component {
    static propTypes = {
        onPress: PropTypes.func,
        liked: PropTypes.bool,
        count: PropTypes.number,
        style: ViewPropTypes.style
    };

    static defaultProps = {
        liked: false,
        count: 0,
        style: {}
    };

    constructor(props) {
        super(props);

        this.state = {
            scale: new Animated.Value(1),
            liked: props.liked,
            count: props.count
        };
    }

    _onPress = () => {
        this.setState({
            liked: true,
            count: this.state.liked ? this.state.count : this.state.count + 1
        });

        Animated.timing(
            this.state.scale,
            {
                toValue: 1.5,
                friction: 1,
                duration: 200
            },
        ).start();

        setTimeout(() => {
            Animated.spring(
                this.state.scale,
                {
                    toValue: 1,
                    friction: 1,
                    duration: 200
                },
            ).start();
        }, 50);

        if (this.props.onPress) {
            this.props.onPress();
        }
    }

    render() {
        return (

            <TouchableWithoutFeedback onPress={this._onPress}>
                <View style={[AppStyles.row, AppStyles.centerAligned]}>
                    <Animated.View
                        style={[{transform: [{scale: this.state.scale}]}, this.props.style]}
                    >
                        <Icon size={20} color={this.state.liked ? '#E05641' : '#A9AFB5'} type='material-icons' name={this.state.liked ? 'favorite' : 'favorite-border'} />
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>

        );
    }
}

/* Component ==================================================================== */
class PostCard extends Component {
    static componentName = 'PostCard';

    static contextTypes= {
        actionSheet: PropTypes.func
    };

    static propTypes = {
        post: PropTypes.object.isRequired,
        reportable: PropTypes.bool.isRequired,
        deletable: PropTypes.bool.isRequired,
        featureAble: PropTypes.bool.isRequired,
        onPressLike: PropTypes.func.isRequired,
        onPressDelete: PropTypes.func.isRequired,
        onPressFeature: PropTypes.func.isRequired,
        onPressReport: PropTypes.func.isRequired,
        onPressWatch: PropTypes.func.isRequired,
        onPressUnWatch: PropTypes.func.isRequired
    };

    shouldComponentUpdate(nextProps) {
        return this.props.post !== nextProps.post;
    }

    _onPressWatch = () => {
        const {post, onPressWatch, onPressUnWatch} = this.props;

        if (post.w) {
            onPressUnWatch(post.id);
            Toast.show('Post Unwatched!', {
                shadow: true,
                animation: true,
                hideOnPress: true
            });
        } else {
            Toast.show('Post Watched!', {
                shadow: true,
                animation: true,
                hideOnPress: true
            });
            onPressWatch(post.id);
        }
    }

    _onPressFeature = () => {
        const {post, featureAble, onPressFeature} = this.props;

        if (!featureAble) {
            Toast.show('You need at least one point to feature this posts', {
                shadow: true,
                animation: true,
                hideOnPress: true
            });
        } else {
            onPressFeature(post.id);
        }
    }

    _onPressLike = async() => {
        const {post, onPressLike} = this.props;

        if (!post.gp) {
            onPressLike(post.id, post.pid);
        }
    };

    _onPressComments = () => {
        const {post} = this.props;

        Actions.commentsView({
            postID: post.id
        });
    };

    _onCopyPostURL= () => {
        const {post} = this.props;
        Clipboard.setString(`${AppConfig.urls.baseURL}post/${post.id}`);

        Toast.show('Success copied to clipboard', {
            shadow: true,
            animation: true,
            hideOnPress: true
        });
    }

    _onPressAvatar = () => {
        const {post} = this.props;

        Actions.userProfileView({
            userID: post.pid
        });
    };

    _onPressOption = () => {
        const {
            post, reportable, deletable, onPressDelete, onPressReport
        } = this.props;

        const options = ['Copy Post URL'];

        let watchIndex = 0;
        let deleteIndex = 0;
        let reportIndex = 0;
        let featureIndex = 0;
        let copyIndex = 0;

        if (!post.featured) {
            options[options.length] = 'Feature';
            featureIndex = options.length - 1;
        }

        if (deletable) {
            options[options.length] = 'Delete';
            deleteIndex = options.length - 1;
        }

        if (reportable) {
            options[options.length] = 'Report';
            reportIndex = options.length - 1;
        }

        if (!post.w) {
            options[options.length] = 'Turn On Post Notifications ';
            watchIndex = options.length - 1;
        } else {
            options[options.length] = 'Turn Off Post Notifications' ;
            watchIndex = options.length - 1;
        }

        this.context.actionSheet().showActionSheetWithOptions(
            {
                options
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case featureIndex:
                        this._onPressFeature();
                        break;
                    case copyIndex:
                        this._onCopyPostURL();
                        break;
                    case deleteIndex:
                        onPressDelete(post.id);
                        break;
                    case reportIndex:
                        onPressReport(post.id);
                        break;
                    case watchIndex:
                        this._onPressWatch();
                        break;
                    default:
                        break;
                }
            },
        );
    };

    renderContent = () => {
        const {post} = this.props;

        let isGIF = false;

        // check if post content is gif
        if (post.txt.split(/\n/)[0].endsWith('.gif') || (post.txt.split(/\n/)[0].startsWith('http') && post.txt.split(/\n/)[0].startsWith('https'))) {
            isGIF = true;
            this.gifURL = post.txt.split(/\n/)[0];
            this.cleanText = post.txt.split(/\n/)[2];
        }

        if (isGIF) {
            return (
                <View style={[styles.cardContent]}>
                    {!!this.cleanText &&
                    <View style={[AppStyles.row, styles.cardText]}>
                        <Text p>{ this.cleanText }</Text>
                    </View>
                    }
                    <View style={[AppStyles.row, styles.cardImage]}>
                        <ImageViewer
                            containerStyle={{height: 200}}
                            disabled={false}
                            source={{uri: this.gifURL}}
                            doubleTapEnabled
                            downloadable
                        />
                    </View>
                </View>
            );
        }
        return (
            <View style={[styles.cardContent]}>
                {!!post.txt &&
                <View style={[AppStyles.row, styles.cardText]}>
                    <Text p>{post.txt}</Text>
                </View>
                }
                {!!post.img &&
                    <View style={[AppStyles.row, styles.cardImage]}>
                        <ImageViewer
                            containerStyle={{height: 200}}
                            disabled={false}
                            source={{uri: getImageURL(post.img)}}
                            doubleTapEnabled
                            downloadable
                        />
                    </View>
                }
            </View>
        );
    }

    render = () => {
        const {post} = this.props;

        if (post.reported) {
            return (
                <View style={[styles.container, styles.card]}>
                    <View style={[AppStyles.row, styles.reportContainer]}>
                        <Icon size={40} color='#FB6567' name='info-outline' />
                        <Text h5>Thanks for reporting this post !</Text>
                    </View>
                </View>
            );
        }

        return (
            <View style={[styles.container, styles.card]}>
                <View style={[styles.cardHeader, AppStyles.row]}>
                    <Avatar
                        source={{uri: getImageURL(post.pImg, true)}}
                        onPress={this._onPressAvatar}
                    />

                    <View style={[styles.postHeaderContainer]}>
                        <View style={[AppStyles.row]}>
                            {/* user name */}
                            <Text h5 onPress={this._onPressAvatar}>{post.name}</Text>

                            {/* user badge */}
                            {!!post.ul && <Badge type={post.ul} /> }

                            {/* user rank */}
                            {post.ur !== -1 && <Text style={[styles.posterRank]}>#{post.ur}</Text> }

                            {/* post options right */}
                            <View style={styles.postOptions}>
                                <TouchableOpacity onPress={this._onPressOption}>
                                    <Icon
                                        size={20}
                                        color='#bbbbbb'
                                        name='dots-vertical'
                                        type='material-community'
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={[styles.posterLocation]}>
                            {moment(post.date).fromNow()} @ {post.loc}
                        </Text>
                    </View>
                </View>

                { this.renderContent()}

                <View style={[styles.cardAction]}>

                    <View style={[AppStyles.flex4]}>
                        <View style={[AppStyles.row]}>
                            {post.pc !== 0 &&
                                    <Text style={[AppStyles.paddingLeftSml, AppStyles.subtext]}>
                                        {post.pc} Likes
                                    </Text>
                            }
                            {post.cc !== 0 &&
                                    <Text style={[AppStyles.paddingLeftSml, AppStyles.subtext]}>
                                        {post.cc} Comments
                                    </Text>
                            }
                        </View>
                    </View>

                    <View style={AppStyles.flex1}>
                        <View style={[AppStyles.row, {right: 0}]}>
                            <TouchableOpacity style={AppStyles.paddingRight} onPress={this._onPressComments}>
                                <View style={[AppStyles.row, AppStyles.centerAligned]}>
                                    <Icon size={18} color='#A9AFB5' type='font-awesome' name='comment-o' />
                                </View>
                            </TouchableOpacity>

                            <AnimatedLike
                                onPress={this._onPressLike}
                                liked={post.gp}
                                count={post.pc}
                            />
                        </View>
                    </View>

                </View>
            </View>

        );
    }
}

/* Component Styles ==================================================================== */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        margin: 5
    },
    reportContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 3,
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 1,
        shadowOffset: {
            height: 5,
            width: 0.3
        }
    },
    cardHeader: {
        padding: 10
    },
    cardImage: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#e2e2e2',
        backgroundColor: '#E9EBEE'
    },
    cardContent: {
        paddingTop: 10
    },
    cardText: {
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 20

    },
    cardAction: {
        padding: 8,
        paddingRight: 3,
        paddingLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.3,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderRadius: 5,
        borderColor: '#b9b9b9'

    },
    separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#E9E9E9'
    },
    posterLocation: {
        color: 'gray',
        fontSize: 10
    },
    posterRank: {
        marginLeft: 5,
        color: '#828282',
        fontSize: 12,
        paddingTop: 2
    },
    postOptions: {
        position: 'absolute',
        top: 2,
        bottom: 2,
        left: AppSizes.screen.width * 0.75
    },
    postHeaderContainer: {
        paddingLeft: 8
    }
});

/* Export Component ==================================================================== */
export default PostCard;
