import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Breadcrumb,
    Divider,
    notification,
    Pagination,
    Flex,
    Button,
    Input,
    Skeleton,
} from 'antd';
import { useEffect, useState } from 'react';
import { ModalAddNews } from '../components/ModalAddNews';
import { FetchPostPayload, Post } from '../../../../models/post';
type NotificationType = 'success' | 'error';
import { useRecoilValue } from 'recoil';
import { userValue } from '../../../../stores/userAtom';
import '@/assets/scss/new_management.scss';
import { NewsCards } from '../components/NewsCards';
import { ModalConfirmDeleteNews } from '../components/ModalConfirmDeleteNews';
import { SearchProps } from 'antd/es/input';
import { useFetchPostWithPagination } from '../../../../hooks/posts/useFetchPostWithPagination';
const { Search } = Input;
const NewsManagement = () => {
    const user = useRecoilValue(userValue);
    const [api, contextHolder] = notification.useNotification();
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [isShowModalConfirm, setIsShowModalConfirm] =
        useState<boolean>(false);
    const [post, setPost] = useState<Post>({} as Post);
    const [searchOptions, setSearchOptions] = useState<FetchPostPayload>({
        categoryId: null,
        searchContent: '',
        status: 'Chờ duyệt',
        authorId: user.userId,
        pageIndex: 1,
        pageSize: 8,
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

    const {
        data: postResponse,
        error,
        isError,
        isFetching,
        refetch,
        isRefetching,
    } = useFetchPostWithPagination(searchOptions);

    const onSearch: SearchProps['onSearch'] = (value, _e, _) => {
        setSearchOptions({
            ...searchOptions,
            searchContent: value,
        });
    };

    const closeInputPostModal = () => {
        setIsShowModal(false);
        setPost({} as Post);
    };
    const handleChangePostContent = (content: string) => {
        setPost({ ...post, content: content });
    };
    const handleCloseConfirmModal = () => {
        setIsShowModalConfirm(false);
        setPost({} as Post);
    };

    return (
        <div className="">
            {contextHolder}
            <Flex className=" justify-content-between">
                <div>
                    <Breadcrumb
                        items={[
                            {
                                href: 'http://localhost:5173/admin/dashboard',
                                title: <HomeOutlined />,
                            },
                            {
                                title: 'Bài viết',
                            },
                        ]}
                    />
                </div>
                {user.roleId === 2 && (
                    <Button
                        className="border-0 text-white bg-primary"
                        onClick={() => setIsShowModal(true)}
                    >
                        <PlusOutlined /> Thêm mới
                    </Button>
                )}
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
                <Flex className="justify-content-end ps-2 pe-2 mb-3">
                    <div>
                        <Search
                            onSearch={onSearch}
                            placeholder="Nhập tiêu đề bài viết"
                        />
                    </div>
                </Flex>
                <Skeleton active loading={isFetching || isRefetching}>
                    {isError ? (
                        <p className="fw-bold text-center">
                            {error.message.includes('404')
                                ? 'Không có bài viết nào !'
                                : error.message}
                        </p>
                    ) : (
                        <NewsCards
                            posts={postResponse?.posts}
                            setIsShowModal={setIsShowModal}
                            setPost={setPost}
                            setIsUpdate={setIsUpdate}
                            openNotificationWithIcon={openNotificationWithIcon}
                            setIsShowModalConfirm={setIsShowModalConfirm}
                        />
                    )}
                </Skeleton>

                {postResponse?.pageCount && (
                    <Pagination
                        className="mt-3"
                        showSizeChanger
                        align="center"
                        defaultCurrent={1}
                        current={searchOptions.pageIndex}
                        pageSize={searchOptions.pageSize}
                        total={
                            postResponse?.pageCount
                                ? postResponse?.pageCount *
                                  searchOptions.pageSize
                                : 0
                        }
                        pageSizeOptions={['5', '10', '20', '50']}
                        onChange={(current: number, size: number) => {
                            if (size !== searchOptions.pageSize) {
                                setSearchOptions({
                                    ...searchOptions,
                                    pageIndex: 1,
                                    pageSize: size,
                                });
                            } else {
                                setSearchOptions({
                                    ...searchOptions,
                                    pageIndex: current,
                                });
                            }
                        }}
                    />
                )}
            </div>
            {isShowModal && (
                <ModalAddNews
                    isShowModal={isShowModal}
                    closeInputPostModal={closeInputPostModal}
                    isUpdate={isUpdate}
                    openNotification={openNotificationWithIcon}
                    refetch={refetch}
                    post={post}
                    handleChangePostContent={handleChangePostContent}
                />
            )}
            {isShowModalConfirm && (
                <ModalConfirmDeleteNews
                    isShowModalConfirm={isShowModalConfirm}
                    handleCloseConfirmModal={handleCloseConfirmModal}
                    post={post}
                    openNotification={openNotificationWithIcon}
                    refetch={refetch}
                />
            )}
        </div>
    );
};
export default NewsManagement;
