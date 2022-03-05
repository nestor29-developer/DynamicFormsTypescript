import React, { useContext } from "react";
import { FormContext } from "../../FormContext";
import { useForm } from "react-hook-form";
import { Fields } from "../../interfaces/fields";
import { Input } from "./Input";

export const Checkbox: React.FC<Fields> = ({
  uid,
  label,
  checked, 
  value,
}) => {
  const { handleChange }: any = useContext(FormContext);

  return (
    <>
      <div className="mb-3 mt-3 form-check" style={{ marginLeft: "12px" }}>
        <input
          type="checkbox"
          className="form-check-input"
          id="chkform"
          checked={checked}
          onChange={(event) => handleChange(uid, event)}
        />
        <label className="form-check-label" htmlFor="chkform">
          {label}
        </label>
      </div>

      {checked &&
        value.length > 0 &&
        value.map((val, i) => (
          <Input
            key={i}
            uid={val.uid}
            label={val.label}
            error_msg={val.error_msg}
            field_placeholder={val.field_placeholder}
            field_mandatory={val.field_mandatory}
            field_value={val.field_value}
            type={val.type}
            label_mandatory={val.label_mandatory}
            field_mandatory_active={val.field_mandatory_active}
            index={i}
          />
        ))}
    </>
  );
};
