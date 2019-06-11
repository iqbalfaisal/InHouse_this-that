import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainerRequests : {
    backgroundColor: 'white',
  },
  displayRequests : {
    flexDirection : 'row',
    marginTop : 10
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
  mainCard : {
    paddingBottom : 20,
  },
  cardView : {
    flexDirection : "row",
  },
  cardTouchableOpacity : {
    borderWidth : 0
  },
  image : {
    borderRadius : 50,
    width : 50,
    height : 50,
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
    right: 0,
    zIndex : 99999,
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
  name : {
    padding : 8,
    fontSize : 18,
    marginTop : -8,
    fontWeight : 'bold',
  },
  username : {
    padding : 8,
    fontSize : 15,
    marginTop : -35,
    marginLeft : 40,
  },
})
