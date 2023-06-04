import { Configuration, OpenAIApi } from 'openai';
import { getEnvVariable } from '../../utils';
import { generatePrompt } from './prompt';

const configuration = new Configuration({
	apiKey: getEnvVariable('OPENAI_API_KEY')
});

let openaiClient = new OpenAIApi(configuration);

const getClient = (): OpenAIApi => {
	if (!openaiClient) {
		openaiClient = new OpenAIApi(configuration);
	}
	return openaiClient;
}

export const extractInformationFromRawText = async (tsSchema: string, rawText: string) => {
	const client = getClient();
	try {
		const completion = await client.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: generatePrompt(tsSchema, rawText),
		});
		const optimalChoice = completion.data.choices.find((choice) => choice.message && choice.message.role === 'assistant');
		if (!optimalChoice) {
			return "";
		} else {
			return optimalChoice.message?.content ?? "";
		}
	} catch (e: any) {
		if (e.response) {
			console.error(e.response.status, e.response.data);
		} else {
			console.error(`Error with OpenAI API request`, e.message);
		}
		return "";
	}
}
