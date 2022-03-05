import React, { useContext } from "react";
import { FormContext } from "../../FormContext";
import { useForm } from "react-hook-form";
import { Fields } from "../../interfaces/fields";

export const Input: React.FC<Fields> = ({
  uid,
  label,
  field_placeholder,
  field_value,
  field_mandatory,
  error_msg,
  field_mandatory_active,
  type,
  label_mandatory,
  index
}) => {
  const { handleChange }: any = useContext(FormContext); 
  return ( 
    <div className="mb-4 form-group col-6">
      <label htmlFor="inputElement" className="form-label">
        {label} {label_mandatory && <small className="text-danger">*</small>}
      </label>

      <input
        type={type}
        className="form-control"
        id="inputElement"
        placeholder={field_placeholder ? field_placeholder : ""}
        value={field_value}
        onChange={(event) => handleChange(uid, event, "", index)}
      />
      {field_mandatory && field_mandatory_active && error_msg === "" && (
        <small className="text-danger">{label} is Required</small>
      )}
      {error_msg!.length > 0 && (
        <small className="text-danger">{error_msg}</small>
      )}
    </div>
  );
};
