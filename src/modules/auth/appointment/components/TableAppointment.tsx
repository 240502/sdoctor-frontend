import React, { useState } from 'react';
import { Button, Flex, Select, Table, Tooltip } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

type TableRowSelection<T extends object = object> =
    TableProps<T>['rowSelection'];

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}

const columns: TableColumnsType<DataType> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Address', dataIndex: 'address' },
    {
        title: 'Action',
        key: 'action',
        render: (text: string, record: DataType) => (
            <>
                <Tooltip placement="topLeft" title={'Xác nhận'}>
                    <Button className="me-3 border border-success">
                        <CheckOutlined className="text-success" />
                    </Button>
                </Tooltip>
                <Tooltip placement="topLeft" title={'Từ chối'}>
                    <Button danger>
                        <CloseOutlined />
                    </Button>
                </Tooltip>
            </>
        ),
    },
];

const dataSource = Array.from<DataType>({ length: 46 }).map<DataType>(
    (_, i) => ({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
    })
);

const TableAppointment: React.FC = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);

    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    return (
        <Flex gap="middle" vertical>
            <Flex
                align="center"
                gap="middle"
                justify="space-between"
                className="mb-2"
            >
                <div className="btn__confirm__all">
                    {' '}
                    <Button
                        type="primary"
                        onClick={start}
                        disabled={!hasSelected}
                        loading={loading}
                        className="me-2"
                    >
                        Xác nhận tất cả
                    </Button>
                    {hasSelected
                        ? `Số lịch hẹn được chọn ${selectedRowKeys.length} `
                        : null}
                </div>
                <div className="col-4 d-flex justify-content-end">
                    <Select defaultValue={'0'} style={{ width: '40%' }}>
                        <Select.Option value="0">Chờ xác nhận</Select.Option>
                        <Select.Option value="1">Đã xác nhận</Select.Option>
                    </Select>
                </div>
            </Flex>
            <Table<DataType>
                bordered
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
            />
        </Flex>
    );
};

export default TableAppointment;
