import { Button, Col, Flex, Form, Input, Popconfirm, Skeleton, Tag, Typography } from "antd";
import { useCreateMedicalEquipment, useDeleteMedicalEquipment, useGetMedicalEquipmentByClinicId, useUpdateMedicalEquipment } from "../../../../hooks";
import { useEffect, useState } from "react";
import { NoticeType } from "antd/es/message/interface";
import { MedicalEquipment, MedicalEquipmentCreateDto, MedicalEquipmentUpdateDto } from "../../../../models";

interface InputMedicalEquipmentTabProps{
    clinicId: number | null;
    openMessage: (type: NoticeType, content: string) => void;   
}
const InputMedicalEquipmentTab = ({
    clinicId,
    openMessage
}:InputMedicalEquipmentTabProps) => {
    const [form] = Form.useForm();
    const { mutate: createMedicalEquipment } = useCreateMedicalEquipment();
    const { mutate: updateMedicalEquipment } = useUpdateMedicalEquipment();
    const { mutate: deleteMedicalEquipment } = useDeleteMedicalEquipment();
    const [equipments, setEquipments] = useState<MedicalEquipment[]>([]);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const {data,isFetching,refetch,isRefetching} = useGetMedicalEquipmentByClinicId(clinicId)
    const [updatedId, setUpdatedId] = useState<number | null>(null);
    useEffect(() => {
        setEquipments(data);
        return () => {
            setEquipments([])
        }
    }, [data])
    const handleTimeLineItemClick = (equipment: MedicalEquipment) => {
        setIsUpdate(true);
        setUpdatedId(equipment.id);
        form.setFieldsValue({
            equipmentName: equipment.name,
        });
    };
    const onFinish = (values: { equipmentName: string }) => {
        if (isUpdate) {
            const payload: MedicalEquipmentUpdateDto = {
                id: updatedId,
                clinicId,
                name:values.equipmentName
                
            }
            updateMedicalEquipment(payload, {
                onSuccess() {
                    openMessage("success","Cập nhật thành công"!)
                    
                },
                onError() {
                    openMessage("error","Cập nhật không thành công!")
                }
            })
        }
        else {
            const payload: MedicalEquipmentCreateDto = {
                clinicId,
                name: values.equipmentName
            }
            createMedicalEquipment(payload, {
                onSuccess() {
                    openMessage("success", "Thêm thành công"!)
                    refetch();
                },
                onError() {
                    openMessage("error","Thêm không thành công!")
                }
            })
        }
        form.resetFields();

    }
    return <>
        <Form form={form}
            onFinish={onFinish}
            layout="inline"
            className="mb-2"
        >
            <Form.Item label="Tên thiết bị"
                name={"equipmentName"}
                rules={[{
                    required:true,message:"Vui lòng nhập tên thiết bị!"
                }]}
            >
                <Input placeholder="Ví dụ: Máy siêu âm"/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Lưu
                </Button>
            </Form.Item>
            {isUpdate && (
                    <Form.Item>
                        <Popconfirm
                            title="Bạn có chắc muốn xóa thông tin này?"
                            onConfirm={() =>
                                deleteMedicalEquipment(updatedId, {
                                    onSuccess() {
                                        openMessage(
                                            'success',
                                            'Xóa thành công!'
                                        );
                                        refetch();
                                    },
                                    onError() {
                                        openMessage(
                                            'error',
                                            'Xóa không thành công!'
                                        );
                                    },
                                })
                            }
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <Button type="link" danger>
                                Xóa
                            </Button>
                        </Popconfirm>
                    </Form.Item>
                )}
        </Form>
        <Skeleton active loading={isFetching || isRefetching}>
            {equipments?.length > 0 ? (
                <Flex wrap gap="middle" align="stretch">
                    {equipments?.map((equipment: MedicalEquipment) => {
                        return (
                            <Col
                                span={3}
                                className="gutter-row"
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                    handleTimeLineItemClick(equipment)
                                }
                            >
                                <Tag
                                    color="rgb(248, 249, 252)"
                                    className="text-dark p-2 fw-medium rounded-5 shadow w-100 text-center text-wrap"
                                >
                                    <Typography.Text>
                                        {equipment.name}
                                    </Typography.Text>
                                </Tag>
                            </Col>
                        );
                    })}
                </Flex>
            ) : (
                <Typography.Text>
                    Chưa có thiết bị nào. Vui lòng thêm mới.
                </Typography.Text>
            )}
        </Skeleton>
      
    </>;
};

export default InputMedicalEquipmentTab;
