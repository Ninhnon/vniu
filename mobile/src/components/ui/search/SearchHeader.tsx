import {useFormContext} from 'react-hook-form';

import React, {useEffect} from 'react';


import {Form, Layout} from '@components/base';
import {Navigation} from '@components/ui/navigation';

const SearchHeader = () => {
//   const {value, setValue} = useInvestSearchContext();
//   const {watch} = useFormContext();
//   const search = watch('search');
//   useEffect(() => {
//     setValue({...value!, search});
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search]);

  return (
    <Layout.Wrapper
      flexDirection="row"
      alignItems="center"
      gap={4}
      paddingVertical={8}
      paddingHorizontal={16}>
      <Navigation.Header.HeaderLeft />
      <Layout.Wrapper flex={1}>
        <Form.Search name="search" />
      </Layout.Wrapper>
    </Layout.Wrapper>
  );
};

export default SearchHeader;
