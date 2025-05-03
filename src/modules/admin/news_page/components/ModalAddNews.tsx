import { Button, Divider, Form, Input, InputRef, Modal, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import MyEditor from './MyEditor';
import { useRecoilValue } from 'recoil';
import { userValue } from '../../../../stores/userAtom';
import { postCategoryService, postService } from '../../../../services';
import * as cheerio from 'cheerio';
import { PostCategory } from '../../../../models/post_category';
import { isEmptyEditor } from '../../../../utils/global';
import {
    useCreatePost,
    useFetchAllPostCategories,
    useUpdatePost,
} from '../../../../hooks';
import { Post, PostCreateDto, PostUpdateDto } from '../../../../models';
type NotificationType = 'success' | 'error';

interface ModalAddNewsProps {
    isShowModal: boolean;
    closeInputPostModal: () => void;
    isUpdate: boolean;
    openNotification: (
        type: NotificationType,
        title: string,
        des: string
    ) => void;
    refetch: () => void;
    post: Post;
    handleChangePostContent: (content: string) => void;
}
export const ModalAddNews = ({
    isShowModal,
    closeInputPostModal,
    isUpdate,
    openNotification,
    refetch,
    post,
    handleChangePostContent,
}: ModalAddNewsProps): JSX.Element => {
    const [editorData, setEditorData] = useState('');
    const user = useRecoilValue(userValue);
    const labelContentRef = useRef<any>(null);
    const [form] = Form.useForm();
    const { mutate: createPost } = useCreatePost();
    const { mutate: updatePost } = useUpdatePost();
    const { data: postCategoryResponse } = useFetchAllPostCategories();
    useEffect(() => {
        if (isUpdate) {
            setEditorData(post.content);
        }
    }, []);
    const handleCreatePost = (values: any) => {
        const isEmptyCKEditor = isEmptyEditor(
            labelContentRef.current,
            editorData
        );

        if (!isEmptyCKEditor) {
            const $ = cheerio.load(editorData);
            const firstImageSrc = $('img').first().attr('src');
            const data: PostCreateDto = {
                title: values.title,
                content: editorData,
                authorId: user.userId,
                categoryId: values.categoryId,
                featuredImage: firstImageSrc ?? null,
            };
            console.log('data create', data);
            createPost(data, {
                onSuccess() {
                    openNotification(
                        'success',
                        'Thông báo!',
                        'Thêm bài viết thành công'
                    );
                    closeInputPostModal();
                    refetch();
                },
                onError(error) {
                    console.log(error.message);
                    openNotification(
                        'error',
                        'Thông báo!',
                        'Thêm bài viết không thành công'
                    );
                },
            });
        }
    };

    const handleUpdate = (values: any) => {
        const isEmptyCKEditor = isEmptyEditor(
            labelContentRef.current,
            editorData
        );
        if (!isEmptyCKEditor) {
            const $ = cheerio.load(editorData);
            const firstImageSrc = $('img').first().attr('src');
            const data: PostUpdateDto = {
                id: post.id,
                title: values.title,
                content: post.content,
                authorId: user.userId,
                categoryId: values.categoryId,
                featuredImage: firstImageSrc ?? null,
            };
            updatePost(data, {
                onSuccess() {
                    openNotification(
                        'success',
                        'Thông báo!',
                        'Sửa bài viết thành công'
                    );
                    closeInputPostModal();
                    refetch();
                },
                onError(error) {
                    console.log(error.message);
                    openNotification(
                        'error',
                        'Thông báo!',
                        'Sửa bài viết không thành công'
                    );
                },
            });
        }
    };
    // const UpdatePost = async (data: any) => {
    //     try {
    //         console.log('data update', data);
    //         const res = await postService.updatePost(data);
    //         console.log(res);
    //         openNotificationWithIcon(
    //             'success',
    //             'Thông báo!',
    //             'Sửa bài viết thành công'
    //         );
    //         loadData();
    //         setIsShowModal(false);
    //         setPost({});
    //     } catch (err: any) {
    //         console.log(err.message);
    //         openNotificationWithIcon(
    //             'error',
    //             'Thông báo!',
    //             'Sửa bài viết không thành công'
    //         );
    //     }
    // };
    const onFinish = async (values: any) => {
        if (user.roleId === 2) {
            if (isUpdate) {
                handleUpdate(values);
            } else {
                handleCreatePost(values);
            }
        }
    };

    // const confirmPost = async () => {
    //     try {
    //         const res = await postService.confirmPost(post.id);
    //         console.log(res);
    //         openNotification(
    //             'success',
    //             'Thông báo',
    //             'Đã đăng bài viết!'
    //         );
    //         loadData();
    //         setIsShowModal(false);
    //         setPost({});
    //     } catch (err: any) {
    //         console.log(err.message);
    //         openNotification(
    //             'error',
    //             'Thông báo',
    //             'Duyệt đăng không thành công!'
    //         );
    //     }
    // };
    return (
        <Modal
            style={{ minWidth: '60%' }}
            open={isShowModal}
            onCancel={closeInputPostModal}
            maskClosable={false}
            footer={[]}
        >
            <h5 className="title">Chi tiết bài viết</h5>
            <Divider />
            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                initialValues={{
                    categoryId: post.categoryId,
                    title: post.title,
                }}
            >
                <Form.Item
                    className="form__group mb-2"
                    label="Danh mục bài viết"
                    name={'categoryId'}
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn danh mục bài viết!',
                        },
                    ]}
                >
                    <Select
                        className="d-flex"
                        showSearch
                        optionFilterProp="children"
                        placeholder="Chọn danh mục bài viết"
                    >
                        {postCategoryResponse.length > 0 ? (
                            postCategoryResponse.map((item: PostCategory) => {
                                return (
                                    <Select.Option value={item.postCategoryId}>
                                        {item.name}
                                    </Select.Option>
                                );
                            })
                        ) : (
                            <></>
                        )}
                    </Select>
                </Form.Item>
                <Form.Item
                    className=" mb-2"
                    label="Tiêu đề"
                    name={'title'}
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tiêu đề bài viết!',
                        },
                    ]}
                >
                    <Input type="text" className="title" />
                </Form.Item>
                <Form.Item label="Nội dung" className=" mb-2">
                    <MyEditor
                        setEditorData={setEditorData}
                        labelContentRef={labelContentRef}
                        post={post}
                        handleChangePostContent={handleChangePostContent}
                        isUpdate={isUpdate}
                    />
                </Form.Item>
                <Form.Item className="text-end">
                    {user.roleId === 2 && (
                        <Button
                            key={'submit'}
                            type="primary"
                            htmlType="submit"
                            className="bg-success me-3"
                        >
                            Lưu
                        </Button>
                    )}
                    {user.roleId === 1 && post.status !== 'Đã đăng' && (
                        <Button
                            key={'submit'}
                            type="primary"
                            htmlType="submit"
                            className="bg-success me-3 "
                            // onClick={confirmPost}
                        >
                            Duyệt đăng
                        </Button>
                    )}
                    <Button key={'back'} onClick={closeInputPostModal}>
                        Đóng
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};
