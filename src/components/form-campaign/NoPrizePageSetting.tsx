'use client';
import React from 'react';
import { FileImageOutlined, EditOutlined } from '@ant-design/icons';
import { InputFormField } from '../inputs/text.input';
import { LanguageDropdown } from './LanguageDropDown';
import { useLanguage } from '@/context/LanguageContext';

export interface NoPrizePageSettingProps {
    prefix?: string;
}

export const NoPrizePageSetting: React.FC<NoPrizePageSettingProps> = ({ prefix = '' }) => {
    const { lang } = useLanguage();

    return (
        <div className="relative w-full">
            <div className="flex justify-end">
                <LanguageDropdown />
            </div>
            <div className="flex flex-col xl:flex-row gap-10">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <FileImageOutlined />
                            <span>NoPrize Header Image</span>
                        </div>
                        <InputFormField
                            name={`${prefix}.noPrizeHeaderImage.${lang}`}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <EditOutlined />
                            <span>NoPrize Description</span>
                        </div>
                        <InputFormField
                            name={`${prefix}.noPrizeDescription.${lang}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};