import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-bidirectional-infinite-scroll';
import breakingBad from './axios/breakingBad';

const App = () => {
  const [target, setTarget] = useState([]);
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const LIMIT = 5;
  useEffect(()=>{
    if(target.length==0){
      (async () => {
        setLoading(true);
        const result = await breakingBad.get(`characters?limit=${LIMIT}&offset=${counter}`);
        setTarget(result.data);
        setLoading(false);
      })();
    }
  },[])

  const search = async () => {
    setLoading(true)
    const result = await breakingBad.get(`characters?limit=${LIMIT}&offset=${counter+5}`);
    setTarget([...target, ...result.data]);
    setCounter(counter+LIMIT);
    setLoading(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <FlatList 
        keyExtractor={index=>index.char_id}
        data={target}
        renderItem={({item})=>{
          return (<View>
              <Text style={{fontSize: 18,color: 'white', alignSelf: 'center'}}>{item.name}</Text>
              <Image style={{height: 240, width: 500}} source={{uri: item.img}}/>
            </View>);
        }}
        onEndReached={()=>search()}
        onEndReachedThreshold={2}
      />
      {loading ? <ActivityIndicator color="#ffffff" size="large"/>:null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    /*alignItems: 'center',
    justifyContent: 'center',*/
  },
});

export default App;