import * as yup from 'yup';

const validationSchema = yup.object().shape({
    vehicleYear: yup
        .number()
        .required('Vehicle Year is required')
        .typeError('Vehicle Year must be a number')
        .min(1900, 'Vehicle Year must be at least 1900'),

    // For Year
    forYear: yup
        .number()
        .required('For Year is required')
        .typeError('For Year must be a number')
        .min(1900, 'For Year must be at least 1900'),
    collision: yup.array().of(
        yup.object().shape({
            collisionType: yup.number().required("Collision Type is required"),
            deductibleAmbRate: yup
                .number()
                .required("Deductible Amb Rate is required")
                .min(0, "Deductible Amb Rate must be at least 0")
                .typeError("Deductible Amb Rate must be a number"),
            deductibleWavRate: yup
                .number()
                .required("Deductible WAV Rate is required")
                .min(0, "Deductible WAV Rate must be at least 0")
                .typeError("Deductible WAV Rate must be a number"),
            costAmbRate: yup
                .number()
                .required("Cost Amb Rate is required")
                .min(0, "Cost Amb Rate must be at least 0")
                .typeError("Cost Amb Rate must be a number"),
            costWavRate: yup
                .number()
                .required("Cost WAV Rate is required")
                .min(0, "Cost WAV Rate must be at least 0")
                .typeError("Cost WAV Rate must be a number"),
        })
    ),
});

export default validationSchema;
