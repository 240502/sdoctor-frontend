import { Checkbox, Flex } from 'antd';

const BlockGenderOptions = () => {
    return (
        <Flex className="" vertical>
            <h6 className="mb-3">Giới tính</h6>
            <Checkbox className="fs-6 "> Nam</Checkbox>
            <Checkbox className="fs-6"> Nữ</Checkbox>
        </Flex>
    );
};
export default BlockGenderOptions;
