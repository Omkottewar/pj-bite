"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import Quill with SSR disabled since it relies on the browser's Document object
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  // Modules configuration for the toolbar
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#E8E6E1] focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary transition-all">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || "Write your content here..."}
        className="h-72 mb-12" // mb-12 provides room for the quill toolbar/bottom area if needed
      />
      <style jsx global>{`
        .quill {
          display: flex;
          flex-direction: column;
        }
        .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #E8E6E1;
          font-family: inherit;
          padding: 12px;
          background-color: #fcfcfc;
        }
        .ql-container.ql-snow {
          border: none;
          font-family: inherit;
          font-size: 1rem;
        }
        .ql-editor {
          min-height: 250px;
          padding: 16px;
        }
        .ql-editor p {
          margin-bottom: 0.75rem;
        }
      `}</style>
    </div>
  );
}
