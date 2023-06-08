import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';
import { createReadStream } from 'fs';
import { sleep } from '../../utils';
import { getEnvVariable } from '../../utils/environment';
import { GetReadResultResponse, ReadInStreamResponse, ReadResult } from '@azure/cognitiveservices-computervision/esm/models';
import { isNil } from 'lodash';

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

export const extractTextFromFile = async (filepath: string): Promise<ReadResult[]> => {
	const client = getClient();
	const initialResult: ReadInStreamResponse = await client.readInStream(() => createReadStream(filepath));
	const operation = initialResult.operationLocation.split('/').slice(-1)[0];
	let finalResult: GetReadResultResponse | null = null;

	while (isNil(finalResult) || finalResult.status !== "succeeded") {
		await sleep(1000);
		finalResult = await client.getReadResult(operation);
	}

	return finalResult.analyzeResult?.readResults ?? [];
}