import React, {ReactNode} from "react";
import Layout from "./Layout";

type Props = {
    children: ReactNode;
};

const ConstrainedLayout: React.FC<Props> = (props) => (
    <>
        <Layout>
            {props.children}
        </Layout>
        <style jsx global>{`
          .layout {
            padding: 0 2rem;
          }
        `}</style>
    </>
);

export default ConstrainedLayout;
