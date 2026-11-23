import { Client } from '@notionhq/client';

const client = new Client({
    auth: process.env.NOTION_KEY,
});

async function posts() {
    const myPosts = await client.databases.query({
        database_id: `${process.env.NOTION_DATABASE}`,
    });
    return myPosts;
}

async function post(id: string) {
    const myPost = await client.pages.retrieve({
        page_id: id,
    });
    return myPost;
}

async function blocks(id: string) {
    const myBlocks = await client.blocks.children.list({
        block_id: id
    });
    return myBlocks;
}

// Slug for a database row: the manual "Slug" text column, falling back
// to the Notion page ID when the column is missing or empty.
function getSlug(page: any): string {
    const slug = page.properties?.Slug?.rich_text?.[0]?.plain_text;
    return slug || page.id;
}

// Find the database row whose slug (or page ID) matches, or null.
async function findPostBySlug(slug: string) {
    const { results } = await posts();
    return results.find((page: any) => getSlug(page) === slug) || null;
}


export {
    posts,
    post,
    blocks,
    getSlug,
    findPostBySlug
}