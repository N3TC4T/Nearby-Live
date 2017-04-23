import React, { Component, PropTypes } from 'react';
import {
    View,
    ListView,
    RefreshControl,
    InteractionManager,
} from 'react-native';

import { ButtonGroup }  from 'react-native-elements'


// Actions
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';
import { ErrorMessages } from '@constants/';
import AppAPI from '@lib/api';


// Components
import { PostCard } from '@ui/cards'
import { ListInfinite, List, ListItem, Spacer, Text } from '@components/ui';
import Loading from '@components/general/Loading';
import Error from '@components/general/Error';

/* Component ==================================================================== */
class PostsListing extends Component {
    static componentName = 'PostsListing';

    static propTypes = {
        postsListing: PropTypes.array.isRequired,
        getPosts: PropTypes.func,
        likePost: PropTypes.func,
        updateSectionIndex: PropTypes.func,
    };
    constructor(props) {
        super(props);

        this.state = {
            isRefreshing:true,
            isLoadingMore:false,
            sectionIndex:0,
            error:null,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        };

        this.state.dataSource = this.getUpdatedDataSource(props);

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.postsListing !== this.props.postsListing) {
            this.setState({
                dataSource: this.getUpdatedDataSource(nextProps)
            })
        }
    }

    componentDidMount = () => {
        InteractionManager.runAfterInteractions(() => {
            this.fetchPosts(true, true);
        });
    }

    getUpdatedDataSource = (props) => {
        return this.state.dataSource.cloneWithRows(props.postsListing);
    }

    fetchPosts = async (reFetch = false, firstInit = false) => {

        let { sectionIndex } = this.state

        reFetch ? startFrom = -1 : null

        this.setState({ isRefreshing:true, error: null })

        await this.props.getPosts(sectionIndex, startFrom)
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

        // in first initilize we need to load following and trending for better ux
        if (firstInit){
            await this.props.getPosts(1, -1)
            await this.props.getPosts(2, -1)
        }
    }


    onPressWatch = () => {
        console.log('watch pressed')
    };

    onPressAvatar = () => {
        console.log('avatar pressed')
    };

    onPressComments = (post) => {
        Actions.commentsView({
            postID: post.id,
        });

    };

    updateIndex = (selectedIndex) => {
        this.setState({ sectionIndex:selectedIndex })

        this.props.updateSectionIndex(selectedIndex)

        if (this._listView){
            this._listView.scrollTo({y:0})
        }
    }

    _onLoadMore = async () => {

        const { isLoadingMore, sectionIndex } = this.state ;

        if ( isLoadingMore ) return; else this.setState({ isLoadingMore: true })

        const { postsListing } = this.props

        let startFrom = postsListing[postsListing.length -1 ].id

        await this.props.getPosts(sectionIndex, startFrom)
            .then(() => {
                this.setState({
                    isLoadingMore: false ,
                });
            });

    }

    _canLoadMore = () => {
        const { isLoadingMore, sectionIndex } = this.state

        return !isLoadingMore && sectionIndex !== 2
    }


    render = () => {
        const { postsListing, likePost } = this.props;
        const { isRefreshing, dataSource, sectionIndex } = this.state;

        const sections = ['Recent', 'Following', 'Trending']

        if (isRefreshing && (!postsListing || postsListing.length < 1)) {
            return <Loading text={'Loading Feed...'} />
        }



        // show error on empty feed
        if (!isRefreshing && (!postsListing || postsListing.length < 1)) {
            return (
                <View style={[AppStyles.container]}>
                    <ButtonGroup
                        onPress={this.updateIndex}
                        selectedIndex={sectionIndex}
                        buttons={sections}
                        containerStyle={{height: 30}}
                    />
                    <Error text={ErrorMessages.posts404} tryAgain={() => { this.fetchPosts(true) } }  />
                </View>
            )
        }


        return (
                <View style={[AppStyles.container]}>
                    <ButtonGroup
                        onPress={this.updateIndex}
                        selectedIndex={sectionIndex}
                        buttons={sections}
                        containerStyle={{height: 30}}
                    />

                    <List containerStyle={{marginTop:0, height:AppSizes.screen.height-160}}>
                        <ListView
                            ref={listView => (this._listView = listView)}
                            enableEmptySections
                            renderScrollComponent={props => <ListInfinite  {...props} />}
                            renderRow={post => <PostCard
                            post={post}
                            onPressLike={likePost}
                            onPressComments={() => {this.onPressComments(post)}}
                            onPressWatch={this.onPressWatch}
                            onPressAvatar={this.onPressAvatar}
                         />
                        }
                            dataSource={dataSource}
                            canLoadMore={this._canLoadMore}
                            onLoadMoreAsync={this._onLoadMore}
                            refreshControl={
                              <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={()=>{this.fetchPosts(true)}}
                                tintColor={AppColors.brand.primary}
                              />
                              }
                        />
                    </List>
                </View>
        );
    }
}

/* Export Component ==================================================================== */
export default PostsListing;
