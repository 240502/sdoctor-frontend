import { Card, Button, Flex, Pagination } from 'antd';
import { Doctor } from '../../../../models/doctor';
import { baseURL } from '../../../../constants/api';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export const DoctorCards = ({
    doctors,
    pageIndex,
    pageSize,
    pageCount,
    handleChange,
    handleClickEditBtn,
    handleClickBtnDelete,
}: any) => {
    const navigate = useNavigate();
    return (
        <>
            <Flex wrap>
                {doctors?.length > 0 ? (
                    doctors?.map((doctor: Doctor) => {
                        return (
                            <div className="col-3 ps-2 pe-2 mb-3">
                                <Card
                                    className="shadow text-center"
                                    cover={
                                        <img
                                            style={{
                                                maxWidth: '100%',
                                                height: '230px',
                                            }}
                                            className="object-fit-cover"
                                            alt="example"
                                            src={
                                                doctor?.image?.includes(
                                                    'cloudinary'
                                                )
                                                    ? String(doctor?.image)
                                                    : baseURL + doctor?.image
                                            }
                                        />
                                    }
                                >
                                    <h6>
                                        <h6 className="text-decoration-none text-dark">
                                            {doctor?.fullName}
                                        </h6>
                                    </h6>
                                    <p style={{ height: '20px' }}>
                                        {doctor?.departmentName}
                                    </p>
                                    <Flex className="justify-content-between mt-2 ">
                                        <Button
                                            className="border-0 text-success p-0"
                                            onClick={() => {
                                                const queryParams =
                                                    new URLSearchParams();

                                                queryParams.append(
                                                    'doctorId',
                                                    doctor.doctorId.toString()
                                                );
                                                navigate(
                                                    `/admin/doctor?${queryParams}`
                                                );
                                                handleClickEditBtn(doctor);
                                            }}
                                        >
                                            <EditOutlined /> Sửa
                                        </Button>
                                        <Button
                                            className="border-0 p-0"
                                            danger
                                            onClick={() => {
                                                handleClickBtnDelete(doctor);
                                            }}
                                        >
                                            <DeleteOutlined /> Xóa
                                        </Button>
                                    </Flex>
                                </Card>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center">Chưa có bác sĩ nào!</p>
                )}
            </Flex>
            {pageCount > 0 && (
                <Pagination
                    className="mt-3"
                    showSizeChanger
                    align="center"
                    defaultCurrent={1}
                    current={pageIndex}
                    pageSize={pageSize}
                    total={pageCount * pageSize}
                    pageSizeOptions={['5', '10', '20', '50']}
                    onChange={(current: number, size: number) => {
                        handleChange(current, size);
                    }}
                />
            )}
        </>
    );
};
