import React, { Component, PropTypes } from 'react';
import {
    TouchableOpacity,
    RefreshControl,
    FlatList,
    View,
    Text,
    Platform,
    StyleSheet,
    TextInput,
    InteractionManager,
} from 'react-native';


// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles, AppSizes, AppColors } from '@theme/';
import { ErrorMessages } from '@constants/';

// Components
import Error from '@components/general/Error';
import { Icon, Spacer, List } from "@ui/"
import { CommentCard } from '@ui/cards'

/* Component ==================================================================== */
class CommentsListing extends Component {
    static componentName = 'CommentsListing';

    static propTypes = {
        post: PropTypes.object,
        getComments: PropTypes.func,
        leaveComment: PropTypes.func,
    }

    constructor(props) {
        super(props);

        this.state = {
            isRefreshing: true,
            isEditable: true,
            error:null,
        };

        this.state.dataSource = this.props.post.comments
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.post.comments !== this.props.post.comments) {
            this.setState({
                dataSource: nextProps.post.comments,
            })
        }
    }

    componentDidMount () {
        InteractionManager.runAfterInteractions(() => {
            this.fetchComments(true);
        });
    }


    /**
     * Fetch Comments from API
     */
    fetchComments = async () => {

        this.setState({ isRefreshing:true, error: null })

        await this.props.getComments()
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

    _onSend = () => {

        const { isEditable } = this.state

        if (this._textInput._lastNativeText && isEditable){
            const { post , user } = this.props;

            // create temp comment object
            let _comment = {
                txt:this._textInput._lastNativeText,
                pImg: user.profile.img,
                pid : user.profile.id,
                name: user.profile.name,
            }


            // make text editable false
            this.setState({isEditable:false})


            // send comment
            this.props.leaveComment(post.id, Object.assign({}, _comment) )
                .finally(() => {
                    // if success send make text editable with empty value
                    this._textInput.clear()
                    // make it editable
                    this.setState({isEditable:false})
                    // in the end we refetch comments
                    this.fetchComments()
                })
        }



        //todo: need to catch error and give retry to user
    }

    _rendInput = () => {
        const { isEditable } = this.state

        return(
            <View style={[styles.inputContainer]}>
                <View style={[styles.primary]}>
                    <TouchableOpacity
                        style={[styles.actionContainer]}
                        onPress={()=>{console.log('attach')}}
                    >
                        <View  style={[AppStyles.flex1]}>
                            <Icon size={22} color={'grey'} type={'material'} name={'add-a-photo'} />
                        </View>
                    </TouchableOpacity>
                    <TextInput
                        ref={textInput => (this._textInput = textInput)}
                        placeholder={'Comment'}
                        placeholderTextColor={'grey'}
                        multiline={true}
                        style={[styles.textInput]}
                        enablesReturnKeyAutomatically={true}
                        underlineColorAndroid="transparent"
                        editable={isEditable}
                    />
                    <TouchableOpacity
                        style={[styles.sendContainer]}
                        onPress={this._onSend}
                    >
                        <View style={[AppStyles.flex1]}>
                            <Icon size={24} color={'grey'} type={'ionicon'} name={'md-send'} />

                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    render = () => {
        const { isRefreshing, dataSource, error } = this.state;

        const { post } = this.props

        if (error) return <Error text={error} tryAgain={() => { this.fetchComments() } } />;

        return (
            <View style={[AppStyles.container, {paddingTop:AppSizes.paddingSml}]}>
                <FlatList
                    renderItem={comment => <CommentCard comment={comment.item} ownerId={post.pid} />}
                    ItemSeparatorComponent={() => (<View style={AppStyles.hr} />)}
                    data={dataSource}
                    refreshing={isRefreshing}
                    onRefresh={() => {this.fetchComments(true)}}
                    keyExtractor={item => item.id}
                />

                { this._rendInput() }
            </View>
        );
    }
}

/* Component Styles ==================================================================== */

const styles = StyleSheet.create({
    inputContainer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#b2b2b2',
        backgroundColor: '#FFFFFF',
    },
    primary: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    textInput: {
        flex: 1,
        height:40,
        marginLeft: 10,
        fontSize: 16,
        lineHeight: 16,
        marginTop: Platform.select({
            ios: 6,
            android: 0,
        }),
        marginBottom: Platform.select({
            ios: 5,
            android: 3,
        }),
    },
    sendContainer:{
        top:2,
        width: 26,
        height: 20,
        marginRight: 10,
        marginBottom: 15,
    },
    actionContainer:{
        top:1,
        width: 26,
        height: 20,
        marginLeft: 10,
        marginBottom: 15,
    },
})


/* Export Component ==================================================================== */
export default CommentsListing;
