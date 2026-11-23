import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import PostList from '../../components/PostList';
import Pager from '../../components/Pager';
import { getSortedPosts, getTotalPages, getPagePosts } from '../../lib/pagination';
import { ParsedUrlQuery } from 'querystring';

interface IParams extends ParsedUrlQuery {
    page: string
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { page } = ctx.params as IParams;
    const pageNum = Number(page);
    const sorted = await getSortedPosts();
    const totalPages = getTotalPages(sorted);
    if (!Number.isInteger(pageNum) || pageNum < 1 || pageNum > totalPages) {
        return { notFound: true };
    }
    return {
        props: {
            posts: getPagePosts(sorted, pageNum),
            currentPage: pageNum,
            totalPages,
        },
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const sorted = await getSortedPosts();
    const totalPages = getTotalPages(sorted);
    const paths = [];
    for (let p = 1; p <= totalPages; p += 1) {
        paths.push({ params: { page: String(p) } });
    }
    return {
        paths,
        fallback: false,
    };
};

interface Props {
    posts: [any],
    currentPage: number,
    totalPages: number
}

const Page: NextPage<Props> = (props) => {
    const router = useRouter();
    // Page 1 lives at / — send visitors there (static export cannot
    // return a redirect from getStaticProps, so redirect client-side).
    // router.replace('/') and router.basePath are basePath-aware, so
    // this lands on /nbtn/ on GitHub Pages and / on Workers.
    useEffect(() => {
        if (props.currentPage === 1) {
            router.replace('/');
        }
    }, [props.currentPage, router]);
    if (props.currentPage === 1) {
        const home = router.basePath ? `${router.basePath}/` : '/';
        return (
            <div className={styles.container}>
                <Head>
                    <title>Latest posts</title>
                    <meta httpEquiv="refresh" content={`0; url=${home}`} />
                </Head>
                <main className={styles.main}>
                    <p>Redirecting to <Link href="/"><a>Latest posts</a></Link>…</p>
                </main>
            </div>
        );
    }
    return (
        <div className={styles.container}>
            <Head>
                <title>Latest posts — Page {props.currentPage}</title>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Latest posts
                </h1>
                <PostList posts={props.posts} />
                <Pager currentPage={props.currentPage} totalPages={props.totalPages} />
            </main>

            <footer className={styles.footer}>
                <p>Blog application</p>
            </footer>
        </div>
    )
}

export default Page;
