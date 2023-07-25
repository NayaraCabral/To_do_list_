import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const IconButton = ({ name, title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Icon name={name} size={20} />
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const App = () => {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState([]);
  const [editingKey, setEditingKey] = useState(null);

  // Criar uma referência para guardar os valores animados de cada item
  const animatedValues = useRef({});

  const addTodo = () => {
    if (editingKey) {
      setTodos(todos.map((todo) => (todo.key === editingKey ? { ...todo, text } : todo)));
      setEditingKey(null);
    } else {
      // Gerar um valor animado inicializado com 0 para o novo item
      const key = Date.now().toString();
      animatedValues.current[key] = new Animated.Value(0);
      setTodos([...todos, { key, text, isStriked: false }]);
      // Animar o valor para 1 quando o item for adicionado
      Animated.timing(animatedValues.current[key], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    setText('');
  };

  const removeTodo = (key) => {
    // Animar o valor para 0 quando o item for removido
    Animated.timing(animatedValues.current[key], {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Remover o item do estado quando a animação terminar
      setTodos(todos.filter((todo) => todo.key !== key));
      // Remover o valor animado da referência
      delete animatedValues.current[key];
    });
  };

  const editTodo = (key) => {
    const todo = todos.find((todo) => todo.key === key);
    setText(todo.text);
    setEditingKey(key);
  };

  const sortTodos = () => {
    setTodos([...todos].sort((a, b) => a.text.localeCompare(b.text)));
  };

  const toggleStrike = (key) => {
    // Animar o valor para -1 ou 1 quando o item for marcado como concluído ou não
    const todo = todos.find((todo) => todo.key === key);
    Animated.timing(animatedValues.current[key], {
      toValue: todo.isStriked ? 1 : -1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Atualizar o estado do item quando a animação terminar
      setTodos(todos.map((todo) => (todo.key === key ? { ...todo, isStriked: !todo.isStriked } : todo)));
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To DO List</Text>
      <TextInput
        value={text}
        onChangeText={(text) => setText(text)}
        style={styles.input}
      />
      <View style={styles.buttonRow}>
        <IconButton title={editingKey ? 'Update' : 'Add'} onPress={addTodo} name="plus" />
        <IconButton title="Sort" onPress={sortTodos} name="sort" />
      </View>
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          // Usar o método interpolate para transformar o valor animado em opacidade e escala
          <Animated.View
            style={[
              styles.item,
              {
                opacity: animatedValues.current[item.key].interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [0.5, 0, 1],
                }),
                transform: [
                  {
                    scale: animatedValues.current[item.key].interpolate({
                      inputRange: [-1, 0, 1],
                      outputRange: [0.8, 0, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity onPress={() => toggleStrike(item.key)}>
              <Text style={[styles.itemText, item.isStriked ? styles.strike : null]}>{item.text}</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <IconButton title="Edit" onPress={() => editTodo(item.key)} name="edit" />
            <IconButton title="Delete" onPress={() => removeTodo(item.key)} name="trash" />
          </Animated.View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonText: {
    marginLeft: 5,
    color: '#333333',
  },
  item: {
    backgroundColor: '#FFFFFF',
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
 
itemText: {
    fontSize: 18,
    color: '#333333',
  },
  strike: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },
  separator: {
    height: 1,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginVertical: 5,
  },
});

export default App;



  
