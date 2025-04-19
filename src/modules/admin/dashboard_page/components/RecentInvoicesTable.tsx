import { Button, Card, Flex, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { invoicesService } from '../../../../services';
import { useEffect, useState } from 'react';
import { Invoices } from '../../../../models/invoices';
import { EyeOutlined } from '@ant-design/icons';
import { ViewInvoiceModal } from '../../../../components';
import { User } from '../../../../models/user';
import { useNavigate } from 'react-router-dom';
export const RecentInvoicesTable = ({ user }: { user: User }) => {
    const navigate = useNavigate();
    const [recentInvoices, setRecentInvoices] = useState<Invoices[]>([]);
    const [openViewInvoiceModal, setOpenViewInvoiceModal] =
        useState<boolean>(false);
    const [invoice, setInvoice] = useState<Invoices>({} as Invoices);
    const getRecentInvoices = async () => {
        try {
            const res = await invoicesService.getRecentInvoice(user.doctorId);
            console.log('getRecentInvoices', res);
            setRecentInvoices(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
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
            key: 'patient_name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'serviceName',
            key: 'service_name',
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
                pagination={false}
                dataSource={recentInvoices}
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
