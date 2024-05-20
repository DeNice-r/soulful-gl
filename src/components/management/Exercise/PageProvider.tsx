import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from 'react';

interface PageData {
    id: number;
    data: {
        image: string;
        title: string;
        description: string;
    };
}

interface PageContextProps {
    pages: PageData[];
    currentPage: number;
    savePageData: (index: number, data: PageData['data']) => void;
    goToPreviousPage: (currentPageData: PageData['data']) => void;
    goToNextPage: (currentPageData: PageData['data']) => void;
    deletePage: (index: number) => void;
}

const PageContext = createContext<PageContextProps | undefined>(undefined);

export const PageProvider = ({ children }: { children: ReactNode }) => {
    const [pages, setPages] = useState<PageData[]>([
        { id: 1, data: { image: '1', title: '1', description: '1' } },
    ]);
    const [currentPage, setCurrentPage] = useState(0);

    const savePageData = (index: number, data: PageData['data']) => {
        const newPages = [...pages];
        newPages[index] = { ...newPages[index], data };
        setPages(newPages);
    };

    const addNewPage = () => {
        setPages([
            ...pages,
            {
                id: pages.length + 1,
                data: { image: '', title: '', description: '' },
            },
        ]);
        setCurrentPage(pages.length);
    };

    const goToPreviousPage = (currentPageData: PageData['data']) => {
        savePageData(currentPage, currentPageData);
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = (currentPageData: PageData['data']) => {
        savePageData(currentPage, currentPageData);
        if (currentPage < pages.length - 1) {
            setCurrentPage(currentPage + 1);
        } else {
            addNewPage();
        }
    };

    const deletePage = (index: number) => {
        if (index > 0) {
            const newPages = pages.filter(
                (_, pageIndex) => pageIndex !== index,
            );
            setPages(newPages);
            setCurrentPage((prevPage) =>
                prevPage >= index ? prevPage - 1 : prevPage,
            );
        }
    };

    return (
        <PageContext.Provider
            value={{
                pages,
                currentPage,
                savePageData,
                goToPreviousPage,
                goToNextPage,
                deletePage,
            }}
        >
            {children}
        </PageContext.Provider>
    );
};

export const usePageContext = () => {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error('usePageContext must be used within a PageProvider');
    }
    return context;
};
