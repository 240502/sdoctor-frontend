import { useRef, useState } from 'react';
import { Button, Flex, Table, Tooltip, Tag, Modal, Space, Input } from 'antd';
import type { InputRef, TableColumnsType } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { News } from '../../../../models/post';
import { NewsService } from '../../../../services/postService';
import { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';

type DataIndex = keyof News;

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
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [isShowModalConfirm, setIsShowModalConfirm] =
        useState<boolean>(false);
    const [postId, setPostId] = useState<number>(0);
    const handleCancel = () => {
        setIsShowModalConfirm(false);
    };
    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }: FilterDropdownProps) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(
                            selectedKeys as string[],
                            confirm,
                            dataIndex
                        )
                    }
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(
                                selectedKeys as string[],
                                confirm,
                                dataIndex
                            )
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm kiếm
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Đóng
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined
                style={{ color: filtered ? '#1677ff' : undefined }}
            />
        ),
        onFilter: (value: any, record: any) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),

        render: (text: any) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
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
            ...getColumnSearchProps('title'),
            render: (text) => (
                <p
                    style={{
                        maxWidth: '250px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {text}
                </p>
            ),
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'category_name',
            ...getColumnSearchProps('category_name'),
        },
        {
            title: 'Tên tác giả',
            dataIndex: 'author_name',
            ...getColumnSearchProps('author_name'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (text) => (
                <Tag bordered={false} color="processing">
                    {text}
                </Tag>
            ),
            filters: [
                {
                    text: 'Chờ xác nhận',
                    value: 'Chờ xác nhận',
                },
                {
                    text: 'Đã xác nhận',
                    value: 'Đã xác nhận',
                },
            ],
            onFilter: (value, record) =>
                record.status.indexOf(value as string) === 0,
        },

        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: News) => (
                <>
                    <Tooltip placement="topLeft" title={'Xem chi tiết'}>
                        <Button
                            className="me-2 border border-info"
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
                            className="me-2 border border-warning"
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
                            className="mt-2"
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
                <Table<News>
                    bordered
                    dataSource={news}
                    columns={columns}
                    pagination={false}
                />
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
