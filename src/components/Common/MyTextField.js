import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MyText} from './MyText';
import {TextInput} from 'react-native-paper';

export const MyTextField = ({
  label,
  refer,
  value,
  onChangeText,
  errorText,
  returnKeyType = 'next',
  keyboardType = 'default',
  width = '100%',
  multiline = false,
  onSubmitEditing = () => {},
  onFocus = () => {},
  blurOnSubmit = false,
  secureTextEntry = false,
}) => {
  return (
    <View>
      <TextInput
        label={label}
        mode="outlined"
        multiline={multiline}
        keyboardType={keyboardType}
        numberOfLines={10}
        style={[
          styles.textField,
          {
            width,
            padding: 0,
            margin: 0,
            borderWidth: 0,
          },
        ]}
        enablesReturnKeyAutomatically={true}
        ref={refer}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        outlineColor="#dbdbdb"
        blurOnSubmit={blurOnSubmit}
        returnKeyType={returnKeyType}
        error={!!errorText}
        secureTextEntry={!!secureTextEntry}
        onFocus={onFocus}
        theme={{
          colors: {
            primary: '#FF8112',
          },
        }}
      />
      {!!errorText && <MyText text={errorText} color="red" />}
    </View>
  );
};

const styles = StyleSheet.create({
  textField: {
    width: '100%',
    backgroundColor: 'white',
    fontSize: 14,
    zIndex: 1000,
  },
});
