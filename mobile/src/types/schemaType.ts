import {z} from 'zod';

import {Validators, timeFilterSchema} from '@configs/validators';

export type TEmailSchema = z.infer<typeof Validators.emailSchema>;
export type TVerifyCodeSchema = z.infer<typeof Validators.verifyCodeSchema>;
export type TCreatePasswordSchema = z.infer<
  typeof Validators.createPasswordSchema
>;
export type TChangePasswordSchema = z.infer<
  typeof Validators.changePasswordSchema
>;
export type TCreateNewPasswordSchema = z.infer<
  typeof Validators.createNewPasswordSchema
>;
export type TLogInSchema = z.infer<typeof Validators.logInSchema>;
export type TInvestSearchForm = z.infer<
  typeof Validators.formInvestSearchSchema
>;
export type TInvestShareForm = z.infer<typeof Validators.investShareSchema>;
export type TPropertySearchForm = z.infer<
  typeof Validators.formPropertySearchSchema
>;
export type THistorySearchForm = z.infer<
  typeof Validators.formHistorySearchSchema
>;

export type TTimeFilterSchema = z.infer<typeof timeFilterSchema>;
