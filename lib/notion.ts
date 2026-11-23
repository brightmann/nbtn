import { Client } from '@notionhq/client';

const client = new Client({
    auth: process.env.NOTION_KEY,
});

async function posts(cursor?: string, acc: any[] = []): Promise<any> {
    const myPosts: any = await client.databases.query({
        database_id: `${process.env.NOTION_DATABASE}`,
        start_cursor: cursor,
        page_size: 100,
    });
    const all = acc.concat(myPosts.results);
    // Notion returns at most 100 rows per call — page through the rest.
    if (myPosts.has_more && myPosts.next_cursor) {
        return posts(myPosts.next_cursor, all);
    }
    return { results: all };
}

async function post(id: string) {
    const myPost = await client.pages.retrieve({
        page_id: id,
    });
    return myPost;
}

async function blocks(id: string, cursor?: string, acc: any[] = []): Promise<any> {
    const myBlocks: any = await client.blocks.children.list({
        block_id: id,
        start_cursor: cursor,
        page_size: 100,
    });
    const all = acc.concat(myBlocks.results);
    // Notion returns at most 100 blocks per call — page through the rest.
    if (myBlocks.has_more && myBlocks.next_cursor) {
        return blocks(id, myBlocks.next_cursor, all);
    }
    return { results: all };
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