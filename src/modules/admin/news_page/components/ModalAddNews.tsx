import { Button, Divider, Form, Input, InputRef, Modal, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import MyEditor from './MyEditor';
import { useRecoilValue } from 'recoil';
import { userValue } from '../../../../stores/userAtom';
import { PostService } from '../../../../services/post.service';
import * as cheerio from 'cheerio';
import { PostCategory } from '../../../../models/post_category';
import { PostCategoryService } from '../../../../services/post_category.service';
import { isEmptyEditor } from '../../../../utils/global';
export const ModalAddNews = ({
    isShowModal,
    setIsShowModal,
    isUpdate,
    openNotificationWithIcon,
    loadData,
    post,
    setPost,
    setIsUpdate,
    config,
}: any): JSX.Element => {
    const [editorData, setEditorData] = useState('');
    const user = useRecoilValue(userValue);
    const labelContentRef = useRef<any>(null);
    const [form] = Form.useForm();
    const [postCategories, setPostCategories] = useState<PostCategory[]>([]);
    const getAllPostCategories = async () => {
        try {
            const res = await PostCategoryService.getAllPostCategory();
            setPostCategories(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        if (isUpdate) {
            setEditorData(post.content);
        }
        getAllPostCategories();
    }, []);
    const handleCreatePost = (values: any) => {
        const isEmptyCKEditor = isEmptyEditor(
            labelContentRef.current,
            editorData
        );

        if (!isEmptyCKEditor) {
            const $ = cheerio.load(editorData);
            // Lấy ảnh đầu tiên
            const firstImageSrc = $('img').first().attr('src');
            const data = {
                title: values.title,
                content: editorData,
                authorId: user.userId,
                categoryId: values.categoryId,
                featuredImage: firstImageSrc ?? null,
            };
            console.log('data create', data);

            CreatePost(data);
        }
    };
    const CreatePost = async (data: any) => {
        try {
            const res = await PostService.createPost(data, config);
            openNotificationWithIcon(
                'success',
                'Thông báo!',
                'Thêm bài viết thành công'
            );
            loadData();
            setIsShowModal(false);
            setPost({});
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo!',
                'Thêm bài viết không thành công'
            );
        }
    };
    const handleUpdate = (values: any) => {
        const isEmptyCKEditor = isEmptyEditor(
            labelContentRef.current,
            editorData
        );
        if (!isEmptyCKEditor) {
            const $ = cheerio.load(editorData);
            // Lấy ảnh đầu tiên
            const firstImageSrc = $('img').first().attr('src');
            const data = {
                id: post.id,
                title: values.title,
                content: post.content,
                authorId: user.userId,
                categoryId: values.categoryId,
                featuredImage: firstImageSrc,
            };
            UpdatePost(data);
        }
    };
    const UpdatePost = async (data: any) => {
        try {
            console.log('data update', data);
            const res = await PostService.updatePost(data, config);
            console.log(res);
            openNotificationWithIcon(
                'success',
                'Thông báo!',
                'Sửa bài viết thành công'
            );
            loadData();
            setIsShowModal(false);
            setPost({});
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo!',
                'Sửa bài viết không thành công'
            );
        }
    };
    const onFinish = async (values: any) => {
        if (user.roleId === 2) {
            if (isUpdate) {
                handleUpdate(values);
            } else {
                handleCreatePost(values);
            }
        }
    };

    const handleCancel = () => {
        setIsShowModal(false);
        setPost({});
        setIsUpdate(false);
    };
    const confirmPost = async () => {
        try {
            const res = await PostService.confirmPost(post.id, config);
            console.log(res);
            openNotificationWithIcon(
                'success',
                'Thông báo',
                'Đã đăng bài viết!'
            );
            loadData();
            setIsShowModal(false);
            setPost({});
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo',
                'Duyệt đăng không thành công!'
            );
        }
    };
    useEffect(() => {
        console.log('news', post);
    }, []);
    return (
        <Modal
            style={{ minWidth: '60%' }}
            open={isShowModal}
            onCancel={handleCancel}
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
                        {postCategories.length > 0 ? (
                            postCategories.map((item: PostCategory) => {
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
                        setPost={setPost}
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
                            onClick={confirmPost}
                        >
                            Duyệt đăng
                        </Button>
                    )}
                    <Button key={'back'} onClick={handleCancel}>
                        Đóng
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};
