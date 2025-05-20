import { useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CustomUploadAdapterPlugin from '../../../../utils/MyUploadAdapterPlugin';
const ClinicEditor = ({ handleChangeClinicEditor, clinic }: any) => {
    const editorRef = useRef<any>(null);
    return (
        <CKEditor
            editor={ClassicEditor}
            data={
                clinic !== undefined && clinic?.description
                    ? clinic?.description
                    : ''
            }
            config={{
                extraPlugins: [CustomUploadAdapterPlugin],
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
                    'alignment',
                    'imageUpload',
                    'insertTable',
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
            onChange={(event, editor) => {
                const data = editor.getData();
                handleChangeClinicEditor(data);
            }}
        />
    );
};

export default ClinicEditor;
