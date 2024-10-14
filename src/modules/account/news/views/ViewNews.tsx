import React from 'react';
import { Image } from 'antd';
import { BlockNewNews } from '../components/BlockNewNews';
import { BlockCommonNews } from '../components/BlockCommonNews';
import { BlockNewCategories } from '../components/BlockNewsCategories';

const ViewNews = () => {
    return (
        <div className="container mt-3">
            <div className="banner">
                <Image
                    className="rounded"
                    preview={false}
                    src="https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F11%2F02%2F142138-song-khoe-suot-doi-1.png&w=1920&q=75"
                />
            </div>
            <BlockNewNews />
            <BlockCommonNews />
            <BlockNewCategories />
        </div>
    );
};
export default ViewNews;
