import { Flex, Card } from 'antd';
import { Major } from '../../../../models/major';
import { baseURL } from '../../../../constants/api';
import { useNavigate } from 'react-router-dom';

export const MajorCards = ({
    majors,
    setOptionsGlobal,
    optionsGlobal,
}: any) => {
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
                                                setOptionsGlobal({
                                                    ...optionsGlobal,
                                                    majorId: major.id,
                                                });
                                            }}
                                            src={baseURL + major?.image}
                                        ></img>
                                    }
                                >
                                    <h6
                                        onClick={() => {
                                            navigate('/list/doctor');
                                            setOptionsGlobal({
                                                ...optionsGlobal,
                                                majorId: major.id,
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
