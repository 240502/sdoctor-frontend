import {
    Breadcrumb,
    Divider,
    Flex,
    Select,
    DatePicker,
    Row,
    Col,
    message,
    Pagination,
    Skeleton,
} from 'antd';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../../stores/userAtom';
import { HomeOutlined } from '@ant-design/icons';
import { InvoiceTable } from '../components/InvoiceTable';
import { useEffect, useState } from 'react';
import { InvoiceModal } from '../components/InvoviceModal';
import { useFetchInvoices } from '../../../../hooks/invoice/useInvoice';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import isoWeek from 'dayjs/plugin/isoWeek';
import { NoticeType } from 'antd/es/message/interface';
import { useNavigate } from 'react-router-dom';
dayjs.extend(isoWeek);
dayjs.locale('vi');
const InvoiceManagement = () => {
    const navigate = useNavigate();
    const [api, contextHolder] = message.useMessage();
    const [openInvoiceModal, setOpenInvoiceModal] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const user = useRecoilValue(userState);
    const [options, setOptions] = useState<{
        pageIndex: number;
        pageSize: number;
        status: string;
        doctorId: number;
        createdAt: Dayjs;
    }>({
        pageIndex: 1,
        pageSize: 10,
        status: 'Chưa thanh toán',
        doctorId: user.supporterId || 0,
        createdAt: dayjs(),
    });

    const { data, isError, error, isFetching, refetch, isRefetching } =
        useFetchInvoices(options);
    const cancelInvoiceModal = () => {
        setOpenInvoiceModal(false);
        setUpdate(false);
        navigate('/admin/invoice');
    };
    const handleClickUpdateButton = () => {
        setOpenInvoiceModal(true);
        setUpdate(true);
    };

    const changePage = (current: number, size: number) => {
        if (options.pageSize !== size) {
            setOptions({ ...options, pageSize: size, pageIndex: 1 });
        } else {
            setOptions({ ...options, pageIndex: current });
        }
    };
    const openNotification = (type: NoticeType, message: string) => {
        api.open({
            type,
            content: message,
            duration: 2,
        });
    };

    return (
        <div className="container invoice-management">
            {contextHolder}
            <Breadcrumb
                items={[
                    { href: '/', title: <HomeOutlined /> },
                    { title: 'Hóa đơn' },
                ]}
            ></Breadcrumb>
            <Divider />
            <Flex className="justify-content-between ps-2 pe-2 mb-3">
                <h5>Danh sách hóa đơn</h5>
            </Flex>
            <Row className="mt-3 mb-3" gutter={24}>
                <Col span={12}>
                    <Select
                        value={options.status}
                        onChange={(value: string) =>
                            setOptions({ ...options, status: value })
                        }
                    >
                        <Select.Option value="Chưa thanh toán">
                            Chưa thanh toán
                        </Select.Option>
                        <Select.Option value="Đã thanh toán">
                            Đã thanh toán
                        </Select.Option>
                    </Select>
                </Col>
                <Col span={12} className="text-end">
                    <DatePicker
                        format="DD-MM-YYYY"
                        value={options.createdAt}
                        onChange={(date: Dayjs) =>
                            setOptions({ ...options, createdAt: date })
                        }
                    />
                </Col>
            </Row>
            <Skeleton active loading={isFetching || isRefetching}>
                {isError ? (
                    <p className="fw-bold text-center">
                        {error.message.includes('404')
                            ? 'Không có hóa đơn nào !'
                            : 'Không thể tải hóa đơn, vui lòng thử lại sau.'}
                    </p>
                ) : (
                    <>
                        <InvoiceTable
                            openNotification={openNotification}
                            handleClickUpdateButton={handleClickUpdateButton}
                            invoices={data?.invoices}
                            refetch={refetch}
                        />
                        {
                            <Pagination
                                className="mt-3"
                                align="center"
                                showSizeChanger
                                pageSizeOptions={['5', '10', '15']}
                                current={options.pageIndex}
                                pageSize={options.pageSize}
                                total={data?.pageCount * options.pageSize}
                                onChange={changePage}
                            />
                        }
                    </>
                )}
            </Skeleton>
            {openInvoiceModal && (
                <InvoiceModal
                    openInvoiceModal={openInvoiceModal}
                    cancelInvoiceModal={cancelInvoiceModal}
                    openNotification={openNotification}
                    update={update}
                />
            )}
        </div>
    );
};
export default InvoiceManagement;
