import type { NextApiRequest, NextApiResponse } from "next";
import { fileToText, parseTextToJSON } from "../../backend/pdf";
import { FormidableError, parseForm } from "../../backend/utils/parse-form";
import { head } from "lodash";
import { ExtractedData } from "../../common/types/rpc";
import { postExtractionResult } from "../../backend/clients/callback";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({
      data: null,
      error: "Method Not Allowed",
    });
    return;
  }
  // Just after the "Method Not Allowed" code
  try {
    const { fields, files } = await parseForm(req);
    const file = files.files;
    let filepath = Array.isArray(file) ? file.map((f) => f.filepath) : file.filepath;
		const callbackUrl = Array.isArray(fields["callbackUrl"]) ? head(fields["callbackUrl"]) : fields["callbackUrl"];
		const tsSchema = Array.isArray(fields["tsSchema"]) ? head(fields["tsSchema"]) : fields["tsSchema"];
		fileToText({
			filepath: Array.isArray(filepath) ? filepath[0] : filepath,
			tsSchema: tsSchema ?? null,
		})
		.then(async (data: ExtractedData) => {
			if (callbackUrl) {
				await postExtractionResult(data, callbackUrl);
			}
		});
    res.status(200).json({
      message: "File uploaded successfully. Please wait for the result."
    });
  } catch (e) {
    if (e instanceof FormidableError) {
      res.status(e.httpCode || 400).json({ data: null, error: e.message });
    } else {
      console.error(e);
      res.status(500).json({ data: null, error: "Internal Server Error" });
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
