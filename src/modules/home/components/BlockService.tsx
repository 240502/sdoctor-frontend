import { Link } from 'react-router-dom';
import { Image } from 'antd';
import { useEffect, useState } from 'react';

import { HomeDirectoryService } from '../../../services/home_directoryService';
import { HomeDirectory } from '../../../models/home_directory';
import { baseURL } from '../../../constants/api';
export const BlockService = () => {
    const [homeDirectories, setHomeDirectories] = useState<HomeDirectory[]>();
    const loadData = async () => {
        try {
            const data = await HomeDirectoryService.getHomeDirectory();
            setHomeDirectories(data);
        } catch (err: any) {
            console.error(err);
        }
    };
    useEffect(() => {
        loadData();
    }, []);
    return (
        <div className="row block__services mt-5">
            <h3 className="block__title fs-4 fw-bold mb-4">
                Dịch vụ toàn diện
            </h3>
            <div className="block__list row">
                {homeDirectories?.map((item: HomeDirectory) => {
                    return (
                        <div
                            className="block__group col-6  mb-5 "
                            key={Number(item.id)}
                        >
                            <Link
                                to={item.url}
                                className="text-decoration-none col-5"
                            >
                                <div className="block__list__item  align-items-center border rounded-pill d-flex p-4  ">
                                    <Image
                                        className=""
                                        preview={false}
                                        src={baseURL + item.image}
                                        style={{ width: '40%' }}
                                    ></Image>

                                    <h3 className="ms-5 mb-0 fs-4 item__heading text-center">
                                        {item.name}
                                    </h3>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
