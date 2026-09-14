import { createClient, type Entry, type EntryFieldTypes } from "contentful";

export type BlogPostSkeleton = {
	contentTypeId: "blogPosts";
	fields: {
		title: EntryFieldTypes.Text;
		slug: EntryFieldTypes.Text;
		featuredImage?: EntryFieldTypes.AssetLink;
		date: EntryFieldTypes.Date;
		tags: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
		content: EntryFieldTypes.RichText;
	};
};

export type BlogPost = Entry<
	BlogPostSkeleton,
	"WITHOUT_UNRESOLVABLE_LINKS",
	string
>;

const client = createClient({
	space: process.env.CONTENTFUL_SPACE_ID!,
	accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
}).withoutUnresolvableLinks;

// GET ALL ITEMS FROM THE CMS:
export async function getAllPosts(): Promise<BlogPost[]> {
	const res = await client.getEntries<BlogPostSkeleton>({
		content_type: "blogPosts",
		order: ["-fields.date"],
	});
	return res.items;
}

// // GET SINGLE POST by ID
// export async function getPostById(id: string): Promise<BlogPost | null> {
// 	const res = await client.getEntries<BlogPostSkeleton>({
// 		content_type: "blogPosts",
// 		"sys.id": id,
// 		order: ["-sys.createdAt"],
// 	});
// 	return res.items[0] ?? null;
// }

// // GET SINGLE POST by Slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
	const res = await client.getEntries<BlogPostSkeleton>({
		content_type: "blogPosts",
		"fields.slug": slug,
		limit: 1,
	});
	return res.items[0] ?? null;
}
