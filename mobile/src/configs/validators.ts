import {z} from 'zod';


const fullName = z
  .string({message: 'This field is required.'})
  .min(0, 'Username is required')
  .max(25, 'Username cannot be longer than 25 characters')
  .regex(
    /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/,
    'Invalid name! Please only use letters.',
  );


const email = z
  .string()
  .max(100, 'It should not exceed 100 characters')
  .min(1, "Email can't be empty")
  .email({
    message: 'Uh oh, it’s an invalid email.',
  });

const otp = z
  .string({required_error: 'This field is required.'})
  .trim()
  .min(6, 'It should not be less than 6 characters')
  .max(6, 'It should not exceed 6 characters');

const city = z
  .string({required_error: 'This field is required.'})
  .min(1, 'This field is required.')
  .max(500, 'It should not exceed 50 characters');

const address = z
  .string({required_error: 'This field is required.'})
  .min(1, 'This field is required.')
  .max(200, 'It should not exceed 50 characters');

const postalCode = z.string().max(6, 'Invalid postal code');

const password = z.string().refine(
  value => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwordRegex.test(value);
  },
  {
    message:
      'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and special character.',
  },
);
const rePassword = z.string();

const price = z
  .object({
    from: z.string(),
    to: z.string(),
  })
  .refine(
    data => {
      if (!data.from || !data.to) {
        return true;
      }
      return +data.from < +data.to;
    },
    {
      message: "The 'from' price must be less than the 'to' price",
      path: ['from'],
    },
  )
  .optional();

export const investShareSchema = z
  .object({
    available: z.number(),
    value: z.string(),
  })
  .refine(
    data => {
      if (!data.value) {
        return false;
      }
      return +data.value >= 5;
    },
    {
      message: 'Please invest at least 5 shares',
      path: ['value'],
    },
  )
  .refine(
    data => {
      if (!data.value) {
        return false;
      }
      return +data.value <= +data.available;
    },
    {
      message: 'Not enough available shares',
      path: ['value'],
    },
  );
const username = z
  .string()
  .min(1, 'Please provide your username!')
  .max(20, 'Your username cannot be longer than 20 characters')
  .regex(
    /^[a-zA-Z][a-zA-Z0-9._]{2,15}$/,
    'Invalid username! Please only use letters, numbers, underscores (_), and hyphens (-).',
  );
const bio = z
  .string()
  .refine(
    value => value.replace('\n', '').length <= 500,
    'Your Bio cannot be longer than 500 characters.',
  );
const birthday = z.string({required_error: 'This field is required.'});

export const createPasswordSchema = z
  .object({
    email: z.string(),
    password,
    rePassword,
  })
  .refine(data => data.password === data.rePassword, {
    // Custom error message
    message: 'Password does not match.',
    path: ['rePassword'], // This is where the error message will be attached
  });
export const changePasswordSchema = z
  .object({
    email: z.string(),
    oldPassword: password,
    newPassword: password,
    rePassword,
  })
  .refine(data => data.newPassword === data.rePassword, {
    // Custom error message
    message: 'Password does not match.',
    path: ['rePassword'], // This is where the error message will be attached
  });
export const createNewPasswordSchema = z
  .object({
    email: z.string(),
    otp: z.string(),
    password,
    rePassword,
  })
  .refine(data => data.password === data.rePassword, {
    // Custom error message
    message: 'Password does not match.',
    path: ['rePassword'], // This is where the error message will be attached
  });
export const emailSchema = z.object({
  email,
});
export const verifyCodeSchema = z.object({
  email: z.string(),
  otp,
});
export const logInSchema = z.object({
  email,
  password,
});

const formInvestSearchSchema = z.object({
  search: z.string().optional(),
  sort: z
    .object({
      by: z.object({
        label: z.string(),
        value: z.string(),
      }),
      order: z.object({
        label: z.string(),
        value: z.string(),
      }),
    })
    .optional(),
  filter: z
    .object({
      propertyType: z.array(z.string()).optional(),
      apartmentType: z.array(z.string()).optional(),
      landType: z.array(z.string()).optional(),
      availability: z.array(z.string()).optional(),
      price,
    })
    .optional(),
});
const formPropertySearchSchema = z.object({
  search: z.string().optional(),
  sort: z
    .object({
      by: z.string(),
      order: z.string(),
    })
    .optional(),
  filter: z
    .object({
      propertyType: z.array(z.string()).optional(),
      apartmentType: z.array(z.string()).optional(),
      landType: z.array(z.string()).optional(),
      rentStatus: z.array(z.string()).optional(),
      returnRate: z.object({
        from: z.string(),
        to: z.string(),
      }),
      appreciation: z.object({
        from: z.string(),
        to: z.string(),
      }),
      owned: z.object({
        from: z.string(),
        to: z.string(),
      }),
      pricePerShare: z.object({
        from: z.string(),
        to: z.string(),
      }),
      investedAmount: z.object({
        from: z.string(),
        to: z.string(),
      }),
    })
    .optional(),
});
const formHistorySearchSchema = z.object({
  search: z.string().optional(),
  sort: z
    .object({
      by: z.string(),
      order: z.string(),
    })
    .optional(),
  filter: z
    .object({
      propertyType: z.string().optional(),
      propertySubType: z.string().optional(),
      availability: z.string().optional(),
      price,
    })
    .optional(),
});
export const timeFilterSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
});
export const Validators = {
  //auth
  logInSchema,
  emailSchema,
  verifyCodeSchema,
  createPasswordSchema,
  changePasswordSchema,
  createNewPasswordSchema,


  //invest
  formInvestSearchSchema,
  investShareSchema,

  // portfolio
  formPropertySearchSchema,
  formHistorySearchSchema,
};
