import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import {
  HomeScreen,
  HowToPlayScreen,
  SettingsScreen,
  PlayerSetupScreen,
  WordDistributionScreen,
  DiscussionScreen,
  VotingScreen,
  SpyGuessScreen,
  RoundResultScreen,
  GameEndScreen,
  HighScoresScreen,
} from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_left', // RTL animation
          contentStyle: { backgroundColor: 'transparent' },
          animationDuration: 250,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="PlayerSetup" component={PlayerSetupScreen} />
        <Stack.Screen name="HighScores" component={HighScoresScreen} />
        <Stack.Screen 
          name="WordDistribution" 
          component={WordDistributionScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="Discussion" 
          component={DiscussionScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="Voting" 
          component={VotingScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="SpyGuess" 
          component={SpyGuessScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="RoundResult" 
          component={RoundResultScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="GameEnd" 
          component={GameEndScreen}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
