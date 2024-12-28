import { DummyKaryaClient } from "./DummyClient";
import { ClientConfig } from 'karya-client/client/config.js';
import { KaryaRestClient } from 'karya-client/client/karya-rest-client.js';
import { Protocol } from "karya-client/entities/constants";

function createKaryaRestClient(serverUrl) {
    if (!serverUrl) {
        throw new Error("Invalid server URL.");
    }

    const url = new URL(serverUrl);
    const protocol = url.protocol === 'https:' ? Protocol.HTTPS : Protocol.HTTP;
    const config = new ClientConfig({
        host: url.hostname,
        protocol: protocol,
        baseUrl: serverUrl,
    });

    return new KaryaRestClient(config);
}

console.log(process.env.REACT_APP_SERVER_URL)

const karyaClient = process.env.REACT_APP_SERVER_URL
    ? createKaryaRestClient(process.env.REACT_APP_SERVER_URL)
    : new DummyKaryaClient();

export default karyaClient;
