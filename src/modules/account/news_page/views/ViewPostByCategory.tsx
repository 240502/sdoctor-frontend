import { useState, useEffect } from 'react';
import { Post } from '../../../../models/post';
import { Breadcrumb, Flex, Select, Input, Pagination } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { PostCategoryService } from '../../../../services/post_categoryService';
import { PostCategory } from '../../../../models/post_category';
import { SearchProps } from 'antd/es/input';
import { PostCards } from '../components/PostCards';
import { useRecoilState } from 'recoil';
import { postCategoryState } from '../../../../stores/scheduleAtom';
import { useFetchDataWithPaginationProps } from '../../../../hooks';

const { Option } = Select;
const { Search } = Input;

const ViewPostByCategory = () => {
    const [pagination, setPagination] = useRecoilState(paginationState);
    const [postCategory, setPostCategory] = useRecoilState(postCategoryState);
    const [searchOptions, setSearchOptions] = useState<any>({
        searchContent: null,
        categoryId: postCategory?.postCategoryId
            ? postCategory?.postCategoryId
            : null,
    });
    const [posts, setPosts] = useState<Post[]>([]);
    const [postCategories, setPostCategories] = useState<PostCategory[]>([]);

    const onSearch: SearchProps['onSearch'] = (value, _e) => {
        setSearchOptions({ ...searchOptions, searchContent: value });
    };
    const apiEndpoint = '/post/view';
    const { data, loading, error, changePage } =
        useFetchDataWithPaginationProps<Post>(apiEndpoint, searchOptions);

    const getAllPostCategory = async () => {
        try {
            const res = await PostCategoryService.getAllPostCategory();
            setPostCategories(res);
        } catch (err: any) {
            console.log(err.message);
            setPostCategories([]);
        }
    };

    useEffect(() => {
        getAllPostCategory();
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        console.log('changed data', data);
        setPosts(data);
    }, [data]);

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
            {loading ? (
                <p className="fs-6 fw-bold text-center mt-4">
                    Đang tải dữ liệu ...
                </p>
            ) : error ? (
                <p className="fs-6 fw-bold text-center mt-4"> {error}</p>
            ) : data?.length > 0 ? (
                <PostCards posts={posts} />
            ) : (
                <p className="fs-6 fw-bold text-center mt-4">
                    {' '}
                    Không có dữ liệu!
                </p>
            )}

            {/* {pagination.pageCount > 0 && (
                <Pagination
                    align="center"
                    className="mt-3 mb-3"
                    current={pagination.pageIndex}
                    pageSize={pagination.pageSize}
                    total={pagination.pageCount * pagination.pageSize}
                    showSizeChanger
                    pageSizeOptions={['4', '8', '12', '16']}
                    onChange={changePage}
                />
            )} */}
        </div>
    );
};

export default ViewPostByCategory;
