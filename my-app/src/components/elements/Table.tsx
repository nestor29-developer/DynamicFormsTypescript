import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { Fields } from "../../interfaces/fields";
import {
  AiOutlineSortDescending,
  AiOutlineSortAscending,
} from "react-icons/ai";
import { render } from "@testing-library/react";
import React from "react";
import { CgPlayListAdd } from "react-icons/cg";

export const Table: React.FC<Fields> = ({ uid, value, label, initvalues }) => {
  let obj: any = [];
  const [fields, setFields] = useState(value);
  const [activateColReal, setActivateColReal] = useState(false);
  const [activateColRealNested, setActivateColRealNested] = useState(false);
  let lengtharr = 0;
  initvalues.forEach((e) => {
    if (e.uid === uid) {
      localStorage.setItem("init" + uid, JSON.stringify(e.value));
      e.value.forEach(() => {
        lengtharr++;
      });
    }
  });

  useEffect(() => {
    localStorage.removeItem(uid + "group");
    localStorage.removeItem(uid + "childrengroup");
  }, []);

  const handleNewField = (e: any): any => {
    e.preventDefault();
    let arr: any = [];

    const initval: any = localStorage.getItem("init" + uid);
    const parseit = JSON.parse(initval);
    for (var i = 0; i < parseit.length; i++) {
      if (parseit[i].data_type !== "group") {
        obj = {
          id: uuidv4(),
          uid: value[i].uid,
          data_type: value[i].data_type,
          field_placeholder: value[i].field_placeholder,
          field_value: "",
          type: value[i].type,
        };
      } else {
        let valuesnested: any = [];
        parseit[i].value.forEach((e) => {
          const objnested = {
            id: uuidv4(),
            uid: e.uid,
            data_type: e.data_type,
            field_placeholder: e.field_placeholder,
            field_value: "",
            type: e.type,
          };
          valuesnested.push(objnested);
        });
        obj = {
          uid: value[i].uid,
          data_type: value[i].data_type,
          label: value[i].label,
          value: valuesnested,
        };
      }
      arr.push(obj);
    }
    setFields([...fields, ...arr]);
    setActivateColReal(true);
    updatedRows(uid);
  };

  const handleInputChange = (index: number, event: any) => {
    const values: any = [...fields];
    values[index]["field_value"] = event.target.value;
    setFields(values);
    updatedvalues(fields);
    setActivateColReal(true);
  };

  const handleInputChangeNested = (event: any, uidvalue, id) => {
    let arrchildren: any = [];
    fields
      .filter((x) => x.data_type === "group")
      .forEach((e, i) => {
        if (e.uid === uidvalue) {
          fields
            .filter((x) => x.data_type === "group")
            [i].value.forEach((element) => {
              if (element.id === id) {
                element.field_value = event.target.value;
              }
            });
          arrchildren.push(...e.value);
        }
      });

    setFields([...fields]);
    updatedvalues(arrchildren, uidvalue + "children");
    setActivateColRealNested(true);
  };

  const handleNewFieldNested = (
    e: any,
    uidvalue,
    uidchildren,
    uidparent,
    row
  ): any => {
    e.preventDefault();
    const getRow = getLastRow(uidchildren);
    if (getRow) {
      let arr: any = [];
      const initval: any = localStorage.getItem("init" + uid);
      let parseit = JSON.parse(initval);
      parseit = parseit.filter((x) => x.data_type === "group");
      parseit.forEach((e, i) => {
        if (e.uid === uidvalue) {
          parseit = parseit[i].value;
        }
      });
      const rowsParent = getLastRow(uidparent);
      let val = fields.filter((x) => x.data_type === "group");

      if (rowsParent === 0 || rowsParent === null) {
        val.forEach((e, i) => {
          if (e.uid === uidvalue) {
            val = val[i].value;
          }
        });
      } else {
        const numrows = val.length / rowsParent;
        const min = row * numrows;
        const max = numrows * row + numrows;
        let arr: any = [];
        for (let index = min; index < max; index++) {
          arr.push(val[index]);
        }
        val = arr;
        val.forEach((e, i) => {
          if (e.uid === uidvalue) {
            val = val[i].value;
          }
        });
      }

      for (var i = 0; i < parseit.length; i++) {
        obj = {
          id: uuidv4(),
          uid: val[i].uid,
          data_type: val[i].data_type,
          field_placeholder: val[i].field_placeholder,
          field_value: "",
          type: val[i].type,
        };
        arr.push(obj);
      }

      const rowpar = rowsParent ? rowsParent : 1;

      if (rowpar === 1) {
        fields
          .filter((x) => x.data_type === "group")
          .forEach((e, i) => {
            if (e.uid === uidvalue) {
              fields
                .filter((x) => x.data_type === "group")
                [i].value.push(...arr);
            }
          });
      } else {
        fields
          .filter((x) => x.data_type === "group")
          .filter((x) => x.uid === uidvalue)
          .forEach((e, index) => {
            if (index === row) {
              fields
                .filter((x) => x.data_type === "group" && x.uid === uidvalue)
                [index].value.push(...arr);
            }
          });
      }

      setFields([...fields]);
    }
    setFields([...fields]);
    setActivateColRealNested(true);
    updatedRowsNested(uidchildren);
  };

  const handleSortAsc = () => {
    const sorted = fields.sort((a, b): any => {
      const isReserved = 1;
      return isReserved * a.field_value.localeCompare(b.field_value);
    });
    setFields([...sorted]);
    updatedvalues(fields);
  };

  const handleSortDesc = () => {
    const sorted = fields.sort((a, b): any => {
      const isReserved = -1;
      return isReserved * a.field_value.localeCompare(b.field_value);
    });
    setFields([...sorted]);
    updatedvalues(fields);
  };

  const handleRemoveFields = (id, col?, position?) => {
    let values = [...fields];
    if (col && position) {
      let num = position;
      for (let index = 0; index < col; index++) {
        const idvalue = values[num].id;

        values = values.filter((field) => field.id !== idvalue);
        num--;
      }
    } else values = values.filter((field) => field.id !== id);

    setFields(values);
    updatedvalues(values);
    let newrow = getLastRow(uid);
    --newrow;
    localStorage.setItem("count" + uid, newrow);
  };

  function updatedvalues(val, name?) {
    const savedata = {
      value: val,
    };
    localStorage.setItem(
      name ? name + "group" : uid + "group",
      JSON.stringify(savedata)
    );
  }

  function updatedRows(val) {
    const getStorage: any = localStorage.getItem("count" + val);
    const existsStorage = JSON.parse(getStorage);
    if (existsStorage) {
      let lastRow = existsStorage;
      lastRow++;
      localStorage.setItem("count" + val, lastRow);
    } else {
      localStorage.setItem("count" + val, "2");
    }
  }

  function updatedRowsNested(val) {
    const getStorage: any = localStorage.getItem("count" + val);
    const existsStorage = JSON.parse(getStorage);
    if (existsStorage) {
      let lastRow = existsStorage;
      lastRow++;
      localStorage.setItem("count" + val, lastRow);
    } else {
      localStorage.setItem("count" + val, "1");
    }
  }

  function getLastRow(val) {
    const getStorage: any = localStorage.getItem("count" + val);
    let numberOfRow = JSON.parse(getStorage);
    return numberOfRow;
  }

  function removeChildrenRows(nesteduid) {
    for (let index = 0; index < 30; index++) {
      localStorage.removeItem("count" + nesteduid + index);
    }
  }

  const createNestedTable = (nesteduid, array, row, uidvalue, uidparent) => {
    let tableNested: any = [];
    const initval: any = localStorage.getItem("init" + uid);
    let parseit = JSON.parse(initval);
    parseit = parseit.filter((x) => x.data_type === "group");
    parseit.forEach((e, i) => {
      if (e.uid === uidvalue) {
        parseit = parseit[i].value;
      }
    });
    updatedvalues(fields);

    const rowsParent = getLastRow(uidparent);

    let val = array.filter((x) => x.data_type === "group");

    // let countarr:any = [];

    if (rowsParent === 0 || rowsParent === null) {
      val.forEach((e, i) => {
        if (e.uid === uidvalue) {
          val = val[i].value;
        }
      });
    } else {
      const numrows = val.length / rowsParent;
      const min = row * numrows;
      const max = numrows * row + numrows;
      let arr: any = [];
      for (let index = min; index < max; index++) {
        arr.push(val[index]);
      }
      val = arr;
      val.forEach((e, i) => {
        if (e.uid === uidvalue) {
          val = val[i].value;
        }
      });
    }

    if (parseit.length === val.length && !activateColRealNested) {
      removeChildrenRows(nesteduid);
    }

    const getRow = getLastRow(nesteduid + row);
    if (getRow) {
      const row = getRow;
      const col: any = val;
      for (let i = 0; i < row; i++) {
        let childrenNested: any = [];

        for (let j = 0; j < parseit.length; j++) {
          childrenNested.push(
            <td key={j}>
              <div className="form-group d-flex align-items-center">
                <input
                  name={col[j + i * parseit.length].uid}
                  type={col[j + i * parseit.length].type}
                  className="form-control"
                  value={col[j + i * parseit.length].field_value}
                  id="inputElement"
                  placeholder={col[j + i * parseit.length].field_placeholder}
                  onChange={(e) =>
                    handleInputChangeNested(
                      e,
                      uidvalue,
                      col[j + i * parseit.length].id
                    )
                  }
                />
              </div>
            </td>
          );
        }

        tableNested.push(
          <tr key={i} className="table-light">
            {childrenNested}
          </tr>
        );
      }
    }

    return tableNested;
  };

  const createBody = () => {
    const getDataStorage: any = localStorage.getItem("init" + uid);
    const colStorage: any = JSON.parse(getDataStorage);
    const colReal: any = fields;
    if (colStorage.length === colReal.length) {
      localStorage.removeItem("count" + uid);
    }
    const col: any = activateColReal
      ? colReal
      : activateColRealNested
      ? colReal
      : colStorage;
    const rows = getLastRow(uid);

    const raw: any = rows ? rows : 1;
    let table: any = [];
    for (let i = 0; i < raw; i++) {
      let children: any = [];
      for (let j = 0; j < colStorage.length; j++) {
        children.push(
          <td key={j}>
            <div className="form-group mt-3 d-flex align-items-center">
              {col[j + i * colStorage.length].data_type !== "group" && (
                <input
                  name={
                    colStorage.length === 1
                      ? col[i].uid
                      : col[j + i * colStorage.length].uid
                  }
                  type={
                    colStorage.length > 1
                      ? col[j + i * colStorage.length].type
                      : col[i].type
                  }
                  className="form-control"
                  value={
                    colStorage.length > 1
                      ? col[j + i * colStorage.length].field_value
                      : col[i].field_value
                  }
                  id="inputElement"
                  placeholder={
                    colStorage.length > 1
                      ? col[j + i * colStorage.length].field_placeholder
                      : col[i].field_placeholder
                  }
                  onChange={(e) =>
                    handleInputChange(
                      colStorage.length > 1 ? j + i * colStorage.length : i,
                      e
                    )
                  }
                />
              )}

              {col[j + i * colStorage.length].data_type !== "group" && (
                <div>
                  {lengtharr > 1 && i > 0 && colStorage.length - j == 1 && (
                    <div
                      onClick={() =>
                        handleRemoveFields(
                          col[j + i * colStorage.length].id,
                          colStorage.length,
                          j + i * colStorage.length
                        )
                      }
                      style={{
                        marginLeft: "22px",
                        cursor: "pointer",
                      }}
                    >
                      <h3>
                        <MdDelete />
                      </h3>
                    </div>
                  )}
                </div>
              )}

              {col[j + i * colStorage.length].data_type !== "group" && (
                <div>
                  {lengtharr === 1 && i > 0 && (
                    <div
                      onClick={() => handleRemoveFields(col[i].id)}
                      style={{
                        marginLeft: "22px",
                        cursor: "pointer",
                      }}
                    >
                      <h3>
                        <MdDelete />
                      </h3>
                    </div>
                  )}
                </div>
              )}

              {col[j + i * colStorage.length].data_type === "group" && (
                <div className="col">
                  <div className="d-flex">
                    <div className="mt-1" style={{ marginRight: "16px" }}>
                      <h6>{col[j + i * colStorage.length].label!}</h6>
                    </div>

                    <h3>
                      <CgPlayListAdd
                        style={{
                          color: "blue",
                          cursor: "pointer",
                        }}
                        onClick={(e) =>
                          handleNewFieldNested(
                            e,
                            col[j + i * colStorage.length].uid,
                            col[j + i * colStorage.length].uid + "children" + i,
                            uid,
                            i
                          )
                        }
                      />
                    </h3>
                  </div>

                  <div>
                    <table className="table table-bordered mt-4">
                      <tbody>
                        {createNestedTable(
                          col[j + i * colStorage.length].uid + "children",
                          col,
                          i,
                          col[j + i * colStorage.length].uid,
                          uid
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </td>
        );
      }

      table.push(<tr key={i}>{children}</tr>);
    }
    return table;
  };

  return (
    <div>
      <div className="d-flex align-items-center">
        <h3>
          <IoMdAddCircle
            style={{
              marginLeft: "144px",
              marginTop: "-92.5px",
              cursor: "pointer",
              color: "green",
            }}
            onClick={(e) => handleNewField(e)}
          />
        </h3>

        {lengtharr === 1 && (
          <>
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
          </>
        )}
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">{label}</th>
          </tr>
        </thead>
        <tbody>{createBody()}</tbody>
      </table>
    </div>
  );
};
