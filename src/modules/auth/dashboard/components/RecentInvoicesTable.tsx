import { Avatar, Button, Card, Flex, List } from 'antd';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { invoicesService } from '../../../../services/invoicesService';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Invoices } from '../../../../models/invoices';
import { EyeOutlined } from '@ant-design/icons';

export const RecentInvoicesTable = () => {
    const [recentInvoices, setRecentInvoices] = useState<Invoices[]>([]);
    const getRecentInvoices = async () => {
        try {
            const res = await invoicesService.getRecentInvoice();
            console.log(res);
            setRecentInvoices(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        getRecentInvoices();
    }, []);
    const columns: TableProps<Invoices>['columns'] = [
        {
            title: 'Tên bệnh nhân',
            dataIndex: 'patient_name',
            key: 'patient_name',
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
                    <Tag color="success" key={text}>
                        {text.toUpperCase()}
                    </Tag>
                </>
            ),
        },
        {
            title: 'Ngày thanh toán',
            key: 'updated_at',
            dataIndex: 'updated_at',
            render: (text) => {
                const date = new Date(text.split('Z')[0]);
                const dateRender = `${date.getDate()}-${
                    date.getMonth() + 1
                }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                return <>{dateRender}</>;
            },
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Button>
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
                    <Button className="border-top-0 border-start-0 border-end-0 text-primary fw-bold">
                        Xem thêm
                    </Button>
                </Flex>
            }
        >
            <Table dataSource={recentInvoices} columns={columns} bordered />
        </Card>
    );
};
