import React from 'react';
import { Footer } from '~/components/common/Footer';
import { Header } from '~/components/common/Header';

const Posts: React.FC = () => {
    return (
        <div className="flex h-screen flex-col justify-between">
            <Header />
            <div className="h-full"></div>
            <Footer />
        </div>
    );
};

export default Posts;
