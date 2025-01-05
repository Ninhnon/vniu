import React, {createContext, useContext, useMemo, useState} from 'react';

type TInvestSearchContextValue = {
  indexTypeCard?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  filter?: {
    propertyType?: string[];
    apartmentType?: string[];
    landType?: string[];
    availability?: string[];
  };
};

type TInvestSearchContext = {
  value?: TInvestSearchContextValue | null;
  setValue: (value: TInvestSearchContextValue | null) => void;
};

export const InvestSearchContext = createContext<TInvestSearchContext>(
  {} as TInvestSearchContext,
);
export const useInvestSearchContext = () => useContext(InvestSearchContext);

export const InvestSearchContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [value, setValue] = useState<TInvestSearchContextValue | null>({
    search: '',
    indexTypeCard: 0,
    sortBy: '',
    sortOrder: '',
    filter: {
      propertyType: [],
      apartmentType: [],
      landType: [],
      availability: [],
    },
  });
  const contextValue = useMemo(() => ({value, setValue}), [value, setValue]);
  return (
    <InvestSearchContext.Provider value={contextValue}>
      {children}
    </InvestSearchContext.Provider>
  );
};
