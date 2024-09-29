import { Link } from 'react-router-dom';
import { Image } from 'antd';
export const BlockForYou = (): JSX.Element => {
    return (
        <div className="row block__for__you mt-4">
            <h3 className="fs-4 fw-bold block__title ">Dành cho bạn</h3>
            <div className="block__list row mt-4">
                <div className="block__list_item col-3 d-flex">
                    <Link to="" className="text-decoration-none">
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
                    <Link to="" className="text-decoration-none">
                        <Image
                            style={{ width: '90%' }}
                            preview={false}
                            className="rounded-circle"
                            src="https://cdn.bookingcare.vn/fo/w384/2023/11/01/141017-csyt.png"
                        ></Image>
                        <h5 className="fs-5 text-center block__heading mt-4">
                            Bác sĩ
                        </h5>
                    </Link>
                </div>
                <div className="block__list_item col-3 d-flex">
                    <Link to="" className="text-decoration-none">
                        <Image
                            style={{ width: '90%' }}
                            preview={false}
                            className="rounded-circle"
                            src="https://cdn.bookingcare.vn/fo/w384/2023/11/01/141017-csyt.png"
                        ></Image>
                        <h5 className="fs-5 text-center block__heading mt-4">
                            Chuyên khoa
                        </h5>
                    </Link>
                </div>
                <div className="block__list_item col-3 d-flex">
                    <Link to="" className="text-decoration-none">
                        <Image
                            style={{ width: '90%' }}
                            preview={false}
                            className="rounded-circle"
                            src="https://cdn.bookingcare.vn/fo/w384/2023/11/01/141017-csyt.png"
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
