import React, {Component} from 'react';
import {
    ListView,
    StyleSheet,
    View,
    Image,
    TouchableOpacity
} from 'react-native';

import PropTypes from 'prop-types';

// Actions
import {Actions} from 'react-native-router-flux';

// Consts and libs
import {AppStyles, AppSizes, AppFonts} from '@theme/';

// Components
import {Text} from '@ui/';

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

// Todo: Move component to another file
/* Component ==================================================================== */
class GiftGrid extends Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
        itemsPerRow: PropTypes.number.isRequired,
        itemMargin: PropTypes.number.isRequired,
        renderItem: PropTypes.func.isRequired
    };

    constructor() {
        super();

        this.state = {
            data: new ListView.DataSource({
                // Todo: Fix me
                // eslint-disable-next-line no-unused-expressions
                rowHasChanged: (r1, r2) => { r1 !== r2; }
            })
        };
    }

    buildRows(items, itemsPerRow = 3) {
        return items.reduce((rows, item, idx) => {
            if (idx % itemsPerRow === 0 && idx > 0) {rows.push([]);}
            rows[rows.length - 1].push(item);
            return rows;
        }, [[]]);
    }

    renderRow(items) {
        const {itemsPerRow} = this.props;
        const margin = this.props.itemMargin || 1;

        const totalMargin = margin * (itemsPerRow - 1);
        const itemWidth = Math.floor((AppSizes.screen.width - totalMargin) / itemsPerRow);
        const adjustedMargin = (AppSizes.screen.width - (itemsPerRow * itemWidth)) / (itemsPerRow - 1);

        return (
            <View style={[styles.row, {marginBottom: adjustedMargin}]}>
                { items.map(item => this.props.renderItem(item, itemWidth)) }
                { itemsPerRow - items.length > 0 && <View style={{width: itemWidth * (itemsPerRow - items.length)}} />}
            </View>
        );
    }

    render() {
        const rows = this.buildRows(this.props.data, this.props.itemsPerRow);

        return (
            <ListView
                {...this.props}
                dataSource={this.state.data.cloneWithRows(rows)}
                // Todo: Fix me
                // eslint-disable-next-line react/jsx-no-bind
                renderRow={this.renderRow.bind(this)}
                style={{flex: 1}}
            />
        );
    }
}

class UserGiftsRender extends Component {
    static propTypes = {
        gifts: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            items: this.props.gifts
        };
    }

    renderItem = (item, itemSize) => (
        <TouchableOpacity onPress={() => { Actions.userProfileView({userID: item.giverid}); }} style={[AppStyles.centerAligned, {width: itemSize, height: itemSize}]}>
            <Image
                style={{
                    position: 'absolute',
                    left: (itemSize / 2) - 35,
                    top: 5,
                    width: itemSize * 0.60,
                    height: itemSize * 0.60
                }}
                source={{uri: `https://nearbydata.blob.core.windows.net/gifts/gift_${item.id}.png`}}
            />
            <View
                style={[AppStyles.centerAligned, {
                    position: 'absolute',
                    backgroundColor: '#364150',
                    opacity: 0.7,
                    width: itemSize,
                    height: itemSize * 0.30,
                    bottom: 0
                }]}>
                <Text
                    style={[
                        {
                            fontSize: AppFonts.base.size * 0.8,
                            color: '#FCFCFA',
                            textAlign: 'center'
                        }]}>{item.giver}
                </Text>
            </View>
        </TouchableOpacity>

    )

    render() {
        return (
            <GiftGrid
                data={this.state.items}
                itemsPerRow={3}
                itemMargin={1}
                renderItem={this.renderItem}
            />

        );
    }
}

export default UserGiftsRender;
