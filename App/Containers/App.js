import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import RootContainer from './RootContainer'
import createStore from '../Redux'
import firebase from 'react-native-firebase'
import { AsyncStorage } from "react-native"
import PubNubReact from 'pubnub-react';
import { NavigationActions } from 'react-navigation'

var PushNotification = require('react-native-push-notification');

// create our store
const store = createStore()


/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({
        publishKey: 'pub-c-2df6bd48-0dad-40af-a0a0-b0e193bae137',
        subscribeKey: 'sub-c-bc6b661e-f7a3-11e8-b085-b2b44c5b7fba'
    });
    this.pubnub.init(this);
    PushNotification.configure({
      // Called when Token is generated.
      onRegister: function(token) {
          console.log( 'TOKEN:', token );
          this.storeData('deviceToken',token.token);
          if (token.os == "ios") {
            this.pubnub.push.addChannels(
            {
              channels: ['notifications'],
              device: token.token,
              pushGateway: 'apns'
            });
            // Send iOS Notification from debug console: {"pn_apns":{"aps":{"alert":"Hello World."}}}
          } else if (token.os == "android"){
            this.pubnub.push.addChannels(
            {
              channels: ['notifications'],
              device: token.token,
              pushGateway: 'gcm' // apns, gcm, mpns
            });
            // Send Android Notification from debug console: {"pn_gcm":{"data":{"message":"Hello World."}}}
          }  
      }.bind(this),
      // Something not working?
      // See: https://support.pubnub.com/support/solutions/articles/14000043605-how-can-i-troubleshoot-my-push-notification-issues-
      // Called when a remote or local notification is opened or received.
      onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
        // Do something with the notification.
        // Required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // ANDROID: GCM or FCM Sender ID
      senderID: "814833699979",
  });
}
  storeData = async (storeValueName, storeValue) => {
    console.log('storeDataisCalled',storeValue)
    try {
      await AsyncStorage.setItem(storeValueName, storeValue);
      console.log('deviceTokenSavedStoreData',storeValue)
    } catch (error) {
      // Error saving data
    }
  }
  render () {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}

// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron
  ? console.tron.overlay(App)
  : App
