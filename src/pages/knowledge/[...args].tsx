import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '~/components/common/Layout';
import Knowledge from '~/components/knowledge/Knowledge';
import { type EntityData, EntityTypeToPath } from '~/utils/types';

const CURRENT_PATH = 'knowledge';

const KnowledgePage: React.FC = () => {
    const router = useRouter();

    // const [_1, _2, entity, currentEntityId] = router.pathname.split('/').pop();
    const currentEntity = {
        type: EntityTypeToPath[
            router.query?.args?.[0] as keyof typeof EntityTypeToPath
        ],
        id: router.query?.args?.[1] ?? null,
    };

    function setCurrentEntity(currentEntity: EntityData) {
        void router.push(
            `/${CURRENT_PATH}/${currentEntity?.type[0]}/${currentEntity?.id ?? ''}`,
        );
    }

    return (
        <Layout footer={false} className="bg-knowledge-cover">
            <Head>
                <title>База знань</title>
            </Head>
            <div className="flex w-2/3 flex-col items-center gap-10 py-12 text-slate-800">
                <Knowledge
                    {...{
                        currentEntity,
                        setCurrentEntity,
                    }}
                />
            </div>
        </Layout>
    );
};

export default KnowledgePage;
