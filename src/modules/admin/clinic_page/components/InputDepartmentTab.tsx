import {
    Form,
    Button,
    Select,
    Row,
    Col,
    Skeleton,
    Image,
    Modal,
    Popconfirm,
} from 'antd';
import {
    useCreateClinicSpecialty,
    useDeleteClinicSpecialty,
    useFetchAllDepartments,
    useGetClinicSpecialtyByClinicId,
    useUpdateClinicSpecialty,
} from '../../../../hooks';
import {
    ClinicSpecialty,
    ClinicSpecialtyCreateDto,
    ClinicSpecialtyUpdateDto,
    Department,
} from '../../../../models';
import { NoticeType } from 'antd/es/message/interface';
import { baseURL } from '../../../../constants/api';
import { useState } from 'react';

interface InputDepartmentTabProps {
    clinicId: number | null;
    openMessage: (type: NoticeType, content: string) => void;
}

const InputDepartmentTab = ({
    clinicId,
    openMessage,
}: InputDepartmentTabProps) => {
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSpecialty, setEditingSpecialty] =
        useState<ClinicSpecialty | null>(null);
    // Track loading state for each department deletion
    const [deletingIds, setDeletingIds] = useState<{ [key: number]: boolean }>(
        {}
    );

    const { data: departmentResponse, isFetching } = useFetchAllDepartments();
    const {
        data,
        isError: isGetClinicSpecialtyError,
        isFetching: isFetchingClinicSpecialty,
        refetch,
        isRefetching,
    } = useGetClinicSpecialtyByClinicId(clinicId);

    const { mutate: createClinicSpecialty, isPending } =
        useCreateClinicSpecialty();
    const { mutate: updateClinicSpecialty, isPending: isUpdating } =
        useUpdateClinicSpecialty();
    const { mutate: deleteClinicSpecialty } = useDeleteClinicSpecialty();

    // Handle form submission for creating a new specialty
    const onFinish = (values: { departmentId: number }) => {
        const payload: ClinicSpecialtyCreateDto = {
            clinicId: clinicId!,
            specialtyId: values.departmentId,
        };
        createClinicSpecialty(payload, {
            onSuccess() {
                openMessage('success', 'Thêm thành công!');
                refetch();
                form.resetFields();
            },
            onError(error) {
                console.log('có lỗi khi thêm clinic specialty', error);
                openMessage('error', 'Thêm không thành công!');
            },
        });
    };

    // Handle edit button click
    const handleEdit = (specialty: ClinicSpecialty) => {
        setEditingSpecialty(specialty);
        editForm.setFieldsValue({ departmentId: specialty.specialtyId });
        setIsModalVisible(true);
    };

    // Handle edit form submission
    const handleEditSubmit = (values: { departmentId: number }) => {
        if (!editingSpecialty) return;
        const payload: ClinicSpecialtyUpdateDto = {
            id: editingSpecialty.id,
            clinicId: clinicId!,
            specialtyId: values.departmentId,
        };
        updateClinicSpecialty(payload, {
            onSuccess() {
                openMessage('success', 'Cập nhật thành công!');
                refetch();
                setIsModalVisible(false);
                editForm.resetFields();
                setEditingSpecialty(null);
            },
            onError(error) {
                console.log('có lỗi khi cập nhật clinic specialty', error);
                openMessage('error', 'Cập nhật không thành công!');
            },
        });
    };

    // Handle delete button click
    const handleDelete = (id: number) => {
        setDeletingIds((prev) => ({ ...prev, [id]: true })); // Set loading for specific id
        deleteClinicSpecialty(id, {
            onSuccess() {
                openMessage('success', 'Xóa thành công!');
                refetch();
                setDeletingIds((prev) => ({ ...prev, [id]: false })); // Clear loading
            },
            onError(error) {
                console.log('có lỗi khi xóa clinic specialty', error);
                openMessage('error', 'Xóa không thành công!');
                setDeletingIds((prev) => ({ ...prev, [id]: false })); // Clear loading
            },
        });
    };

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Chọn chuyên khoa"
                    name="departmentId"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn một chuyên khoa!',
                        },
                    ]}
                >
                    <Select
                        placeholder="Chọn chuyên khoa"
                        showSearch
                        allowClear
                        optionFilterProp="children"
                        loading={isFetching}
                    >
                        {departmentResponse?.departments?.map(
                            (dept: Department) => (
                                <Select.Option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </Select.Option>
                            )
                        )}
                    </Select>
                </Form.Item>

                <Form.Item className="text-center">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isPending}
                        className="col-2"
                    >
                        Lưu
                    </Button>
                </Form.Item>
            </Form>
            <Modal
                title="Chỉnh sửa chuyên khoa"
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    editForm.resetFields();
                    setEditingSpecialty(null);
                }}
                footer={null}
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleEditSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Chọn chuyên khoa"
                        name="departmentId"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn một chuyên khoa!',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn chuyên khoa"
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            loading={isFetching}
                        >
                            {departmentResponse?.departments?.map(
                                (dept: Department) => (
                                    <Select.Option
                                        key={dept.id}
                                        value={dept.id}
                                    >
                                        {dept.name}
                                    </Select.Option>
                                )
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item className="text-center">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isUpdating}
                        >
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Skeleton
                active
                loading={isFetchingClinicSpecialty || isRefetching}
            >
                <Row gutter={[24, 24]}>
                    {!isGetClinicSpecialtyError ? (
                        data?.map((clinicSpecialty: ClinicSpecialty) => (
                            <Col key={clinicSpecialty.id} span={5}>
                                <div className="category-item rounded border border-1 gutter-row p-3 shadow">
                                    <Image
                                        preview={false}
                                        className="category-image rounded object-fit-contain"
                                        src={baseURL + clinicSpecialty.imageUrl}
                                    />
                                    <p className="category-name pb-0 text-center fw-bold fs-md-5 mt-3">
                                        {clinicSpecialty.name}
                                    </p>
                                    <div className="text-center mt-2">
                                        <Button
                                            type="primary"
                                            onClick={() =>
                                                handleEdit(clinicSpecialty)
                                            }
                                            className="me-2"
                                        >
                                            Sửa
                                        </Button>
                                        <Popconfirm
                                            title="Bạn có chắc muốn xóa thông tin này?"
                                            onConfirm={() =>
                                                handleDelete(clinicSpecialty.id)
                                            }
                                        >
                                            <Button
                                                type="link"
                                                danger
                                                loading={
                                                    deletingIds[
                                                        clinicSpecialty.id
                                                    ] || false
                                                }
                                            >
                                                Xóa
                                            </Button>
                                        </Popconfirm>
                                    </div>
                                </div>
                            </Col>
                        ))
                    ) : (
                        <p className="fw-bold text-center">
                            Chưa có chuyên khoa nào! Vui lòng thêm mới !
                        </p>
                    )}
                </Row>
            </Skeleton>
        </>
    );
};

export default InputDepartmentTab;
