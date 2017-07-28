'use strict';

import React, { Component } from 'react';
import {
    ListView,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

// Actions
import { Actions } from 'react-native-router-flux';


// Consts and libs
import { AppStyles, AppSizes, AppFonts } from '@theme/';

// Components
import { Text } from "@ui/";
import { getImageURL } from '@lib/util'


let styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});

class GiftGrid extends React.Component {

    constructor() {
        super();

        this.state = {
            data: new ListView.DataSource({
                rowHasChanged: (r1, r2) => { r1 !== r2; }
            }),
        }
    }

    buildRows(items, itemsPerRow = 3) {
        return items.reduce((rows, item, idx) => {
            if(idx % itemsPerRow === 0 && idx > 0) rows.push([]);
            rows[rows.length-1].push(item);
            return rows;
        }, [[]]);
    }

    render() {
        let rows = this.buildRows(this.props.data, this.props.itemsPerRow);

        return (
            <ListView
                { ...this.props }
                dataSource = { this.state.data.cloneWithRows(rows) }
                renderRow = { this.renderRow.bind(this) }
                style = {{ flex: 1 }} />
        );
    }

    renderRow(items) {
        let itemsPerRow = this.props.itemsPerRow;
        let margin = this.props.itemMargin || 1;

        let totalMargin = margin * (itemsPerRow - 1);
        let itemWidth = Math.floor( (AppSizes.screen.width - totalMargin) / itemsPerRow );
        let adjustedMargin = ( AppSizes.screen.width - (itemsPerRow*itemWidth) ) / (itemsPerRow - 1);

        return (
            <View style = {[ styles.row, { marginBottom: adjustedMargin } ]}>
                { items.map(item => this.props.renderItem(item, itemWidth)) }
                { itemsPerRow - items.length > 0 && <View style={{width: itemWidth * (itemsPerRow - items.length)}} />}
            </View>
        );
    }

}



class UserGiftsRender extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: this.props.gifts,
        };
    }



    render() {
        return(
            <GiftGrid
                data = { this.state.items }
                itemsPerRow = { 3 }
                itemMargin = { 1 }
                renderItem = { this.renderItem }
            />

        );
    }

    renderItem = (item, itemSize) => {
        return(
                <TouchableOpacity onPress={() => {Actions.userProfileView({userID: item.giverid,});}} style={[AppStyles.centerAligned, { width:itemSize,height:itemSize}]}>
                    <Image
                        style={{
                        position: 'absolute',
                        left:(itemSize / 2) - 35,
                        top:5,
                        width:itemSize * 0.60,
                        height:itemSize * 0.60
                    }}
                        source={{uri:`https://nearbydata.blob.core.windows.net/gifts/gift_${item.id}.png`}}
                    />
                    <View
                        style={[AppStyles.centerAligned,{
                        position: 'absolute',
                        backgroundColor:'#364150',
                        opacity:0.7,
                        width:itemSize,
                        height:itemSize * 0.30,
                        bottom:0
                    }]}
                    >
                        <Text
                            style={[
                            {
                            fontSize:AppFonts.base.size * 0.8,
                            color:'#FCFCFA',
                            textAlign:'center'
                        }]}
                        >{item.giver}</Text>
                    </View>
                </TouchableOpacity>



        )
    }

}

export default UserGiftsRender;