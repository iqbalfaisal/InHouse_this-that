import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainerLogin : {
    backgroundColor : 'white',
    paddingLeft : 20,
    paddingRight : 20,
    alignItems : 'center'
  },
  headerLogoStyle : {
    flex : 1,
    alignSelf : 'center',
  },
  regForm: {
    alignSelf: 'stretch',
  },
  textStyle: {
    fontSize: 15,
    color: '#232632',
    textAlign: 'center',
    paddingBottom: 10,
    marginTop : 20,
    fontWeight : 'bold'
  },
  textInput: {
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 10,
    color: '#757575',
  },
  forgotpass: {
    alignSelf : 'flex-end',
    color: '#FC3838',
    fontWeight : 'bold'
  },
  signupButton: {
    alignSelf: 'stretch',
    alignSelf : 'center',
    marginTop : 20,
    shadowColor: 'rgba(46, 229, 157, 0.2)',
    shadowOpacity: 0.5,
    elevation: 5,
    shadowRadius: 20 ,
    shadowOffset : { width: 1, height: 5},
    backgroundColor: 'rgba(46, 229, 157, 0.2)',
  },
  orText : {
    color : '#232632',
    alignSelf : 'center',
    fontWeight : 'bold',
    marginTop : 20
  },
  continueSocialText : {
    color : '#232632',
    alignSelf : 'center',
    marginTop : 15
  },
  haveaccount : {
    color : '#A9A9A9',
    alignSelf : 'center',
    fontWeight : 'bold',
    marginTop : 30,
  },
  haveaccountother : {
    color : '#FC3838',
    fontWeight : 'bold'
  },
  privacyterms : {
    color : '#FC3838',
    fontWeight : 'bold',
    fontSize : 13,
    alignSelf : 'center',
    marginTop : 20
  },
  error: {
    borderBottomColor: 'red'
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal3: {
    marginTop : 30,
    height: 300,
    width: 300,
    backgroundColor : 'rgba(255,255,255,0)'
  },
})
