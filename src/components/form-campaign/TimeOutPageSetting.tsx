'use client';
import React from 'react';
import { FileImageOutlined, EditOutlined } from '@ant-design/icons';
import { InputFormField } from '../inputs/text.input';
import { LanguageDropdown } from './LanguageDropDown';
import { useLanguage } from '@/context/LanguageContext';

export interface TimeOutPageSettingProps {
    prefix?: string;
}

export const TimeOutPageSetting: React.FC<TimeOutPageSettingProps> = ({ prefix = '' }) => {
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
                            <span>TimeOut Header Image</span>
                        </div>
                        <InputFormField
                            name={`${prefix}.timeOutHeaderImage.${lang}`}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <EditOutlined />
                            <span>TimeOut Description</span>
                        </div>
                        <InputFormField
                            name={`${prefix}.timeOutDescription.${lang}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
