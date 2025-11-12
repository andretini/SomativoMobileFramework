import React, { FC } from 'react';
import { Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    variant?: 'primary' | 'secondary' | 'danger' | 'link';
}

const Button: FC<ButtonProps> = ({ title, onPress, style, textStyle, variant = 'primary' }) => {

  const baseStyle: ViewStyle = {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 48,
  };

  const primaryStyle: ViewStyle = { backgroundColor: '#3b82f6' }; 
  const secondaryStyle: ViewStyle = { backgroundColor: '#e5e7eb' };
  const dangerStyle: ViewStyle = { backgroundColor: '#ef4444' };
  const textLinkStyle: ViewStyle = { backgroundColor: 'transparent' };

  let currentStyle: ViewStyle;
  let currentTextStyle: TextStyle;

  switch (variant) {
    case 'primary':
      currentStyle = primaryStyle;
      currentTextStyle = { color: '#ffffff', fontWeight: 'bold', fontSize: 16 };
      break;
    case 'secondary':
      currentStyle = secondaryStyle;
      currentTextStyle = { color: '#1f2937', fontWeight: '500', fontSize: 16 };
      break;
    case 'danger':
      currentStyle = dangerStyle;
      currentTextStyle = { color: '#ffffff', fontWeight: 'bold', fontSize: 16 };
      break;
    case 'link':
      currentStyle = textLinkStyle;
      currentTextStyle = { color: '#3b82f6', fontSize: 14 };
      break;
    default:
      currentStyle = primaryStyle;
      currentTextStyle = { color: '#ffffff', fontWeight: 'bold', fontSize: 16 };
      break;
  }

  return (
    <TouchableOpacity onPress={onPress} style={[baseStyle, currentStyle, style]}>
      <Text style={[currentTextStyle, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;