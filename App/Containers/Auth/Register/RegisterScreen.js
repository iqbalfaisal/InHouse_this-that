import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, View, TextInput, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient'
import PasswordInputText from '../../CustomComponents/PasswordField/passwordInput'
import { ToastAndroid } from 'react-native'
import API from '../../../Services/Api'
import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader'
import Modal from 'react-native-modalbox'
import { Header, Icon, Card, Badge } from 'react-native-elements'

// Styles
import styles from './RegisterScreenStyle'

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      username: '',
      validated: true,
      namevalidation: true,
      usernamevalidation: true,
      passwordvalidation: true,
      deviceToken: '',
      fullname: '',
      userId : '',
      userToken : '',
    };
  }
  resetNavigation(targetRoute) {
    console.log('resetNavigationUSERID',this.state.userId)
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: targetRoute, params: { user_id: this.state.userId, user_token : '1231236zxc6as6123xc' } }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }
  retrieveDeviceToken = async (getValue) => {
    console.log('retriveDeviceToken')
    try {
      const value = await AsyncStorage.getItem('deviceToken');
      if (value !== '') {
        this.setState({ deviceToken: value })
        //console.log('deviceTokenFromState',this.state.deviceToken);
      }
    } catch (error) {
      // Error retrieving data
    }
  }
  componentDidMount() {
    this.retrieveDeviceToken('deviceToken');
  }
  signUpPressed = () => {
    const api = API.create();
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let usernameRegex = /^[a-zA-Z0-9]+$/;
    let fullNameRegex = /^[a-zA-Z\s]*$/;
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    console.log(this.state.password)
    if (this.state.email != '' && this.state.fullname != '' && this.state.username != '' && this.state.password != '') {
      this.setState({ validated: true });
      this.setState({ namevalidation: true });
      this.setState({ usernamevalidation: true });
      this.setState({ passwordvalidation: true });
      if (reg.test(this.state.email) === false) {
        ToastAndroid.show('Please enter a valid email address and try again', ToastAndroid.LONG);
        this.setState({ validated: false })
        return false;
      }
      else {
        this.setState({ validated: true })
        console.log("Email is Correct");
        if (usernameRegex.test(this.state.username) === false) {
          ToastAndroid.show('Username cannot contain special charaters, try again', ToastAndroid.LONG);
          this.setState({ usernamevalidation: false })
          return false;
        }
        else {
          this.setState({ usernamevalidation: true })
          if (fullNameRegex.test(this.state.name) === false) {
            ToastAndroid.show('Your name cannot contain special charaters, try again', ToastAndroid.LONG);
            this.setState({ namevalidation: false })
            return false;
          }
          else {
            if (passwordRegex.test(this.state.password) === false) {
              ToastAndroid.show('Password must contain: One uppercase and lowercase character followed by atleast 1 number and special character with minimum of 8 characters in total', ToastAndroid.LONG);
              this.setState({ passwordvalidation: false });
              return false;
            }
            else {
              this.refs.modal3.open()
              this.setState({ passwordvalidation: true })
              api.registration(this.state.username, this.state.email, this.state.password, this.state.fullname, this.state.deviceToken)
                .then(response => {
                  console.log(response)
                  if (response.status == 200) {
                    this.setState({userId : response.data.data.user_id})
                    console.log(this.state.userId)
                    api.registrationtoken(this.state.email)
                      .then(response => {
                        console.log(response)
                        if (response.status == 200) {
                          this.refs.modal3.close()
                          ToastAndroid.show('An email was sent to you, please verify it before logging in', ToastAndroid.LONG);
                          this.resetNavigation('DefaultInterestsScreen');
                        }
                      })
                      .catch(error => {
                        console.log(error)
                        ToastAndroid.show('There was an error sending the email, try again later', ToastAndroid.LONG);
                      });
                  }
                  else if (response.status == 400) {
                    this.refs.modal3.close()
                    ToastAndroid.show('Email already registered or username is taken', ToastAndroid.LONG);
                    this.setState({ validated: false });
                    this.setState({ usernamevalidation: false });
                  }
                })
                .catch(error => {
                  this.refs.modal3.close()
                  console.log(error)
                  ToastAndroid.show('Email already registered or username is taken', ToastAndroid.LONG);
                  this.setState({ validated: false });
                  this.setState({ usernamevalidation: false });
                });
            }
          }
        }
      }
    }
    else {
      ToastAndroid.show('One of the fields are empty or not set properly', ToastAndroid.LONG);
      if (this.state.email === '') {
        this.setState({ validated: false })
      }
      else if (this.state.fullname === '') {
        this.setState({ namevalidation: false })
      }
      else if (this.state.username === '') {
        this.setState({ usernamevalidation: false })
      }
      else if (this.state.password === '') {
        this.setState({ passwordvalidation: false })
      }
      this.setState({ validated: false })
      this.setState({ namevalidation: false })
      this.setState({ usernamevalidation: false })
      this.setState({ passwordvalidation: false })
    }
  }
  render() {
    return (
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={styles.mainContainerLogin}>
          <KeyboardAwareScrollView style={styles.regForm} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={true} automaticallyAdjustContentInsets={false} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
            <View style={styles.headerLogoStyle}>
              <Image
                style={styles.mainLogoHeader}
                resizeMode="cover"
                source={require('../../../Images/Icons/main-app-logo.png')}
              />
            </View>
            <Text style={styles.textStyle}> Let's create an account
            </Text>
            <View style={{ marginTop: 30 }}>
              <TextInput style={[styles.textInput, !this.state.namevalidation ? styles.error : null]} placeholder="Full Name" placeholderTextColor="#757575" underlineColorAndroid={'#FC3838'} keyboardType={'default'}
                autoCapitalize={'none'} autoCorrect={false} onChangeText={(fullname) => this.setState({ fullname: fullname })}
                value={this.state.fullname}>
              </TextInput>
              <TextInput style={[styles.textInput, !this.state.usernamevalidation ? styles.error : null]} placeholder="Username" placeholderTextColor="#757575" underlineColorAndroid={'#FC3838'} keyboardType={'default'}
                autoCapitalize={'none'} autoCorrect={false} onChangeText={(username) => this.setState({ username: username })}
                value={this.state.username}>
              </TextInput>
              <TextInput style={[styles.textInput, !this.state.validated ? styles.error : null]} placeholder="Email" placeholderTextColor="#757575" underlineColorAndroid={'#FC3838'} keyboardType={'email-address'}
                autoCapitalize={'none'} autoCorrect={false} onChangeText={(email) => this.setState({ email: email })}
                value={this.state.email}>
              </TextInput>
              <PasswordInputText
                style={[styles.textInput, !this.state.passwordvalidation ? styles.error : null]}
                value={this.state.password}
                onChangeText={(password) => this.setState({ password: password })}
              />
              {/* <TextInput style={[styles.textInput, !this.state.passwordvalidation ? styles.error : null]} placeholder="Password" placeholderTextColor="#757575" underlineColorAndroid={'#FC3838'} secureTextEntry={true} onChangeText={(text) => this.getpassword(text)} value={this.state.password} maxLength={25} autoCapitalize={'none'} autoCorrect={false}></TextInput> */}
            </View>
            <TouchableOpacity style={styles.signupButton} onPress={this.signUpPressed}>
              <LinearGradient
                colors={['#FC3838', '#F52B43', '#ED0D51']}
                start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
                style={{ height: 48, width: 270, alignItems: 'center', justifyContent: 'center', width: 270, borderRadius: 3 }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>SIGN UP</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.haveaccount}>Already have an account? <Text style={styles.haveaccountother} onPress={() => this.props.navigation.navigate('LoginScreen')}>Log in</Text></Text>
            <Text style={styles.privacyterms}>Privacy - Terms and Conditions</Text>
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
