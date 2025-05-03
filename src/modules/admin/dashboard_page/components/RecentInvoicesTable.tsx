import { Button, Card, Flex, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { invoicesService } from '../../../../services';
import { useEffect, useState } from 'react';
import { Invoices } from '../../../../models/invoices';
import { EyeOutlined } from '@ant-design/icons';
import { ViewInvoiceModal } from '../../../../components';
import { User } from '../../../../models/user';
import { useNavigate } from 'react-router-dom';
import { useFetchRecentInvoice } from '../../../../hooks';
export const RecentInvoicesTable = ({ user }: { user: User }) => {
    const navigate = useNavigate();
    const [recentInvoices, setRecentInvoices] = useState<Invoices[]>([]);
    const [openViewInvoiceModal, setOpenViewInvoiceModal] =
        useState<boolean>(false);
    const [invoice, setInvoice] = useState<Invoices>({} as Invoices);
    const getRecentInvoices = async () => {
        try {
            const res = await invoicesService.getRecentInvoice(user?.doctorId);
            console.log('getRecentInvoices', res);
            setRecentInvoices(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const { data, error, isFetching } = useFetchRecentInvoice(user.userId);
    useEffect(() => {
        console.log('invoice data', data);
    }, [data]);
    const cancelViewInvoiceModal = () => {
        setInvoice({} as Invoices);
        setOpenViewInvoiceModal(false);
    };
    useEffect(() => {
        getRecentInvoices();
        console.log(openViewInvoiceModal);
    }, []);
    const columns: TableProps<Invoices>['columns'] = [
        {
            title: 'Tên bệnh nhân',
            dataIndex: 'patientName',
            key: 'patientName',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'serviceName',
            key: 'serviceName',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Tổng thanh toán',
            dataIndex: 'amount',
            key: 'amount',
            render: (text) => <>{text.toLocaleString(undefined)} VNĐ</>,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: (text) => (
                <>
                    <Tag
                        color={text === 'Đã thanh toán' ? 'success' : 'blue'}
                        key={text}
                    >
                        {text.toUpperCase()}
                    </Tag>
                </>
            ),
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Button
                    onClick={() => {
                        setInvoice(record);
                        setOpenViewInvoiceModal(true);
                    }}
                >
                    <EyeOutlined />
                </Button>
            ),
        },
    ];

    return (
        <Card
            className="shadow"
            title={
                <Flex className="justify-content-between align-items-center">
                    <h6>Hóa đơn gần đây</h6>{' '}
                    <Button
                        className="border-top-0 border-start-0 border-end-0 text-primary fw-bold"
                        onClick={() => {
                            navigate('/admin/invoice');
                        }}
                    >
                        Xem thêm
                    </Button>
                </Flex>
            }
        >
            <Table
                size="small"
                pagination={false}
                dataSource={data}
                columns={columns}
                bordered
            />
            {openViewInvoiceModal && (
                <ViewInvoiceModal
                    openViewInvoiceModal={openViewInvoiceModal}
                    invoice={invoice}
                    cancelViewInvoiceModal={cancelViewInvoiceModal}
                />
            )}
        </Card>
    );
};
