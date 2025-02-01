import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles

interface IRichTextEditorProps {
    content: string;
    onChangeContent: (value: string) => void;
}
const QuillRichTextEditor: React.FC<IRichTextEditorProps> = ({
    content,
    onChangeContent,
}) => {
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
        ],
    };
    return (
        <ReactQuill
            className="bg-[#374151] !text-white"
            value={content}
            onChange={(e) => onChangeContent(e)}
            modules={modules}
        />
    );
};

export default QuillRichTextEditor;
