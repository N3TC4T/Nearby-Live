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
import {PostCard} from '@ui/cards';
import {SegmentButton} from '@ui/';
import Loading from '@components/general/Loading';
import Error from '@components/general/Error';

/* Component ==================================================================== */
class PostsListing extends Component {
    static componentName = 'PostsListing';

    static propTypes = {
        postsListing: PropTypes.array.isRequired,
        getPosts: PropTypes.func.isRequired,
        likePost: PropTypes.func.isRequired,
        updateSectionIndex: PropTypes.func.isRequired,
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
            dataSource: null,
            error: null
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

    fetchPosts = async(firstInit = false) => {
        const {sectionIndex} = this.state;

        const startFrom = -1;

        this.setState({isRefreshing: true, error: null});

        await this.props.getPosts(sectionIndex, startFrom)
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

        // in first initilize we need to load following and trending for better UX
        if (firstInit) {
            await this.props.getPosts(1, -1);
            await this.props.getPosts(2, -1);
        }
    };

    updateIndex = (selectedIndex) => {
        this.setState({sectionIndex: selectedIndex});

        this.props.updateSectionIndex(selectedIndex);

        // Todo : this should fix in SectioList
        // this._sectionList.scrollToIndex({ index: 0 })
    };

    LoadMore = () => {
        const {isLoadingMore, sectionIndex} = this.state;

        if (isLoadingMore) {return;} this.setState({isLoadingMore: true});

        const {postsListing} = this.props;

        const startFrom = postsListing[postsListing.length - 1].id;

        this.props.getPosts(sectionIndex, startFrom)
            .then(() => {
                this.setState({
                    isLoadingMore: false
                });
            });
    };

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
    };

    render = () => {
        const {postsListing} = this.props;
        const {
            isRefreshing, dataSource, sectionIndex, error
        } = this.state;

        const sections = ['Recent', 'Following', 'Trending'];

        if (isRefreshing && (!postsListing || postsListing.length < 1)) {
            return <Loading text='Loading Feed...' />;
        }

        // show error on empty feed or error on getting posts
        if ((!isRefreshing && (!postsListing || postsListing.length < 1)) || error) {
            return (
                <View style={[AppStyles.container]}>
                    <SegmentButton
                        onPress={this.updateIndex}
                        selectedIndex={sectionIndex}
                        buttons={sections}
                    />
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
                    <SegmentButton
                        onPress={this.updateIndex}
                        selectedIndex={sectionIndex}
                        buttons={sections}
                    />

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
