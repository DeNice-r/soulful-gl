import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
    useRef,
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
    const pagesRef = useRef<PageData[]>([
        { id: 1, data: { image: '', title: '', description: '' } },
    ]);
    const [currentPage, setCurrentPage] = useState(0);

    const savePageData = (index: number, data: PageData['data']) => {
        pagesRef.current[index] = { ...pagesRef.current[index], data };
    };

    const goToPreviousPage = (currentPageData: PageData['data']) => {
        savePageData(currentPage, currentPageData);
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = (currentPageData: PageData['data']) => {
        savePageData(currentPage, currentPageData);
        setCurrentPage(currentPage + 1);
    };

    const deletePage = (index: number) => {
        if (index > 0) {
            pagesRef.current = pagesRef.current.filter(
                (_, pageIndex) => pageIndex !== index,
            );

            setCurrentPage((prevPage) =>
                prevPage >= index ? prevPage - 1 : prevPage,
            );
        }
    };

    return (
        <PageContext.Provider
            value={{
                pages: pagesRef.current,
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
