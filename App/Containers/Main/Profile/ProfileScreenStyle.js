import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainerProfile : {
    backgroundColor : 'white',
    height : 90,
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
})
