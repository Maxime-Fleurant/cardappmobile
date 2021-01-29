import React from 'react';
import { Text, View } from 'react-native';
import tailwind from 'tailwind-rn';

const Splash = () => {
  return (
    <View style={tailwind('bg-gray-100 flex-1')}>
      <Text>Splash</Text>
    </View>
  );
};

export default Splash;
