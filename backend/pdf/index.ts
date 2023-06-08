import { compact, head, last } from 'lodash';
import { extractTextFromFile } from '../clients/azure-ocr';
import { extractInformationFromRawText } from '../clients/openai';
import natural from 'natural';
import { ReadResult } from '@azure/cognitiveservices-computervision/esm/models';
import { MAX_GPT_3_TURBO_TOKEN_LENGTH } from '../utils/contants';
import { ExtractedData } from '../../common/types/rpc';

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

interface Page {
	content: string;
	tokenCount: number;
}

interface MergedPage {
	content: string;
	tokenCount: number;
	pageRange: number[];
}

export const fileToText = async (filepath: string, tsSchema: string | null): Promise<ExtractedData> => {
	const readResults = await extractTextFromFile(filepath);
	const pages = sanitizeOCRResults(readResults);
	const mergedPages = mergePages(pages);
	const result = await Promise.all(
		mergedPages.map(
			async (page) => {
				const extraction = await extractInformationFromRawText(tsSchema ?? INVOICE_TS_SCHEMA, page.content);
				return {
					pageRange: page.pageRange,
					extraction: parseTextToJSON(extraction)
				}
			}
		)
	);
	return {
		data: result
	};
}

const mergePages = (pages: Page[]): MergedPage[] => {
	const firstPage = head(pages);
	if (!firstPage) return [];
	
	// Greedily merge pages until we hit the token limit.
	const mergedPages: MergedPage[] = [];
	let currentPage: MergedPage = {
		...firstPage,
		pageRange: [0]
	}
	let pageIndex = 1;
	while (pageIndex < pages.length) {
		const page = pages[pageIndex];
		const totalTokenCount = currentPage.tokenCount + page.tokenCount;
		if (totalTokenCount > MAX_GPT_3_TURBO_TOKEN_LENGTH) {
			mergedPages.push(currentPage);
			currentPage = {
				...page,
				pageRange: [pageIndex]
			}
		} else {
			currentPage.content += '\n' + page.content;
			currentPage.tokenCount += page.tokenCount;
			currentPage.pageRange.push(pageIndex);
		}
		pageIndex++;
	}
	mergedPages.push(currentPage);
	return mergedPages;
}

const sanitizePage = (page: string): Page => {
	// Remove stop words and lemmatize words (going -> go)
	const tokenizers = new natural.WordTokenizer();
	const tokens = tokenizers.tokenize(page) ?? [];
	return {
		content: page,
		tokenCount: tokens.length
	};
}

const sanitizeOCRResults = (readResults: ReadResult[]): Page[] => {
	const pages = compact(
	readResults.map(
		(result) => {
			if (result.lines.length) {
				const page = result.lines.map((line: any) => {
					const lineStr = line.words.map((w: any) => w.text).join(' ');
					return lineStr;
				}).join('\n');
				return sanitizePage(page);
			} else {
				return null;
			}
		}
	));
	return pages;
}

export const parseTextToJSON = (text: string) => {
	try {
		const starting = text.indexOf('{');
		const ending = text.lastIndexOf('}');
		return JSON.parse(text.substring(starting, ending + 1));
	} catch (e: any) {
		console.error(e);
		return null;
	}
}

