import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, View, TextInput, TouchableOpacity, Button } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient'
import { ToastAndroid } from 'react-native'
import API from '../../../../Services/Api'
import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader'
import Modal from 'react-native-modalbox'
import { Header, Icon, Card, Badge, Avatar } from 'react-native-elements'
import { BackHandler } from 'react-native'
import Feather from 'react-native-vector-icons/Feather';
import styles from './MyPollsScreenStyle'

export default class MyPollsScreen extends Component {
  componentDidMount() {
    console.log('my polls screen')
  }
  render() {
    return (
      <ScrollView>
        {/* User Polls */}
        {/* Main Card to show My Polls */}
        <View >
          <Header
            leftComponent={
              <Text style={{ color: '#FC3838', fontWeight: 'bold' }}>My Polls</Text>
            }
            centerComponent={
              <Text></Text>
            }
            rightComponent={
              <Icon
                type='material-community'
                size={25}
                name='filter-variant'
                color='#FC3838'
              />
            }
            containerStyle={{
              backgroundColor: 'white',
              justifyContent: 'space-around',
              borderBottomWidth: 0,
            }}
          />
          <Card containerStyle={{
            shadowColor: 'rgba(252, 56, 56, 0.2)',
            shadowOpacity: 0.5,
            elevation: 3,
            shadowRadius: 10,
            shadowOffset: { width: 1, height: 3 },
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            marginBottom: 20
          }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ alignSelf: 'flex-start' }}>
                <Image
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 25,
                    marginBottom: 20,
                  }}
                  resizeMode='cover'
                  source={require('../../../../Images/SampleStockPhotos/stock1.jpg')}
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FC3838', alignSelf: 'flex-start', marginTop: 5, marginLeft: 5, marginRight: 180 }}>You <Text style={{ color: '#87888F' }}>posted</Text></Text>
                <Icon
                  type='ionicon'
                  size={20}
                  name='md-more'
                  color='#FC3838'
                  containerStyle={{
                    marginTop: 5,
                    position: 'absolute',
                    right: 0,
                  }}
                />
              </View>
            </View>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#87888F', alignSelf: 'flex-start', marginTop: -35, marginLeft: 45, marginBottom: 10 }}>just now</Text>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  style={{
                    height: 150,
                    width: 145,
                    marginRight: 5,
                    marginLeft: 2,
                    borderRadius: 5
                  }}
                  resizeMode='cover'
                  source={require('../../../../Images/SampleStockPhotos/stock1.jpg')}
                />
                <Image
                  style={{
                    height: 150,
                    width: 145,
                    borderRadius: 5
                  }}
                  resizeMode='cover'
                  source={require('../../../../Images/SampleStockPhotos/stock1.jpg')}
                />
              </View>
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20, color: '#242632' }}>Poll Title</Text>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#9B9B9B' }}>This poll will end in 2 hours</Text>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                type='octicon'
                size={20}
                name='comment-discussion'
                color='#FC3838'
                containerStyle={{
                  marginTop: 10,
                  alignSelf: 'flex-start'
                }}
              />
              <Text style={{ marginLeft: 10, marginTop: 9, fontWeight: 'bold', marginRight: 180 }}>37</Text>
              <Image
                style={{
                  height: 25,
                  width: 25,
                  borderRadius: 25,
                  alignSelf: 'flex-end',
                  borderColor: 'white',
                  borderWidth: 1
                }}
                resizeMode='cover'
                source={require('../../../../Images/SampleStockPhotos/stock1.jpg')}
              />
              <Image
                style={{
                  height: 25,
                  width: 25,
                  borderRadius: 25,
                  alignSelf: 'flex-end',
                  marginLeft: -10,
                  borderColor: 'white',
                  borderWidth: 1
                }}
                resizeMode='cover'
                source={require('../../../../Images/SampleStockPhotos/stock2.jpg')}
              />
              <Image
                style={{
                  height: 25,
                  width: 25,
                  borderRadius: 25,
                  alignSelf: 'flex-end',
                  marginLeft: -10,
                  borderColor: 'white',
                  borderWidth: 1
                }}
                resizeMode='cover'
                source={require('../../../../Images/SampleStockPhotos/stock1.jpg')}
              />
              <View style={{
                height: 25,
                width: 25,
                alignSelf: 'flex-end',
                marginLeft: -10,
                marginTop: 5,
                borderRadius: 25,
                backgroundColor: '#FD3F36',
              }}>
                <Text style={{ color: 'white', marginLeft: 4, marginTop: 2, fontSize: 13, fontWeight: 'bold' }}>+6</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    )
  }
}