import { sendAuthRequest } from '../../api/utils/auth';
import Request from '../../stores/lib/Request';
import apiBase from '../../api/apiBase';

const debug = require('debug')('Ferdi:feature:planSelection:api');

export const planSelectionApi = {
  downgrade: async () => {
    const url = `${apiBase()}/payment/downgrade`;
    const options = {
      method: 'PUT',
    };
    debug('downgrade UPDATE', url, options);
    const result = await sendAuthRequest(url, options);
    debug('downgrade RESULT', result);
    if (!result.ok) throw result;

    return result.ok;
  },
};

export const downgradeUserRequest = new Request(planSelectionApi, 'downgrade');

export const resetApiRequests = () => {
  downgradeUserRequest.reset();
};
