
import React, { useState, useCallback } from 'react';

import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';

export default function DashboardScreen() {

  const [tasks, setTasks] = useState<any[]>([]);

  // Load tasks whenever Dashboard gets focus
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');

      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks([]);
      }

    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  // Refresh tasks whenever user returns to Dashboard
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  return (
    <ImageBackground
      source={{
        uri: 'https://img.magnific.com/free-vector/isometric-time-management-concept-illustrated_52683-55534.jpg?semt=ais_hybrid&w=740&q=80',
      }}
      style={styles.background}
      resizeMode="cover"
    >

      <View style={styles.container}>

        <Text style={styles.heading}>Your Tasks</Text>

        <ScrollView style={styles.list}>

          {tasks.length === 0 ? (

            <Text style={styles.empty}>
              No tasks saved yet. Add one!
            </Text>

          ) : (

            tasks.map((task) => (

              <View
                key={task.id}
                style={styles.taskCard}
              >

                <Text style={styles.taskName}>
                  {task.taskName}
                </Text>

                <Text style={styles.taskDescription}>
                  {task.taskDescription}
                </Text>

              </View>

            ))

          )}

        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-task')}
        >

          <Text style={styles.buttonText}>
            + Add New Task
          </Text>

        </TouchableOpacity>

      </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },

  heading: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
  },

  list: {
    flex: 1,
  },

  empty: {
    fontSize: 14,
    color: 'gray',
    fontStyle: 'italic',
    marginTop: 10,
  },

  taskCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },

  taskName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 6,
  },

  taskDescription: {
    fontSize: 14,
    color: '#333',
  },

  addButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

});
