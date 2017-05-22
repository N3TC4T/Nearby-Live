import moment from "moment";

import React, {Component, PropTypes} from "react";

import {
    StyleSheet,
    Image,
    View,
} from 'react-native'

// Consts and Libs
import { AppSizes, AppColors, AppStyles, AppFonts } from '@theme/';
import {  getImageURL } from "@lib/util";

// Components
import {Image as ImageViewer, Avatar, Badge, Text} from "@ui/"

/* Component ==================================================================== */
class CommentCard extends Component {
    static componentName = 'CommentCard';

    static propTypes = {
        comment: PropTypes.object.isRequired,
        ownerId:PropTypes.string.isRequired,
        onPressAvatar: PropTypes.func
    };

    render = () => {
        const { comment, ownerId, onPressAvatar } = this.props;

        return (
            <View>
                <View style={[AppStyles.flex1, styles.container]}>
                    <View style={[AppStyles.row]}>
                        {!!comment.pImg ? (
                            <Avatar
                                source={{ uri: getImageURL(comment.pImg, true) }}
                                imgKey={comment.pImg}
                            />
                        ) : (
                            <Avatar
                                source={{ uri: getImageURL() }}
                            />
                        )}

                        <View style={[styles.commentHeaderContainer]}>
                            <View style={[AppStyles.row]}>
                                <Text style={[styles.commenterName]}>{comment.name}</Text>
                                {comment.pid === ownerId && <Badge type={'owner'}/> }
                            </View>

                            <Text style={[styles.commenterLocation]}>{moment(comment.date).fromNow()}  @ {comment.loc}</Text>
                        </View>
                    </View>

                    <View style={[styles.commentContent, AppStyles.leftAligned]}>
                        {!!comment.img ? (
                            <View style={[AppStyles.row, styles.commentImage]}>
                                <ImageViewer
                                    disabled={false}
                                    source={{ uri: getImageURL(comment.img)  }}
                                    doubleTapEnabled={true}
                                    onMove={(e, gestureState) => null}
                                    downloadable={true}
                                    imageStyle={{width:200}}
                                />

                            </View>
                        ) : (
                            <View style={[AppStyles.row]}>
                                <Text style={[styles.commentText]}>{comment.txt}</Text>
                            </View>
                        )}

                    </View>
                </View>

            </View>

        );
    }
}


/* Component Styles ==================================================================== */

const styles = StyleSheet.create({
    container: {
        marginLeft: AppSizes.paddingSml,
        marginRight: AppSizes.paddingSml,
        marginTop:AppSizes.paddingSml,
    },
    commentHeader: {
        paddingTop:10

    },
    commentHeaderContainer:{
        paddingLeft:8
    },
    commentContent: {
        marginTop:2,
        marginLeft:42,
    },
    commentImage:{
        paddingTop:10
    },
    commenterLocation:{
        color:'gray',
        fontSize:AppFonts.base.size * 0.65,
    },
    commenterName:{
        fontFamily: AppFonts.base.familyBold,
        fontSize: AppFonts.base.size * 0.85,
        color:"#ffffff"
    },
    commentText:{
        fontFamily: AppFonts.base.family,
        fontSize: AppFonts.base.size * 0.80,
        color:AppColors.textPrimary,
    }
});


/* Export Component ==================================================================== */
export default CommentCard;
