import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, View, Image, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CodeInput from 'react-native-confirmation-code-input';
import API from '../../../Services/Api'
import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient'


// Styles
import styles from './ForgotPasswordVerifyScreenStyle'

export default class ForgotPasswordVerifyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }
  resetNavigation(targetRoute) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: targetRoute, params: { userEmail: this.state.email } }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }
  onCodeComplete = (code) => {
    const { navigation } = this.props;
    const userEmail = navigation.getParam('userEmail');
    console.log(userEmail);
    this.setState({ email: userEmail })
    console.log(code);
    const api = API.create();
    api.verifyResetPasswordCode(userEmail, code)
      .then(response => {
        console.log(response)
        if (response.status == 200) {
          //this.props.navigation.navigate('SetupNewPasswordScreen',{userEmail:userEmail});
          this.resetNavigation('ForgotPasswordNewPasswordScreen');
        }
        else {
          ToastAndroid.show('Invalid code or incorrect email, please try again', ToastAndroid.LONG);
        }
      })
      .catch(error => {
        ToastAndroid.show('Invalid code or incorrect email, please try again', ToastAndroid.LONG);
      })
  }
  resendCode = () => {
    const { navigation } = this.props;
    const userEmail = navigation.getParam('userEmail');
    const api = API.create();
    console.log(userEmail);
    api.resetPassword(userEmail)
      .then(response => {
        if (response.status == 200) {
          ToastAndroid.show('Enter the verification code sent to your email', ToastAndroid.LONG)
        }
        else {
          ToastAndroid.show('Could not send the code, try again', ToastAndroid.LONG);
        }
      })
      .catch(error => {
        console.log(error);
        ToastAndroid.show('Could not send the code, try again', ToastAndroid.LONG);
      })
  }
  render() {
    return (
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={styles.mainContainerForgotVerify}>
          <KeyboardAwareScrollView style={styles.forgotVerifyForm} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={true} automaticallyAdjustContentInsets={false} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
            <View style={styles.headerLogoStyle}>
              <Image
                style={styles.mainLogoHeader}
                resizeMode="cover"
                source={require('../../../Images/Icons/main-app-logo.png')}
              />
            </View>
            <Text style={styles.textStyle}> Enter the verification code
        </Text>
            <Text style={styles.textStyleContinue}> Enter the verification code you received in your email
        </Text>
            <CodeInput
              ref="codeInputRef2"
              keyboardType="numeric"
              className='border-box'
              codeLength={6}
              activeColor='black'
              inactiveColor='black'
              autoFocus={true}
              codeInputStyle={{ fontWeight: '800', borderColor: '#FC3838', borderWidth: 2, }}
              onFulfill={(code) => this.onCodeComplete(code)}
            />
            <TouchableOpacity style={styles.resendButton}>
              <LinearGradient
                colors={['#FC3838', '#F52B43', '#ED0D51']}
                start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
                style={{ height: 48, width: 270, alignItems: 'center', justifyContent: 'center', width: 270, borderRadius: 3 }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>RESEND CODE</Text>
              </LinearGradient>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      </ScrollView>
    )
  }
}
