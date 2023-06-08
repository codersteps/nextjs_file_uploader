import { ExtractedData } from "../../../common/types/rpc";

export const postExtractionResult = async (data: ExtractedData, callbackUrl: string) => {
	await fetch(callbackUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
};