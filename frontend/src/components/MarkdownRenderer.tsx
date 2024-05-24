import { Remarkable } from "remarkable";

const md = new Remarkable({
	breaks: true,
});

const MarkdownRenderer = ({ content }: { content: string }) => {
	const markdownToHtml = md.render(content);

	// biome-ignore lint/security/noDangerouslySetInnerHtml: This is a safe use of dangerouslySetInnerHTML
	return <div dangerouslySetInnerHTML={{ __html: markdownToHtml }} />;
};

export default MarkdownRenderer;
