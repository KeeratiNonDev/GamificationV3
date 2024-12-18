'use client';
import React from 'react';
import { FileImageOutlined, EditOutlined } from '@ant-design/icons';
import { InputFormField } from '../inputs/text.input';
import { LanguageDropdown } from './LanguageDropDown';
import { useLanguage } from '@/context/LanguageContext';

export interface WinPageSettingProps {
    prefix?: string;
}

export const WinPageSetting: React.FC<WinPageSettingProps> = ({ prefix = '' }) => {
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
                            <span>Win Header Image</span>
                        </div>
                        <InputFormField
                            name={`${prefix}.winHeaderImage.${lang}`}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <EditOutlined />
                            <span>Win Description</span>
                        </div>
                        <InputFormField
                            name={`${prefix}.winDescription.${lang}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
