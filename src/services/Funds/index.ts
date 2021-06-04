import { mapModId } from '@/utils/utils';
import { request } from 'umi';
import { BussType } from '@/pages/Purchase/components';

export async function fundUnHxList(
  data: QueryRequest<FUND.Entries>,
  headers = { modId: mapModId.funds },
) {
  let url;
  if (data.queryFilter?.bussType === BussType.收款单) {
    url = '/funds/receipt/findsrc';
  } else {
    url = '/bis/payment/getOriginBill';
  }
  return request(url, {
    data,
    headers,
    method: 'POST',
  });
}
