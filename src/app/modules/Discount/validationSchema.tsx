import * as yup from 'yup';
import dayjs from 'dayjs';

const validationSchema = yup.object().shape({
    name: yup
        .string()
        .required('Name is required.')
        .min(3, 'Name must be at least 3 characters long.'),

    date: yup
        .string()
        .required('Date is required.')
        .matches(
            /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/,
            'Date must be in MM-DD-YYYY format.'
        )
        .test(
            'is-valid-date',
            'Date must be a valid date.',
            (value: any) => value && dayjs(value, 'MM-DD-YYYY', true).isValid()
        ),
    amount: yup
        .number()
        .required('Amount is required.')
        .min(1, 'Amount must be at least 1.')
        .typeError('Amount must be a number.'),
});

export default validationSchema;
