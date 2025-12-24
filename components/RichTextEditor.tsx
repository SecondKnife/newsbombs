"use client";

import { useEffect, useRef, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

// Custom upload adapter for CKEditor
class MyUploadAdapter {
  loader: any;
  
  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then((file: File) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('upload', file);
        
        const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
        
        fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/articles/ckeditor-upload`, {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: formData,
        })
          .then(response => response.json())
          .then(result => {
            if (result.uploaded) {
              resolve({ default: result.url });
            } else {
              reject(result.error?.message || 'Upload failed');
            }
          })
          .catch(error => {
            reject(error.message || 'Upload failed');
          });
      });
    });
  }

  abort() {
    // Handle abort if needed
  }
}

function MyCustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
  };
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  minHeight = "300px",
}: RichTextEditorProps) {
  const editorRef = useRef<any>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorInstance, setEditorInstance] = useState<any>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    let isMounted = true;

    const loadEditor = async () => {
      try {
        // Dynamically import CKEditor modules
        const { CKEditor } = await import("@ckeditor/ckeditor5-react");
        const ClassicEditor = (await import("@ckeditor/ckeditor5-build-classic")).default;

        if (!isMounted) return;

        // Store references
        editorRef.current = { CKEditor, ClassicEditor };
        setEditorLoaded(true);
      } catch (error) {
        console.error("Error loading CKEditor:", error);
      }
    };

    loadEditor();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorInstance && value !== editorInstance.getData()) {
      editorInstance.setData(value);
    }
  }, [value, editorInstance]);

  if (!editorLoaded || !editorRef.current) {
    return (
      <div
        className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center"
        style={{ minHeight }}
      >
        <span className="text-gray-500">Loading editor...</span>
      </div>
    );
  }

  const { CKEditor, ClassicEditor } = editorRef.current;

  return (
    <div className="ckeditor-wrapper">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          placeholder,
          extraPlugins: [MyCustomUploadAdapterPlugin],
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "outdent",
            "indent",
            "|",
            "imageUpload",
            "blockQuote",
            "insertTable",
            "mediaEmbed",
            "|",
            "undo",
            "redo",
          ],
          heading: {
            options: [
              { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
              { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
              { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
              { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
            ],
          },
          image: {
            toolbar: [
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side',
              '|',
              'toggleImageCaption',
              'imageTextAlternative'
            ],
            // Default to block style (centered)
            styles: {
              options: [
                'inline',
                'alignLeft',
                'alignRight',
                'alignCenter',
                'alignBlockLeft',
                'alignBlockRight',
                'block',
                'side'
              ]
            }
          },
        }}
        onReady={(editor: any) => {
          setEditorInstance(editor);
          // Set minimum height
          const editorElement = editor.ui.view.editable.element;
          if (editorElement) {
            editorElement.style.minHeight = minHeight;
          }
        }}
        onChange={(event: any, editor: any) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
      <style jsx global>{`
        .ckeditor-wrapper .ck-editor__editable {
          min-height: ${minHeight};
        }
        .ckeditor-wrapper .ck-editor__editable:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
        }
        .ckeditor-wrapper .ck.ck-editor {
          width: 100%;
        }
        .ckeditor-wrapper .ck.ck-toolbar {
          background: #f8fafc !important;
          border-color: #e2e8f0 !important;
          border-radius: 8px 8px 0 0 !important;
        }
        .ckeditor-wrapper .ck.ck-editor__main > .ck-editor__editable {
          background: white !important;
          border-color: #e2e8f0 !important;
          border-radius: 0 0 8px 8px !important;
        }
        /* Center all images in editor */
        .ckeditor-wrapper .ck-editor__editable figure.image {
          display: flex !important;
          justify-content: center !important;
          margin: 1rem auto !important;
        }
        .ckeditor-wrapper .ck-editor__editable figure.image img {
          max-width: 100% !important;
          height: auto !important;
        }
        .dark .ckeditor-wrapper .ck.ck-toolbar {
          background: #1e293b !important;
          border-color: #334155 !important;
        }
        .dark .ckeditor-wrapper .ck.ck-toolbar .ck-button {
          color: #e2e8f0 !important;
        }
        .dark .ckeditor-wrapper .ck.ck-toolbar .ck-button:hover {
          background: #334155 !important;
        }
        .dark .ckeditor-wrapper .ck.ck-editor__main > .ck-editor__editable {
          background: #0f172a !important;
          border-color: #334155 !important;
          color: #e2e8f0 !important;
        }
        .dark .ckeditor-wrapper .ck.ck-editor__editable.ck-focused {
          border-color: #3b82f6 !important;
        }
        .dark .ckeditor-wrapper .ck-dropdown__panel {
          background: #1e293b !important;
          border-color: #334155 !important;
        }
        .dark .ckeditor-wrapper .ck-list__item .ck-button {
          color: #e2e8f0 !important;
        }
        .dark .ckeditor-wrapper .ck-list__item .ck-button:hover {
          background: #334155 !important;
        }
      `}</style>
    </div>
  );
}
