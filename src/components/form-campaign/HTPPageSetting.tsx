'use client';
import React from 'react';
import { FileImageOutlined } from '@ant-design/icons';
import { LanguageDropdown } from './LanguageDropDown';
import { useLanguage } from '@/context/LanguageContext';
import { InputFormField } from '../inputs/text.input';

export interface HTPPageProps {
    prefix?: string;
}

export const HTPPage: React.FC<HTPPageProps> = ({ prefix = '' }) => {
    const { lang } = useLanguage();

    return (
        <div>
            <div className="flex justify-end">
                <LanguageDropdown />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <FileImageOutlined />
                    <span>How to play Image</span>
                </div>
                <InputFormField
                    name={`${prefix}.htpImage.${lang}`}
                />
            </div>
        </div>
    );
};
