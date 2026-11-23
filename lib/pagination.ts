import { posts } from './notion';

export const POSTS_PER_PAGE = 5;

// Newest first, by the page's creation time.
export async function getSortedPosts(): Promise<any[]> {
    const { results } = await posts();
    return [...results].sort(
        (a: any, b: any) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime(),
    );
}

export function getTotalPages(sortedPosts: any[]): number {
    return Math.max(1, Math.ceil(sortedPosts.length / POSTS_PER_PAGE));
}

export function getPagePosts(sortedPosts: any[], page: number): any[] {
    const start = (page - 1) * POSTS_PER_PAGE;
    return sortedPosts.slice(start, start + POSTS_PER_PAGE);
}
