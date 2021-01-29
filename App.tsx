import React from 'react';
import { AUTH_TYPE, createAuthLink } from 'aws-appsync-auth-link';
import { ApolloProvider, ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
// @ts-ignore
import { withAuthenticator } from 'aws-amplify-react-native';
import Amplify, { Auth } from 'aws-amplify';
import tailwind from 'tailwind-rn';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons/';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native';
import config from './src/aws-exports';
import CardList from './src/features/CardList';
import CreateCard from './src/features/CreateCard';

Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

const url = config.aws_appsync_graphqlEndpoint;
const region = config.aws_appsync_region;
const auth = {
  type: config.aws_appsync_authenticationType as AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
  jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
};

const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createSubscriptionHandshakeLink({ url, region, auth }),
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const signout = async () => {
  await Auth.signOut();
};

const Stack = createBottomTabNavigator();

const App = () => {
  return (
    <ApolloProvider client={client}>
      <SafeAreaView style={tailwind('flex-1 bg-gray-100  ')}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="List"
            tabBar={(props) => (
              <BottomTabBar
                activeTintColor="#1F2937"
                inactiveTintColor="#9CA3AF"
                showLabel={false}
                tabStyle={tailwind('bg-gray-100')}
                {...props}
              />
            )}
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'List') {
                  iconName = focused ? 'list-circle' : 'list-circle-outline';
                } else if (route.name === 'Add') {
                  iconName = focused ? 'add-circle' : 'add-circle-outline';
                }

                return <Ionicons name={iconName} size={size * 1.2} color={color} />;
              },
            })}
          >
            <Stack.Screen name="List" component={CardList} />
            <Stack.Screen name="Add" component={CreateCard} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </ApolloProvider>
  );
};

export default withAuthenticator(App);

/* <View style={tailwind('h-12 items-center flex-row justify-between mx-4 ')}>
          <Text style={tailwind('text-3xl font-semibold')}>Cards</Text>
          <View style={tailwind('flex-row items-center')}>
            <Pressable onPress={newCard}>
              <Text style={tailwind('text-base font-normal mr-4')}>New</Text>
            </Pressable>
            <Pressable onPress={signout}>
              <Text style={tailwind('text-base font-normal')}>Signout</Text>
            </Pressable>
          </View>
        </View> */
