import React, { useState, useEffect } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function Wysiwyg({ label, name, value, onChange, error }) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const onEditorStateChange = (state) => {
        setEditorState(state);
        const html = draftToHtml(convertToRaw(state.getCurrentContent()));
        if (html == "<p></p>\n") {
            onChange("");
        } else {
            onChange(html);
        }
        // Push updated HTML to the form
    };

    return (
        <div className="mb-4">
            {label && <label className="block mb-1 font-medium">{label}</label>}
            <Editor
                editorState={editorState}
                wrapperClassName="border rounded"
                editorClassName="p-2 min-h-[150px] max-h-[150px] overflow-y-auto custom-rtl-editor"
                onEditorStateChange={onEditorStateChange}
            />

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
