import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { Fields } from "../../interfaces/fields";
import { AiOutlineSortDescending, AiOutlineSortAscending } from "react-icons/ai";

export const AddForm: React.FC<Fields> = ({ uid, value, label }) => {

  const arrlen = value.length;
  const val = arrlen===1 ? value[0].uid : null; 

  const [field, setField] = useState([
    {
      id: uuidv4(),
      uid: val,
      data_type: "string",
      field_placeholder: "Enter your "+ val,
      field_value: "",
      type: "text",
    },
  ]); 

  useEffect(() => {
    setField(value);
  }, []);

  const handleNewField = (e: any): any => {
    e.preventDefault();
    console.log("value: ", value)
    setField([
      ...field,
      {
        id: uuidv4(),
        uid: val,
        data_type: "string",
        field_placeholder: "Enter your "+val,
        field_value: "",
        type: "text",
      },
    ]);
  };

  const handleSortAsc = () => { 
    const sorted = field.sort((a, b): any => {
      const isReserved = 1;
      return isReserved * a.field_value.localeCompare(b.field_value);
    });
    setField([...sorted]);
  };

  const handleSortDesc = () => { 
    const sorted = field.sort((a, b): any => {
      const isReserved = -1;
      return isReserved * a.field_value.localeCompare(b.field_value);
    });
    setField([...sorted]);
  };

  const handleInputChange = (index: number, event: any) => {
    const values: any = [...field];
    values[index]["field_value"] = event.target.value;
    setField(values);
  };

  const handleRemoveFields = (id) => {
    const values = [...field];
    let updated: any = [];
    updated = values.filter((field) => field.id !== id);
    setField(updated);
  };

  return (
    <form onSubmit={handleNewField}>
      <div className="">
        <div className="d-flex align-items-center">
          <h3>
            <IoMdAddCircle
              style={{
                marginLeft: "64px",
                marginTop: "-92.5px",
                cursor: "pointer",
              }}
              onClick={(e) => handleNewField(e)}
            />
          </h3>

          <div
            style={{
              marginLeft: "64px",
              marginTop: "-88.5px",
              cursor: "pointer",
            }}
            onClick={() => handleSortAsc()}
          >
            <h3>
              <AiOutlineSortDescending />
            </h3>
          </div>

          <div
            style={{
              marginLeft: "32px",
              marginTop: "-88.5px",
              cursor: "pointer",
            }}
            onClick={() => handleSortDesc()}
          >
            <h3>
              <AiOutlineSortAscending />
            </h3>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">{label}</th>
            </tr>
          </thead>
          <tbody>
            {field
              ? field.map((field: any, i: any) => (
                  <tr key={i}>
                    <td>
                      <div className="form-group mt-3">
                        <input
                          name={field.uid}
                          type={field.type}
                          className="form-control"
                          value={field.field_value}
                          style={{ width: "100%" }}
                          id="inputElement"
                          placeholder={
                            field.field_placeholder
                              ? field.field_placeholder
                              : ""
                          }
                          onChange={(e) => handleInputChange(i, e)}
                        />
                      </div>
                    </td>
                    <td>
                      {i > 0 && (
                        <div
                          onClick={() => handleRemoveFields(field.id)}
                          style={{
                            marginTop: "14px",
                            marginLeft: "32px",
                            cursor: "pointer",
                          }}
                        >
                          <h3>
                            <MdDelete />
                          </h3>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </form>
  );
};
