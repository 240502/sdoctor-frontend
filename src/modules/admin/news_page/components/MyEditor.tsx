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
    handleChangePostContent,
    isUpdate,
}: any) => {
    const editorRef = useRef<any>(null);
    // useEffect(() => {
    //     if (editorRef.current) {
    //         const editorInstance = editorRef.current;
    //     }
    // }, []);
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
            }}
            onFocus={(event, editor) => {
                showSuccess(labelContentRef.current);
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                if (isUpdate) {
                    handleChangePostContent({ ...post, content: data });
                } else {
                    setEditorData(data);
                }
            }}
        />
    );
};

export default MyEditor;
