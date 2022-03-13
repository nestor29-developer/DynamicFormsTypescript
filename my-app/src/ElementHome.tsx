import React, { FormEvent } from "react";
import "./App.css";
import dynamicFormJson from "./fields.json";
import { useState, useEffect } from "react";
import { Element } from "./components/Element";
import { FormContext } from "./FormContext";
import { AiOutlinePlus } from "react-icons/ai";
import { GrLinkNext } from "react-icons/gr";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

const ElementHome: React.FC = () => {
  const [elements, setElements]: any = useState<[]>([]);
  const [fieldsRequired, setFieldsRequired]: any = useState<[]>([]);
  const [saveForm, setSaveForm] = useState<boolean>(false);

  localStorage.setItem("array", JSON.stringify(dynamicFormJson[0]));
  const val: any = localStorage.getItem("array");
  const [initvalue, setInitvalue] = useState(JSON.parse(val));
  //   const navigate = useNavigate();
  let initvalues: any = initvalue.fields.filter((e) => e.data_type === "group");

  useEffect(() => {
    setElements(dynamicFormJson[0] as any);
  }, []);

  const { fields, page_label } = elements ?? ({} as any);
  const handleSubmit = (event: FormEvent<HTMLButtonElement>) => {
    let count = 0;
    let countMandatory = 0;
    event.preventDefault();

    elements.fields.forEach((field: any) => {
      if (field["field_mandatory"]) {
        if (
          field["data_type"] === "checkbox" &&
          field["value"] &&
          field["value"].length > 0
        ) {
          for (var i = 0; i < field.value.length; i++) {
            if (field.value[i]["field_mandatory"]) {
              field.value[i]["field_mandatory"] =
                field.value[i]["field_value"].length > 0 ? false : true;
              if (field.value[i]["field_mandatory"])
                field.value[i]["field_mandatory_active"] = true;
              else if (
                !field.value[i]["field_mandatory"] &&
                field.value[i]["error_msg"].length === 0
              ) {
                field.value[i]["field_mandatory_active"] = false;
                count++;
              }
            }
          }
        } else {
          field["field_mandatory"] =
            field["field_value"].length > 0 && field["error_msg"].length === 0
              ? false
              : true;
          if (field["field_mandatory"]) field["field_mandatory_active"] = true;
          else if (
            !field["field_mandatory"] &&
            field["error_msg"].length === 0
          ) {
            field["field_mandatory_active"] = false;
            count++;
          }
        }

        setFieldsRequired(field);
      }
    });

    elements.fields.forEach((field: any) => {
      if (
        field["field_mandatory"] &&
        field["data_type"] === "checkbox" &&
        field["value"] &&
        field["value"].length > 0
      ) {
        for (var i = 0; i < field.value.length; i++) {
          if (field.value[i]["field_mandatory"]) countMandatory++;
        }
      } else if (field["field_mandatory"]) countMandatory++;
    });

    if (count === countMandatory) {
      alert("Saved successfully!!");
      for (var i = 0; i < elements.fields.length; i++) {
        if (elements.fields[i].data_type === "group") {
          const nestedgroup: any = localStorage.getItem(
            elements.fields[i].uid + "group"
          );
          const converted = JSON.parse(nestedgroup);
          if (converted) {
            const row = converted.value.length;
            if (row) {
              for (let index = 0; index < row; index++) {
                if (converted.value[index].data_type !== "group") {
                  elements.fields[i].value.length = 0;
                  elements.fields[i].value.push(...converted.value);
                  break;
                }
              }
            }
          }
        }
      }

      console.log("elements saved by handleSubmit", elements);
      setSaveForm(true);
    } else {
      setSaveForm(false);
    }
  };

  const handleChange = (id: any, event: any, text: any, index: any) => {
    const newElements = { ...elements };
    newElements.fields.forEach((field: any) => {
      const { data_type, uid, value } = field;

      if (id === uid) {
        switch (data_type) {
          case "checkbox":
            field["checked"] = event.target.checked;
            field["field_mandatory"] = event.target.checked;
            if (!field["checked"]) {
              for (var i = 0; i < field.value.length; i++) {
                field.value[i]["field_value"] = "";
                field.value[i]["field_mandatory"] = false;
                field.value[i]["field_mandatory_active"] = false;
              }
            } else {
              for (var i = 0; i < field.value.length; i++) {
                field.value[i]["field_mandatory"] = true;
                field.value[i]["field_mandatory_active"] = true;
              }
            }
            break;

          default:
            field["field_value"] = event.target
              ? event.target.value
              : !text.props
              ? ""
              : text.props.children.props
              ? localStorage.getItem("lastTextEditor")
              : text.props.children;
            if (
              !event.target &&
              !text.props.children.props &&
              text.props.children
            )
              localStorage.setItem("lastTextEditor", text.props.children);

            if (id === "email") {
              const regEx =
                /[a-zA-Z0-9._%+--]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
              if (
                !regEx.test(field["field_value"]) &&
                field["field_value"].length > 0
              )
                field["error_msg"] = "Email invalid";
              else field["error_msg"] = "";
            }

            field["field_mandatory"] =
              field["field_value"].length > 0 && field["error_msg"].length === 0
                ? false
                : true;

            break;
        }
      } else if (
        data_type !== "group" &&
        value &&
        value.length > 0 &&
        index !== undefined
      ) {
        field.value[index]["field_value"] = event.target.value;

        field.value[index]["field_mandatory"] =
          field.value[index]["field_value"].length > 0 &&
          field.value[index]["error_msg"].length === 0
            ? false
            : true;
      }
      setElements(newElements);
    });
  };

  //   const handleEdit = () => {
  //     navigate("/edit");
  //   };

  return (
    <FormContext.Provider value={{ handleChange }}>
      <div className="col container">
        <h2 className="mt-2 mb-4 d-flex justify-content-center">
          {page_label}
        </h2>
        <div className="row">
          {fields
            ? fields.map((field: any, i: any) => (
                <Element key={i} {...field} initvalues={initvalues} />
              ))
            : null}
          <div className="d-flex justify-content-center">
            <div className="col-6">
              <button
                type="submit"
                className="btn btn-success mt-5 mb-3 btn-circle"
                style={{
                  width: "100%",
                  padding: "8px 25px",
                  fontWeight: "600",
                  borderRadius: "35px",
                }}
                onClick={(e) => handleSubmit(e)}
              >
                Submit <AiOutlinePlus />
              </button>
            </div>
          </div>

          {/* {saveForm && (
              <div className="d-flex justify-content-center">
                <div className="col-6">
                  <button
                    type="submit"
                    className="btn btn-primary mt-3 mb-3 border-0"
                    style={{
                      width: "100%",
                      padding: "8px 25px",
                      fontWeight: "600",
                    }}
                    onClick={() => handleEdit()}
                  >
                    Next Step <GrLinkNext />
                  </button>
                </div>
              </div>
            )} */}
        </div>
      </div>
    </FormContext.Provider>
  );
};

export default ElementHome;
