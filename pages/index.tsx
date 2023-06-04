import type { NextPage } from "next";
import Head from "next/head";
import SingleFileUploadForm from "../components/SingleUploadForm";
import OutputPanel from "../components/OutputPanel";
import { useState } from "react";

const Home: NextPage = () => {
	const [output, setOutput] = useState<string | null>(null);

  return (
    <div>
      <Head>
        <title>File uploader</title>
        <meta name="description" content="File uploader" />
      </Head>

      <main className="py-10">
				<div className="w-full flex flex-row align-center justify-center">
					<div className="w-full max-w-3xl px-3">
						<h1 className="mb-10 text-3xl font-bold text-gray-900">
							Upload your files
						</h1>

						<div className="space-y-10">
							<div>
								<SingleFileUploadForm
									onUploadStart={() => setOutput(null)}
									onUploadFinish={(output: string) => setOutput(output)}
								/>
							</div>
							{/* <div>
								<h2 className="mb-3 text-xl font-bold text-gray-900">
									Multiple File Upload Form
								</h2>
								<MultipleFileUploadForm />
							</div> */}
						</div>
					</div>
					<OutputPanel text={output}/>
				</div>
      </main>

      <footer>
        <div className="w-full max-w-3xl px-3 mx-auto text-center">
          <p>All rights reserved, @Cohesive 2023</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
