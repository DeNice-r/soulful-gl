import type React from 'react';
import { Layout } from '~/components/common/Layout';
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

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
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <BreadcrumbEllipsis />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>
                                            Documentation
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Themes
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            GitHub
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
                    <div className="flex w-full flex-wrap justify-between gap-8">
                        <Button className="flex h-14 w-64 rounded-3xl bg-neutral-300 drop-shadow-md hover:bg-neutral-300/60 active:shadow-inner active:drop-shadow-none"></Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default Knowledge;
