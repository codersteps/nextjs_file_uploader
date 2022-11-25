import Image from "next/image";
import { ChangeEvent, useState } from "react";

const MultipleFileUploadForm = () => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const onFilesUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (!fileInput.files) {
      alert("No files were chosen");
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Files list is empty");
      return;
    }

    /** Files validation */
    const validFiles: File[] = [];
    for (let i = 0; i < fileInput.files.length; i++) {
      const file = fileInput.files[i];

      if (!file.type.startsWith("image")) {
        alert(`File with idx: ${i} is invalid`);
        continue;
      }

      validFiles.push(file);
    }

    if (!validFiles.length) {
      alert("No valid files were chosen");
      return;
    }

    /** Uploading files to the server */
    try {
      var formData = new FormData();
      validFiles.forEach((file) => formData.append("media", file));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const {
        data,
        error,
      }: {
        data: {
          url: string | string[];
        } | null;
        error: string | null;
      } = await res.json();

      if (error || !data) {
        alert(error || "Sorry! something went wrong.");
        return;
      }

      setPreviewUrls(
        validFiles.map((validFile) => URL.createObjectURL(validFile))
      ); // we will use this to show the preview of the images

      /** Reset file input */
      fileInput.type = "text";
      fileInput.type = "file";

      console.log("Files were uploaded successfylly:", data);
    } catch (error) {
      console.error(error);
      alert("Sorry! something went wrong.");
    }
  };

  return (
    <form
      className="w-full p-3 border border-gray-500 border-dashed"
      onSubmit={(e) => e.preventDefault()}
    >
      {previewUrls.length > 0 ? (
        <>
          <button
            onClick={() => setPreviewUrls([])}
            className="mb-3 text-sm font-medium text-gray-500 transition-colors duration-300 hover:text-gray-900"
          >
            Clear Previews
          </button>

          <div className="flex flex-wrap justify-start">
            {previewUrls.map((previewUrl, idx) => (
              <div key={idx} className="w-full p-1.5 md:w-1/2">
                <Image
                  alt="file uploader preview"
                  objectFit="cover"
                  src={previewUrl}
                  width={320}
                  height={218}
                  layout="responsive"
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <label className="flex flex-col items-center justify-center h-full py-8 transition-colors duration-150 cursor-pointer hover:text-gray-600">
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
          <strong className="text-sm font-medium">Select images</strong>
          <input
            className="block w-0 h-0"
            name="file"
            type="file"
            onChange={onFilesUploadChange}
            multiple
          />
        </label>
      )}
    </form>
  );
};

export default MultipleFileUploadForm;
