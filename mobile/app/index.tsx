import { View, Text } from 'react-native'
import React from 'react'
import MaskedCarousel from '../animation/MaskedCarousel'

const index = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          position: 'absolute',
          top: 100,
          left: 16,
          right: 16,
          textAlign: 'center',
          color: '#CFCFCF',
          zIndex: 1000,
          paddingVertical: 6,
          paddingHorizontal: 8,
          fontSize: 40,
          fontFamily: 'Poppins_600SemiBold',
        }}
      >
        codewithbaris
      </Text>
      <MaskedCarousel />
    </View>
  )
}

export default index