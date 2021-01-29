import React, { useEffect, useState } from 'react';
import { ImageBackground, Platform, Pressable, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { Storage } from 'aws-amplify';
import tailwind from 'tailwind-rn';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { gql, useMutation } from '@apollo/client';
import { CreateCardMutation, CreateCardMutationVariables } from '../../API';
import { createCard } from '../../graphql/mutations';

const CreateCard = () => {
  const [image, setImage] = useState<ImageInfo | undefined>();
  const [title, setTitle] = useState<string | undefined>();
  const [desc, setDesc] = useState<string | undefined>();

  const [addCard] = useMutation<CreateCardMutation, CreateCardMutationVariables>(
    gql`
      ${createCard}
    `
  );

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result);
    }
  };

  const saveCard = async () => {
    if (image && desc && title) {
      const fileName = image.uri.split('/').pop() as string;
      const response = await fetch(image.uri);
      const blob = await response.blob();
      await Storage.put(fileName, blob);
      await addCard({
        variables: {
          input: {
            name: title,
            description: desc,
            coverImage: fileName,
          },
        },
      });
    }
  };

  return (
    <View style={tailwind('bg-gray-100 flex-1 p-4')}>
      <View style={tailwind('mb-8 ')}>
        <Pressable onPress={pickImage} style={tailwind('border border-gray-800')}>
          {image ? (
            <ImageBackground source={{ uri: image.uri }} style={tailwind(' h-64 ')}>
              <LinearGradient
                colors={['rgba(31, 41, 55, 0)', 'rgba(31, 41, 55, 1)']}
                start={{ x: 1, y: 0.4 }}
                end={{ x: 1, y: 1 }}
                style={tailwind('flex-1 p-2 justify-end ')}
              >
                <Text style={tailwind('text-2xl text-gray-100 font-medium')}>
                  {title || 'Title'}
                </Text>
              </LinearGradient>
            </ImageBackground>
          ) : (
            <View style={tailwind('flex-initial items-center justify-center h-64 p-4')}>
              <Text style={tailwind('text-2xl text-gray-800 font-medium')}>Add Cover</Text>
            </View>
          )}
        </Pressable>
      </View>
      <View style={tailwind('mb-8')}>
        <Text style={tailwind('mb-2 text-xl text-gray-800')}>Title</Text>
        <TextInput
          placeholder="Title"
          style={tailwind('border border-gray-800 p-4')}
          onChangeText={(val) => {
            setTitle(val);
          }}
        />
      </View>
      <View style={tailwind('mb-8')}>
        <Text style={tailwind('mb-2 text-xl text-gray-800')}>Description</Text>
        <TextInput
          placeholder="Description"
          style={tailwind('border border-gray-800 p-4')}
          onChangeText={(val) => {
            setDesc(val);
          }}
        />
      </View>
      <Pressable
        style={tailwind('border border-gray-800 flex-initial p-4 items-center mt-4')}
        onPress={saveCard}
      >
        <Text style={tailwind('text-xl text-gray-800')}>Save</Text>
      </Pressable>
    </View>
  );
};

export default CreateCard;
