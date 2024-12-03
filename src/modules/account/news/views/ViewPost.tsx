import React, { useEffect } from 'react';
import { Image } from 'antd';
import { BlockNewPost } from '../components/BlockNewPost';
import { BlockCommonPost } from '../components/BlockCommonPost';
import { BlockNewCategories } from '../components/BlockNewsCategories';

const ViewPost = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="container mt-3">
            <div className="banner">
                <Image
                    className="rounded"
                    preview={false}
                    src="https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F11%2F02%2F142138-song-khoe-suot-doi-1.png&w=1920&q=75"
                />
            </div>
            <BlockNewPost />
            <BlockCommonPost />
            <BlockNewCategories />
        </div>
    );
};
export default ViewPost;
