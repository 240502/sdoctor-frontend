import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from '../../../../models/post';
import { useRecoilValue } from 'recoil';
import { postsValue } from '../../../../stores/postAtom';
import { PostService } from '../../../../services/postService';
import { Breadcrumb, Card, Image, Flex, Divider } from 'antd';
import { CalendarOutlined, HomeOutlined } from '@ant-design/icons';
import parse from 'html-react-parser';
import '@/assets/scss/app.scss';

type DataParams = {
    id: string;
};
const PostDetail = () => {
    const posts = useRecoilValue(postsValue);
    const { id } = useParams<DataParams>();
    const [post, setPost] = useState<Post>({} as Post);
    const getPostById = async () => {
        if (posts.length > 0) {
            const post: any = posts.find(
                (post: Post) => post.id === Number(id)
            );
            if (post) {
                setPost(post);
            }
        } else {
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
    useEffect(() => {
        getPostById();
    }, [id]);
    useEffect(() => {
        console.log('post', post);
    }, [post]);
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
                            src={post.image}
                            className="rounded-circle col-1 me-2"
                        />
                        <p className="fw-bold m-0 me-2">{post.full_name}</p>
                        <p className=" m-0">
                            <CalendarOutlined className="me-1" />
                            {post.public_date?.toString().slice(0, 10)}
                        </p>
                    </Flex>
                    <div className="content">{parse(post.content)}</div>
                </Card>
                <Flex className="col-4 ps-3" vertical>
                    <Card
                        title={'Bài viết liên quan'}
                        className="w-full"
                    ></Card>
                </Flex>
            </Flex>
        </div>
    );
};
export default PostDetail;
