import React from 'react';
import { Layout } from '~/components/common/Layout';

const QnA: React.FC = () => {
    return (
        <Layout className="bg-homepage-cover">
            <div className="flex w-full flex-col items-center gap-8 py-10 pb-8 md:w-2/3">
                <h3 className="w-full pb-4 text-center font-bold">
                    Запитання та відповіді
                </h3>
                <div className="flex w-full flex-col gap-3 rounded-xl bg-neutral-200 p-10 drop-shadow-xl">
                    <h2 className="font-semibold">Запитання:</h2>
                    <span>
                        Aenean lorem ante, ultricies sit amet ante vitae,
                        volutpat feugiat odio. Sed convallis leo rutrum,
                        scelerisque turpis eu, volutpat nulla. Nulla vitae eros
                        metus. Sed commodo, leo in iaculis aliquet, ligula dui
                        ornare massa, eu egestas leo mi eu arcu.
                    </span>
                    <h2 className="font-semibold">Відповідь:</h2>
                    <span>
                        Proin sed ipsum elementum, laoreet lorem a, ultricies
                        ligula. Etiam nisl magna, facilisis vitae sodales ac,
                        molestie ac sapien. Integer at tortor dictum, luctus
                        justo id, tempor mauris. Quisque ac tristique ex. Donec
                        bibendum, lorem nec condimentum pulvinar, augue magna
                        fringilla dui, nec tincidunt nisi enim ut velit.
                        Curabitur ornare mi risus. Curabitur lacinia, orci vitae
                        efficitur tincidunt, magna ligula imperdiet nibh, vel
                        molestie leo neque quis eros. Quisque facilisis ut
                        sapien sit amet sodales. Donec scelerisque dignissim
                        ipsum, in lacinia felis.
                    </span>
                </div>
            </div>
        </Layout>
    );
};
export default QnA;
