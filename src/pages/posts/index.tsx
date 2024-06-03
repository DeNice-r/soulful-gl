import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { CustomPagination } from '~/components/utils/CustomPagination';
import { Post } from '~/components/Post';
import { Layout } from '~/components/common/Layout';
import { Spinner } from '~/components/ui/spinner';
import { api, type RouterOutputs } from '~/utils/api';
import { DEFAULT_POSTS_LAYOUT_LIMIT } from '~/utils/constants';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Search } from 'lucide-react';

const Posts: React.FC = () => {
    const router = useRouter();

    const [query, setQuery] = useState<string | undefined>(
        router.query.query as string,
    );

    const limit = router.query.limit
        ? Number(router.query.limit)
        : DEFAULT_POSTS_LAYOUT_LIMIT;

    const page = router.query.page ? Number(router.query.page) : 1;

    const posts = api.post.list.useQuery({ limit, page, query });

    const total = posts.data?.count ? Math.ceil(posts.data.count / limit) : 0;

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

    const PostHelper = (
        post: RouterOutputs['post']['list']['values'][number],
    ) => {
        return (
            <div
                key={post.id}
                className="flex w-full flex-grow justify-center rounded-md bg-neutral-200 shadow-md outline-2 outline-neutral-200 transition-shadow duration-100 ease-in hover:cursor-pointer hover:shadow-xl hover:outline xl:w-5/12"
            >
                <Post variant="posts" post={post} />
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
            <div className="flex w-full flex-col items-center pb-8 md:w-2/3">
                <div className="flex w-full flex-wrap justify-between gap-8 py-10 text-slate-800">
                    <div className="flex w-full flex-col items-center gap-8">
                        <h3 className="w-full text-center font-bold">
                            Дописи з порадами щодо ментального здоров&apos;я
                        </h3>
                        <Label className="relative flex w-2/3">
                            <Input
                                type="search"
                                name="query"
                                id="default-search"
                                placeholder="Шукати дописи..."
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
                    {posts?.data?.values
                        .slice(0, Math.ceil(limit / 2))
                        .map((post) => PostHelper(post))}
                    {!!recommendations.data?.length &&
                        !recommendations.isFetching && (
                            <div className="flex w-full flex-col gap-10 rounded-2xl bg-neutral-200 px-10 py-14 shadow-lg">
                                <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
                                    <h2 className="text-center font-bold">
                                        Рекомендації для гарного настрою
                                    </h2>
                                    <SunIcon />
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
                    {posts?.data?.values
                        .slice(Math.round(limit / 2))
                        .map((post) => PostHelper(post))}
                    {!posts.data && (
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

function SunIcon() {
    return (
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 500 500"
        >
            <style type="text/css">{`.st0{fill:#f2cb1d;}`}</style>
            <path
                className="st0"
                d="M365.413208,250c0,63.7409668-51.6722412,115.413208-115.413208,115.413208 S134.586792,313.7409668,134.586792,250S186.2590332,134.586792,250,134.586792S365.413208,186.2590332,365.413208,250z M250,113.027832c5.0908203,0,9.2177734-4.1269531,9.2177734-9.2177734V40.4458008 c0-5.0908203-4.1269531-9.2177734-9.2177734-9.2177734s-9.2177734,4.1269531-9.2177734,9.2177734v63.3642578 C240.7822266,108.9008789,244.9091797,113.027832,250,113.027832z M156.6142578,137.1479492 c1.8037109,2.4829102,4.6142578,3.8007813,7.465332,3.8007813c1.878418,0,3.7744141-0.5727539,5.4101563-1.7612305 c4.1186523-2.9921875,5.0317383-8.7568359,2.0395508-12.8754883L134.284668,75.0493164 c-2.9912109-4.1181641-8.7563477-5.0307617-12.8754883-2.0395508c-4.1186523,2.9921875-5.0317383,8.7568359-2.0395508,12.8754883 L156.6142578,137.1479492z M47.8535156,194.0107422l60.2626953,19.5805664 c0.9467773,0.3076172,1.90625,0.4541016,2.8505859,0.4541016c3.8852539,0,7.4990234-2.4770508,8.7646484-6.3720703 c1.5732422-4.8417969-1.0761719-10.0424805-5.9179688-11.6152344l-60.2626953-19.5805664 c-4.8408203-1.5717773-10.0415039,1.0766602-11.6152344,5.9179688 C40.3623047,187.2373047,43.0117188,192.4379883,47.8535156,194.0107422z M119.7314453,292.3261719 c-1.5737305-4.8417969-6.7744141-7.4931641-11.6152344-5.9179688l-60.2626953,19.5810547 c-4.8417969,1.5732422-7.4912109,6.7734375-5.9179688,11.6152344c1.265625,3.8955078,4.8789063,6.3720703,8.7646484,6.3720703 c0.9438477,0,1.9042969-0.1464844,2.8505859-0.4541016l60.2626953-19.5810547 C118.6552734,302.3681641,121.3046875,297.1679688,119.7314453,292.3261719z M169.4897461,360.8134766 c-4.1201172-2.9951172-9.8833008-2.0800781-12.8754883,2.0390625l-37.2446289,51.2626953 c-2.9921875,4.1181641-2.0791016,9.8828125,2.0395508,12.875c1.6362305,1.1894531,3.5317383,1.7617188,5.4101563,1.7617188 c2.8505859,0,5.6616211-1.3183594,7.465332-3.8007813l37.2446289-51.2626953 C174.5214844,369.5703125,173.6083984,363.8056641,169.4897461,360.8134766z M250,386.9726563 c-5.0908203,0-9.2177734,4.1269531-9.2177734,9.2177734v63.3632813c0,5.0908203,4.1269531,9.2177734,9.2177734,9.2177734 s9.2177734-4.1269531,9.2177734-9.2177734v-63.3632813C259.2177734,391.0996094,255.0908203,386.9726563,250,386.9726563z  M343.3857422,362.8525391c-2.9921875-4.1181641-8.7568359-5.0351563-12.875-2.0390625 c-4.1191406,2.9921875-5.0322266,8.7568359-2.0390625,12.875l37.2441406,51.2626953 c1.8037109,2.4824219,4.6142578,3.8007813,7.4648438,3.8007813c1.8779297,0,3.7744141-0.5722656,5.4101563-1.7607422 c4.1191406-2.9931641,5.0322266-8.7578125,2.0390625-12.8759766L343.3857422,362.8525391z M452.1464844,305.9892578 l-60.2626953-19.5810547c-4.8398438-1.5722656-10.0419922,1.0761719-11.6152344,5.9179688 s1.0761719,10.0419922,5.9179688,11.6152344l60.2626953,19.5810547c0.9462891,0.3076172,1.90625,0.4541016,2.8505859,0.4541016 c3.8857422,0,7.4990234-2.4765625,8.7646484-6.3720703C459.6376953,312.7626953,456.9882813,307.5625,452.1464844,305.9892578z M380.2685547,207.6733398c1.265625,3.8955078,4.8789063,6.3720703,8.7646484,6.3720703 c0.9443359,0,1.9042969-0.1464844,2.8505859-0.4541016l60.2626953-19.5805664 c4.8417969-1.5727539,7.4912109-6.7734375,5.9179688-11.6152344c-1.5732422-4.8422852-6.7763672-7.4902344-11.6152344-5.9179688 l-60.2626953,19.5805664C381.3447266,197.6308594,378.6953125,202.831543,380.2685547,207.6733398z M330.5107422,139.1875 c1.6357422,1.1889648,3.53125,1.7612305,5.4101563,1.7612305c2.8505859,0,5.6621094-1.3183594,7.4648438-3.8007813 l37.2441406-51.2626953c2.9931641-4.1186523,2.0800781-9.8833008-2.0390625-12.8754883 c-4.1181641-2.9931641-9.8847656-2.0795898-12.875,2.0395508l-37.2441406,51.2626953 C325.4785156,130.4306641,326.3916016,136.1953125,330.5107422,139.1875z"
            />
        </svg>
    );
}

export default Posts;
