import {
    Breadcrumb,
    Button,
    Divider,
    Flex,
    notification,
    Select,
    DatePicker,
    Row,
    Col,
} from 'antd';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../../stores/userAtom';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { InvoiceTable } from '../components/InvoiceTable';
import { useEffect, useState } from 'react';
import { Invoices } from '../../../../models/invoices';
import { InvoiceModal } from '../components/InvoviceModal';
import { ConfirmModal } from '../../../../components';
import { useFetchInvoices } from '../../../../hooks/invoice/useInvoice';
const { RangePicker } = DatePicker;
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);
dayjs.locale('vi');
type NotificationType = 'success' | 'error';
const InvoiceManagement = () => {
    const [api, contextHolder] = notification.useNotification();
    const [openInvoiceModal, setOpenInvoiceModal] = useState<boolean>(false);
    const [invoice, setInvoice] = useState<Invoices>({} as Invoices);
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const user = useRecoilValue(userState);

    const [options, setOptions] = useState<{
        pageIndex: number;
        pageSize: number;
        status: string;
        doctorId: number;
        fromDate: Dayjs;
        toDate: Dayjs;
    }>({
        pageIndex: 1,
        pageSize: 10,
        status: 'Chưa thanh toán',
        doctorId: user.supporterId || 0,
        fromDate: dayjs().startOf('isoWeek'),
        toDate: dayjs().endOf('isoWeek'),
    });

    const { data, isError, error, isFetching, refetch, isRefetching } =
        useFetchInvoices(options);

    useEffect(() => {
        console.log(data);
    }, [data]);
    const cancelInvoiceModal = () => {
        setOpenInvoiceModal(false);
        setInvoice({} as Invoices);
    };
    const onClickUpdateButton = (invoice: Invoices) => {
        setInvoice(invoice);
        setOpenInvoiceModal(true);
        setUpdate(true);
    };
    const onClickDeleteButton = (invoice: Invoices) => {
        setInvoice(invoice);
        setOpenConfirmModal(true);
    };
    const changePage = (current: number, size: number) => {
        if (options.pageSize !== size) {
            setOptions({ ...options, pageSize: size, pageIndex: 1 });
        } else {
            setOptions({ ...options, pageIndex: current });
        }
    };
    const openNotification = (
        type: NotificationType,
        title: string,
        message: string
    ) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const cancelConfirmModal = () => {
        setOpenConfirmModal(false);
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
                <Button
                    className="border-0 text-white bg-primary"
                    onClick={() => setOpenInvoiceModal(true)}
                >
                    <PlusOutlined /> Thêm mới
                </Button>
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
                    <RangePicker
                        placeholder={['Từ ngày', 'Đến ngày']}
                        value={[options.fromDate, options.toDate]}
                        format={'DD-MM-YYYY'}
                    ></RangePicker>
                </Col>
            </Row>
            <InvoiceTable
                openNotification={openNotification}
                onClickUpdateButton={onClickUpdateButton}
                pageCount={data?.pageCount}
                invoices={data?.invoices}
                changePage={changePage}
                onClickDeleteButton={onClickDeleteButton}
            />
            {openInvoiceModal && (
                <InvoiceModal
                    invoice={data?.invoices}
                    openInvoiceModal={openInvoiceModal}
                    cancelInvoiceModal={cancelInvoiceModal}
                    setInvoice={setInvoice}
                    openNotification={openNotification}
                    update={update}
                />
            )}
        </div>
    );
};
export default InvoiceManagement;
