interface Props {
	text: string | null;
}

const OutputPanel = ({
	text
}: Props) => {
	return (
		<div className="flex flex-grow flex-col max-w-xl">
			<h2 className="mb-10 text-3xl font-bold text-gray-900 mb-10">
				Output
			</h2>
			<textarea className="p-10 w-full h-full flex-grow flex-col border border-gray-700 bg-slate-100"
				defaultValue={text ?? ""}
			/>
		</div>
	)
}

export default OutputPanel;