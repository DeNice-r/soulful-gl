import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
    useRef,
} from 'react';
import type * as z from 'zod';
import { type ExerciseStepSchema } from '~/utils/schemas';

interface PageData {
    id: number;
    data: z.infer<typeof ExerciseStepSchema>;
}

interface PageContextProps {
    pages: PageData[];
    pagesRef: React.MutableRefObject<PageData[]>;
    currentPage: number;
    savePageData: (index: number, data: PageData['data']) => void;
    goToPreviousPage: (currentPageData: PageData['data']) => void;
    goToNextPage: (currentPageData: PageData['data']) => void;
    deletePage: (index: number) => void;
    resetPages: (value?: PageData[] | null) => void;
}

const PageContext = createContext<PageContextProps | undefined>(undefined);

export const PageProvider = ({ children }: { children: ReactNode }) => {
    const defaultValue: PageData[] = [
        { id: 1, data: { image: '', title: '', description: '' } },
        {
            id: 2,
            data: { image: '', title: '', description: '', timeSeconds: '' },
        },
    ];
    const pagesRef = useRef<PageData[]>(defaultValue);
    const [currentPage, setCurrentPage] = useState(-1);

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

    const resetPages = (value?: PageData[] | null) => {
        pagesRef.current = value ?? defaultValue;
        setCurrentPage(-1);
        setTimeout(() => setCurrentPage(0), 100);
    };

    return (
        <PageContext.Provider
            value={{
                pages: pagesRef.current,
                pagesRef,
                currentPage,
                savePageData,
                goToPreviousPage,
                goToNextPage,
                deletePage,
                resetPages,
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
