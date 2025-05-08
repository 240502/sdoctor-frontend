import { Menu } from 'antd';
import parse from 'html-react-parser';

import { Functions } from '../../../models/functions';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userValue } from '../../../stores/userAtom';

export const Sidenav = () => {
    const user = useRecoilValue(userValue);
    return (
        <Menu theme="dark" mode="inline">
            {user?.functions?.map((item: Functions, index: number) => {
                return (
                    <Menu.Item key={index}>
                        <Link
                            to={`${item.link}`}
                            className="text-decoration-none"
                        >
                            {parse(String(item.icon))}{' '}
                            <span className="ps-3 ms-3">
                                {item.functionName}
                            </span>
                        </Link>
                    </Menu.Item>
                );
            })}
        </Menu>
    );
};
