import { useState, useEffect } from 'react';
import { Post } from '../../../../models/post';
import { PostService } from '../../../../services/postService';
import { Breadcrumb, Flex, Select, Input, Pagination } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { PostCategoryService } from '../../../../services/post_categoryService';
import { PostCategory } from '../../../../models/post_category';
import { SearchProps } from 'antd/es/input';
import { PostCards } from '../components/PostCards';
import { useRecoilState } from 'recoil';
import { postCategoryState } from '../../../../stores/scheduleAtom';

const { Option } = Select;
const { Search } = Input;

const ViewPostByCategory = () => {
    const [searchOptions, setSearchOptions] = useState<any>({
        searchContent: null,
        categoryId: null,
    });
    const [postCategory, setPostCategory] = useRecoilState(postCategoryState);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageCount, setPageCount] = useState<number>(0);
    const [posts, setPosts] = useState<Post[]>([]);
    const [postCategories, setPostCategories] = useState<PostCategory[]>([]);
    const onSearch: SearchProps['onSearch'] = (value, _e) => {
        setSearchOptions({ ...searchOptions, searchContent: value });
    };

    const getAllPostCategory = async () => {
        try {
            const res = await PostCategoryService.getAllPostCategory();
            setPostCategories(res);
        } catch (err: any) {
            console.log(err.message);
            setPostCategories([]);
        }
    };

    const getPostByCategory = async () => {
        try {
            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                ...searchOptions,
                categoryId:
                    searchOptions.categoryId !== null
                        ? searchOptions.categoryId
                        : postCategory.postCategoryId,
            };
            const res = await PostService.viewPost(data);
            setPosts(res.data);
            setPageCount(res.pageCount);
        } catch (err: any) {
            setPosts([]);
            setPageCount(0);
            console.log(err.message);
        }
    };
    useEffect(() => {
        getAllPostCategory();
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        getPostByCategory();
    }, [searchOptions, pageIndex, pageSize]);

    return (
        <div className="container">
            <Breadcrumb
                items={[
                    {
                        href: '/',
                        title: <HomeOutlined />,
                    },
                    {
                        href: '/list/post',
                        title: 'Sống khỏe',
                    },
                    {
                        title: `${
                            postCategory?.postCategoryId
                                ? postCategory.name
                                : ''
                        }`,
                    },
                ]}
            />
            <Flex className="justify-content-between mt-4">
                <div className="col-3">
                    <Select
                        className="w-75"
                        value={
                            searchOptions.categoryId !== null
                                ? searchOptions.categoryId
                                : postCategory.postCategoryId
                        }
                        optionFilterProp="children"
                        allowClear
                        showSearch
                        onChange={(value: number) => {
                            const category: any = postCategories.find(
                                (item: PostCategory) =>
                                    item.postCategoryId === value
                            );
                            setSearchOptions({
                                ...searchOptions,
                                categoryId: value,
                            });
                            setPageIndex(1);
                            setPostCategory(category);
                        }}
                        placeholder="Chọn loại bài viết"
                    >
                        {postCategories.map((category: PostCategory) => {
                            return (
                                <Option
                                    key={category.postCategoryId}
                                    value={category.postCategoryId}
                                    label={category.name}
                                >
                                    {category.name}
                                </Option>
                            );
                        })}
                    </Select>
                </div>
                <div className="col-4">
                    <Search
                        onSearch={onSearch}
                        placeholder="Nhập tiêu đề bài viết"
                    ></Search>
                </div>
            </Flex>
            <PostCards posts={posts} />
            {pageCount > 0 && (
                <Pagination
                    align="center"
                    className="mt-3 mb-3"
                    current={pageIndex}
                    pageSize={pageSize}
                    total={pageCount * pageSize}
                    showSizeChanger
                    pageSizeOptions={['5', '10', '15', '20']}
                    onChange={(current: number, size: number) => {
                        if (size !== pageSize) {
                            setPageSize(size);
                            setPageIndex(1);
                        } else {
                            setPageIndex(current);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default ViewPostByCategory;
