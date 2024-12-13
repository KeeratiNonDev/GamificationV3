import React from "react";
import { Dropdown, Button } from "antd";
import { useLanguage } from "../../context/LanguageContext";

export const LanguageDropdown: React.FC = () => {
  const { lang, setLang, localeItems } = useLanguage();

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key !== lang) {
      setLang(key);
    }
  };

  return (
    <Dropdown
      menu={{
        items: localeItems,
        onClick: handleMenuClick,
      }}
    >
      <Button>{lang.toUpperCase()}</Button>
    </Dropdown>
  );
};
