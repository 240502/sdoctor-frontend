import { Card, Flex, Image, Button, Pagination } from 'antd';
import { Clinic } from '../../../../models/clinic';
import {
    DeleteOutlined,
    EditOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import { baseURL } from '../../../../constants/api';
import { useNavigate } from 'react-router-dom';
export const ClinicCards = ({
    clinics,
    pageIndex,
    pageSize,
    changePage,
    pageCount,
    handleClickEditBtn,
    handleClickDeleteBtn,
}: any) => {
    const navigate = useNavigate();
    return (
        <>
            <Flex wrap>
                {clinics?.length > 0 ? (
                    clinics?.map((clinic: Clinic) => {
                        return (
                            <div
                                className="col-3 ps-2 pe-2 mb-3"
                                key={clinic.id}
                            >
                                <Card
                                    className="shadow"
                                    cover={
                                        <img
                                            src={
                                                clinic.avatar.includes(
                                                    'cloudinary'
                                                )
                                                    ? clinic.avatar
                                                    : baseURL + clinic.avatar
                                            }
                                            className="w-75 m-auto mt-4 object-fit-contain  feature-img"
                                            style={{
                                                height: '120px',
                                            }}
                                        />
                                    }
                                >
                                    <div className="author mt-3">
                                        <p
                                            className="author-name fw-bold text-center mb-0"
                                            style={{
                                                height: '30px',
                                                maxHeight: '30px',
                                            }}
                                        >
                                            {clinic.name}
                                        </p>
                                    </div>
                                    <div
                                        className="time_public mt-3"
                                        style={{
                                            maxHeight: '70px',
                                            height: '70px',
                                            textAlign: 'justify',
                                        }}
                                    >
                                        <EnvironmentOutlined className="me-2" />
                                        {clinic.location}
                                    </div>

                                    <Flex className="justify-content-between mt-2 ">
                                        <Button
                                            className="border-0 text-success p-0"
                                            onClick={() => {
                                                handleClickEditBtn(clinic);
                                                const queryParams =
                                                    new URLSearchParams();

                                                queryParams.append(
                                                    'clinicId',
                                                    clinic.id.toString()
                                                );
                                                navigate(
                                                    `/admin/clinic?${queryParams}`
                                                );
                                            }}
                                        >
                                            <EditOutlined /> Sửa
                                        </Button>
                                        <Button
                                            className="border-0 p-0"
                                            danger
                                            onClick={() => {
                                                handleClickDeleteBtn(clinic);
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
                    <p className="text-center fw-bold">
                        Không có cơ sở y tế nào
                    </p>
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
                    pageSizeOptions={['5', '10', '20', '30']}
                    onChange={(current: number, size: number) => {
                        changePage(current, size);
                    }}
                />
            )}
        </>
    );
};
