import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, View, TextInput, TouchableOpacity, Alert, Button } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient'
import { TextField } from 'react-native-material-textfield'
import PasswordInputText from '../../CustomComponents/PasswordField/passwordInput'
import { ToastAndroid } from 'react-native'
import API from '../../../Services/Api'
import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import Modal from 'react-native-modalbox'
import { Icon } from 'react-native-elements'



// Styles
import styles from './ForgotPasswordScreenStyle'

export default class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      validated: true,
      isDisabled: false,
      resetDisabled : false
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
  modalContinue = () =>{
    this.resetNavigation('ForgotPasswordVerifyScreen')
  }
  resetPassword = () => {
    this.setState({resetDisabled : true})
    const api = API.create();
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.state.email != '') {
      this.setState({ validated: true });
      if (reg.test(this.state.email) === false) {
        ToastAndroid.show('Please enter a valid email address and try again', ToastAndroid.LONG);
        this.setState({ validated: false })
        return false;
      }
      else {
        this.setState({ validated: true })
        api.resetPassword(this.state.email)
          .then(response => {
            console.log(response)
            if (response.status == 200) {
              this.refs.modal3.open()
              //this.props.navigation.navigate('ForgotPasswordVerifyScreen',{userEmail:this.state.email});
              //this.resetNavigation('ForgotPasswordVerifyScreen');
            }
            else {
              ToastAndroid.show('Please check your email and try again', ToastAndroid.LONG);
              this.setState({resetDisabled : false})
            }
          })
          .catch(error => {
            ToastAndroid.show('Please check your email and try again', ToastAndroid.LONG);
            this.setState({resetDisabled : false})
          })
      }
    }
    else {
      ToastAndroid.show('Email cannot be empty', ToastAndroid.LONG);
      this.setState({ validated: false });
    }
  }
  render() {
    return (
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={styles.mainContainerForgot}>
          <KeyboardAwareScrollView style={styles.forgotForm} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={true} automaticallyAdjustContentInsets={false} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
            <View style={styles.headerLogoStyle}>
              <Image
                style={styles.mainLogoHeader}
                resizeMode="cover"
                source={require('../../../Images/Icons/main-app-logo.png')}
              />
            </View>
            <Text style={styles.textStyle}> Forgot Password?
            </Text>
            <Text style={styles.textStyleContinue}> Please enter your email address below to reset your password
            </Text>
            <View style={{ marginTop: 50 }}>
              <TextInput style={[styles.textInput, !this.state.validated ? styles.error : null]} placeholder="Email" placeholderTextColor="#757575" underlineColorAndroid={'#FC3838'} keyboardType={'email-address'}
                autoCapitalize={'none'} autoCorrect={false} onChangeText={(text) => this.setState({ email: text })}
                value={this.state.email}>
              </TextInput>
            </View>
            <TouchableOpacity style={styles.resetButton} onPress={this.resetPassword} disabled={this.state.resetDisabled}>
              <LinearGradient
                colors={['#FC3838', '#F52B43', '#ED0D51']}
                start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
                style={{ height: 48, width: 270, alignItems: 'center', justifyContent: 'center', width: 270, borderRadius: 3 }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>RESET PASSWORD</Text>
              </LinearGradient>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
        <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} backdrop={false} isDisabled={this.state.isDisabled}>
          <Icon
            type='material-community'
            size={60}
            name='check-circle'
            color='#FC3838'
            containerStyle={{
              alignSelf: 'center'
            }}
          />
          <Text style={styles.modalText}>Enter the code sent to your email to reset your password</Text>
          <TouchableOpacity style={styles.resetButton} onPress={this.modalContinue}>
            <LinearGradient
              colors={['#FC3838', '#F52B43', '#ED0D51']}
              start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
              style={{ height: 48, width: 270, alignItems: 'center', justifyContent: 'center', width: 270, borderRadius: 3 }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>OK</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    )
  }
}
