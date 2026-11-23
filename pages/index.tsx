import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import { posts, getSlug } from '../lib/notion'

export async function getStaticProps() {
    // Get the posts
    let { results } = await posts();
    // Return the result
    return {
        props: {
            posts: results,
            
        }
    }
}

interface Props {
    posts: [any]
}

const Home: NextPage<Props> = (props) => {
    console.log(props.posts)
    return (
        <div className={styles.container}>
        <Head>
            <title>Latest posts</title>
        </Head>

        <main className={styles.main}>
            <h1 className={styles.title}>
            Latest posts
            </h1>
            {
                props.posts.map((result,index) => {
                const title = result.properties.Name.title[0]?.plain_text || '';
                return (
                    <div className={styles.cardHolder} key={index}>
                    <div className={styles.cardContent}>
                        <Link href={`/posts/${getSlug(result)}`}>
                        <a className={styles.cardTitle}>{
                        title
                        }</a>
                        </Link>
                    </div>
                    </div>
                    )
                })
            }
        </main>

        <footer className={styles.footer}>
            <p>Blog application</p>
        </footer>
        </div>
    )
}

export default Home
