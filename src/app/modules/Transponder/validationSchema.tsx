import * as yup from 'yup';

const validationSchema = yup.object().shape({
    medallionNumberId: yup
        .number()
        .typeError('Medallion ID must be a number')
        .required('Medallion ID is required'),

    transponderNumber: yup
        .string()
        .required('Transponder number is required'),

    applyDate: yup
        .date()
        .typeError('Apply Date must be a valid date')
        .required('Apply Date is required'),
});
export default validationSchema;
