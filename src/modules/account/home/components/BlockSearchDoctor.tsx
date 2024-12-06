import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Flex } from 'antd';
import { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { homePageSearchContent } from '../../../../stores/doctorAtom';
import { doctorService } from '../../../../services/doctorService';
import { useNavigate } from 'react-router-dom';

export const BlockSearchDoctor = () => {
    const [searchContent, setSearchContent] = useRecoilState(
        homePageSearchContent
    );
    const navigate = useNavigate();
    const handleSearchDoctor = () => {
        if (searchContent !== '') {
            setSearchContent(searchContent);
        }
    };

    return (
        <div className="search-group">
            <h6 className="text-center fs-5">Tìm kiếm bác sĩ</h6>
            <p className="text-center opacity-50">
                Tìm kiếm bác sĩ của bạn và đặt lịch khám trong 1 lần bấm
            </p>
            <Flex className="group-button w-50 m-auto">
                <Input
                    value={searchContent}
                    placeholder="Tìm kiếm ..."
                    onChange={(e: any) => {
                        setSearchContent(e.target.value);
                    }}
                ></Input>
                <Button
                    className="ms-2"
                    type="primary"
                    onClick={() => {
                        handleSearchDoctor();
                        navigate('/list/doctor');
                    }}
                >
                    <SearchOutlined /> Tìm kiếm
                </Button>
            </Flex>
        </div>
    );
};
