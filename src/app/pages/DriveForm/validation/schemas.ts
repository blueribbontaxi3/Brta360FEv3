import * as yup from 'yup';

export const disclaimerSchema = yup.object({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  disclaimerAccepted: yup.boolean().oneOf([true], 'You must accept the disclaimer to proceed'),
});

export const nameSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  middleName: yup.string(),
  lastName: yup.string().required('Last name is required'),
});

export const addressSchema = yup.object({
  streetAddress: yup.string().required('Street address is required'),
  unitApt: yup.string(),
  location: yup.string().required('Location is required'),
});

export const personalInfoSchema = yup.object({
  socialNumber: yup.string().required('Social Security Number is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
});

export const contactSchema = yup.object({
  cellPhone: yup.string().required('Cell phone is required'),
  homePhone: yup.string(),
});