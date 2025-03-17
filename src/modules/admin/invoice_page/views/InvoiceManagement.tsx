import { Breadcrumb, Button, Divider, Flex, notification, Select } from 'antd';
import { useRecoilValue } from 'recoil';
import { configValue } from '../../../../stores/userAtom';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { InvoiceTable } from '../components/InvoiceTable';
import { useEffect, useState } from 'react';
import { Invoices } from '../../../../models/invoices';
import { InvoiceModal } from '../components/InvoviceModal';
import { invoicesService } from '../../../../services/invoices.service';
import { ConfirmModal } from '../../../../components';

type NotificationType = 'success' | 'error';
const InvoiceManagement = () => {
    const config = useRecoilValue(configValue);
    const [api, contextHolder] = notification.useNotification();
    const [openInvoiceModal, setOpenInvoiceModal] = useState<boolean>(false);
    const [invoice, setInvoice] = useState<Invoices>({} as Invoices);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageCount, setPageCount] = useState<number>(0);
    const [invoices, setInvoices] = useState<Invoices[]>([]);
    const [status, setStatus] = useState<string>('Chưa thanh toán');
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const getInvoices = async () => {
        try {
            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                status: status,
            };
            const res = await invoicesService.viewInvoice(data);
            console.log('data', res);
            setInvoices(res.data);
            setPageCount(res.pageCount);
        } catch (err: any) {
            setInvoices([]);
            setPageCount(0);
            console.log(err.message);
        }
    };
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
        if (pageSize !== size) {
            setPageSize(size);
            setPageIndex(1);
        } else {
            setPageIndex(current);
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
    const DeleteInvoice = async () => {
        try {
            const res = await invoicesService.deleteInvoice(invoice?.id);
            console.log(res);
            openNotification(
                'success',
                'Thông báo!',
                'Xóa hóa đơn thành công!'
            );
            if (invoices.length > 0) {
                const newInvoice = invoices.filter(
                    (item: Invoices) => item.id !== invoice?.id
                );
                setInvoices(newInvoice);
            } else {
                getInvoices();
            }
            cancelConfirmModal();
        } catch (err: any) {
            openNotification(
                'success',
                'Thông báo!',
                'Xóa hóa đơn không thành công!'
            );

            console.log(err.message);
        }
    };
    useEffect(() => {
        getInvoices();
    }, [pageIndex, pageSize, status]);
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
            <div className="mt-3 mb-3">
                <Select
                    value={status}
                    onChange={(value: string) => setStatus(value)}
                >
                    <Select.Option value="Chưa thanh toán">
                        Chưa thanh toán
                    </Select.Option>
                    <Select.Option value="Đã thanh toán">
                        Đã thanh toán
                    </Select.Option>
                </Select>
            </div>
            <InvoiceTable
                config={config}
                openNotification={openNotification}
                onClickUpdateButton={onClickUpdateButton}
                pageIndex={pageIndex}
                pageSize={pageSize}
                pageCount={pageCount}
                invoices={invoices}
                getInvoices={getInvoices}
                changePage={changePage}
                onClickDeleteButton={onClickDeleteButton}
            />
            {openInvoiceModal && (
                <InvoiceModal
                    invoice={invoice}
                    openInvoiceModal={openInvoiceModal}
                    cancelInvoiceModal={cancelInvoiceModal}
                    setInvoice={setInvoice}
                    getInvoices={getInvoices}
                    openNotification={openNotification}
                    update={update}
                />
            )}
            {openConfirmModal && (
                <ConfirmModal
                    message="Bạn chắc chắn muốn xóa hóa đơn này?"
                    openModal={openConfirmModal}
                    handleCancelModal={cancelConfirmModal}
                    handleOk={DeleteInvoice}
                />
            )}
        </div>
    );
};
export default InvoiceManagement;
