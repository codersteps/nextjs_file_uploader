import { ChatCompletionRequestMessage } from "openai";

export const generatePrompt = (tsSchema: string, rawText: string): ChatCompletionRequestMessage[] => {
	return [
		{
			'role': 'system',
			'content': `You are a smart assitant. Given a Typescript schema and a text blurb, generate JSON object(s) with
			relevant information from the text blurb. It's important to always return a JSON object following the given schema.
			Leave fields empty if no relevant information is found.`
		},
		{
			'role': 'user',
			'content': `
				Schema: 
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

				Text:
					1
					Rainbow Roll
					$15.95
					1
					Spider Roll
					$14.95
					1
					750ml Hakutsuru
					$39.95
					SUB-TOTAL
					$70.85
					TAX
					$5.31
					PAYMENT TYPE
					VISA Card
					APP# : 11278860
					REF# : 18623058
					REC# : 0018
					TOTAL DUE
					$76.16
					TIP
					TOTAL
			`
		},
		{
			'role': 'assistant',
			'content': `
				{
					"lineItems": [
						{ "item": "Rainbow Roll", "quantity": "1", "unitPrice": "$15.95" },
						{ "item": "Spider Roll", "quantity": "1", "unitPrice": "$14.95" },
						{ "item": "750ml Hakutsuru", "quantity": "1", "unitPrice": "$39.95" }
					],
					"subtotal": "$70.85",
					"tax": "$5.31",
					"total": "$76.16"
				}
			`
		},
		{
			'role': 'user',
			'content': `
				Schema:
				${tsSchema}

				Text:
				${rawText}
			`
		},
	];
}
