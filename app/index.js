import React from 'react';
import 'expo-router/entry';
import { SafeAreaView, Text } from 'react-native';
import CameraView from '../components/CameraView';


export default function index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CameraView />
    </SafeAreaView>
  );
}
