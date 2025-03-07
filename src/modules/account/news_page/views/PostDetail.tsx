import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from '../../../../models/post';
import { useRecoilValue } from 'recoil';
import { postsValue } from '../../../../stores/postAtom';
import { PostService } from '../../../../services/postService';
import { Breadcrumb, Card, Flex, Divider } from 'antd';
import { CalendarOutlined, HomeOutlined } from '@ant-design/icons';
import parse from 'html-react-parser';
import '@/assets/scss/app.scss';
import { RelatedPost } from '../components/RelatedPost';

type DataParams = {
    id: string;
};
const PostDetail = () => {
    const posts = useRecoilValue(postsValue);
    const { id } = useParams<DataParams>();
    const [post, setPost] = useState<Post>({} as Post);
    const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageCount, setPageCount] = useState<number>(0);
    const getPostById = async () => {
        if (posts.length > 0) {
            console.log('ko call api');
            const post: any = posts.find(
                (post: Post) => post.id === Number(id)
            );
            if (post) {
                setPost(post);
            }
        } else {
            console.log(' call api');

            try {
                const res = await PostService.getPostById(Number(id));
                console.log(res);
                setPost(res);
            } catch (err: any) {
                setPost({} as Post);
                console.log(err.message);
            }
        }
    };
    const getRelatedPosts = async () => {
        try {
            const data = {
                id: post.id,
                categoryId: post.category_id,
                pageIndex: pageIndex,
                pageSize: pageSize,
            };

            const res = await PostService.getRelatedPost(data);
            setRelatedPosts(res.data);
            setPageCount(res.pageCount);
        } catch (err: any) {
            setRelatedPosts([]);
            setPageCount(0);

            console.log(err.message);
        }
    };
    const changePage = (current: number, size: number) => {
        if (size !== pageSize) {
            setPageIndex(1);
            setPageSize(size);
        } else {
            setPageIndex(current);
        }
    };
    useEffect(() => {
        if (post?.id) {
            getRelatedPosts();
        }
    }, [post, pageIndex, pageSize]);
    useEffect(() => {
        getPostById();
        window.scrollTo(0, 0);
    }, [id]);

    return (
        <div className="container post-detail mt-4 mb-4">
            <Breadcrumb
                items={[
                    {
                        href: '/',
                        title: <HomeOutlined />,
                    },

                    {
                        href: '/list/post',
                        title: (
                            <p className="text-decoration-none">Sống khỏe</p>
                        ),
                    },
                    {
                        title: 'Chi tiết bài viết',
                    },
                ]}
            />
            <Flex className="mt-4">
                <Card className="content col-8 ">
                    <h5 className="">{post.title}</h5>
                    <Flex className="author align-items-center">
                        <img
                            style={{ width: '4%' }}
                            src={post.featured_image}
                            className="rounded-circle col-1 me-2"
                        />
                        <p className="fw-bold m-0 me-2">{post.full_name}</p>
                        <p className=" m-0">
                            <CalendarOutlined className="me-1" />
                            {post.featured_image?.toString().slice(0, 10)}
                        </p>
                    </Flex>
                    <div className="content">
                        {post?.content ? parse(String(post?.content)) : ''}
                    </div>
                </Card>
                <Flex className="col-4 ps-3" vertical>
                    <div className="w-full border p-2 rounded">
                        <h6 className="mt-2">Bài viết liên quan</h6>
                        <Divider />
                        <RelatedPost
                            relatedPosts={relatedPosts}
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                            pageCount={pageCount}
                            onChangePage={changePage}
                            setPageIndex={setPageIndex}
                        />
                    </div>
                </Flex>
            </Flex>
        </div>
    );
};
export default PostDetail;
