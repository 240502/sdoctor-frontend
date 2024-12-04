import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from '../../../../models/post';
import { PostService } from '../../../../services/postService';
import { Breadcrumb, Flex, Select, Input } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { PostCategoryService } from '../../../../services/post_categorySerivce';
import { PostCategory } from '../../../../models/post_category';
import { SearchProps } from 'antd/es/input';
import { PostCards } from '../components/PostCards';

const { Option } = Select;
const { Search } = Input;
type DataParam = {
    categoryId: string;
};
const ViewPostByCategory = () => {
    const [searchOptions, setSearchOptions] = useState<any>({
        searchContent: null,
        categoryId: null,
    });
    const { categoryId } = useParams<DataParam>();

    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageCount, setPageCount] = useState<number>(0);
    const [posts, setPosts] = useState<Post[]>([]);
    const [postCategories, setPostCategories] = useState<PostCategory[]>([]);
    const [category, setCategory] = useState<PostCategory>({} as PostCategory);
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        setSearchOptions({ ...searchOptions, searchContent: value });
    };

    const getAllPostCategory = async () => {
        try {
            const res = await PostCategoryService.getAllPostCategory();
            setPostCategories(res);
            const postCategory = res.find(
                (item: PostCategory) =>
                    item.post_category_id === Number(categoryId)
            );
            if (postCategory) {
                setCategory(postCategory);
            }
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
                categoryId: Number(categoryId),
            };
            const res = await PostService.viewPostClient(data);
            setPosts(res.data);
            setPageCount(res.pageCount);
        } catch (err: any) {
            console.log(err.message);
            setPosts([]);
            setPageCount(0);
        }
    };
    useEffect(() => {
        setSearchOptions({ ...searchOptions, categoryId: Number(categoryId) });
        getPostByCategory();
        getAllPostCategory();
    }, []);
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
                            category?.post_category_id ? category.name : ''
                        }`,
                    },
                ]}
            />
            <Flex className="justify-content-between mt-4">
                <div className="col-3">
                    <Select
                        className="w-75"
                        value={Number(searchOptions.categoryId)}
                        optionFilterProp="children"
                        allowClear
                        showSearch
                        onChange={(value: number) => {
                            setSearchOptions({
                                ...searchOptions,
                                categoryId: value,
                            });
                        }}
                        placeholder="Chọn loại bài viết"
                    >
                        {postCategories.map((category: PostCategory) => {
                            return (
                                <Option
                                    key={category.post_category_id}
                                    value={category.post_category_id}
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
        </div>
    );
};

export default ViewPostByCategory;
