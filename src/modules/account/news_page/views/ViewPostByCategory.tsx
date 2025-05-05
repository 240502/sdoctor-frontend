import { useState, useEffect } from 'react';
import { FetchPostPayload, Post } from '../../../../models/post';
import { Breadcrumb, Flex, Select, Input, Skeleton, Pagination } from 'antd';
import { HomeOutlined, ItalicOutlined } from '@ant-design/icons';
import { PostCategory } from '../../../../models/post_category';
import { SearchProps } from 'antd/es/input';
import { PostCards } from '../components/PostCards';
import { useRecoilState } from 'recoil';
import { postCategoryState } from '../../../../stores/scheduleAtom';
import { useFetchPostWithPagination } from '../../../../hooks/posts/useFetchPostWithPagination';
import { useSearchParams } from 'react-router-dom';
import { useFetchAllPostCategories } from '../../../../hooks';

const { Option } = Select;
const { Search } = Input;

const ViewPostByCategory = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [postCategory, setPostCategory] = useRecoilState(postCategoryState);

    const [options, setOptions] = useState<FetchPostPayload>({
        searchContent: '',
        categoryId: Number(searchParams.get('categoryId')) ?? null,
        pageIndex: 1,
        pageSize: 8,
        status: null,
        authorId: null,
    });
    const onSearch: SearchProps['onSearch'] = (value, _e) => {
        setOptions({ ...options, searchContent: value });
    };

    const { data: postCategories } = useFetchAllPostCategories();
    const { data, isError, error, isFetching } =
        useFetchPostWithPagination(options);
    useEffect(() => {
        console.log(Number(searchParams.get('category')));

        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        console.log('changed data', data);
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
                            options.categoryId !== null
                                ? options.categoryId
                                : Number(searchParams.get('category'))
                                ? Number(searchParams.get('category'))
                                : null
                        }
                        optionFilterProp="children"
                        allowClear
                        showSearch
                        onChange={(value: number) => {
                            const category: any = postCategories.find(
                                (item: PostCategory) =>
                                    item.postCategoryId === value
                            );
                            const newSearchParams = new URLSearchParams(
                                searchParams
                            );
                            if (value) {
                                newSearchParams.set(
                                    'categoryId',
                                    value.toString()
                                );
                            } else {
                                newSearchParams.delete('categoryId'); // Xóa nếu không chọn
                            }
                            setSearchParams(newSearchParams);
                            setPostCategory(category);
                            setOptions({
                                ...options,
                                categoryId: value ?? null,
                            });
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
            <Skeleton active loading={isFetching}>
                {isError ? (
                    <p className="fw-bold text-center">
                        {error.message.includes('404')
                            ? 'Không có bài viết nào !'
                            : error.message}
                    </p>
                ) : (
                    <PostCards posts={data?.posts} />
                )}
            </Skeleton>

            {data?.pageCount && data?.pageCount > 0 && (
                <Pagination
                    align="center"
                    className="mt-3 mb-3"
                    current={options.pageIndex}
                    pageSize={options.pageSize}
                    total={
                        data.pageCount ? data.pageCount * options.pageSize : 0
                    }
                    showSizeChanger
                    pageSizeOptions={['4', '8', '12', '16']}
                    onChange={(current: number, size: number) => {
                        if (size !== options.pageSize) {
                            setOptions({
                                ...options,
                                pageIndex: 1,
                                pageSize: size,
                            });
                        } else {
                            setOptions({ ...options, pageIndex: current });
                        }
                    }}
                />
            )}
        </div>
    );
};

export default ViewPostByCategory;
