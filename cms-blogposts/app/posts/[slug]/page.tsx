import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { getPostBySlug, getAllPosts } from "@/lib/contentful";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
	const posts = await getAllPosts();
	return posts.map((post) => ({
		slug: post.fields.slug,
	}));
}

interface BlogPostPageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post) {
		notFound();
	}

	const { title, featuredImage, date, content, tags } = post.fields;

	const imageUrl = featuredImage?.fields?.file?.url
		? `https:${featuredImage.fields.file.url}`
		: null;

	return (
		<article className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
				{/* Navigation Back Link */}
				<div className="mb-8">
					<Link
						href="/"
						className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
					>
						← Back to all posts
					</Link>
				</div>

				{/* Tags */}
				<div className="flex flex-wrap gap-2 mb-4">
					{tags &&
						tags.map((tag, idx) => (
							<span
								key={idx}
								className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 uppercase tracking-wider"
							>
								{tag}
							</span>
						))}
				</div>
				{/* Title */}
				<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
					{title}
				</h1>

				{/*  Date */}
				<div className="text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
					Published on{" "}
					<time dateTime={date}>
						{date
							? new Date(date).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})
							: "Undated"}
					</time>
				</div>

				{/* Image */}
				{imageUrl && (
					<div className="relative w-full h-64 sm:h-96 mb-10 rounded-xl overflow-hidden shadow-sm bg-gray-100">
						<Image
							src={imageUrl}
							alt={title}
							fill
							priority
							className="object-cover"
							sizes="(max-width: 768px) 100vw, 768px"
						/>
					</div>
				)}

				{/* Rich Text Content */}
				<div className="prose prose-slate max-w-none">
					{content ? (
						documentToReactComponents(content)
					) : (
						<p className="text-gray-400 italic">
							No content available for this post.
						</p>
					)}
				</div>
			</div>
		</article>
	);
}
