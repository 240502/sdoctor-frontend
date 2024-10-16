// src/CustomUploadAdapter.ts
export default class CustomUploadAdapter {
    loader: any;
    uploadUrl: string;

    constructor(loader: any, uploadUrl: string) {
        this.loader = loader;
        this.uploadUrl = uploadUrl;
    }

    // Phương thức bắt buộc: upload
    upload(): Promise<{ default: string }> {
        return this.loader.file.then(
            (file: File) =>
                new Promise((resolve, reject) => {
                    const formData = new FormData();
                    formData.append('file', file); // Đảm bảo tên trường là 'file'

                    fetch(this.uploadUrl, {
                        method: 'POST',
                        body: formData,
                    })
                        .then((response) => response.json())
                        .then((result: { url: string }) => {
                            if (result && result.url) {
                                resolve({
                                    default: result.url, // URL của hình ảnh đã tải lên
                                });
                            } else {
                                reject('Upload failed');
                            }
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })
        );
    }

    // Phương thức bắt buộc: abort
    abort() {
        // Bạn có thể triển khai hủy bỏ tải lên nếu cần
    }
}
