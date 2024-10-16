// src/CustomUploadAdapterPlugin.ts
import CustomUploadAdapter from './MyUploadAdapter';

function CustomUploadAdapterPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (
        loader: any
    ) => {
        return new CustomUploadAdapter(
            loader,
            'http://localhost:400/api/upload'
        ); // Đảm bảo URL đúng với backend
    };
}

export default CustomUploadAdapterPlugin;
