import React, { useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Select } from 'antd';
import CustomUploadAdapterPlugin from '../../../../utils/MyUploadAdapterPlugin';
import { showError, showSuccess } from '../../../../utils/global';
const MyEditor = ({
    setEditorData,
    labelContentRef,
    post,
    setPost,
    isUpdate,
    isView,
}: any) => {
    const editorRef = useRef<any>(null);
    useEffect(() => {
        if (editorRef.current) {
            const editorInstance = editorRef.current;
            if (isView) {
                editorInstance.enableReadOnlyMode('my-editor');
            } else {
                editorInstance.disableReadOnlyMode('my-editor');
            }
        }
    }, [isView]);
    return (
        <CKEditor
            editor={ClassicEditor}
            data={post !== undefined ? post.content : ''}
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
                if (isView) {
                    editor.enableReadOnlyMode('my-editor'); // Thiết lập chế độ chỉ đọc nếu cần
                } else {
                    editor.disableReadOnlyMode('my-editor'); // Thiết lập chế độ chỉnh sửa nếu cần
                }
                console.log('Editor is ready to use!', editor);
            }}
            onFocus={(event, editor) => {
                showSuccess(labelContentRef.current);
            }}
            onChange={(event, editor) => {
                console.log(editor.isReadOnly);
                const data = editor.getData();
                if (isUpdate) {
                    setPost({ ...post, content: data });
                } else {
                    setEditorData(data);
                }
            }}
        />
    );
};

export default MyEditor;
