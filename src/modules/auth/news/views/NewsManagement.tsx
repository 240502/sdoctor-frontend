import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Breadcrumb,
    Divider,
    notification,
    Pagination,
    Flex,
    Button,
    Select,
    Input,
} from 'antd';
import { useEffect, useState } from 'react';
import { ModalAddNews } from '../components/ModalAddNews';
import { Post } from '../../../../models/post';
import { PostService } from '../../../../services/postService';
type NotificationType = 'success' | 'error';
import { useRecoilValue } from 'recoil';
import { configValue, userValue } from '../../../../stores/userAtom';
import '@/assets/scss/new_management.scss';
import { NewsCards } from '../components/NewsCards';
import { ModalConfirmDeleteNews } from '../components/ModalConfirmDeleteNews';
import { PostCategory } from '../../../../models/post_category';
import { PostCategoryService } from '../../../../services/post_categorySerivce';
import { SearchProps } from 'antd/es/input';
const { Option } = Select;
const { Search } = Input;
const NewsManagement = () => {
    const user = useRecoilValue(userValue);
    const config = useRecoilValue(configValue);
    const [api, contextHolder] = notification.useNotification();
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [isShowModalConfirm, setIsShowModalConfirm] =
        useState<boolean>(false);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageCount, setPageCount] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<any>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [post, setPost] = useState<Post>({} as Post);
    const [postCategories, setPostCategories] = useState<PostCategory[]>([]);
    const [searchOptions, setSearchOptions] = useState<any>({
        categoryId: null,
        title: null,
        status: 'Chờ duyệt',
    });
    const openNotificationWithIcon = (
        type: NotificationType,
        title: string,
        des: string
    ) => {
        api[type]({
            message: title,
            description: des,
        });
    };
    const getAllPostCategory = async () => {
        try {
            const res = await PostCategoryService.getAllPostCategory();
            setPostCategories(res);
        } catch (err: any) {
            console.log(err.message);
            setPostCategories([]);
        }
    };
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        setSearchOptions({
            ...searchOptions,
            title: value !== '' ? value : null,
        });
    };
    const loadData = async () => {
        try {
            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                authorId: user?.role_id === 2 ? user.user_id : null,
                ...searchOptions,
            };
            const res = await PostService.viewPostAdmin(data, config);
            setPageCount(res.pageCount);
            setPosts(res.data);
        } catch (err: any) {
            setPageCount(0);
            setPosts([]);
            console.log(err.message);
        }
    };
    const handleCloseModalConfirm = () => {
        setIsShowModalConfirm(false);
    };
    useEffect(() => {
        getAllPostCategory();
    }, []);
    useEffect(() => {
        loadData();
    }, [pageIndex, pageSize, searchOptions]);

    return (
        <div className="container">
            {contextHolder}
            <Flex className=" justify-content-between">
                <div>
                    <Breadcrumb
                        items={[
                            {
                                href: '',
                                title: <HomeOutlined />,
                            },
                            {
                                title: 'Bài viết',
                            },
                        ]}
                    />
                </div>
                <Button
                    className="border-0 text-white bg-primary"
                    onClick={() => setIsShowModal(true)}
                >
                    <PlusOutlined /> Thêm mới
                </Button>
            </Flex>
            <Divider />
            <div className="block__list__news">
                <Flex className="justify-content-between ps-2 pe-2 mb-3">
                    <Flex className="col-3">
                        <Button
                            key={'pending'}
                            onClick={() => {
                                setSearchOptions({
                                    ...searchOptions,
                                    status: 'Chờ duyệt',
                                });
                            }}
                            className={
                                searchOptions.status === 'Chờ duyệt'
                                    ? 'bg-info text-white border-0'
                                    : 'border-0 text-dark'
                            }
                        >
                            Chờ duyệt
                        </Button>
                        <Button
                            key={'active'}
                            onClick={() => {
                                setSearchOptions({
                                    ...searchOptions,
                                    status: 'Đã đăng',
                                });
                            }}
                            className={
                                searchOptions.status === 'Đã đăng'
                                    ? 'bg-info text-white border-0'
                                    : 'border-0 text-dark'
                            }
                        >
                            Đã đăng
                        </Button>
                    </Flex>
                </Flex>
                <Flex className="justify-content-between ps-2 pe-2 mb-3">
                    <div className="col-4">
                        <Select
                            allowClear
                            showSearch
                            value={searchOptions.categoryId}
                            className="w-50"
                            onChange={(value: number) => {
                                setSearchOptions({
                                    ...searchOptions,
                                    categoryId: value,
                                });
                                setPageIndex(1);
                            }}
                            optionFilterProp="children"
                            placeholder="Chọn loại bài viết"
                        >
                            {postCategories.map((category: PostCategory) => {
                                return (
                                    <Option
                                        key={category.post_category_id}
                                        value={category.post_category_id}
                                        label={category.name}
                                    >
                                        {category.name}
                                    </Option>
                                );
                            })}
                        </Select>
                    </div>
                    <div>
                        <Search
                            onSearch={onSearch}
                            placeholder="Nhập tiêu đề bài viết"
                        />
                    </div>
                </Flex>
                <NewsCards
                    posts={posts}
                    setIsShowModal={setIsShowModal}
                    setPost={setPost}
                    setIsUpdate={setIsUpdate}
                    openNotificationWithIcon={openNotificationWithIcon}
                    loadData={loadData}
                    setIsShowModalConfirm={setIsShowModalConfirm}
                />
                {pageCount > 1 && (
                    <Pagination
                        className="mt-3"
                        showSizeChanger
                        align="center"
                        defaultCurrent={1}
                        current={pageIndex}
                        pageSize={pageSize}
                        total={pageCount * pageSize}
                        pageSizeOptions={['5', '10', '20', '50']}
                        onChange={(current: number, size: number) => {
                            if (size !== pageSize) {
                                setPageIndex(1);
                                setPageSize(size);
                            } else {
                                setPageIndex(current);
                            }
                        }}
                    />
                )}
            </div>
            {isShowModal && (
                <ModalAddNews
                    isShowModal={isShowModal}
                    setIsShowModal={setIsShowModal}
                    isUpdate={isUpdate}
                    openNotificationWithIcon={openNotificationWithIcon}
                    loadData={loadData}
                    post={post}
                    setPost={setPost}
                    setIsUpdate={setIsUpdate}
                    config={config}
                />
            )}
            {isShowModalConfirm && (
                <ModalConfirmDeleteNews
                    isShowModalConfirm={isShowModalConfirm}
                    handleCloseModalConfirm={handleCloseModalConfirm}
                    post={post}
                    header={config}
                    openNotificationWithIcon={openNotificationWithIcon}
                    loadData={loadData}
                />
            )}
        </div>
    );
};
export default NewsManagement;
