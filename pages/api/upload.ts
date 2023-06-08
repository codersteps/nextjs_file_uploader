import type { NextApiRequest, NextApiResponse } from "next";
import { fileToText, parseTextToJSON } from "../../backend/pdf";
import { FormidableError, parseForm } from "../../backend/utils/parse-form";
import { head } from "lodash";
import { ExtractedData } from "../../common/types/rpc";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<{
    data: ExtractedData | null;
    error: string | null;
  }>
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
		const field = Array.isArray(fields["tsSchema"]) ? head(fields["tsSchema"]) : fields["tsSchema"];
		const data = await fileToText(Array.isArray(filepath) ? filepath[0] : filepath, field ?? null);
    res.status(200).json({
      data,
      error: null,
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
