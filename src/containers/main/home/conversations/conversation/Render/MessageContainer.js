import React from 'react';
import PropTypes from 'prop-types';
import {
    ListView,
    View
} from 'react-native';

import shallowequal from 'shallowequal';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import md5 from 'md5';
import LoadEarlier from './LoadEarlier';
import Message from './Message';

export default class MessageContainer extends React.Component {
    constructor(props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
        this.renderScrollComponent = this.renderScrollComponent.bind(this);

        const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.hash !== r2.hash
        });

        const messagesData = this.prepareMessages(props.messages);
        this.state = {
            dataSource: dataSource.cloneWithRows(messagesData.blob, messagesData.keys)
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.messages === nextProps.messages) {
            return;
        }
        const messagesData = this.prepareMessages(nextProps.messages);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(messagesData.blob, messagesData.keys)
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!shallowequal(this.props, nextProps)) {
            return true;
        }
        if (!shallowequal(this.state, nextState)) {
            return true;
        }
        return false;
    }

    prepareMessages(messages) {
        return {
            keys: messages.map(m => m.id),
            blob: messages.reduce((o, m, i) => {
                const previousMessage = messages[i + 1] || {};
                const nextMessage = messages[i - 1] || {};
                // add next and previous messages to hash to ensure updates
                const toHash = JSON.stringify(m) + previousMessage.id + nextMessage.id;
                // Todo: Fix me
                // eslint-disable-next-line no-param-reassign
                o[m.id] = {
                    ...m,
                    previousMessage,
                    nextMessage,
                    hash: md5(toHash)
                };
                return o;
            }, {})
        };
    }

    scrollTo(options) {
        this.invertibleScrollViewRef.scrollTo(options);
    }

    renderFooter() {
        if (this.props.renderFooter) {
            const footerProps = {
                ...this.props
            };
            return this.props.renderFooter(footerProps);
        }
        return null;
    }

    renderLoadEarlier() {
        if (this.props.loadEarlier === true) {
            const loadEarlierProps = {
                ...this.props
            };
            return (
                <LoadEarlier {...loadEarlierProps} />
            );
        }
        return null;
    }

    renderRow(message) {
        if (!message.id && message.id !== 0) {
            console.warn('ChatRender: `id` is missing for message', JSON.stringify(message));
        }

        const messageProps = {
            ...this.props,
            key: message.id,
            currentMessage: message,
            previousMessage: message.previousMessage,
            nextMessage: message.nextMessage,
            position: message.dir === 1 ? 'right' : 'left'
        };

        if (this.props.renderMessage) {
            return this.props.renderMessage(messageProps);
        }
        return <Message {...messageProps} />;
    }

    renderScrollComponent(props) {
        return (
            <InvertibleScrollView
                {...props}
                ref={(component) => { this.invertibleScrollViewRef = component; }}
            />
        );
    }
    // enableEmptySections={true}

    render() {
        return (
            // Todo: Fix me
            // eslint-disable-next-line react/no-string-refs
            <View ref='container' style={{flex: 1}}>
                <ListView
                    enableEmptySections
                    automaticallyAdjustContentInsets={false}
                    initialListSize={20}
                    pageSize={20}

                    {...this.props.listViewProps}

                    dataSource={this.state.dataSource}

                    renderRow={this.renderRow}
                    renderHeader={this.renderFooter}
                    renderFooter={this.renderLoadEarlier}
                    renderScrollComponent={this.renderScrollComponent}
                />
            </View>
        );
    }
}

MessageContainer.defaultProps = {
    messages: [],
    user: {},
    renderFooter: null,
    renderMessage: null,
    listViewProps: {},
    onLoadEarlier: () => {
    },
    loadEarlier: true
};

MessageContainer.propTypes = {
    messages: PropTypes.array,
    user: PropTypes.object,
    renderFooter: PropTypes.func,
    renderMessage: PropTypes.func,
    onLoadEarlier: PropTypes.func,
    listViewProps: PropTypes.object,
    loadEarlier: PropTypes.bool
};
