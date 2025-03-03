import { useEffect } from 'react';
import { Image } from 'antd';
import { BlockNewPost } from '../components/BlockNewPost';
import { BlockCommonPost } from '../components/BlockCommonPost';
import { BlockNewCategories } from '../components/BlockNewsCategories';

const ViewPost = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="container mt-3 post-page-container">
            <div className="banner">
                <Image
                    className="rounded w-full d-block"
                    preview={false}
                    src="https://cdn.bookingcare.vn/fo/2023/11/02/142138-song-khoe-suot-doi-1.png"
                />
            </div>
            <BlockNewPost />
            <BlockCommonPost />
            <BlockNewCategories />
        </div>
    );
};
export default ViewPost;
