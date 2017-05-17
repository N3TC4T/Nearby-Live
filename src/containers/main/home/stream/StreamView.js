import React, { Component, PropTypes } from 'react';
import {
    View,
    SectionList,
    RefreshControl,
    InteractionManager,
} from 'react-native';

import ActionSheet from '@expo/react-native-action-sheet';
import { ButtonGroup }  from 'react-native-elements'


// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';
import { ErrorMessages } from '@constants/';
import AppAPI from '@lib/api';


// Components
import { PostCard } from '@ui/cards'
import { List } from '@components/ui';
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


    updateIndex = (selectedIndex) => {
        this.setState({ sectionIndex:selectedIndex })

        this.props.updateSectionIndex(selectedIndex)

        //Todo : this should fix in SectioList
        // this._sectionList.scrollToIndex({ index: 0 })

    }

    LoadMore =  () => {

        const { isLoadingMore, sectionIndex } = this.state ;

        if ( isLoadingMore ) return; else this.setState({ isLoadingMore: true })

        const { postsListing } = this.props

        let startFrom = postsListing[postsListing.length -1 ].id

        this.props.getPosts(sectionIndex, startFrom)
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
            <ActionSheet ref={component => this._actionSheetRef = component}>
                <View style={[AppStyles.container]}>
                    <ButtonGroup
                        onPress={this.updateIndex}
                        selectedIndex={sectionIndex}
                        buttons={sections}
                        containerStyle={{height: 30}}
                    />

                    <List containerStyle={[{marginTop:0,marginBottom:40}]}>
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
                    </List>
                </View>
            </ActionSheet>
        );
    }
}

/* Export Component ==================================================================== */
export default PostsListing;
