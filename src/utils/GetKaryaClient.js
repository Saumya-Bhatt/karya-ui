import { ClientConfig } from 'karya-client/client/config.js';
import { KaryaRestClient } from 'karya-client/client/karya-rest-client.js';
import { KaryaDummyClient } from 'karya-client/client/karya-dummy-client.js';

function createKaryaRestClient(serverUrl) {
    if (!serverUrl) {
        throw new Error("Invalid server URL.");
    }

    const config = new ClientConfig(new URL(serverUrl));
    console.log(config)
    return new KaryaRestClient(config);
}

const karyaClient = process.env.REACT_APP_SERVER_URL
    ? createKaryaRestClient(process.env.REACT_APP_SERVER_URL)
    : new KaryaDummyClient();

export default karyaClient;
