import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';

import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
  containerStyle?: {};
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

/**
 * The RefForwardingComponent was used because we wanna passa the *ref* reference
 * from the parent component.
 */
const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, containerStyle = {}, icon, ...rest },
  ref
) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const inputElementRef = useRef<any>(null);
  const { registerField, fieldName, defaultValue = '', error } = useField(name);
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  /**
   * Using this hook, the parent component has access to the child attributes and
   * methods
   */
  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(_ref: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = 'value';
        inputElementRef.current.clear();
      },
    });
  }, [registerField, fieldName]);

  const handleFocused = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputValueRef.current.value);
  }, []);

  return (
    <Container style={containerStyle} isFocused={isFocused} isErrored={!!error}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#ff9000' : '#666360'}
      />
      <TextInput
        ref={inputElementRef}
        placeholderTextColor="#666360"
        keyboardAppearance="dark"
        onChangeText={(value) => {
          inputValueRef.current.value = value;
        }}
        onFocus={handleFocused}
        onBlur={handleBlur}
        defaultValue={defaultValue}
        {...rest}
      />
    </Container>
  );
};

/**
 * when using the RefForwardingComponent, it´s necessary to enclose the component
 * with forwardRef
 */
export default forwardRef(Input);
