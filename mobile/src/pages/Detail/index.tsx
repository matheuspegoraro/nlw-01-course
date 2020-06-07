import React, { useEffect, useState } from 'react';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView, Linking } from 'react-native';
import Constants from 'expo-constants';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';

interface Params {
  point_id: number;
}

interface Data {
  serializedPoint: {
    image: string;
    image_url: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items: {
    title: string;
  }[];
}

const Detail = () => {
  const [data, setData] = useState<Data>({} as Data);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    api.get(`points/${routeParams.point_id}`).then(response => {
      setData(response.data);
    });
  }, []);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${data.serializedPoint.whatsapp}&text=Tenho interesse no despejo de resíduos.`);
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Tenho interesse no despejo de resíduos.',
      recipients: [data.serializedPoint.email],
    });
  }

  if (!data.serializedPoint) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={ handleNavigateBack }>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{ uri: data.serializedPoint.image_url }} />

        <Text style={styles.pointName}>{data.serializedPoint.name}</Text>
        <Text style={styles.pointItems}>{data.items.map(item => item.title).join(', ')}</Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{data.serializedPoint.city}, {data.serializedPoint.uf}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton 
          style={styles.button} 
          onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color='#fff' />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        <RectButton 
          style={styles.button} 
          onPress={handleComposeMail}>
          <Icon name="mail" size={20} color='#fff' />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20 + Constants.statusBarHeight,
    backgroundColor: '#1a1a1a'
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#fff'
  },

  address: {
    marginTop: 32,
    color: '#fff',
  },
  
  addressTitle: {
    color: '#fff',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#fff'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#1a1a1a',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  }
});