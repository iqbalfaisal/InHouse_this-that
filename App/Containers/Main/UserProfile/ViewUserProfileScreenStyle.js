import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainerProfile : {
    backgroundColor : 'white',
    paddingLeft : 10,
    paddingRight : 10
  },
  mainProfileHeader : {
    alignSelf : 'center'
  },
  userFullName : {
    marginTop : 20,
    fontWeight : '400',
    color : '#FC3838',
    fontSize : 20
  },
  userNameDisplay : {
    marginTop : 2,
    fontWeight : '400',
    color : 'grey',
    fontSize : 12
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
  addFriendButton: {
    alignSelf: 'stretch',
    alignSelf : 'center',
    marginTop : 30,
    shadowColor: 'rgba(46, 229, 157, 0.2)',
    shadowOpacity: 0.5,
    elevation: 5,
    shadowRadius: 20 ,
    shadowOffset : { width: 1, height: 5},
    backgroundColor: 'rgba(46, 229, 157, 0.2)',
  },
  interestsStyle : {
    marginRight : 10,
    backgroundColor : '#FC3838',
    marginBottom : 5
  },
})
