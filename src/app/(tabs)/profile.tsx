
import React, { useEffect, useState } from 'react';

import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {

  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Load saved profile information
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('studentProfile');

      if (storedProfile) {
        const parsedData = JSON.parse(storedProfile);

        setStudentName(parsedData.name || '');
        setStudentId(parsedData.id || '');
        setProfileImage(parsedData.imageUri || null);
      }

    } catch (error) {
      console.error('Failed to load profile data:', error);
    }
  };

  // Pick an image from gallery
  const pickImage = async () => {

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photos!'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Save profile details
  const saveProfileData = async () => {

    if (!studentName.trim() || !studentId.trim()) {
      Alert.alert(
        'Error',
        'Please enter both Name and Student ID.'
      );
      return;
    }

    try {
      const profileData = {
        name: studentName,
        id: studentId,
        imageUri: profileImage,
      };

      await AsyncStorage.setItem(
        'studentProfile',
        JSON.stringify(profileData)
      );

      Alert.alert(
        'Success',
        'Profile details saved successfully!'
      );

    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Error', 'Failed to save profile.');
    }
  };

  // Clear all local storage
  const clearAllData = async () => {

    try {
      await AsyncStorage.clear();

      setStudentName('');
      setStudentId('');
      setProfileImage(null);

      Alert.alert(
        'Success',
        'All local data has been wiped!'
      );

    } catch (error) {
      console.error('Failed to clear storage:', error);
      Alert.alert('Error', 'Failed to clear storage.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Profile image */}
      <TouchableOpacity
        onPress={pickImage}
        style={styles.imageContainer}
      >
        <Image
          source={{
            uri: profileImage ||
              'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          }}
          style={styles.avatar}
        />

        <View style={styles.editBadge}>
          <Text style={styles.editText}>✎</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.heading}>
        Student Profile
      </Text>

      {/* Student Name */}
      <Text style={styles.label}>Name</Text>

      <TextInput
        style={styles.input}
        placeholder="John Doe"
        value={studentName}
        onChangeText={setStudentName}
      />

      {/* Student ID */}
      <Text style={styles.label}>Student ID</Text>

      <TextInput
        style={styles.input}
        placeholder="CS/2020/001"
        value={studentId}
        onChangeText={setStudentId}
      />

      {/* Save button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveProfileData}
      >
        <Text style={styles.buttonText}>
          Save Details
        </Text>
      </TouchableOpacity>

      {/* Clear button */}
      <TouchableOpacity
        style={styles.clearButton}
        onPress={clearAllData}
      >
        <Text style={styles.buttonText}>
          Clear All Tasks
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },

  imageContainer: {
    marginTop: 30,
    marginBottom: 15,
    position: 'relative',
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
  },

  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'blue',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  editText: {
    color: 'white',
    fontSize: 20,
  },

  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#222',
  },

  label: {
    alignSelf: 'stretch',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 7,
    padding: 12,
    backgroundColor: '#f8f8f8',
    fontSize: 15,
  },

  saveButton: {
    width: '100%',
    backgroundColor: '#0879ed',
    padding: 14,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 25,
  },

  clearButton: {
    width: '100%',
    backgroundColor: 'red',
    padding: 14,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 12,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },

});
