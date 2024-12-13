'use client'
import { createContext, useContext, useState, ReactNode } from 'react';

interface EditingContextProps {
    isTimelineEditing: boolean;
    setIsTimelineEditing: (editing: boolean) => void;
}

const EditingContext = createContext<EditingContextProps | undefined>(undefined);

export const EditingProvider = ({ children }: { children: ReactNode }) => {
    const [isTimelineEditing, setIsTimelineEditing] = useState(false);

    return (
        <EditingContext.Provider value={{ isTimelineEditing, setIsTimelineEditing }}>
            {children}
        </EditingContext.Provider>
    );
};

export const useEditing = () => {
    const context = useContext(EditingContext);
    if (!context) {
        throw new Error('useEditing must be used within an EditingProvider');
    }
    return context;
};
