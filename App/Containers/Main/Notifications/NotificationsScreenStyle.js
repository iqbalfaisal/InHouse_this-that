import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainerNotifications : {
    backgroundColor: 'white',
  },
  displayNotifications : {
    flexDirection : 'row',
    marginTop : 10
  },
  image : {
    borderRadius : 50,
    width : 35,
    height : 35,
  },
  startText : {
    padding : 4,
    fontSize : 12,
    color : '#FC3838',
  },
  notificationText : {
    fontSize : 12,
    color : 'black'
  },
  notificationAbout : {
    fontSize : 12,
    color : '#FC3838',
    fontWeight : 'bold'
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
  input: {
    flex: 1,
    borderBottomColor : '#FC3838',
    borderBottomWidth : 2,
    backgroundColor: '#fff',
    color: '#424242',
    padding : -5
  },
  mainCard : {
    paddingBottom : 20,
  },
  cardView : {
    flexDirection : "row",
  },
  cardTouchableOpacity : {
    marginTop : -10,
    borderWidth : 0
  },
  image : {
    borderRadius : 40,
    width : 40,
    height : 40,
    marginLeft : -10
  },
  inviteText : {
    paddingTop: 10,
    paddingLeft: 15,
    fontWeight : "bold"
  },
  inviteButton : {
    // paddingLeft : 120
    position: "absolute",
    right: 0
  },
  friendAccept : {
    marginLeft : -175,
    position: "absolute",
    right: 0
  },
  friendDecline : {
    marginLeft : -75,
    position: "absolute",
    right: 0
  },
  inviteButtonText : {
    borderStyle : "solid",
    borderColor : "#BCDEFC",
    borderWidth : 2,
    padding : 10,
    fontWeight : "bold"
  }
})
