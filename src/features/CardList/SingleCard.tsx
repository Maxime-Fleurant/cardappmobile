import React, { FunctionComponent, useEffect, useState } from 'react';
import { Storage } from 'aws-amplify';
import { ImageBackground, Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import tailwind from 'tailwind-rn';
import { useNavigation } from '@react-navigation/native';

const SingleCard: FunctionComponent<{ name: string; coverImage: string | null }> = ({
  name,
  coverImage,
}) => {
  const [img, setImg] = useState<Object | String>();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchImage = async () => {
      console.log(coverImage);
      if (coverImage) {
        const currentImg = await Storage.get(coverImage);
        setImg(currentImg);
      }
    };

    fetchImage();
  }, []);

  return (
    <Pressable
      style={tailwind('mx-4 mb-4 border border-gray-800')}
      onPress={() => {
        navigation.navigate('Details');
      }}
    >
      <ImageBackground style={tailwind('h-64')} source={{ uri: img as string | undefined }}>
        <LinearGradient
          colors={['rgba(31, 41, 55, 0)', 'rgba(31, 41, 55, 1)']}
          start={{ x: 1, y: 0.4 }}
          end={{ x: 1, y: 1 }}
          style={tailwind('flex-1 p-2 justify-end ')}
        >
          <Text style={tailwind('text-2xl text-gray-100 font-medium')}>{name}</Text>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
};

export default SingleCard;
