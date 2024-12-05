import { useEffect } from 'react';

import { Card, Button, Pagination, Flex, Divider } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { User } from '../../../../models/user';
export const UserCard = ({
    users,
    pageIndex,
    pageSize,
    pageCount,
    onPageChange,
}: any) => {
    useEffect(() => {
        console.log('users', users);
    }, [users]);
    return (
        <Flex wrap>
            {users?.length > 0 ? (
                users?.map((user: User) => {
                    return (
                        <div className="col-3 ps-2 pe-2 mb-3">
                            <Card
                                className="shadow text-center"
                                cover={<img src={user?.image} />}
                            >
                                {/* <h6> {user?.}</h6> */}
                            </Card>
                        </div>
                    );
                })
            ) : (
                <></>
            )}
        </Flex>
    );
};
