import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Divider, notification, Pagination } from 'antd';
import React, { useEffect, useState } from 'react';
import TableNews from '../components/TableNews';
import { ModalAddNews } from '../components/ModalAddNews';
import { News } from '../../../../models/news';
import { NewsService } from '../../../../services/newsService';
type NotificationType = 'success' | 'error';
import type { PaginationProps } from 'antd';

const NewsManagement = () => {
    const [api, contextHolder] = notification.useNotification();
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageCount, setPageCount] = useState<number>(0);
    const [status, setStatus] = useState<string>('');
    const [categoryId, setCategoryId] = useState<any>(null);
    const [posts, setPosts] = useState<News[]>([]);
    const [post, setPost] = useState<News>({
        id: 0,
        title: '',
        content: '',
        author_id: 0,
        public_date: null,
        updated_at: null,
        status: '',
        category_id: 0,
        featured_image: '',
        created_at: null,
        category_name: '',
        author_name: '',
    });
    const [isView, setIsView] = useState<boolean>(false);
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
    const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
        current,
        pageSize
    ) => {
        console.log(current, pageSize);
    };
    const loadData = async () => {
        try {
            console.log('api');
            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                status: status,
                categoryId: categoryId,
            };
            const res = await NewsService.viewNewsAdmin(data);
            setPageCount(res.pageCount);
            setPosts(res.data);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        loadData();
    }, []);
    useEffect(() => {
        console.log(post);
    }, [post]);
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
            <div className="block__list__appointment">
                <h5 className="mb-3">Danh sách bài viết</h5>

                <div className="mb-3"></div>
                <TableNews
                    setIsUpdate={setIsUpdate}
                    setIsShowModal={setIsShowModal}
                    news={posts}
                    setPost={setPost}
                    setIsView={setIsView}
                    openNotificationWithIcon={openNotificationWithIcon}
                    loadData={loadData}
                />
                <Pagination
                    showSizeChanger
                    align="center"
                    defaultCurrent={1}
                    total={pageCount}
                    onShowSizeChange={onShowSizeChange}
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
                    isView={isView}
                    setIsView={setIsView}
                    setIsUpdate={setIsUpdate}
                />
            )}
        </div>
    );
};
export default NewsManagement;
