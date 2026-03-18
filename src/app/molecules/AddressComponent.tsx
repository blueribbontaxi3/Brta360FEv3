import React, { useState } from "react";
import { Col } from "antd";
import { Autocomplete } from "@react-google-maps/api";
import { InputField } from "@atoms/FormElement";

export const AddressComponent = ({ control, setValue, errors }: any) => {
  const [autocomplete, setAutocomplete] = useState<any>(null);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      // Extract address components from Google API response
      const addressComponents = place.address_components || [];
      console.log('addressComponents', addressComponents)
      const getComponent = (type: string) =>
        addressComponents.find((comp: any) => comp.types.includes(type))?.long_name || "";

      const streetNumber = getComponent("street_number");
      const route = getComponent("route");
      const simplifiedAddress = `${streetNumber} ${route}`.trim();

      // Other fields
      const city = getComponent("locality");
      const state = getComponent("administrative_area_level_1");
      const zipCode = getComponent("postal_code");

      // Set values dynamically using setValue
      setValue("address", simplifiedAddress); // Simplified address
      setValue("unit", ""); // Optional: Set to empty or a default value
      setValue("city", city);
      setValue("state", state);
      setValue("zipCode", zipCode);
    }
  };

  return (
    <>
      <Col xs={24} sm={24} md={12} lg={8} xl={8}>
        <Autocomplete
          onLoad={(autocompleteInstance) => setAutocomplete(autocompleteInstance)}
          onPlaceChanged={onPlaceChanged}
          options={{
            componentRestrictions: { country: "us" }, // Restrict search to USA
          }}
        >
          <InputField
            label="Address"
            fieldName="address"
            control={control}
            iProps={{
              placeholder: "Address",
              size: "large",
            }}
            errors={errors}
          />
        </Autocomplete>
      </Col>

      <Col xs={24} sm={24} md={12} lg={8} xl={4}>
        <InputField
          label="Unit"
          fieldName="unit"
          control={control}
          iProps={{
            placeholder: "Unit",
            size: "large",
          }}
          errors={errors}
        />
      </Col>

      <Col xs={24} sm={24} md={12} lg={8} xl={4}>
        <InputField
          label="City"
          fieldName="city"
          control={control}
          iProps={{
            placeholder: "City",
            size: "large",
          }}
          errors={errors}
        />
      </Col>

      <Col xs={24} sm={24} md={12} lg={8} xl={4}>
        <InputField
          label="State"
          fieldName="state"
          control={control}
          iProps={{
            placeholder: "State",
            size: "large",
          }}
          errors={errors}
        />
      </Col>

      <Col xs={24} sm={24} md={12} lg={8} xl={4}>
        <InputField
          label="Zip Code"
          fieldName="zipCode"
          control={control}
          iProps={{
            placeholder: "Zip Code",
            size: "large",
          }}
          errors={errors}
        />
      </Col>
    </>
  );
};
