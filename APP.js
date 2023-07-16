import React, { useState } from 'react';
import {
FlatList,
Text,
StyleSheet,
TextInput,
TouchableNativeFeedback,
View,
} from 'react-native';
const TodoList = () => {
const [data, setData] = useState([
{ key: '1', text: 'Tarefa 1' },
{ key: '2', text: 'Tarefa 2' },
{ key: '3', text: 'Tarefa 3' },
]);
const [text, setText] = useState('');
const [editingKey, setEditingKey] = useState(null);
const [rippleColor, setRippleColor] = useState(randomHexColor());
const [rippleOverflow, setRippleOverflow] = useState(false);
const handleAddTask = () => {
if (text) {
setData([...data, { key: Date.now().toString(), text }]);
setText('');
}
};
const handleDeleteTask = (key) => {
setData(data.filter((item) => item.key !== key));
};
const handleEditTask = (key) => {
setEditingKey(key);
setText(data.find((item) => item.key === key).text);
};
const handleSaveTask = () => {
setData(data.map((item) => (item.key === editingKey ? { ...item, text } : item)));
setEditingKey(null);
setText('');

};

return (

<View style={styles.container}>

<TextInput value={text} onChangeText={setText} placeholder="Adicionar tarefa" />

<TouchableNativeFeedback

onPress={() => {

setRippleColor(randomHexColor());

setRippleOverflow(!rippleOverflow);

editingKey ? handleSaveTask() : handleAddTask();

}}

background={TouchableNativeFeedback.Ripple(rippleColor, rippleOverflow)}

>

<View style={[styles.button, styles.addButton]}>

<Text style={styles.buttonText}>{editingKey ? 'Salvar' : 'Adicionar'}</Text>

</View>

</TouchableNativeFeedback>

<FlatList

data={data}

renderItem={({ item }) => (

<TouchableNativeFeedback

onPress={() =>

editingKey === item.key ? setEditingKey(null) : handleEditTask(item.key)

}

background={TouchableNativeFeedback.SelectableBackground()}

>

<View>

<Text>{item.text}</Text>

</View>

</TouchableNativeFeedback>

)}

/>

{editingKey && (

<TouchableNativeFeedback

onPress={() => handleDeleteTask(editingKey)}

background={TouchableNativeFeedback.SelectableBackground()}

>

<View style={[styles.button, styles.deleteButton]}>

<Text style={styles.buttonText}>Excluir</Text>

</View>

</TouchableNativeFeedback>

)}

</View>

);

};

const randomHexColor = () => { 

return '#000000'.replace(/0/g, function () {
return Math.round(Math.random() * 16).toString(16);
});
};
const styles = StyleSheet.create({
container: {
flex: 1,
flexDirection: 'column',
backgroundColor: '#fff',
alignItems: 'center',
gap: 30,
padding: 30,
paddingTop: '50%',
marginBottom: '40%',
},
button: {
alignItems: 'center',
borderRadius: 25,
padding: 10,
margin: 10,
},
addButton: {
backgroundColor: '#1E90FF',
},
deleteButton: {
backgroundColor: '#FF0000',
},
buttonText: {
color: 'white',
fontSize: 18,
fontWeight: 'bold',
},
});

export default TodoList;
