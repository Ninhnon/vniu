import React, {useCallback, useState} from 'react';

import {Pressable, TextInputProps} from 'react-native';

import {Layout} from '../Layout';
import Show from '../Show/Show';
import SvgIcon from '../SvgIcon/SvgIcon';
import TextInput from '../TextInput/TextInput';
import FieldContainer from './FieldContainer';
import {useDebounceSearchValue} from './hooks';

interface ISearchFieldProps extends TextInputProps {
  onClearText?: () => void;
  onChangeText?: ((text: string) => void) | undefined;
  debounceTime?: number;
}
const SearchField = ({
  onClearText,
  onChangeText,
  debounceTime,
  ...props
}: ISearchFieldProps) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  const _debounceSearch = useDebounceSearchValue(debounceTime || 1000);

  const _handleOnfocus = useCallback(() => {
    setIsFocus(true);
  }, []);

  const _handleOnEditing = useCallback(() => {
    setIsFocus(false);
  }, []);

  const _handleOnChangeText = useCallback(
    (text: string) => {
      setSearchValue(text);
      onChangeText && _debounceSearch(onChangeText)(text);
    },
    [_debounceSearch, onChangeText],
  );
  const handleClearText = useCallback(() => {
    setSearchValue('');
    onClearText && onClearText();
    setIsFocus(false);
  }, [onClearText]);

  return (
    <FieldContainer isFocus={isFocus}>
      <SvgIcon name="magnifyingGlass" size={20} fill="ELEMENT_BASE_3" />

      <Layout.Wrapper flex={1}>
        <TextInput
          onEndEditing={_handleOnEditing}
          onFocus={_handleOnfocus}
          onChangeText={_handleOnChangeText}
          value={searchValue}
          autoFocus={true}
          {...props}
        />
      </Layout.Wrapper>

      <Show.When isTrue={!!onClearText && isFocus}>
        <Pressable hitSlop={12} onPress={handleClearText}>
          <SvgIcon name="xCircle" size={20} fill="ELEMENT_BASE_3" />
        </Pressable>
      </Show.When>
    </FieldContainer>
  );
};

export default SearchField;
