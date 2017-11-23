import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    SectionList,
    RefreshControl,
    InteractionManager,
} from 'react-native';

import ActionSheet from '@expo/react-native-action-sheet';


// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';
import { ErrorMessages } from '@constants/';
import AppAPI from '@lib/api';


// Components
import { PostCard } from '@ui/cards'
import { SegmentButton } from '@ui/'
import Loading from '@components/general/Loading';
import Error from '@components/general/Error';

/* Component ==================================================================== */
class PostsListing extends Component {
    static componentName = 'PostsListing';

    static propTypes = {
        postsListing: PropTypes.array.isRequired,
        getUserPosts: PropTypes.func,
    };

    static childContextTypes = {
        actionSheet: PropTypes.func,
    }

    constructor(props) {
        super(props);

        this.state = {
            isRefreshing:true,
            isLoadingMore:false,
            sectionIndex:0,
            error:null,
            dataSource:null,
        };

        this.state.dataSource = props.postsListing

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.postsListing !== this.props.postsListing) {
            this.setState({
                dataSource: nextProps.postsListing,
            })
        }
    }

    componentDidMount () {
        InteractionManager.runAfterInteractions(() => {
            this.fetchPosts(true, true);
        });
    }

    getChildContext() {
        return {
            actionSheet: () => this._actionSheetRef,
        };
    }

    fetchPosts = async (reFetch = false, firstInit = false) => {

        const { pid } = this.props

        reFetch ? startFrom = -1 : null

        this.setState({ isRefreshing:true, error: null })

        await this.props.getUserPosts(pid, startFrom)
            .then(() => {
                this.setState({
                    isRefreshing: false,
                    error: null,
                });
            }).catch((err) => {
                const error = AppAPI.handleError(err);
                this.setState({
                    isRefreshing: false,
                    error,
                });
            });
    }

    LoadMore =  () => {

        const { isLoadingMore } = this.state ;

        if ( isLoadingMore ) return; else this.setState({ isLoadingMore: true })

        const { pid , postsListing } = this.props

        let startFrom = postsListing[postsListing.length -1 ].id

        this.props.getUserPosts(pid , startFrom)
            .then(() => {
                this.setState({
                    isLoadingMore: false ,
                });
            });

    }

    renderItem = ({item})  => {
        const { user ,likePost, watchPost , unwatchPost, featurePost, deletePost, reportPost } = this.props
        return (
            <PostCard
                post={item}
                reportable={ item.pid !== user.profile.id }
                deletable={ item.pid == user.profile.id }
                featureAble={ user.points.AvailablePoints > 0 }
                onPressLike={ likePost }
                onPressDelete={ deletePost }
                onPressFeature={ featurePost }
                onPressReport={ reportPost }
                onPressWatch={ watchPost }
                onPressUnWatch={ unwatchPost }
            />
        )
    }


    render = () => {
        const { postsListing,  } = this.props;
        const { isRefreshing, dataSource, sectionIndex } = this.state;

        const sections = ['Recent', 'Following', 'Trending']

        if (isRefreshing && (!postsListing || postsListing.length < 1)) {
            return <Loading text={'Loading User Posts...'} />
        }



        // show error on empty feed
        if (!isRefreshing && (!postsListing || postsListing.length < 1)) {
            return (
                <View style={[AppStyles.container]}>
                    <Error text={ErrorMessages.posts404} tryAgain={() => { this.fetchPosts(true) } }  />
                </View>
            )
        }


        return (
            <ActionSheet ref={component => this._actionSheetRef = component}>
                <View style={[AppStyles.container]}>
                    <SectionList
                        ref={(ref) => { this._sectionList = ref }}
                        renderItem={this.renderItem}
                        sections={[
                                {key: sectionIndex, data: dataSource},
                              ]}
                        refreshing={isRefreshing}
                        initialNumToRender={5}
                        onRefresh={() => {this.fetchPosts(true)}}
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
