"use client";
import { type PropsWithChildren, useState } from "react";
import { IAnkhCmsConfig } from 'ankh-types';
import { AnkhCmsConfigContext, getConfig } from "../contexts/ConfigContext";

export function AnkhCmsConfigProvider({ children }: PropsWithChildren) {
  const [config, setConfig] = useState<IAnkhCmsConfig>(getConfig());
  const value = { config, setConfig };

  return (
    <>
      <AnkhCmsConfigContext.Provider value={value}>
        {children}
      </AnkhCmsConfigContext.Provider>
    </>
  );
}