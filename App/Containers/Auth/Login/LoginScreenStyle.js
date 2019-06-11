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
    paddingTop : 30
  },
  logForm: {
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
    marginBottom: 25,
    color: '#757575',
  },
  forgotpass: {
    alignSelf : 'flex-end',
    color: '#FC3838',
    fontWeight : 'bold'
  },
  loginButton: {
    alignSelf: 'stretch',
    alignSelf : 'center',
    marginTop : 30,
    shadowColor: 'rgba(46, 229, 157, 0.2)',
    shadowOpacity: 0.5,
    elevation: 0,
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
    marginTop : 10
  },
  donthaveaccount : {
    color : '#A9A9A9',
    alignSelf : 'center',
    fontWeight : 'bold',
    marginTop : 20,
  },
  donthaveaccountother : {
    color : '#FC3838',
    fontWeight : 'bold'
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
