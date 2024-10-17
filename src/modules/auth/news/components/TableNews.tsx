import React, { useEffect, useState } from 'react';
import {
    Button,
    Flex,
    Select,
    Table,
    Tooltip,
    Pagination,
    Tag,
    Modal,
} from 'antd';
import type { TableColumnsType } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { News } from '../../../../models/news';
import { NewsService } from '../../../../services/newsService';
const TableNews = ({
    setIsUpdate,
    setIsShowModal,
    news,
    setPost,
    setIsView,
    openNotificationWithIcon,
    loadData,
    config,
}: any) => {
    const [isShowModalConfirm, setIsShowModalConfirm] =
        useState<boolean>(false);
    const [postId, setPostId] = useState<number>(0);
    const handleCancel = () => {
        setIsShowModalConfirm(false);
    };
    const handleOk = async () => {
        console.log(postId);
        try {
            await NewsService.deleteNews(postId, config);
            openNotificationWithIcon(
                'success',
                'Thông báo!',
                'Xóa bài viết thành công'
            );
            loadData();
            setPostId(0);
            setIsShowModalConfirm(false);
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'danger',
                'Thông báo!',
                'Xóa bài viết không thành công'
            );
        }
    };
    const columns: TableColumnsType<News> = [
        {
            title: 'Tiêu đề bài viết',
            dataIndex: 'title',
        },
        { title: 'Tên danh mục', dataIndex: 'category_name' },
        { title: 'Tên tác giả', dataIndex: 'author_name' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (text) => (
                <Tag bordered={false} color="processing">
                    {text}
                </Tag>
            ),
        },

        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: News) => (
                <>
                    <Tooltip placement="topLeft" title={'Xem chi tiết'}>
                        <Button
                            className="me-3 border border-info"
                            onClick={() => {
                                setIsView(true);
                                setPost(record);
                                setIsShowModal(true);
                            }}
                        >
                            <EyeOutlined className="text-info" />
                        </Button>
                    </Tooltip>
                    <Tooltip placement="topLeft" title={'Sửa bài viết'}>
                        <Button
                            className="me-3 border border-warning"
                            danger
                            onClick={() => {
                                setIsUpdate(true);
                                setPost(record);
                                setIsShowModal(true);
                            }}
                        >
                            <EditOutlined className="text-warning" />
                        </Button>
                    </Tooltip>
                    <Tooltip placement="topLeft" title={'Xóa bài viết'}>
                        <Button
                            danger
                            onClick={() => {
                                setIsShowModalConfirm(true);
                                setPostId(record.id);
                            }}
                        >
                            <DeleteOutlined />
                        </Button>
                    </Tooltip>
                </>
            ),
        },
    ];
    return (
        <>
            <Flex gap="middle" vertical>
                <Flex
                    align="center"
                    gap="middle"
                    justify="space-between"
                    className="mb-2"
                >
                    <div className="btn__add_news">
                        <Button
                            type="primary"
                            className="me-2 bg-success"
                            onClick={() => setIsShowModal(true)}
                        >
                            <PlusOutlined />
                            Thêm bài viết
                        </Button>
                    </div>
                </Flex>
                <Table<News> bordered dataSource={news} columns={columns} />
            </Flex>
            {isShowModalConfirm && (
                <Modal
                    open={isShowModalConfirm}
                    maskClosable={false}
                    onCancel={handleCancel}
                    footer={[
                        <Button
                            key={'submit'}
                            onClick={handleOk}
                            danger
                            type="primary"
                        >
                            Đồng ý
                        </Button>,
                        <Button key={'back'} onClick={handleCancel}>
                            Đóng
                        </Button>,
                    ]}
                >
                    <h5>Thông báo</h5>
                    <p>Bạn chắc chắn muốn xóa bài viết này?</p>
                </Modal>
            )}
        </>
    );
};

export default TableNews;
