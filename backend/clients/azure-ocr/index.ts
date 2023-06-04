import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';
import { createReadStream } from 'fs';
import { sleep } from '../../utils';
import { getEnvVariable } from '../../utils/environment';

const key = getEnvVariable('AZURE_COMPUTER_VISION_KEY');
const endpoint = getEnvVariable('AZURE_COMPUTER_VISION_ENDPOINT');

let computerVisionClient = new ComputerVisionClient(
	new ApiKeyCredentials({
		inHeader: {
			'Ocp-Apim-Subscription-Key': key
		}
	}),
	endpoint
);

const getClient = (): ComputerVisionClient => {
	if (!computerVisionClient) {
		computerVisionClient = new ComputerVisionClient(
			new ApiKeyCredentials({
				inHeader: {
					'Ocp-Apim-Subscription-Key': key
				}
			}),
			endpoint
		);
	}
	return computerVisionClient;
}

export const extractTextFromFile = async (filepath: string): Promise<any[]> => {
	const client = getClient();
	let result: any = await client.readInStream(() => createReadStream(filepath));
	let operation = result.operationLocation.split('/').slice(-1)[0];

	while (result.status !== "succeeded") {
		await sleep(1000);
		result = await client.getReadResult(operation);
	}

	return result.analyzeResult.readResults;
}