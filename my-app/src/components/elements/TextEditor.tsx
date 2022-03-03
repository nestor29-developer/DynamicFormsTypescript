import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import parse from "html-react-parser";
import React, { useState, useContext } from "react";
import { FormContext } from "../../FormContext";
import ReactMarkdown from "react-markdown";
import { Fields } from "../../interfaces/fields";

export const TextEditor: React.FC<Fields> = ({ uid, label }) => {
  const { handleChange }: any = useContext(FormContext);
  const [text, setText] = useState("");

  return (
    <div className="mb-4">
      <ReactMarkdown>{label}</ReactMarkdown>
      <div className="editor">
        <CKEditor
          editor={ClassicEditor}
          data={text}
          onChange={(event: any, editor: any) => {
            const data = editor.getData();
            const parseData = parse(data);
            handleChange(uid, event, parseData);
          }}
        />
      </div>
    </div>
  );
};
