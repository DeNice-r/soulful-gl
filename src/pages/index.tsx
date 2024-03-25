import React from 'react';
import Post from '../components/Post';
import ConstrainedLayout from '../components/ConstrainedLayout';
import { api } from '~/utils/api';

const Blog: React.FC = () => {
    const posts = api.post.get.useQuery();
    return (
        <ConstrainedLayout>
            <div className="page">
                <h1>Public Feed</h1>
                <main>
                    {posts.data &&
                        posts.data.map((post) => (
                            <div key={post.id} className="post">
                                <Post post={post} />
                            </div>
                        ))}
                </main>
            </div>
            <style jsx>{`
                .post {
                    background: white;
                    transition: box-shadow 0.1s ease-in;
                }

                .post:hover {
                    box-shadow: 1px 1px 3px #aaa;
                }

                .post + .post {
                    margin-top: 2rem;
                }
            `}</style>
        </ConstrainedLayout>
    );
};

export default Blog;
