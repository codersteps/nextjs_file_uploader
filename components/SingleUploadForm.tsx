import { ChangeEvent, MouseEvent, useState } from "react";
import Spinner from "./Spinner";
import { ExtractedData } from "../common/types/rpc";

interface Props {
	onUploadStart: () => void;
	onUploadFinish: (output: string) => void;
}

const SingleFileUploadForm = ({
	onUploadStart,
	onUploadFinish
}: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [tsSchema, setTsSchema] = useState<string | null>(null);
	const [processing, setProcessing] = useState<boolean>(false);

	const onUpdateSchema = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const newSchema = e.target.value;
		setTsSchema(newSchema);
	}

  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (!fileInput.files) {
      alert("No file was chosen");
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Files list is empty");
      return;
    }

    const file = fileInput.files[0];

    /** Setting file state */
    setFile(file); // we will use the file state, to send it later to the server
    setPreviewUrl(URL.createObjectURL(file)); // we will use this to show the preview of the image

    /** Reset file input */
    e.currentTarget.type = "text";
    e.currentTarget.type = "file";

		onUploadStart();
  };

  const onCancelFile = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!previewUrl && !file) {
      return;
    }
    setFile(null);
    setPreviewUrl(null);
		onUploadStart();
  };

  const onUploadFile = async (e: MouseEvent<HTMLButtonElement>) => {
		setProcessing(true);
    e.preventDefault();

    if (!file) {
      return;
    }

    try {
      var formData = new FormData();
      formData.append("files", file);
			if (tsSchema) {
				formData.append("tsSchema", tsSchema ?? "");
			}

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const {
        data,
        error,
      }: {
        data: ExtractedData | null,
        error: string | null;
      } = await res.json();

      if (error || !data) {
        alert(error || "Sorry! something went wrong.");
        return;
      }
      console.log("File was uploaded successfylly:", data);
			onUploadFinish(JSON.stringify(data, null, 2));
			setProcessing(false);
    } catch (error) {
      console.error(error);
      alert("Sorry! something went wrong.");
			setProcessing(false);
    }
  };

  return (
    <form
      className="w-full p-3 border border-gray-500 border-dashed"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex flex-col gap-1.5 md:py-4">
				<div className="flex mt-4 md:mt-0 md:flex-col justify-center gap-1.5">
					<button
            disabled={!previewUrl}
            onClick={onUploadFile}
            className="w-1/2 px-4 py-3 text-sm font-medium text-white transition-colors duration-300 bg-gray-700 rounded-sm md:w-auto md:text-base disabled:bg-gray-400 hover:bg-gray-600"
          >
            {
							processing ? <Spinner className="w-5 h-5"/> : <span>Upload file</span>
						}
          </button>
          <button
            disabled={!previewUrl}
            onClick={onCancelFile}
            className="w-1/2 px-4 py-3 text-sm font-medium text-white transition-colors duration-300 bg-gray-700 rounded-sm md:w-auto md:text-base disabled:bg-gray-400 hover:bg-gray-600"
          >
            Cancel file
          </button>
        </div>
        <div className="flex flex-col flex-grow">
          {file ? (
            <div className="mx-auto my-8 w-80 text-center">
              {file.name}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-full py-3 transition-colors duration-150 cursor-pointer hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-14 h-14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
              <strong className="text-sm font-medium">{"Select file (.jpg, .jpeg, .png, .pdf)"}</strong>
              <input
                className="block w-0 h-0"
                name="file"
                type="file"
                onChange={onFileUploadChange}
              />
            </label>
          )}
					<label className="flex flex-col items-center justify-center h-full py-3 transition-colors duration-150 cursor-pointer hover:text-gray-600">
						<strong className="text-sm font-medium">{"Specify a custom Typescript schema"}</strong>
						<textarea
							className="h-80 p-10 w-full flex border border-solid border-gray-400 text-start justify-start align-start"
							onChange={onUpdateSchema}
					/>
					</label>
        </div>
      </div>
    </form>
  );
};

export default SingleFileUploadForm;
