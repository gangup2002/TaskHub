
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

export default function AddTaskScreen() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const saveTask = async () => {
    if (!taskName.trim() || !taskDescription.trim()) {
      Alert.alert('Error', 'Please fill in all fields!');
      return;
    }

    try {
      // 1. Get existing tasks
      const existingTasks = await AsyncStorage.getItem('tasks');

      const tasksArray = existingTasks
        ? JSON.parse(existingTasks)
        : [];

      // 2. Create a new task
      const newTask = {
        id: Date.now().toString(),
        taskName: taskName,
        taskDescription: taskDescription,
      };

      tasksArray.push(newTask);

      // 3. Save tasks to AsyncStorage
      await AsyncStorage.setItem(
        'tasks',
        JSON.stringify(tasksArray)
      );

      // 4. Request notification permission
      const permission =
        await Notifications.requestPermissionsAsync();

      if (permission.granted) {
        // 5. Send local notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Task Saved Successfully! 🎉',
            body: `Don't forget to complete: ${taskName}`,
          },
          trigger: null,
        });
      }

      Alert.alert('Success', 'Your task has been saved!');

      // 6. Return to Dashboard
      router.back();

    } catch (error) {
      console.error('Failed to save task:', error);
      Alert.alert('Error', 'Failed to save task.');
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://img.magnific.com/free-vector/isometric-time-management-concept-illustrated_52683-55534.jpg?semt=ais_hybrid&w=740&q=80',
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>

        <Image
          source={{
            uri: 'https://static.vecteezy.com/system/resources/previews/016/921/110/non_2x/business-task-management-illustration-concept-on-white-background-vector.jpg',
          }}
          style={styles.banner}
          resizeMode="contain"
        />

        <Text style={styles.label}>Task Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter task name"
          value={taskName}
          onChangeText={setTaskName}
        />

        <Text style={styles.label}>Task Description</Text>

        <TextInput
          style={styles.description}
          placeholder="Enter task description"
          value={taskDescription}
          onChangeText={setTaskDescription}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveTask}
        >
          <Text style={styles.buttonText}>Save Task</Text>
        </TouchableOpacity>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },

  banner: {
    width: '100%',
    height: 180,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: 'white',
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },

  description: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    height: 110,
    fontSize: 15,
  },

  saveButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 25,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
