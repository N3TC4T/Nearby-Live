import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    SectionList,
    InteractionManager
} from 'react-native';

import ActionSheet from '@expo/react-native-action-sheet';

// Consts and Libs
import {AppStyles} from '@theme/';
import {ErrorMessages} from '@constants/';
import AppAPI from '@lib/api';

// Components
import {PostCard} from '@ui';
import Loading from '@components/general/Loading';
import Error from '@components/general/Error';

/* Component ==================================================================== */
class PostsListing extends Component {
    static componentName = 'PostsListing';

    static propTypes = {
        pid: PropTypes.string.isRequired,
        postsListing: PropTypes.array.isRequired,
        getUserPosts: PropTypes.func.isRequired,
        likePost: PropTypes.func.isRequired,
        watchPost: PropTypes.func.isRequired,
        unwatchPost: PropTypes.func.isRequired,
        featurePost: PropTypes.func.isRequired,
        deletePost: PropTypes.func.isRequired,
        reportPost: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired
    };

    static childContextTypes = {
        actionSheet: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.state = {
            isRefreshing: true,
            isLoadingMore: false,
            sectionIndex: 0,
            error: null,
            dataSource: null
        };

        this.state.dataSource = props.postsListing;
    }

    getChildContext() {
        return {
            actionSheet: () => this.actionSheetRef
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchPosts(true, true);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.postsListing !== this.props.postsListing) {
            this.setState({
                dataSource: nextProps.postsListing
            });
        }
    }

    fetchPosts = async() => {
        const {pid} = this.props;

        const startFrom = -1;

        this.setState({isRefreshing: true, error: null});

        await this.props.getUserPosts(pid, startFrom)
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
    }

    LoadMore = () => {
        const {isLoadingMore} = this.state;

        if (isLoadingMore) {return;} this.setState({isLoadingMore: true});

        const {pid, postsListing} = this.props;

        const startFrom = postsListing[postsListing.length - 1].id;

        this.props.getUserPosts(pid, startFrom)
            .then(() => {
                this.setState({
                    isLoadingMore: false
                });
            });
    }

    renderItem = ({item}) => {
        const {
            user, likePost, watchPost, unwatchPost, featurePost, deletePost, reportPost
        } = this.props;
        return (
            <PostCard
                post={item}
                reportable={item.pid !== user.profile.id}
                deletable={item.pid === user.profile.id}
                featureAble={user.points.AvailablePoints > 0}
                onPressLike={likePost}
                onPressDelete={deletePost}
                onPressFeature={featurePost}
                onPressReport={reportPost}
                onPressWatch={watchPost}
                onPressUnWatch={unwatchPost}
            />
        );
    }

    render = () => {
        const {postsListing} = this.props;
        const {
            isRefreshing, dataSource, sectionIndex, error
        } = this.state;

        if (isRefreshing && (!postsListing || postsListing.length < 1)) {
            return <Loading text='Loading User Posts...' />;
        }

        // show error on empty feed
        if ((!isRefreshing && (!postsListing || postsListing.length < 1)) || error) {
            return (
                <View style={[AppStyles.container]}>
                    <Error
                        text={ErrorMessages.posts404}
                        tryAgain={() => { this.fetchPosts(true); }}
                    />
                </View>
            );
        }

        return (
            <ActionSheet ref={(component) => { this.actionSheetRef = component; }}>
                <View style={[AppStyles.container]}>
                    <SectionList
                        ref={(ref) => { this.sectionList = ref; }}
                        renderItem={this.renderItem}
                        sections={[
                            {key: sectionIndex, data: dataSource}
                        ]}
                        refreshing={isRefreshing}
                        initialNumToRender={5}
                        onRefresh={() => { this.fetchPosts(true); }}
                        onEndReached={this.LoadMore}
                        onEndReachedThreshold={100}
                        keyExtractor={item => item.id}
                    />

                </View>
            </ActionSheet>
        );
    }
}

/* Export Component ==================================================================== */
export default PostsListing;
