import type { NextPage } from "next";
import Head from "next/head";
import MultipleFileUploadForm from "../components/MultipleFileUploadForm";
import SingleFileUploadForm from "../components/SingleUploadForm";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>File uploader</title>
        <meta name="description" content="File uploader" />
      </Head>

      <main className="py-10">
        <div className="w-full max-w-3xl px-3 mx-auto">
          <h1 className="mb-10 text-3xl font-bold text-gray-900">
            Upload your files
          </h1>

          <div className="space-y-10">
            <div>
              <h2 className="mb-3 text-xl font-bold text-gray-900">
                Single File Upload Form
              </h2>
              <SingleFileUploadForm />
            </div>
            <div>
              <h2 className="mb-3 text-xl font-bold text-gray-900">
                Multiple File Upload Form
              </h2>
              <MultipleFileUploadForm />
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="w-full max-w-3xl px-3 mx-auto">
          <p>All right reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
