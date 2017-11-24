import React, {Component} from 'react';
import {
    InteractionManager,
    ListView,
    StyleSheet,
    View
} from 'react-native';

import PropTypes from 'prop-types';

import {AppStyles, AppSizes} from '@theme/';

import {Image, Text} from '@ui/';
import Loading from '@components/general/Loading';

import {getImageURL} from '@lib/util';
import AppAPI from '@lib/api';

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

// Todo: Move component to another file
class PhotoGrid extends React.Component {
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
                /* eslint react/jsx-no-bind: "off" */
                // Todo: Fix me
                renderRow={this.renderRow.bind(this)}
                style={{flex: 1}}
            />
        );
    }
}

class UserPhotosRender extends Component {
    static propTypes = {
        pid: PropTypes.string.isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            photos: null,
            error: null,
            isLoading: false
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchUserPhotos();
        });
    }

    fetchUserPhotos = () => {
        this.setState({isLoading: true, error: null});

        const {pid} = this.props;

        AppAPI.people.get({id: pid, mini: true, photos: true})
            .then((res) => {
                this.setState({
                    photos: res.photos,
                    isLoading: false,
                    error: null
                });
            }).catch((err) => {
                const error = AppAPI.handleError(err);
                this.setState({
                    error
                });
            });
    }

    renderItem = (item, itemSize) => (
        <Image
            key={item}
            disabled={false}
            source={{uri: getImageURL(item)}}
            doubleTapEnabled
            downloadable
            imageStyle={[AppStyles.flex1]}
            containerStyle={{width: itemSize, height: itemSize}}
        />

    )

    render() {
        const {isLoading, photos, error} = this.state;

        if (isLoading || !photos) {
            return <Loading text='Loading Photos...' />;
        }

        // Todo: Better Error handling
        if (error) {
            return <Text>Cant Load Photos</Text>;
        }

        return (
            <PhotoGrid
                data={this.state.photos}
                itemsPerRow={3}
                itemMargin={1}
                renderItem={this.renderItem}
            />

        );
    }
}

export default UserPhotosRender;
