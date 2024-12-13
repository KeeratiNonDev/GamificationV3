import CampaginSettingForm from "@/components/form-campaign/CampaginSettingForm";
import { EditingProvider } from "@/context/EditingContext";
import React from "react";

const page = () => {
  return (
    <EditingProvider>
      <CampaginSettingForm />
    </EditingProvider>
  );
};

export default page;
