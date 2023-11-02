import React, { createContext } from "react";

type PageInfo = {
    name: string;
    url: string;
};
const pageInfoContext = createContext<PageInfo | undefined>(undefined);

function PageInfoProvider({
    children,
    value,
}: {
    children: React.ReactNode;
    value?: PageInfo;
}) {
    return (
        <pageInfoContext.Provider value={value}>
            {children}
        </pageInfoContext.Provider>
    );
}

export { pageInfoContext, PageInfoProvider };
