import * as yup from 'yup';
import dayjs from 'dayjs';

const validationSchema = yup.object().shape({
    year: yup
        .number()
        .required('For Year is required')
        .typeError('For Year must be a number')
        .min(2023, 'For Year must be at least 1900'),
    amount: yup
        .number()
        .required('Amount is required.')
        .min(1, 'Amount must be at least 1.')
        .typeError('Amount must be a number.'),
    wav_fee: yup
        .number()
        .required('Amount is required.')
        .min(1, 'Amount must be at least 1.')
        .typeError('Amount must be a number.'),
});

export default validationSchema;
