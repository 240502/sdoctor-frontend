import { Link } from 'react-router-dom';
import { Image } from 'antd';
import { baseURL } from '../../../../constants/api';
export const BlockForYou = (): JSX.Element => {
    return (
        <div className="row block__for__you mt-4">
            <h3 className="fs-4 fw-bold block__title ">Dành cho bạn</h3>
            <div className="block__list row mt-4">
                <div className="block__list_item col-3 d-flex">
                    <Link
                        to=""
                        className="text-decoration-none"
                        onClick={() => {
                            localStorage.setItem(
                                'currentMenu',
                                JSON.stringify('3')
                            );
                        }}
                    >
                        <Image
                            style={{ width: '90%' }}
                            preview={false}
                            className="rounded-circle"
                            src="https://cdn.bookingcare.vn/fo/w384/2023/11/01/141017-csyt.png"
                        ></Image>
                        <h5 className="fs-5 text-center block__heading mt-4">
                            Cơ sở y tế
                        </h5>
                    </Link>
                </div>
                <div className="block__list_item col-3 d-flex">
                    <Link
                        to="/list/doctor/for-you"
                        className="text-decoration-none"
                        onClick={() => {
                            localStorage.setItem(
                                'currentMenu',
                                JSON.stringify('2')
                            );
                        }}
                    >
                        <Image
                            style={{ width: '90%' }}
                            preview={false}
                            className="rounded-circle"
                            src={baseURL + '/img/140234-bac-si.png'}
                        ></Image>
                        <h5 className="fs-5 text-center block__heading mt-4">
                            Bác sĩ
                        </h5>
                    </Link>
                </div>
                <div className="block__list_item col-3 d-flex">
                    <Link
                        to=""
                        className="text-decoration-none"
                        onClick={() => {
                            localStorage.setItem(
                                'currentMenu',
                                JSON.stringify('6')
                            );
                        }}
                    >
                        <Image
                            style={{ width: '90%' }}
                            preview={false}
                            className="rounded-circle"
                            src={baseURL + '/img/140537-chuyen-khoa.png'}
                        ></Image>
                        <h5 className="fs-5 text-center block__heading mt-4">
                            Chuyên khoa
                        </h5>
                    </Link>
                </div>
                <div className="block__list_item col-3 d-flex">
                    <Link
                        to=""
                        className="text-decoration-none"
                        onClick={() => {
                            localStorage.setItem(
                                'currentMenu',
                                JSON.stringify('5')
                            );
                        }}
                    >
                        <Image
                            style={{ width: '90%' }}
                            preview={false}
                            className="rounded-circle"
                            src={baseURL + '/img/140319-bai-viet.png'}
                        ></Image>
                        <h5 className="fs-5 text-center block__heading mt-4">
                            Bài viết
                        </h5>
                    </Link>
                </div>
            </div>
        </div>
    );
};
