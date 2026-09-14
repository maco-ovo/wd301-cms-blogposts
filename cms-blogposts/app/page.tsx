import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/contentful";

export default async function HomePage() {
	const posts = await getAllPosts();

	return (
		<main className="min-h-screen bg-gray-50 py-16 px-8 sm:px-15 lg:px-18">
			<div className="mx-auto">
				{/* Header */}
				<header className="mb-12 text-center">
					<h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
						My Blog Posts
					</h1>
					<p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
						Discover the latest stories, and updates powered by Contentful and
						Next.js
					</p>
				</header>

				{/* Posts */}
				{posts.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-gray-500 text-lg">
							No blog posts found. Please make sure your entries are published
							in Contentful.
						</p>
					</div>
				) : (
					/* Post Grid */
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{posts.map((post) => {
							const { title, slug, featuredImage, date, tags } = post.fields;

							// Extract image URL
							const imageUrl = featuredImage?.fields?.file?.url
								? `https:${featuredImage.fields.file.url}`
								: null;

							return (
								<article
									key={post.sys.id}
									className="flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
								>
									<Link
										href={`/posts/${post.fields.slug}`}
										className="flex flex-col h-full group"
									>
										{/* Featured Image */}
										<div className="relative w-full h-48 bg-gray-200 overflow-hidden">
											{imageUrl ? (
												<Image
													src={imageUrl}
													alt={title}
													fill
													className="object-cover group-hover:scale-105 transition-transform duration-300"
													sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
													No Image Available
												</div>
											)}
										</div>

										{/* Post Content */}
										<div className="p-6 flex flex-col flex-1">
											{/* Tags */}
											{tags && tags.length > 0 && (
												<div className="flex flex-wrap gap-2 mb-3">
													{tags.map((tag, idx) => (
														<span
															key={idx}
															className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-600"
														>
															{tag}
														</span>
													))}
												</div>
											)}

											{/* Title */}
											<h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-2">
												{title}
											</h2>

											{/* Publication Date */}
											<div className="mt-auto pt-4 text-sm text-gray-500 border-t border-gray-100">
												<time dateTime={date}>
													{date
														? new Date(date).toLocaleDateString("en-US", {
																year: "numeric",
																month: "short",
																day: "numeric",
															})
														: "Undated"}
												</time>
											</div>
										</div>
									</Link>
								</article>
							);
						})}
					</div>
				)}
			</div>
		</main>
	);
}
