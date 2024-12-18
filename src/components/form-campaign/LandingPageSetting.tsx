'use client';
import React from 'react';
import {
    FileImageOutlined,
    EditOutlined,
    BgColorsOutlined,
} from '@ant-design/icons';
import { LanguageDropdown } from './LanguageDropDown';
import { useLanguage } from '@/context/LanguageContext';
import { InputFormField } from '../inputs/text.input';
import { ColorPickerFormField } from '../inputs/color.box.form.field';

export interface LandingPageSettingProps {
    prefix?: string;
}

export const LandingPageSetting: React.FC<LandingPageSettingProps> = ({ prefix = '' }) => {
    const { lang } = useLanguage();

    return (
        <div className="relative w-full">
            <div className="flex justify-end">
                <LanguageDropdown />
            </div>
            <div className="flex flex-col xl:flex-row gap-10">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <FileImageOutlined />
                                <span>Header Image</span>
                            </div>
                            <InputFormField
                                name={`${prefix}.landingHeaderImage.${lang}`}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <FileImageOutlined />
                                <span>Footer Image</span>
                            </div>
                            <InputFormField
                                name={`${prefix}.landingFooterImage.${lang}`}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <EditOutlined />
                            Terms & Conditions
                        </div>
                        <InputFormField name={`${prefix}.landingTermsAndConditions.${lang}`}/>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col 2xl:flex-row gap-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2">
                                <BgColorsOutlined />
                                Body & Info Color
                            </div>
                            <ColorPickerFormField name={`${prefix}.landingBackgroundColor.${lang}`} label="Background" />
                            <ColorPickerFormField name={`${prefix}.landingTextColor.${lang}`} label="Text" />
                            <ColorPickerFormField name={`${prefix}.landingTextBoxColor.${lang}`} label="TextBox" />
                            <ColorPickerFormField name={`${prefix}.landingTextPlayColor.${lang}`} label="Play Text" />
                            <ColorPickerFormField name={`${prefix}.landingCreditTextColor.${lang}`} label="Credit Text" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2">
                                <BgColorsOutlined />
                                Term & Condition Color
                            </div>
                            <ColorPickerFormField name={`${prefix}.landingTextBoxTermsColor.${lang}`} label="Textbox" />
                            <ColorPickerFormField name={`${prefix}.landingTextBoxBorderTermsColor.${lang}`} label="Textbox Border" />
                            <ColorPickerFormField name={`${prefix}.landingTermsAndConditionsColor.${lang}`} label="Term & Condition" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
