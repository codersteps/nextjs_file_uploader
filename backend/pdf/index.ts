import { extractTextFromFile } from '../clients/azure-ocr';
import { extractInformationFromRawText } from '../clients/openai';

// TODO (nam): Collect schema from end user;
const INVOICE_TS_SCHEMA = `
{
	lineItems: {
		item: string; // name of the billed item
		quantity: string; // quantity of the billed item
		unitPrice: string; // unit price of the billed item
	}[],
	subtotal: string; // total amount without tax
	tax: string; // tax amount
	total: string // total amount due
}
`;

export const fileToText = async (filepath: string, tsSchema: string | null): Promise<string> => {
	const readResults = await extractTextFromFile(filepath);
	const rawText = sanitizeOCRResults(readResults);
	return await extractInformationFromRawText(tsSchema ?? INVOICE_TS_SCHEMA, rawText);
}

const sanitizeOCRResults = (readResults: any[]) => {
	console.log("Recognized text:");
	const pages = readResults.map(
		(result, page) => {
			if (readResults.length > 1) {
				console.log(`==== Page: ${page}`);
			}
			if (result.lines.length) {
				const output = result.lines.map((line: any) => {
					const lineStr = line.words.map((w: any) => w.text).join(' ');
					console.log(lineStr);
					return lineStr;
				}).join('\n');
				return output;
			} else {
				console.log('No recognized text.');
				return '';
			}
		}
	).join('\n\n');
	return pages;
}

export const parseTextToJSON = (text: string) => {
	try {
		console.log("Attempting to parse", text);
		const starting = text.indexOf('{');
		const ending = text.lastIndexOf('}');
		return JSON.parse(text.substring(starting, ending + 1));
	} catch (e: any) {
		console.error(e);
		return null;
	}
}

