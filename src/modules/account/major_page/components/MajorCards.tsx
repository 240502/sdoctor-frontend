import { Flex, Card } from 'antd';
import { Major } from '../../../../models/major';
import { baseURL } from '../../../../constants/api';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { doctorFilterOptions } from '../../../../stores';

export const MajorCards = ({ majors }: any) => {
    const [doctorOptions, setDoctorOptions] =
        useRecoilState(doctorFilterOptions);
    const navigate = useNavigate();
    return (
        <>
            <Flex wrap>
                <>
                    {majors?.map((major: Major) => {
                        return (
                            <div
                                className="col-3 ps-2 pe-2 mb-3"
                                key={major.id}
                            >
                                <Card
                                    className="shadow text-center"
                                    cover={
                                        <img
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                navigate('/list/doctor');
                                                setDoctorOptions({
                                                    ...doctorOptions,
                                                    majorIds: [major.id],
                                                });
                                            }}
                                            src={baseURL + major?.image}
                                        ></img>
                                    }
                                >
                                    <h6
                                        onClick={() => {
                                            navigate('/list/doctor');
                                            setDoctorOptions({
                                                ...doctorOptions,
                                                majorIds: [major.id],
                                            });
                                        }}
                                        style={{
                                            height: '50px',
                                            maxHeight: '50px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {major.name}
                                    </h6>
                                </Card>
                            </div>
                        );
                    })}
                </>
            </Flex>
        </>
    );
};
