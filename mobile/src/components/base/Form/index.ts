import FormField from './FormField';
import FormFieldCustoms from './FormFieldCustoms';
import FormFieldPassword from './FormFieldPassword';
import FormFieldPasswordSpecial from './FormFieldPasswordSpecial';
import FormFieldRange from './FormFieldPriceRange';
import FormFieldSearch from './FormFieldSearch';
import FormFieldSpecial from './FormFieldSpecial';
import FormMultilineField from './FormMultilineField';

export const Form = {
  Input: FormField,
  Password: FormFieldPassword,
  Special: FormFieldSpecial,
  PasswordSpecial: FormFieldPasswordSpecial,
  Search: FormFieldSearch,
  Multiline: FormMultilineField,
  Range: FormFieldRange,
  Customs: FormFieldCustoms,
};
