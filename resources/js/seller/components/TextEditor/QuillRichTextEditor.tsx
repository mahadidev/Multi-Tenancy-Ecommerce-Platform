import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles

const QuillRichTextEditor = () => {
    const [value, setValue] = useState("");

    return (
        <div>
            <h2>Quill Editor</h2>
            <ReactQuill theme="snow" value={value} onChange={setValue} />
        </div>
    );
};

export default QuillRichTextEditor;
