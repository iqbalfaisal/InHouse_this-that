import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, View, TextInput, TouchableOpacity, Button } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient'
import { TextField } from 'react-native-material-textfield'
import PasswordInputText from '../../CustomComponents/PasswordField/passwordInput'
import { ToastAndroid } from 'react-native'
import API from '../../../Services/Api'
import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import FBSDK, { LoginManager, AccessToken } from 'react-native-fbsdk'
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk'
import firebase from "react-native-firebase"
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader'
import Modal from 'react-native-modalbox'


// Styles
import styles from './LoginScreenStyle'

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      validated: true,
      passwordvalidation: true,
      userToken: '',
      userId: '',
      logout: false,
      isDisabled: false,
      isOpen: false,
    };
  }
  storeData = async (storeValueName, storeValue) => {
    try {
      await AsyncStorage.setItem(storeValueName, storeValue);
    } catch (error) {
      // Error saving data
    }
  }
  resetNavigation(targetRoute) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: targetRoute, params: { userId: this.state.userId, userToken: this.state.userToken } }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }
  componentDidMount() {
    // this.loginPressed()
    // this.retrieveDataLoginDetails('userTokenGlobal')
  }
  retrieveDataLoginDetails = async (getValue) => {
    try {
      const value = await AsyncStorage.getItem('userTokenGlobal');
      console.log('loginValue', value)
      if (value !== 'false') {
        this.resetNavigation('MainScreen');
      }
    } catch (error) {
      // Error retrieving data
    }
  }
  validate = (text) => {
    this.setState({ email: text })
  }
  getpassword = (text) => {
    this.setState({ password: text })
  }
  testModal = () =>{
    this.refs.modal3.open()
  }
  dismissModal = () =>{
    console.log('dismissModal is called')
    this.refs.modal3.close()
  }
  loginPressed = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.state.email != '' && this.state.password != '') {
      this.setState({ validated: true });
      this.setState({ passwordvalidation: true });
      this.setState({ validated: true });
      const api = API.create();
      this.refs.modal3.open()
      api.postLogin(this.state.email, this.state.password)
        .then(response => {
          console.log(response)
          if (response.data.status == 200) {
            this.refs.modal3.close()
            console.log(response);
            if (response.data.data.userEmail == 'Unverified') {
              Alert.alert(
                'Email Unverified',
                'Please verify your email before logging in.',
                [
                  {
                    text: 'Resend Email',
                    onPress: () => {
                      api.registrationtoken(this.state.email)
                        .then(response => {
                          if (response.status == 200) {
                            ToastAndroid.show('Email sent successfully', ToastAndroid.LONG);
                          }
                        })
                        .catch(error => {
                          ToastAndroid.show('There was an error sending the email, try again later', ToastAndroid.LONG);
                        });
                    }
                  },
                  { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
              )
            }
            else {
              this.setState({ userToken: response.data.data.token });
              this.setState({ userId: response.data.data.userId });
              // console.log(this.state.userId);
              this.storeData('userIDGlobal', response.data.data.userId)
              this.storeData('userTokenGlobal', response.data.data.token)
              console.log(response)
              //this.props.navigation.navigate('HomeScreen');
              this.resetNavigation('MainScreen');
            }
          }
          else {
            this.refs.modal3.close()
            ToastAndroid.show('Invalid credentials, please check your input or signup to continue', ToastAndroid.LONG);
            this.setState({ validated: false });
            this.setState({ passwordvalidation: false });
          }
          console.log(response.status);
        })
        .catch(error => {
          this.refs.modal3.close()
          console.log(error)
          ToastAndroid.show('Invalid credentials, please check your input or signup to continue', ToastAndroid.LONG);
          this.setState({ validated: false });
          this.setState({ passwordvalidation: false });
        });
    }
    else {
      ToastAndroid.show('One of the fields are empty or not set properly', ToastAndroid.LONG);
      if (this.state.email === '') {
        this.setState({ validated: false });
      }
      else if (this.state.password === '') {
        this.setState({ passwordvalidation: false });
      }
    }
  }
  fbAuth() {
    console.log('fbLoginFunctionIsCalled')
    // LoginManager.logInWithReadPermissions(['public_profile']).then(function (result) {
    //   if (result.isCancelled) {
    //     console.log('Login was cancelled')
    //   }
    //   else {
    //     console.log('Login was a success' + result.grantedPermissions.toString())
    //   }
    // }, function (error) {
    //   console.log('An error occurred : ' + error)
    // })
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('login was cancelled')
        } else {
          console.log('Login success with permissions: ' + JSON.stringify(result));

          AccessToken.getCurrentAccessToken().then((data) => {
            const { accessToken } = data
            fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + data.accessToken.toString())
              .then((response) => response.json())
              .then((res) => {
                // var socialOptions = {
                //   email: res.email,
                //   firstName: res.first_name,
                //   lastName: res.last_name,
                //   token: data.accessToken.toString(),
                //   uid: data.userID,
                //   loginType: 'facebook',
                // }
                // console.log(JSON.stringify(socialOptions))
                console.log(JSON.stringify(res))
              })
              .catch((err) => console.log('error occurred', err.message));
          })
        }
      },
      function (error) {
        alert('Login failed with error: ' + error);
      }
    );
  }
  render() {
    return (
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={styles.mainContainerLogin}>
          <KeyboardAwareScrollView style={styles.logForm} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={true} automaticallyAdjustContentInsets={false} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
            <View style={styles.headerLogoStyle}>
              <Image
                style={styles.mainLogoHeader}
                resizeMode="cover"
                source={require('../../../Images/Icons/main-app-logo.png')}
              />
            </View>
            <Text style={styles.textStyle}> Please login to continue!
            </Text>
            <View style={{ marginTop: 10 }}>
              <TextInput style={[styles.textInput, !this.state.validated ? styles.error : null]} placeholder="Username" placeholderTextColor="#757575" underlineColorAndroid={'#FC3838'} keyboardType={'email-address'}
                autoCapitalize={'none'} autoCorrect={false} onChangeText={(text) => this.validate(text)}
                value={this.state.email}></TextInput>
              <PasswordInputText
                style={[styles.textInput, !this.state.passwordvalidation ? styles.error : null]}
                value={this.state.password}
                onChangeText={(password) => this.setState({ password: password })}
              />
            </View>
            <Text style={styles.forgotpass} onPress={() => this.props.navigation.navigate('ForgotPasswordScreen')}>Forgot Password?</Text>
            <TouchableOpacity style={styles.loginButton} onPress={this.loginPressed}>
              <LinearGradient
                colors={['#FC3838', '#F52B43', '#ED0D51']}
                start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
                style={{ height: 48, width: 270, alignItems: 'center', justifyContent: 'center', width: 270, borderRadius: 3 }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>LOGIN</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.orText}>OR</Text>
            <Text style={styles.continueSocialText}>Continue using socials</Text>
            <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
              <TouchableOpacity onPress={this.fbAuth}>
                <Image
                  resizeMode="cover"
                  source={require('../../../Images/Icons/fb.png')}
                />
              </TouchableOpacity>
              <Image
                resizeMode="cover"
                source={require('../../../Images/Icons/twitter.png')}
              />
            </View>
            <Text style={styles.donthaveaccount}>Don't have an account? <Text style={styles.donthaveaccountother} onPress={() => this.props.navigation.navigate('RegisterScreen')}>Sign up</Text></Text>
          </KeyboardAwareScrollView>
        </View>
        <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} backdrop={true} isDisabled={this.state.isDisabled} coverScreen={true} backdropPressToClose={false}>
          <View>
            <Bars size={20} color="#FC3838"/>
          </View>
        </Modal>
      </ScrollView>
    )
  }
}
