import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().required().email().label('Email Address'),
  password: yup.string().required().min(8).label(' '),
})

export const resetPasswordSchema = yup.object({
  email: yup.string().required().email().label('Email Address'),
})

export const createUserSchema = yup.object({
  name: yup.string().required().label('Username'),
  email: yup.string().required().email().label('Email Address'),
  phone: yup.number()
    .required()
    .label('Phone Number'),
  password: yup.string().required().min(8).label('Password'),
  confirmPassword: yup.string().required()
    .oneOf([yup.ref('password'), null], 'Passwords must match').label('Password Confirmation'),
  // role: yup.string().required().oneOf(['ADMIN', 'USER'], 'Role must be "ADMIN" or "USER"').label('Role'),
  // contractorId: yup.string().required().label('Contractor'),
});

export const updatePasswordSchema = yup.object({
  otp: yup.string().required(),
  password: yup.string().required().min(8),
  confirmPassword: yup.string().required()
  .oneOf([yup.ref('password'), null], 'Passwords must match').label('Password Confirmation'),
}); 