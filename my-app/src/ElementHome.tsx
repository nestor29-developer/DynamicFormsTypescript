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
  const [flagRelatives, setFlagRelatives] = useState<boolean>(false);
  //   const navigate = useNavigate();

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
        field["field_mandatory"] =
          field["field_value"].length > 0 && field["error_msg"].length === 0
            ? false
            : true;
        if (field["field_mandatory"]) field["field_mandatory_active"] = true;
        else if (!field["field_mandatory"] && field["error_msg"].length === 0) {
          field["field_mandatory_active"] = false;
          count++;
        }
        setFieldsRequired(field);
      }
    });

    elements.fields.forEach((field: any) => {
      if (field["field_mandatory"]) countMandatory++;
    });

    if (count === countMandatory) {
      alert("Saved successfully!!");
      console.log("elements saved by handleSubmit", elements);
      setFlagRelatives(true);
    } else {
      setFlagRelatives(false);
    }
  };

  const handleChange = (id: any, event: any, text: any) => {
    const newElements = { ...elements };
    newElements.fields.forEach((field: any) => {
      const { data_type, uid } = field;

      if (id === uid) {
        field["field_value"] = event.target
          ? event.target.value
          : !text.props
          ? ""
          : text.props.children.props
          ? localStorage.getItem("lastTextEditor")
          : text.props.children;
        if (!event.target && !text.props.children.props && text.props.children)
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
        {/* <form> */}
        <div className="row">
          {fields
            ? fields.map((field: any, i: any) => <Element key={i} {...field} />)
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

          {/* {flagRelatives && (
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
        {/* </form> */}
      </div>
    </FormContext.Provider>
  );
};

export default ElementHome;
