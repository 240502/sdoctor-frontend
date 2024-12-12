import { Divider, Row, Col, Image } from 'antd';

const Profile = () => {
    return (
        <>
            <h3>Hồ sơ cá nhân</h3>
            <Divider />
            <Row gutter={24}>
                <Col span={4}>
                    <Image
                        preview={false}
                        src="https://doccure.dreamstechnologies.com/html/template/assets/img/doctors-dashboard/doctor-profile-img.jpg"
                    ></Image>
                </Col>
            </Row>
        </>
    );
};

export default Profile;
