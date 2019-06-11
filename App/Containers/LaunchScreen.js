import React, { Component } from 'react'
import { Images } from '../Themes'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Platform, StatusBar, SafeAreaView, ScrollView, Text, Image, View, TouchableOpacity } from 'react-native'
import { sliderWidth, itemWidth } from './Styles/SliderEntry.style'
import { ENTRIES1, ENTRIES2 } from './Static/entries'
import { scrollInterpolators, animatedStyles } from './Utils/animations'
import SliderEntry from './SliderEntry'
import LinearGradient from 'react-native-linear-gradient'
import { Button } from 'react-native-elements'

// Styles
import styles from './Styles/LaunchScreenStyles'
const SLIDER_1_FIRST_ITEM = 1;
export default class LaunchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM
    };
  }
  _renderItemWithParallax({ item, index }, parallaxProps) {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
      />
    );
  }
  mainExample(number, title) {
    const { slider1ActiveSlide } = this.state;
    return (
      <View style={styles.exampleContainer}>
        <Carousel
          ref={c => this._slider1Ref = c}
          data={ENTRIES1}
          renderItem={this._renderItemWithParallax}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={true}
          firstItem={SLIDER_1_FIRST_ITEM}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          // inactiveSlideShift={20}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          loop={true}
          loopClonesPerSide={2}
          autoplay={true}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
        />
        <Pagination
          dotsLength={ENTRIES1.length}
          activeDotIndex={slider1ActiveSlide}
          containerStyle={styles.paginationContainer}
          dotColor={'#F42846'}
          dotStyle={styles.paginationDot}
          inactiveDotColor={'#F34671'}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          carouselRef={this._slider1Ref}
          tappableDots={!!this._slider1Ref}
        />
      </View>
    );
  }
  render() {
    const mainSliderGetStarted = this.mainExample(1, 'Default layout | Loop | Autoplay | Parallax | Scale | Opacity | Pagination with tappable dots');
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollview}
            scrollEventThrottle={200}
            directionalLockEnabled={true}
          >
            {mainSliderGetStarted}
          </ScrollView>
          <TouchableOpacity style={styles.getStartedButton} onPress={() => this.props.navigation.navigate('LoginScreen')}>
            <LinearGradient
              colors={['#FC3838', '#F52B43', '#ED0D51']}
              start={{ x: 0.7, y: 1.2 }} end={{ x: 0.9, y: 0.7 }}
              style={{ height: 48, width: 200, alignItems: 'center', justifyContent: 'center', width: 200, borderRadius: 3 }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>GET STARTED</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
