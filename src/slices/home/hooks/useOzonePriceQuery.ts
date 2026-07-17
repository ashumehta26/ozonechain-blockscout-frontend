// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQuery } from '@tanstack/react-query';

import useFetch from 'src/api/hooks/useFetch';

export type OzonePriceResponse = {
  success: boolean;
  message: string;
  data: number | string;
};

const OZONE_PRICE_URL =
  'https://chain-metrics-backend.ozonescan.com/api/v1/price/ozone';

export default function useOzonePriceQuery() {
  const fetch = useFetch();

  return useQuery<OzonePriceResponse>({
    queryKey: [ 'ozone_price' ],
    queryFn: async() => fetch(OZONE_PRICE_URL),
    placeholderData: {
      success: true,
      message: 'Ozone price fetched successfully',
      data: '-',
    },
    refetchOnMount: false,
  });
}
