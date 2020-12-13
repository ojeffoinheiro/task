import React, { Component } from 'react'
import {
  ImageBackground,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert
 } from 'react-native'
 import axios from 'axios'

import log from '~/assets/imgs/login.jpg'
import commonStyles from '~/commonStyles'
import AuthInput from '~/components/AuthInput'
import { server, showError, showSucess } from '~/common'

export default class Auth extends Component {

  state = {
    stageNew: false,
    name: '',
    email: '',
    pass: '',
    confirmPassword: '',
  }

  signin = async () => {
    try {
        const res = await axios.post(`${server}/signin`, {
            email: this.state.email,
            pass: this.state.pass
        })

        axios.defaults.headers.common['Authorization']
            = `bearer ${res.data.token}`
        AsyncStorage.setItem('userData', JSON.stringify(res.data))
        this.props.navigation.navigate('Home', res.data)
    } catch (err) {
        Alert.alert('Erro', 'Falha no Login!')
        // showError(err)
    }
}
signup = async () => {
  try {
      await axios.post(`${server}/signup`, {
          name: this.state.name,
          email: this.state.email,
          pass: this.state.pass,
          confirmPassword: this.state.confirmPassword
      })

      Alert.alert('Sucesso!', 'Usuário cadastrado :)')
      this.setState({ stageNew: false })
  } catch (err) {
      showError(err)
  }
}

  signinOrSignup = () => {
    if (this.state.stageNew) {
        this.signup()
    } else {
      this.signin()
    }
  }

  render(){
    return(
      <ImageBackground source={log} style={styles.background} >
        <Text style={styles.title} >Tasks</Text>
        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>
          {this.state.stageNew ?
              'Crie a sua conta' : 'Informe seus dados'}
          </Text>
          {this.state.stageNew &&
            <AuthInput
              icon ='user'
              placeholder='Nome'
              value={this.state.name}
              style={styles.input}
              onChangeText={name => this.setState({ name })}
            />
          }
          <AuthInput
            icon ='at'
            placeholder='Email'
            value={this.state.email}
            style={styles.input}
            onChangeText={email => this.setState({ email })}
            />
          <AuthInput
            icon ='lock'
            placeholder='Senha'
            value={this.state.pass}
            style={styles.input}
            onChangeText={pass => this.setState({ pass })}
            secureTextEntry={true}
            />
            {this.state.stageNew &&
              <AuthInput
                icon ='lock'
                placeholder='Digite sua senha novamente'
                value={this.state.confirmPassword}
                style={styles.input}
                onChangeText={confirmPassword => this.setState({ confirmPassword })}
                secureTextEntry={true}
              />
            }
            <TouchableOpacity onPress={this.signinOrSignup}>
              <View style={styles.button} >
                <Text style={styles.buttonText} >
                  {this.state.stageNew ? 'REGISTRAR' : 'ENTRAR' }
                </Text>
              </View>
            </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => this.setState({ stageNew: !this.state.stageNew})}>
          <Text style={styles.buttonText}>
              {this.state.stageNew ? 'Já possui conta?'
                : 'Ainda não possui conta?'}</Text>
         </TouchableOpacity>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  background: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
  },
  title: {
      fontFamily: commonStyles.fontFamily,
      color: commonStyles.colors.secondary,
      fontSize: 70,
      marginBottom: 10,
  },
  subtitle: {
      fontFamily: commonStyles.fontFamily,
      color: '#FFF',
      fontSize: 20,
      textAlign: 'center',
      marginBottom: 10
  },
  formContainer: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      padding: 20,
      width: '90%',
  },
  input: {
      marginTop: 10,
      backgroundColor: '#FFF'
  },
  button: {
      backgroundColor: '#080',
      marginTop: 10,
      padding: 10,
      alignItems: 'center',
      borderRadius: 5
  },
  buttonText: {
      fontFamily: commonStyles.fontFamily,
      color: '#FFF',
      fontSize: 20
  }
})
