import React, { type ReactNode } from 'react';
import Layout from './Layout';

type Props = {
    children: ReactNode;
};

const ConstrainedLayout: React.FC<Props> = (props) => (
    <>
        <Layout>{props.children}</Layout>
    </>
);

export default ConstrainedLayout;
