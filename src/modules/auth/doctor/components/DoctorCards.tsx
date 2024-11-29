import React, { useEffect } from 'react';
import { Card, Button, Flex, Pagination } from 'antd';
import { Doctor } from '../../../../models/doctor';
import { baseURL } from '../../../../constants/api';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export const DoctorCards = ({
    doctors,
    pageIndex,
    pageSize,
    pageCount,
    handleChange,
    handleClickEditBtn,
    handleClickBtnDelete,
}: any) => {
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
                                            alt="example"
                                            src={
                                                doctor.image.includes(
                                                    'cloudinary'
                                                )
                                                    ? String(doctor.image)
                                                    : baseURL + doctor.image
                                            }
                                        />
                                    }
                                >
                                    <p className="mb-1">{doctor.title}</p>
                                    <h6>
                                        <h6 className="text-decoration-none text-dark">
                                            {doctor.full_name}
                                        </h6>
                                    </h6>
                                    <p style={{ height: '20px' }}>
                                        {doctor.major_name}
                                    </p>
                                    <Flex className="justify-content-between mt-2 ">
                                        <Button
                                            className="border-0 text-success p-0"
                                            onClick={() => {
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
        </>
    );
};
