import { Button, Divider, Form, Input, InputRef, Modal, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import MyEditor from './MyEditor';
import { useRecoilValue } from 'recoil';
import { userValue } from '../../../../stores/userAtom';
import NewsManagement from '../views/NewsManagement';
import { PostService } from '../../../../services/postService';
import * as cheerio from 'cheerio';
import { PostCategory } from '../../../../models/post_category';
import { PostCategoryService } from '../../../../services/post_categorySerivce';
import {
    handleFocusInput,
    handleFocusSelect,
    isEmpty,
    isEmptyEditor,
    isEmptySelect,
} from '../../../../utils/global';
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
    const inputTitleRef = useRef<InputRef>(null);
    const selectCategoryRef = useRef<any>(null);
    const user = useRecoilValue(userValue);
    const labelContentRef = useRef<any>(null);
    const [postCategory, setPostCategory] = useState<PostCategory>(
        {} as PostCategory
    );
    const [postCategories, setPostCategories] = useState<PostCategory[]>([]);
    const getAllPostCategories = async () => {
        try {
            const res = await PostCategoryService.getAllPostCategory();
            setPostCategories(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const handleGetPostCategory = (categoryId: number) => {
        const cate = postCategories.find((item: PostCategory) => {
            return item.post_category_id === categoryId;
        });
        return cate;
    };
    useEffect(() => {
        if (isUpdate) {
            const postCate: any = handleGetPostCategory(post.category_id);
            setPostCategory(postCate);
            setEditorData(post.content);
        }
        getAllPostCategories();
    }, []);
    const handleCreatePost = () => {
        const isEmptySelectCategory = isEmptySelect(
            selectCategoryRef.current,
            post?.category_id
        );
        const isEmptyInputTitle = isEmpty(inputTitleRef.current?.input);
        const isEmptyCKEditor = isEmptyEditor(
            labelContentRef.current,
            editorData
        );

        if (!isEmptySelectCategory && !isEmptyInputTitle && !isEmptyCKEditor) {
            const $ = cheerio.load(editorData);
            // Lấy ảnh đầu tiên
            const firstImageSrc = $('img').first().attr('src');
            const data = {
                title: inputTitleRef?.current?.input?.value,
                content: editorData,
                author_id: user.id,
                category_id: post.category_id,
                featured_image: firstImageSrc,
            };
            CreatePost(data);
        }
    };
    const CreatePost = async (data: any) => {
        try {
            const res = await PostService.createPost(data, config);
            console.log(res);
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
                'danger',
                'Thông báo!',
                'Thêm bài viết không thành công'
            );
        }
    };
    const handleUpdate = () => {
        const isEmptySelectCategory = isEmptySelect(
            selectCategoryRef.current,
            postCategory?.post_category_id ?? postCategory.post_category_id
        );
        const isEmptyInputTitle = isEmpty(inputTitleRef.current?.input);
        const isEmptyCKEditor = isEmptyEditor(
            labelContentRef.current,
            editorData
        );
        if (!isEmptySelectCategory && !isEmptyInputTitle && !isEmptyCKEditor) {
            const $ = cheerio.load(editorData);
            // Lấy ảnh đầu tiên
            const firstImageSrc = $('img').first().attr('src');
            const data = {
                id: post.id,
                title: inputTitleRef?.current?.input?.value,
                content: post.content,
                author_id: user.id,
                category_id: post.category_id,
                featured_image: firstImageSrc,
            };
            UpdatePost(data);
        }
    };
    const UpdatePost = async (data: any) => {
        try {
            console.log(data);
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
                'danger',
                'Thông báo!',
                'Sửa bài viết không thành công'
            );
        }
    };
    const handleOk = async () => {
        console.log('ok', isUpdate);
        if (isUpdate) {
            handleUpdate();
        } else {
            handleCreatePost();
        }
    };

    const handleCancel = () => {
        setIsShowModal(false);
        setPost({});
        setIsUpdate(false);
    };
    const changeCategoryPost = (value: number) => {
        if (value !== 0) {
            const category: any = postCategories.find(
                (item: PostCategory) => item.post_category_id === value
            );
            setPostCategory(category);
        } else
            setPostCategory({
                post_category_id: 0,
                name: '',
                description: '',
                image: '',
            });
    };
    useEffect(() => {
        console.log(post);
    }, [post]);

    return (
        <Modal
            style={{ minWidth: '60%' }}
            open={isShowModal}
            onCancel={handleCancel}
            onOk={handleOk}
            maskClosable={false}
            footer={[
                <Button
                    key={'submit'}
                    type="primary"
                    className="bg-success"
                    onClick={handleOk}
                >
                    Lưu
                </Button>,
                <Button key={'back'} onClick={handleCancel}>
                    Đóng
                </Button>,
            ]}
        >
            <h5 className="title">
                {isUpdate ? 'Sửa bài viết' : 'Thêm bài viết'}
            </h5>
            <Divider />
            <Form>
                <div className="form__group mb-2">
                    <label className="mb-2">Danh mục bài viết</label>
                    <Select
                        ref={selectCategoryRef}
                        className="d-flex"
                        showSearch
                        optionFilterProp="children"
                        value={post.category_id}
                        onFocus={() =>
                            handleFocusSelect(selectCategoryRef.current)
                        }
                        onChange={(value: number) =>
                            setPost({
                                ...post,
                                category_id: value !== 0 ? value : null,
                            })
                        }
                        placeholder="Chọn danh mục bài viết"
                    >
                        {postCategories.length > 0 ? (
                            postCategories.map((item: PostCategory) => {
                                return (
                                    <Select.Option
                                        value={item.post_category_id}
                                    >
                                        {item.name}
                                    </Select.Option>
                                );
                            })
                        ) : (
                            <></>
                        )}
                    </Select>
                    <div
                        className="error_message mt-3"
                        style={{ color: 'red' }}
                    ></div>
                </div>
                <div className="form__group mb-2">
                    <label className="mb-2">Tiêu đề bài viết</label>
                    <Input
                        value={post.title}
                        ref={inputTitleRef}
                        type="text"
                        className="title"
                        onChange={(e) => {
                            console.log(e.target.value);
                            setPost({ ...post, title: e.target.value });
                        }}
                        onFocus={() =>
                            handleFocusInput(inputTitleRef.current?.input)
                        }
                    />
                    <div
                        className="error_message mt-3"
                        style={{ color: 'red' }}
                    ></div>
                </div>
                <div className="form__group mb-2">
                    <label ref={labelContentRef} className="mb-2">
                        Nội dung
                    </label>
                    <MyEditor
                        setEditorData={setEditorData}
                        labelContentRef={labelContentRef}
                        post={post}
                        setPost={setPost}
                        isUpdate={isUpdate}
                    />
                    <div
                        className="error_message mt-3"
                        style={{ color: 'red' }}
                    ></div>
                </div>
            </Form>
        </Modal>
    );
};
