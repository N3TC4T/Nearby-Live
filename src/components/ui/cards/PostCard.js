/**
 * Post View Screen
 *  - The individual post screen
 */
import moment from "moment";

import React, {Component, PropTypes} from "react";
import {StyleSheet, Image, View, TouchableOpacity} from "react-native";
import {Icon} from "react-native-elements";
import Animation from "lottie-react-native";

// Consts and Libs
import {AppSizes, AppColors, AppStyles, AppFonts} from "@theme/";
import {getImageURL} from "@lib/util";

// Components
import {Image as ImageViewer, Avatar, Badge, Text} from "@ui/";

/* Component ==================================================================== */
class PostCard extends Component {
    static componentName = 'PostCard';

    constructor(props){
        super(props)

        this._onPressOption = this._onPressOption.bind(this);

    }

    static propTypes = {
        post: PropTypes.object.isRequired,
        onPressLike: PropTypes.func.isRequired,
        onPressComments: PropTypes.func.isRequired,
        onPressWatch: PropTypes.func.isRequired,
        onPressAvatar: PropTypes.func
    };


    _onPressLike = async() => {
        const { post , onPressLike} = this.props

        if (!post.gp){
            await this.animation.play();

            onPressLike(post.id, post.pid)
        }
    }



    _onPressOption = () => {
        console.log('options pressed!')
    }

    render = () => {
        const { post , onPressComments, onPressWatch, onPressAvatar } = this.props;

        return (

            <View style={[styles.container, styles.card]}>

                <View style={[styles.cardHeader, AppStyles.row]}>
                    {!!post.pImg ? (
                        <Avatar
                            source={{ uri: getImageURL(post.pImg, true) }}
                            imgKey={post.pImg}
                        />
                    ) : (
                        <Avatar
                            source={{ uri: getImageURL() }}
                        />
                    )}

                    <View style={[styles.postHeaderContainer]}>
                        <View style={[AppStyles.row]}>
                            {/*user name*/}
                            <Text>{post.name}</Text>

                            {/*user badge*/}
                            {!!post.ul && <Badge type={post.ul}/> }

                            {/*user rank*/}
                            {post.ur != -1 && <Text style={[styles.posterRank]}>#{post.ur}</Text> }

                            {/*post options right*/}
                            <View style={styles.postOptions}>
                                <TouchableOpacity  onPress={this._onPressOption}>
                                    <Icon  size={20} color={'#bbbbbb'} name="dots-vertical" type="material-community"/>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={[styles.posterLocation]}>{moment(post.date).fromNow()} @ {post.loc}</Text>
                    </View>
                </View>

                <View style={[styles.cardContent]}>
                    {!!post.img &&
                    <View style={[AppStyles.row, styles.cardImage]}>
                        <ImageViewer
                            disabled={false}
                            source={{ uri: getImageURL(post.img)  }}
                            doubleTapEnabled={true}
                            onMove={(e, gestureState) => null}
                            downloadable={true}
                        />
                    </View>
                    }
                    {!!post.txt &&
                    <View style={AppStyles.row}>
                        <Text style={[styles.postText]}>{post.txt}</Text>
                    </View>
                    }

                </View>
                <View style={[styles.cardAction]}>
                    <View onPress={onPressWatch} style={AppStyles.flex1}>
                        <TouchableOpacity  onPress={onPressWatch}>
                            <View  style={[AppStyles.row, AppStyles.centerAligned]}>
                                <Icon size={28} color={'grey'} type={'foundation'} name={'eye'} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={AppStyles.flex1}>
                        <TouchableOpacity  onPress={onPressComments}>
                            <View style={[AppStyles.row, AppStyles.centerAligned]}>
                                <Icon size={22} color={'grey'} type={'material-community'} name={'comment-processing-outline'}/>
                                {post.cc !== 0 &&
                                <Text style={AppStyles.paddingLeftSml}>{post.cc}</Text>
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={AppStyles.flex1}>
                        <TouchableOpacity  onPress={this._onPressLike} >
                            <View style={[AppStyles.row, AppStyles.centerAligned, {padding:18}]}>
                                {!post.gp ? (
                                    <Animation
                                        ref={animation => { this.animation = animation; }}
                                        style={{
                                              width: 180,
                                              height: 180,
                                              marginTop:-80,
                                              marginBottom:-80,
                                              marginLeft:-80,
                                              marginRight:-80
                                            }}
                                        source={require('../../../animations/like.json')}
                                    />
                                ) : (
                                    <Animation
                                        ref={animation => { this.animation = animation; }}
                                        style={{
                                              width: 180,
                                              height: 180,
                                              marginTop:-80,
                                              marginBottom:-80,
                                              marginLeft:-80,
                                              marginRight:-80
                                            }}
                                        progress={1}
                                        source={require('../../../animations/like.json')}
                                    />
                                )}
                                {post.pc !== 0 &&
                                <Text style={[AppStyles.paddingLeftSml]}>{post.pc}</Text>
                                }
                            </View>
                        </TouchableOpacity>
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
        margin: 10
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 15,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 1,
        shadowOffset: {
            height: 5,
            width: 0.3,
        }
    },

    cardHeader: {
        padding: 10
    },
    cardImage:{
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom:5
    },
    cardContent: {
        paddingRight: 16,
        paddingLeft: 16,
        paddingTop: 6,
        paddingBottom: 16,
    },
    cardAction: {
        marginTop:5,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:'#f1f1f1',
        borderWidth:0.3,
        borderTopRightRadius:0,
        borderTopLeftRadius:0,
        borderRadius:5,
        borderColor:'#b9b9b9'

    },
    separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#E9E9E9'
    },
    posterLocation:{
        color:'gray',
        fontSize:10,
    },
    posterRank:{
        marginLeft:5,
        color:'#828282',
        fontSize:12,
        paddingTop:2
    },
    postText:{
        fontFamily: AppFonts.base.family,
        fontSize: AppFonts.base.size * 0.92,
        color:AppColors.textPrimary
    },
    postOptions:{
        position: 'absolute',
        top: 2,
        bottom:2,
        left: AppSizes.screen.width * 0.72,
    },
    postHeaderContainer:{
        paddingLeft:8
    },
});


/* Export Component ==================================================================== */
export default PostCard;
