// https://github.com/Ramiah-Viknesh/react-native-prompt-crossplatform

import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';


const Prompt = ({
  title,
  inputPlaceholder,
  defaultValue,
  onSubmit,
  submitButtonText,
  onCancel,
  cancelButtonText,
  errorText,
  isVisible,
  onBackButtonPress,
  onChangeText,
  primaryColor,
  promptBoxStyle,
  headingStyle,
  inputStyle,
  btnStyle,
  btnTextStyle,
  promptAnimation,
  ...inputProps
}) => (

    <Modal
      animationType={promptAnimation}
      hardwareAccelerated
      transparent
      visible={isVisible}
      onRequestClose={onBackButtonPress}
    >
      <View style={styles.container}>
        <View style={[styles.promptBox, promptBoxStyle]}>
          <Text style={[styles.heading, headingStyle]} ellipsizeMode="tail" numberOfLines={1}>{title}</Text>
          <TextInput
            placeholder={inputPlaceholder}
            defaultValue={defaultValue}
            underlineColorAndroid={primaryColor}
            style={[{ borderBottomColor: primaryColor }, styles.promptInput, inputStyle]}
            onChangeText={text => onChangeText(text)}
            {...inputProps}
          />
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorText}</Text>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={[styles.promptBtn, btnStyle]}
              onPress={onCancel}
            >
              <Text
                style={[{ color: primaryColor }, styles.btnTxt, btnTextStyle]}
              >
                {cancelButtonText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.promptBtn, btnStyle]}
              onPress={onSubmit}
            >
              <Text
                style={[{ color: primaryColor }, styles.btnTxt, btnTextStyle]}
              >
                {submitButtonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

Prompt.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  title: PropTypes.string.isRequired,
  inputPlaceholder: PropTypes.string.isRequired,
  submitButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  errorText: PropTypes.string,
  onBackButtonPress: PropTypes.func,
  primaryColor: PropTypes.string,
  promptBoxStyle: PropTypes.object,
  headingStyle: PropTypes.object,
  inputStyle: PropTypes.object,
  btnStyle: PropTypes.object,
  btnTextStyle: PropTypes.object,
  promptAnimation: PropTypes.string,
};

Prompt.defaultProps = {
  submitButtonText: 'submit',
  cancelButtonText: 'cancel',
  defaultValue: '',
  errorText: '',
  primaryColor: '#f13a59',
  promptAnimation: 'fade',
  promptBoxStyle: {},
  headingStyle: {},
  inputStyle: {},
  btnStyle: {},
  btnTextStyle: {},
  onBackButtonPress: null,
};

export default Prompt;


const COLORS = {
  primaryColor: '#f13a59',
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',
  red: '#FF0000',
  grey: '#dddddd',
  translucent: 'rgba(0,0,0,0.5)',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.translucent,
  },
  promptBox: {
    width: '90%',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    padding: 10,
    borderRadius: 2,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    elevation: 8,
  },
  heading: {
    color: COLORS.black,
    fontSize: 23,
    marginBottom: 20,
  },
  promptInput: {
    width: '90%',
    height: 50,
    fontSize: 20,
    padding: 10,
    paddingBottom: 15,
    borderBottomWidth: Platform.OS === 'ios' ? 1.5 : 0,
  },
  btnContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
  },
  promptBtn: {
    width: '50%',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    marginTop: 10,
    width: '100%',
    minHeight: 20,
  },
  errorText: {
    marginLeft: 20,
    color: COLORS.red,
    textAlign: 'left',
  },
  btnTxt: {
    textAlign: 'center',
    fontSize: 20,
  },
});