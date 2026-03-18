import React, { useEffect, useState } from "react";
import {
  DatePicker,
  Form,
  Input,
  Select,
  Checkbox,
  TimePicker,
  Upload,
  Switch,
  InputNumber,
  Radio,
  Tooltip,
  Typography,
} from "antd";
import { Controller } from "react-hook-form";
import { get } from "lodash"; // For safe nested property access
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

export const InputField = (props: any) => {
  const {
    fieldName,
    label,
    control,
    iProps,
    rules,
    initValue,
    isRequired,
    errors,
  } = props;

  const [validateMessage, setValidateMessage] = useState<string>("");
  const [validateStatus, setValidateStatus] = useState<any>(false);

  // Error Handling for Nested Fields
  useEffect(() => {
    // Use 'get' to safely access nested fields like 'errors.items[0].field'
    const errorObj = get(errors, fieldName);
    if (errorObj) {
      setValidateStatus("error");
      setValidateMessage(errorObj.message);
    } else {
      setValidateStatus(false);
      setValidateMessage("");
    }
  }, [errors?.[fieldName], fieldName]);

  return (
    <>
      <Form.Item
        required={isRequired || false}
        label={label}
        validateStatus={validateStatus}
        help={validateMessage}
        className={props.classes}
        wrapperCol={{ span: 24 }}
      >
        <Controller
          name={fieldName}
          control={control}
          defaultValue={initValue || initValue === 0 ? initValue : ""}
          rules={rules}
          render={({ field }) => (
            <Input
              {...field}
              {...iProps}
            />
          )}
        />
      </Form.Item>
    </>
  );
};

export const InputNumberField = (props: any) => {
  const {
    fieldName,
    label,
    control,
    iProps,
    rules,
    initValue,
    isRequired,
    errors,
  } = props;

  const [validateMessage, setValidateMessage] = useState<string>("");
  const [validateStatus, setValidateStatus] = useState<any>(false);

  // Error Handling for Nested Fields
  useEffect(() => {
    // Use 'get' to safely access nested fields like 'errors.items[0].field'
    const errorObj = get(errors, fieldName);
    if (errorObj) {
      setValidateStatus("error");
      setValidateMessage(errorObj.message);
    } else {
      setValidateStatus(false);
      setValidateMessage("");
    }
  }, [errors?.[fieldName], fieldName]);

  return (
    <>
      <Form.Item
        required={isRequired || false}
        label={label}
        validateStatus={validateStatus}
        help={validateMessage}
        className={props.classes}
        wrapperCol={{ span: 24 }}
      >
        <Controller
          name={fieldName}
          control={control}
          defaultValue={initValue || initValue === 0 ? initValue : ""}
          rules={rules}
          render={({ field }) => (
            <InputNumber
              {...field}
              style={{
                width: '100%'
              }}
              {...iProps}
            />
          )}
        />
      </Form.Item>
    </>
  );
};

export const SearchField = (props: any) => {
  const {
    fieldName,
    label,
    control,
    iProps,
    rules,
    initValue,
    isRequired,
    errors
  } = props;

  useEffect(() => {
    props.valueGot && props.setValue(fieldName, props.valueGot);
  }, [props.valueGot]);
  const [validateMessage, setValidateMessage] = useState<any>('');
  const [validateStatus, setValidateStatus] = useState<any>(false);
  useEffect(() => {

    if (errors?.[fieldName]) {
      setValidateStatus('error')
    } else {
      setValidateStatus(false)
    }
    if (errors?.[fieldName]) {
      setValidateMessage(errors?.[fieldName]?.message)
    } else {
      setValidateMessage('')
    }

  }, [errors?.[fieldName]])

  return (
    <>
      <Form.Item
        required={isRequired ? isRequired : false}
        label={label}
        validateStatus={validateStatus}
        help={validateMessage}
        className={props.classes}
        wrapperCol={{ span: 24 }}
      >
        <Controller
          name={fieldName}
          control={control}
          defaultValue={initValue || initValue == 0 ? initValue : ""}
          rules={rules}
          render={({ field }) => (
            <Input.Search
              {...field}
              enterButton
              // value={value}
              // onChange={onChange}
              // onBlur={props.onBlur}
              {...iProps}
            />
          )}
        />
      </Form.Item>
    </>
  );
};

export const SelectField = (props: any) => {
  const {
    fieldName,
    label,
    control,
    iProps,
    rules,
    initValue,
    isRequired,
    errors,
    options,
    showSearch,
    allowClear,
    disabled,
  } = props;

  useEffect(() => {
    props.valueGot && props.setValue(fieldName, props.valueGot);
  }, [props.valueGot]);

  const [validateMessage, setValidateMessage] = useState<any>('');
  const [validateStatus, setValidateStatus] = useState<any>(false);

  useEffect(() => {
    if (errors?.[fieldName]) {
      setValidateStatus('error')
    } else {
      setValidateStatus(false)
    }
    if (errors?.[fieldName]) {
      setValidateMessage(errors?.[fieldName]?.message)
    } else {
      setValidateMessage('')
    }
  }, [errors])



  // useEffect(() => {
  //   if (selectedDefaultValue) {
  //     props?.setValue(fieldName, selectedDefaultValue)
  //   }
  // }, [selectedDefaultValue])


  return (
    <>
      <Form.Item
        required={isRequired ? isRequired : false}
        label={label}
        validateStatus={validateStatus}
        help={validateMessage}
        className={props.classes}
        wrapperCol={{ span: 24 }}
        extra={iProps?.extra}
        labelCol={{ span: 24 }}
      >
        <Controller
          name={fieldName}
          control={control}
          defaultValue={initValue || initValue == 0 ? initValue : iProps?.mode == 'multiple' ? [] : null}
          rules={rules}
          render={({ field }) => {
            return <Select
              {...field}
              options={options}
              value={field.value ?? undefined}
              onChange={(e) => {
                // console.log('SelectField onChange:', fieldName, e);
                if (props?.setValue) {
                  props.setValue(fieldName, e)
                }
                field.onChange(e === undefined ? null : e);
              }}
              {...iProps}
              showSearch={showSearch}
              allowClear={allowClear}
              disabled={disabled}
            />
          }

          }
        />

      </Form.Item>
    </>
  );
};

export const InputPassword = (props: any) => {
  const {
    fieldName,
    label,
    control,
    iProps,
    rules,
    initValue,
    isRequired,
    errors,
  } = props;

  useEffect(() => {
    props.valueGot && props.setValue(fieldName, props.valueGot);
  }, [props.valueGot]);
  const [validateMessage, setValidateMessage] = useState<any>('');
  const [validateStatus, setValidateStatus] = useState<any>(false);
  useEffect(() => {
    // Use 'get' to safely access nested fields like 'errors.items[0].field'
    const errorObj = get(errors, fieldName);
    if (errorObj) {
      setValidateStatus("error");
      setValidateMessage(errorObj.message);
    } else {
      setValidateStatus(false);
      setValidateMessage("");
    }
  }, [errors?.[fieldName], fieldName]);


  return (
    <>
      <Form.Item
        required={isRequired ? isRequired : false}
        label={label}
        validateStatus={validateStatus}
        help={validateMessage}
        className={props.classes}
        wrapperCol={{ span: 24 }}
      >
        <Controller
          name={fieldName}
          control={control}
          defaultValue={initValue || initValue == 0 ? initValue : ""}
          rules={rules}
          // as={<Input.Password {...iProps} />}
          render={({ field }) => <Input.Password {...field} {...iProps} />}

        />
      </Form.Item>
    </>
  );
};


export const DateField: React.FC<any> = ({
  fieldName,
  label,
  control,
  iProps,
  rules,
  initValue,
  isRequired = false,
  errors,
  setValue,
  valueGot,
  classes,
  disabled,
  extra
}) => {
  const [validateMessage, setValidateMessage] = useState<string>('');
  const [validateStatus, setValidateStatus] = useState<'' | 'error'>('');

  // Handle external value updates
  useEffect(() => {
    if (valueGot && setValue) {
      setValue(fieldName, valueGot);
    }
  }, [valueGot, fieldName, setValue]);

  // Handle error states
  useEffect(() => {
    const fieldError = errors?.[fieldName];
    setValidateStatus(fieldError ? 'error' : '');
    setValidateMessage(fieldError?.message || '');
  }, [errors, fieldName]);

  return (
    <Form.Item
      required={isRequired}
      label={label}
      validateStatus={validateStatus}
      help={validateMessage}
      className={classes}
      wrapperCol={{ span: 24 }}
    >
      <Controller
        name={fieldName}
        control={control}
        defaultValue={initValue}
        rules={rules}
        render={({ field }) => {
          // Convert string date to dayjs for DatePicker display
          let dateValue = field.value ? dayjs(field.value) : null;

          // Handle year picker special case
          if (iProps?.picker === 'year' && field.value) {
            dateValue = dayjs(`${field.value}-01-01`);
          }

          return (
            <>
              <DatePicker
                style={{ width: '100%' }}
                {...iProps}
                value={dateValue}
                onChange={(date, dateString: any) => {
                  // For year picker, only keep the year part
                  if (iProps?.picker === 'year' && dateString) {
                    field.onChange(dateString.substring(0, 4));
                  } else {
                    // Store the date string instead of dayjs object
                    field.onChange(dateString);
                  }
                }}
                disabled={disabled}
              />
              {iProps?.extra}
            </>
          );
        }}
      />
    </Form.Item>
  );
};

export const RangePickerField = (props: any) => {
  const {
    fieldName,
    label,
    control,
    iProps,
    rules,
    initValue,
    isRequired,
    validate,
    validMessage,
  } = props;

  useEffect(() => {
    props.valueGot && props.setValue(fieldName, props.valueGot);
  }, [props.valueGot]);

  return (
    <>
      <Form.Item
        required={isRequired ? isRequired : false}
        label={label}
        validateStatus={validate}
        help={validMessage}
        className={props.classes}
      >
        <Controller
          name={fieldName}
          control={control}
          defaultValue={initValue ? initValue : ""}
          rules={rules}
          render={({ field }) => {
            const [firstValue, secondValue] = field.value || [null, null]; // Handle undefined values

            return (
              <RangePicker
                style={{ width: '100%' }}
                {...field}
                {...iProps}
                value={[firstValue && dayjs(firstValue), secondValue && dayjs(secondValue)]} // Format values with dayjs
              />
            );
          }}
        />
      </Form.Item>
    </>
  );
};

export const TimeField = (props: any) => {
  const {
    fieldName,
    label,
    control,
    iProps,
    rules,
    initValue,
    isRequired,
    errors,
  } = props;

  const [validateMessage, setValidateMessage] = useState<string>("");
  const [validateStatus, setValidateStatus] = useState<any>(false);

  // Error Handling for Nested Fields
  useEffect(() => {
    // Use 'get' to safely access nested fields like 'errors.items[0].field'
    const errorObj = get(errors, fieldName);
    if (errorObj) {
      setValidateStatus("error");
      setValidateMessage(errorObj.message);
    } else {
      setValidateStatus(false);
      setValidateMessage("");
    }
  }, [errors, fieldName]);


  return (
    <>
      <Form.Item
        required={isRequired || false}
        label={label}
        validateStatus={validateStatus}
        help={validateMessage}
        className={props.classes}
        wrapperCol={{ span: 24 }}
      >
        <Controller
          name={fieldName}
          control={control}
          defaultValue={initValue ? initValue : ""}
          rules={rules}
          // as={<TimePicker style={{ width: "100%" }} {...iProps} />}
          render={({ field }) => <TimePicker style={{ width: "100%" }} {...field} {...iProps} />}

        />
      </Form.Item>
    </>
  );
};


export const InputCheckbox: React.FC<any> = ({
  fieldName,
  label,
  control,
  rules,
  initValue = false,
  isRequired = false,
  errors,
  classes,
}) => {
  const [validateMessage, setValidateMessage] = useState<string>("");
  const [validateStatus, setValidateStatus]: any = useState<"error" | "" | false>("");

  // Error Handling for Nested Fields
  useEffect(() => {
    const errorObj = get(errors, fieldName);
    if (errorObj) {
      setValidateStatus("error");
      setValidateMessage(errorObj.message);
    } else {
      setValidateStatus(false);
      setValidateMessage("");
    }
  }, [errors, fieldName]);

  return (
    <Form.Item
      required={isRequired}
      validateStatus={validateStatus}
      help={validateMessage}
      className={classes}
      valuePropName="checked"
    >
      <Controller
        name={fieldName}
        control={control}
        defaultValue={initValue}
        rules={rules}
        render={({ field }) => (
          <Checkbox
            {...field}
            checked={field.value}
            onChange={(e) => field.onChange(e.target.checked)}
          >
            {label}
          </Checkbox>
        )}
      />
    </Form.Item>
  );
};


export const InputRadio = (props: any) => {
  const {
    fieldName,
    label,
    control,
    rules,
    initValue,
    options = [],
    isRequired,
    validate,
    validMessage,
    iProps
  } = props;

  useEffect(() => {
    props.valueGot && props.setValue(fieldName, props.valueGot);
  }, [props.valueGot, fieldName, props]);

  return (
    <Form.Item
      required={isRequired ? isRequired : false}
      validateStatus={validate}
      help={validMessage}
      noStyle
    >
      <Controller
        name={fieldName}
        control={control}
        rules={rules}
        defaultValue={initValue ? initValue : ""}
        render={({ field }) => {
          return (
            <Radio.Group
              {...field}
              {...iProps}
              //onChange={(e: any) => onChange(e.target.value)}
              options={options}

            />
          )
        }}
      />
    </Form.Item>
  );
};


export const UploadField = (props: any) => {
  const {
    fieldName,
    label,
    control,
    rules,
    initValue,
    isRequired,
    validate,
    validMessage,
    filelist,
    fileProps,
    iProps,
  } = props;

  useEffect(() => {
    props.valueGot && props.setValue(fieldName, props.valueGot);
  }, []);

  return (
    <Form.Item
      required={isRequired ? isRequired : false}
      label={label}
      validateStatus={validate}
      help={validMessage}
    >
      <Controller
        name={fieldName}
        control={control}
        rules={rules}
        defaultValue={initValue ? initValue : ""}
        render={({ value, onChange }: any) => (
          <Upload {...fileProps}>
            <Input
              {...iProps}
              value={
                filelist && filelist[0] && filelist[0].name
                  ? filelist[0].name
                  : "Choose file"
              }
              addonAfter="Browse"
            />
          </Upload>
        )}
      />
    </Form.Item>
  );
};

export const TextAreaField = (props: any) => {
  const {
    fieldName,
    label,
    control,
    iProps,
    rules,
    initValue,
    isRequired,
    errors,
  } = props;

  const [validateMessage, setValidateMessage] = useState<string>("");
  const [validateStatus, setValidateStatus] = useState<any>(false);

  // Error Handling for Nested Fields
  useEffect(() => {
    // Use 'get' to safely access nested fields like 'errors.items[0].field'
    const errorObj = get(errors, fieldName);
    if (errorObj) {
      setValidateStatus("error");
      setValidateMessage(errorObj.message);
    } else {
      setValidateStatus(false);
      setValidateMessage("");
    }
  }, [errors, fieldName]);


  return (
    <Form.Item
      required={isRequired || false}
      label={label}
      validateStatus={validateStatus}
      help={validateMessage}
      className={props.classes}
      wrapperCol={{ span: 24 }}
    >
      <Controller
        name={fieldName}
        control={control}
        defaultValue={initValue || initValue == 0 ? initValue : ""}
        rules={rules}
        // as={<Input.TextArea {...iProps} />}
        render={({ field }) => <Input.TextArea {...field} {...iProps} />}

      />
    </Form.Item>
  );
};

export const SwitchField = (props: any) => {
  const {
    fieldName,
    label,
    control,
    iProps,
    rules,
    initValue,
    isRequired,
    errors
  } = props;

  useEffect(() => {
    props.valueGot && props.setValue(fieldName, props.valueGot);
  }, [props.valueGot]);
  const [validateMessage, setValidateMessage] = useState<any>('');
  const [validateStatus, setValidateStatus] = useState<any>(false);
  useEffect(() => {

    if (errors?.[fieldName]) {
      setValidateStatus('error')
    } else {
      setValidateStatus(false)
    }
    if (errors?.[fieldName]) {
      setValidateMessage(errors?.[fieldName]?.message)
    } else {
      setValidateMessage('')
    }

  }, [errors?.[fieldName]])

  return (
    <>
      <Form.Item
        required={isRequired ? isRequired : false}
        label={label}
        validateStatus={validateStatus}
        help={validateMessage}
        className={props.classes}
        wrapperCol={{ span: 24 }}
      >
        <Controller
          name={fieldName}
          control={control}
          defaultValue={initValue || initValue == 0 ? initValue : ""}
          rules={rules}
          render={({ field }) => (
            <Switch
              {...field}
              // value={value}
              // onChange={onChange}
              // onBlur={props.onBlur}
              {...iProps}
            />
          )}
        />
      </Form.Item>
    </>
  );
};



const formatSSN = (value: string) => {
  const numbersOnly = value.replace(/\D/g, "");
  if (numbersOnly.length <= 3) return numbersOnly;
  if (numbersOnly.length <= 5) return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
  return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 5)}-${numbersOnly.slice(5, 9)}`;
};


const formatLicenseNumber = (licenseNumber: any) => {
  if (!licenseNumber) return '';

  const cleanedValue = licenseNumber.replace(/[^A-Z0-9]/g, '').toUpperCase(); // Remove non-alphanumeric and uppercase

  if (cleanedValue.length < 12) {
    return cleanedValue;
  }

  const firstChar = cleanedValue.charAt(0);
  const secondPart = cleanedValue.substring(1, 4);
  const thirdPart = cleanedValue.substring(4, 8);
  const fourthPart = cleanedValue.substring(8, 12);

  return `${firstChar}-${secondPart}-${thirdPart}-${fourthPart}`;
}

const formatPhoneNumber = (phoneNumber: string | number | null | undefined): string => {
  if (!phoneNumber) return '';

  const cleanedValue = String(phoneNumber).replace(/[^0-9]/g, '');

  if (cleanedValue.length <= 9) {
    return cleanedValue; // या "Invalid phone number"
  }

  const areaCode = cleanedValue.substring(0, 3);
  const prefix = cleanedValue.substring(3, 6);
  const lineNumber = cleanedValue.substring(6, 10);

  return `(${areaCode})-${prefix}-${lineNumber}`;
};

const formatEIN = (value: string) => {
  const numbersOnly = value.replace(/\D/g, "");
  if (numbersOnly.length <= 2) return numbersOnly;
  return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2, 9)}`;
};

const formatFileNumber = (value: string) => {
  const numbersOnly = value.replace(/\D/g, "");
  return numbersOnly.slice(0, 8);
};

export const MaskInputField = React.memo((props: any) => {
  const {
    fieldName,
    label,
    control,
    iProps,
    rules,
    initValue,
    isRequired,
    errors,
    valueGot, // Destructure valueGot explicitly
    setValue, // Destructure setValue explicitly
    classes,
  } = props;

  const [validateMessage, setValidateMessage]: any = useState('');
  const [validateStatus, setValidateStatus]: any = useState(false);

  // Set initial value only if `valueGot` changes
  useEffect(() => {
    if (valueGot !== undefined && valueGot !== null) {
      setValue(fieldName, valueGot); // Only setValue when valueGot explicitly updates
    }
  }, [valueGot, fieldName, setValue]);

  // Validation status and message updates
  useEffect(() => {
    if (errors?.[fieldName]) {
      setValidateStatus('error');
      setValidateMessage(errors[fieldName]?.message || '');
    } else {
      setValidateStatus(false);
      setValidateMessage('');
    }
  }, [errors, fieldName]);

  return (
    <Form.Item
      required={!!isRequired}
      label={label}
      validateStatus={validateStatus}
      help={validateMessage}
      className={classes}
      wrapperCol={{ span: 24 }}
    >
      <Controller
        name={fieldName}
        control={control}
        defaultValue={initValue || ''}
        rules={rules}
        render={({ field }: any) => {
          return (
            <Input
              {...field}
              {...iProps}
              onChange={(e) => {
                let formattedValue = e.target.value;

                if (iProps?.mask === "ssn") {
                  formattedValue = formatSSN(e.target.value);
                } else if (iProps?.mask === "dl") {
                  formattedValue = formatLicenseNumber(e.target.value);
                } else if (iProps?.mask === "phone") {
                  formattedValue = formatPhoneNumber(e.target.value);
                } else if (iProps?.mask === "99-9999999") {
                  formattedValue = formatEIN(e.target.value);
                } else if (iProps?.mask === "99999999") {
                  formattedValue = formatFileNumber(e.target.value);
                }

                field.onChange(formattedValue);
                requestAnimationFrame(() => {
                  e.target.selectionStart = e.target.selectionEnd = formattedValue.length;
                });
              }}
            />

            // <input
            //   {...field}
            //   {...iProps}
            //   ref={registerWithMask}
            //   className={`ant-input ${validateStatus ? 'ant-input-status-error' : ''}`}
            // />
          );
        }}
      />
    </Form.Item>
  );
});
