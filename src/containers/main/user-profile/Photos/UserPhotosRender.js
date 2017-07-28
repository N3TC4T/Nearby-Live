'use strict';

import React, { Component } from 'react';
import {
    InteractionManager,
    ListView,
    StyleSheet,
    View,
} from 'react-native';

import { AppStyles, AppSizes } from '@theme/';

import { Image } from "@ui/";
import Loading from '@components/general/Loading';


import { getImageURL } from '@lib/util'
import AppAPI from '@lib/api';



let styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});

class PhotoGrid extends React.Component {

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



class UserPhotosRender extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            photos:null,
            error:null,
            isLoading:false,
        };
    }

    componentDidMount () {
        InteractionManager.runAfterInteractions(() => {
            this.fetchUserPhotos();
        });
    }


    fetchUserPhotos = () => {

        this.setState({ isLoading:true, error: null })

        const { pid } = this.props

        AppAPI.people.get({id:pid, mini:true, photos:true})
            .then((res) => {
                this.setState({
                    photos:res.photos,
                    isLoading: false,
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

    renderItem = (item, itemSize) => {
        return(
            <Image
                key={item}
                disabled={false}
                source={{ uri: getImageURL(item)   }}
                doubleTapEnabled={true}
                onMove={(e, gestureState) => null}
                downloadable={true}
                imageStyle={[AppStyles.flex1 ]}
                containerStyle={{width:itemSize, height:itemSize }}
            />


        )
    }



    render() {
        const { isLoading,  photos } = this.state;


        if (isLoading || !photos ) {
            return <Loading text={'Loading Photos...'} />
        }


        return(
            <PhotoGrid
                data = { this.state.photos }
                itemsPerRow = { 3 }
                itemMargin = { 1 }
                renderItem = { this.renderItem }
            />

        );
    }

}

export default UserPhotosRender;