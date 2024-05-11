import type React from 'react';
import { Icon } from '~/components/common/Icon';
import { Layout } from '~/components/common/Layout';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';

const Knowledge: React.FC = () => {
    return (
        <Layout footer={false} className="bg-knowledge-cover">
            <div className="flex w-2/3 flex-col items-center gap-10 py-12 text-slate-800">
                <h3 className="font-bold">База знань</h3>
                <div className="flex h-full w-full flex-col gap-8 rounded-2xl bg-neutral-200 px-16 py-10 drop-shadow-lg">
                    <nav>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">
                                        Home
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/components">
                                        Components
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </nav>
                    <div className="grid w-full grid-cols-auto flex-wrap justify-between gap-8 2xl:grid-cols-4">
                        <Button className="flex h-14 flex-grow justify-start gap-4 rounded-3xl bg-neutral-300 px-6 drop-shadow-md hover:bg-neutral-300/60 active:shadow-inner active:drop-shadow-none">
                            <Icon
                                stroke="#000"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                            />
                            <p className="text-slate-800">Файл</p>
                        </Button>
                        <Button className="flex h-14 flex-grow justify-start gap-4 rounded-3xl bg-neutral-300 px-6 drop-shadow-md hover:bg-neutral-300/60 active:shadow-inner active:drop-shadow-none">
                            <Icon
                                stroke="#000"
                                d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                            />
                            <p className="text-slate-800">Папка</p>
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default Knowledge;
