import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { CustomPagination } from '~/components/utils/CustomPagination';
import { Layout } from '~/components/common/Layout';
import { Spinner } from '~/components/ui/spinner';
import { api, type RouterOutputs } from '~/utils/api';
import { DEFAULT_POSTS_LAYOUT_LIMIT } from '~/utils/constants';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Search, Sun } from 'lucide-react';
import Head from 'next/head';
import { Exercise } from '~/components/Exercise';

const Exercises: React.FC = () => {
    const router = useRouter();

    const [query, setQuery] = useState<string | undefined>(
        router.query.query as string,
    );

    const limit = router.query.limit
        ? Number(router.query.limit)
        : DEFAULT_POSTS_LAYOUT_LIMIT;

    const page = router.query.page ? Number(router.query.page) : 1;

    const exercises = api.exercise.list.useQuery({ limit, page, query });

    const total = exercises.data?.count
        ? Math.ceil(exercises.data.count / limit)
        : 0;

    const recommendations = api.recommendation.random.useQuery();

    const goToPage = (page: number) => {
        const currentPath = router.pathname;
        void recommendations.refetch();
        const currentQuery = { ...router.query, page };
        void router.push({
            pathname: currentPath,
            query: currentQuery,
        });
    };

    const ExerciseHelper = (
        exercise: RouterOutputs['exercise']['list']['values'][number],
    ) => {
        return (
            <div
                key={exercise.id}
                className="flex w-full flex-grow justify-center rounded-md bg-neutral-200 shadow-md outline-2 outline-neutral-200 transition-shadow duration-100 ease-in hover:cursor-pointer hover:shadow-xl hover:outline xl:w-5/12"
            >
                <Exercise variant="exercise" exercise={exercise} />
            </div>
        );
    };

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    function debounce(fn: () => void, ms: number) {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(fn, ms);
    }
    return (
        <Layout className="bg-homepage-cover">
            <Head>
                <title>Вправи</title>
            </Head>
            <div className="flex w-full flex-col items-center pb-8 md:w-2/3">
                <div className="flex w-full flex-wrap justify-between gap-8 py-10 text-slate-800">
                    <div className="flex w-full flex-col items-center gap-8">
                        <h3 className="w-full text-center font-bold">
                            Вправи для покращення психологічного стану
                        </h3>
                        <Label className="relative flex w-2/3">
                            <Input
                                type="search"
                                name="query"
                                id="default-search"
                                placeholder="Шукати вправи..."
                                className="ps-14"
                                onChange={(e) =>
                                    debounce(
                                        () => setQuery(e.target.value),
                                        1000,
                                    )
                                }
                                defaultValue={query}
                            />
                            <Search className="absolute start-4 top-0 flex h-full w-5 items-center text-neutral-500" />
                        </Label>
                    </div>
                    {exercises?.data?.values
                        .slice(0, Math.ceil(limit / 2))
                        .map((exercise) => ExerciseHelper(exercise))}
                    {!!recommendations.data?.length &&
                        !recommendations.isFetching && (
                            <div className="flex w-full flex-col gap-10 rounded-2xl bg-neutral-200 px-10 py-14 shadow-lg">
                                <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
                                    <h2 className="text-center font-bold">
                                        Рекомендації для гарного настрою
                                    </h2>
                                    <Sun className="h-14 w-14 fill-amber-500 text-amber-500" />
                                </div>
                                <div className="flex w-full flex-wrap gap-8 text-justify font-semibold">
                                    {recommendations?.data?.map(
                                        (recommendation) => (
                                            <article
                                                key={recommendation.id}
                                                className="flex min-w-52 flex-grow basis-1/5 flex-col items-center justify-center gap-4 rounded-xl bg-neutral-200 p-10 shadow-inner"
                                            >
                                                <h1 className="font-bold">
                                                    {recommendation.title}
                                                </h1>
                                                <p>
                                                    {recommendation.description}
                                                </p>
                                            </article>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    {exercises?.data?.values
                        .slice(Math.round(limit / 2))
                        .map((exercise) => ExerciseHelper(exercise))}
                    {!exercises.data && (
                        <div className="h-full w-full">
                            <Spinner size="large" />
                        </div>
                    )}
                </div>
                <CustomPagination
                    page={page}
                    total={total}
                    goToPage={goToPage}
                />
            </div>
        </Layout>
    );
};
export default Exercises;
