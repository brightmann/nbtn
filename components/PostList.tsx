import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { getSlug } from '../lib/notion';

interface Props {
    posts: any[];
}

// The homepage post cards (cover images stripped site-wide).
export default function PostList({ posts }: Props) {
    return (
        <>
            {posts.map((result: any, index: number) => {
                const title = result.properties.Name.title[0]?.plain_text || '';
                return (
                    <div className={styles.cardHolder} key={index}>
                        <div className={styles.cardContent}>
                            <Link href={`/posts/${getSlug(result)}`}>
                                <a className={styles.cardTitle}>{title}</a>
                            </Link>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
