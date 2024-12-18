'use client';
import React from 'react';
import { FileImageOutlined } from '@ant-design/icons';
import { LanguageDropdown } from './LanguageDropDown';
import { useLanguage } from '@/context/LanguageContext';
import { InputFormField } from '../inputs/text.input';

export interface RankingPageSettingProps {
    prefix?: string;
}

export const RankingPageSetting: React.FC<RankingPageSettingProps> = ({ prefix = '' }) => {
    const { lang } = useLanguage();

    return (
        <div>
            <div className="flex justify-end">
                <LanguageDropdown />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <FileImageOutlined />
                    <span>Ranking Header Image</span>
                </div>
                <InputFormField
                    name={`${prefix}.rankingImage.${lang}`}
                />
            </div>
        </div>
    );
};
