import React, {Component, PropTypes } from "react";
import {
    View,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Animated,
    Easing,
    StyleSheet,
    AsyncStorage,
} from "react-native";

import Video  from 'react-native-video';

import { Actions } from "react-native-router-flux";

// Consts and Libs
import { AppStyles, AppColors, AppSizes, AppFonts } from "@theme/";
import AppAPI from '@lib/api';

// Components
import { LoginButton, AccessToken } from 'react-native-fbsdk'
import {Spacer, Text, Icon } from "@ui/";
import { Alert } from '@ui/alerts/'

// consts
const MARGIN = 40;

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    logo: {
        width: AppSizes.screen.width * 0.55,
        resizeMode: 'contain',
    },
    whiteText: {
        color: '#F1F1F2',
    },
    bottomAction:{
        flex: 1,
        position: 'absolute',
        backgroundColor: '#063852',
        bottom: 0,
        right: 0,
        left: 0,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        opacity:0.5
    },
    input: {
        backgroundColor: '#FFF',
        width: AppSizes.screen.width * 0.88,
        height: 40,
        paddingLeft: 40,
        color: '#5a5a5a',
        borderColor: '#eeeeee',
        borderWidth: 2.0,
        borderRadius:3,
    },
    inputWrapper: {
        flex: 1,
    },
    inlineIcon: {
        position: 'absolute',
        zIndex: 99,
        width: 22,
        height: 22,
        left: 10,
        top: 9,
        opacity:0.5
    },
    googleButton:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dd4b39',
        height: MARGIN,
    },
    facebookButton:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3b5998',
        height: MARGIN,
    },
    buttonSubmit: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#004445',
        height: MARGIN,
        zIndex: 100,
        borderRadius:3,
    },
    buttonSubmitCircle: {
        height: MARGIN,
        width: MARGIN,
        marginTop: -MARGIN,
        borderWidth: 1,
        borderColor: AppColors.brand.primary,
        borderRadius: 100,
        alignSelf: 'center',
        zIndex: 99,
        backgroundColor: AppColors.brand.primary,
    },
    buttonSubmitText: {
        color: 'white',
        backgroundColor: 'transparent',
    },
    socialButtonText:{
        fontSize:AppFonts.base.size * 0.70,
        color:'white',
    },
    buttonSubmitImage: {
        width: 24,
        height: 24,
    },
});

/* Component ==================================================================== */
class Authenticate extends Component {
    static componentName = 'Authenticate';

    static propTypes = {
        emailLogin: PropTypes.func.isRequired,
        facebookLogin: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            email:'Email',
            password:'Password'
        };

        this.buttonAnimated = new Animated.Value(0);
        this.growAnimated = new Animated.Value(0);
    }

    componentDidMount = async () => {
        // Get user email from AsyncStorage to populate fields
        const email = await AsyncStorage.getItem('api/credentials');

        if (email !== null) {
            this.setState({
                email: email,
            });
        }
    };


    _onPressLogin = () => {
        const { email , password, isLoading } = this.state

        // Scroll to top, to show message
        if (this.scrollView) {
            this.scrollView.scrollTo({ y: 0 });
        }

        if (isLoading) return;

        if (email && password) {

            this.setState({ isLoading: true });
            Animated.timing(
                this.buttonAnimated,
                {
                    toValue: 1,
                    duration: 200,
                    easing: Easing.linear
                }
            ).start();

            this.props.emailLogin({
                email: email,
                password: password,
            }, true).then(() => {
                setTimeout(() => {
                    this._onGrow();
                }, 2000);
                setTimeout(() => {
                    Actions.app({ type: 'reset' })
                }, 2300);

            }).catch((err) => {
                const error = AppAPI.handleError(err);
                this.buttonAnimated.setValue(0);
                this.setState({
                    isLoading:false,
                })

                Alert.show(error, {
                    type:'error'
                })

            });

        }
    }

    _onFacebookLoginFinished = (error, result) => {
        if (error) {
            Alert.show(error, {
                type:'error'
            })
        } else {

            if (result.isCancelled){
                return null
            }

            AccessToken.getCurrentAccessToken().then(
                (data) => {

                    this.setState({ isLoading: true });
                    Animated.timing(
                        this.buttonAnimated,
                        {
                            toValue: 1,
                            duration: 200,
                            easing: Easing.linear
                        }
                    ).start();

                    this.props.facebookLogin(data.accessToken.toString()).then(() => {
                        setTimeout(() => {
                            this._onGrow();
                        }, 2000);
                        setTimeout(() => {
                            Actions.app({ type: 'reset' })
                        }, 2300);

                    })
                }
            )

        }
    }

    _onGrow = () => {
        Animated.timing(
            this.growAnimated,
            {
                toValue: 1,
                duration: 200,
                easing: Easing.linear
            }
        ).start();
    }

    focusNextField = (nextField) => { this.refs[nextField].focus(); };


    render () {
        const changeWidth = this.buttonAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [AppSizes.screen.width - MARGIN, MARGIN]
        });
        const changeScale = this.growAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [1, MARGIN]
        });

        return (
            <View style={[AppStyles.container, AppStyles.windowSize]}>

                <Video source={require('../../assets/video/390214194mp4.mp4')}
                       style={styles.backgroundVideo}
                       rate={1} volume={1} muted={true}
                       resizeMode="cover" repeat={true} key="video1" />


                <Spacer size={50}/>

                <View style={[AppStyles.row, AppStyles.paddingHorizontal, AppStyles.centerAligned]}>
                    <Text style={{
                                color:'#F8F5F2',
                                fontSize:65,
                                fontFamily: AppFonts.base.familyBold
                            }}>N</Text>
                    <Text style={{
                                color:'#F8F5F2',
                                fontSize:35,
                                fontFamily: AppFonts.base.familyBold
                            }}>earby</Text>
                </View>

                <View style={[AppStyles.row, AppStyles.paddingHorizontal, AppStyles.centerAligned]}>
                    <Text style={{
                                color:'#F8F5F2',
                                fontSize:10,
                                fontFamily: AppFonts.base.familyBold
                            }}>Meet Nearby People</Text>
                </View>

                <Spacer size={80}/>

                <View style={[AppStyles.row, AppStyles.paddingHorizontal]}>
                    <View style={styles.inputWrapper}>
                        <View style={styles.inlineIcon}>
                            <Icon
                                name='email'
                                type='entypo'
                                color='#66A5AD'
                                size={20}
                            />
                        </View>
                        <TextInput style={styles.input}
                                   keyboardType="email-address"
                                   placeholder={'Email'}
                                   autoCorrect={false}
                                   returnKeyType="next"
                                   placeholderTextColor='#66A5AD'
                                   underlineColorAndroid='transparent'
                                   onSubmitEditing={() => this.focusNextField('password')}
                                   onChangeText={(email) => {this.setState({email})}}
                        />
                    </View>
                </View>

                <Spacer size={10}/>

                <View style={[AppStyles.row, AppStyles.paddingHorizontal]}>
                    <View style={styles.inputWrapper}>
                        <View style={styles.inlineIcon}>
                            <Icon
                                name='lock'
                                color='#66A5AD'
                                size={20}
                            />
                        </View>
                        <TextInput style={styles.input}
                                   ref="password"
                                   placeholder={'Password'}
                                   secureTextEntry={true}
                                   autoCorrect={false}
                                   returnKeyType={'done'}
                                   placeholderTextColor='#66A5AD'
                                   underlineColorAndroid='transparent'
                                   onChangeText={(password) => {this.setState({password})}}
                        />
                    </View>
                </View>

                <Spacer size={10}/>

                <View style={[AppStyles.row, AppStyles.padding, AppStyles.centerAligned]}>
                    <Animated.View style={{width: changeWidth}}>
                        <TouchableOpacity style={styles.buttonSubmit}
                                          onPress={this._onPressLogin}
                                          activeOpacity={1} >
                            {this.state.isLoading ?
                                <Image source={require('../../images/loading.gif')} style={styles.buttonSubmitImage} />
                                :
                                <Text style={[styles.buttonSubmitText]}>Login to account</Text>
                            }
                        </TouchableOpacity>
                        <Animated.View style={[ styles.buttonSubmitCircle, {transform: [{scale: changeScale}]} ]} />
                    </Animated.View>
                </View>


                <Text h5 style={[AppStyles.textCenterAligned, styles.whiteText]}>
                    - or -
                </Text>

                <Spacer size={20}/>

                <View style={[AppStyles.row, AppStyles.paddingHorizontal]}>
                    <View style={[AppStyles.flex1, AppStyles.centerAligned]}>
                        <LoginButton
                            onLoginFinished={this._onFacebookLoginFinished}
                        />
                    </View>
                </View>



                <Spacer size={30}/>


                {/*<View style={[AppStyles.row, styles.bottomAction]}>*/}
                {/*<Text style={[styles.whiteText]} onPress={()=>{console.log('lost password')}}> Forget password ?</Text>*/}
                {/*</View>*/}

            </View>
        )
    }
}

/* Export Component ==================================================================== */
export default Authenticate;
