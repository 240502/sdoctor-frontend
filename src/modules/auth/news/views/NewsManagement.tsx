import {
    ClockCircleFilled,
    ClockCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import {
    Breadcrumb,
    Divider,
    notification,
    Pagination,
    Card,
    Flex,
    Button,
    Image,
} from 'antd';
import React, { useEffect, useState } from 'react';
import TableNews from '../components/TableNews';
import { ModalAddNews } from '../components/ModalAddNews';
import { News } from '../../../../models/news';
import { NewsService } from '../../../../services/newsService';
type NotificationType = 'success' | 'error';
import type { PaginationProps } from 'antd';
import { useRecoilValue } from 'recoil';
import { userValue } from '../../../../stores/userAtom';
import { baseURL } from '../../../../constants/api';
import '@/assets/scss/new_management.scss';
import { NewsCards } from '../components/NewsCards';
import { ModalConfirmDeleteNews } from '../components/ModalConfirmDeleteNews';

const NewsManagement = () => {
    const user = useRecoilValue(userValue);
    const [config, setConfig] = useState<any>();
    const [api, contextHolder] = notification.useNotification();
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [isShowModalConfirm, setIsShowModalConfirm] =
        useState<boolean>(false);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageCount, setPageCount] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<any>(null);
    const [posts, setPosts] = useState<News[]>([]);
    const [post, setPost] = useState<News>({} as News);
    const [activeBtn, setActiveBtn] = useState<number>(0);
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

    const loadData = async () => {
        try {
            const header = {
                headers: { authorization: 'Bearer ' + user.token },
            };
            setConfig(header);

            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                status: activeBtn === 0 ? 'Chờ duyệt' : 'Đã đăng',
                categoryId: categoryId,
                authorId: user.id,
            };
            const res = await NewsService.viewNewsAdmin(data, header);
            setPageCount(res.pageCount);
            setPosts(res.data);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const handleCloseModalConfirm = () => {
        setIsShowModalConfirm(false);
    };
    useEffect(() => {
        loadData();
    }, [pageIndex, pageSize, activeBtn]);

    return (
        <div className="container">
            {contextHolder}
            <div className="block__filter">
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
                <Divider />
            </div>
            <div className="block__list__news">
                <Flex className="justify-content-between ps-2 pe-2 mb-3">
                    <Flex>
                        <Button
                            key={'pending'}
                            onClick={() => {
                                setActiveBtn(0);
                            }}
                            className={
                                activeBtn === 0
                                    ? 'bg-info text-white border-0'
                                    : 'border-0 text-dark'
                            }
                        >
                            Chờ duyệt
                        </Button>
                        <Button
                            key={'active'}
                            onClick={() => setActiveBtn(1)}
                            className={
                                activeBtn === 1
                                    ? 'bg-info text-white border-0'
                                    : 'border-0 text-dark'
                            }
                        >
                            Đã đăng
                        </Button>
                    </Flex>
                    <Button
                        className="border-0 text-white bg-primary"
                        onClick={() => setIsShowModal(true)}
                    >
                        <PlusOutlined /> Thêm mới
                    </Button>
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
