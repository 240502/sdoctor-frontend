import { useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
export const SummaryEditor = ({ handleChangeSummaryEditor, service }: any) => {
    const editorRef = useRef<any>(null);

    return (
        <CKEditor
            editor={ClassicEditor}
            data={service !== undefined ? service?.summary : ''}
            config={{
                // Các cấu hình khác nếu cần
                toolbar: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'link',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'alignment', // Add alignment option
                    'imageUpload', // Enable image upload
                    'insertTable', // Enable table insertion
                    'blockQuote',
                    '|',
                    'undo',
                    'redo',
                ],
                // Cho phép chèn hình ảnh
                image: {
                    // Configure the image plugin options
                    toolbar: [
                        'imageTextAlternative',
                        'imageStyle:full',
                        'imageStyle:side',
                    ],
                },
            }}
            onReady={(editor) => {
                editorRef.current = editor; // Lưu instance của editor vào ref
            }}
            onFocus={(event, editor) => {
                // showSuccess(labelContentRef.current);
            }}
            onChange={(event, editor) => {
                console.log(editor.isReadOnly);
                const data = editor.getData();
                // if (isUpdate) {
                //     setPost({ ...post, content: data });
                // } else {
                handleChangeSummaryEditor(data);
                // }
            }}
        />
    );
};