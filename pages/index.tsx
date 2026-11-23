import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import PostList from '../components/PostList';
import Pager from '../components/Pager';
import { getSortedPosts, getTotalPages, getPagePosts } from '../lib/pagination'

export async function getStaticProps() {
    // Get the posts, newest first; homepage is page 1
    const sorted = await getSortedPosts();
    const totalPages = getTotalPages(sorted);
    return {
        props: {
            posts: getPagePosts(sorted, 1),
            totalPages,
        }
    }
}

interface Props {
    posts: [any],
    totalPages: number
}

const Home: NextPage<Props> = (props) => {
    return (
        <div className={styles.container}>
        <Head>
            <title>Latest posts</title>
        </Head>

        <main className={styles.main}>
            <h1 className={styles.title}>
            Latest posts
            </h1>
            <PostList posts={props.posts} />
            <Pager currentPage={1} totalPages={props.totalPages} />
        </main>

        <footer className={styles.footer}>
            <p>Blog application</p>
        </footer>
        </div>
    )
}

export default Home
