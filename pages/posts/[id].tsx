import { GetStaticProps, NextPage, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { post, posts, blocks, getSlug, findPostBySlug } from '../../lib/notion';
import styles from '../../styles/Home.module.css';

interface IParams extends ParsedUrlQuery {
   id: string
}

export const getStaticProps: GetStaticProps = async (ctx) => {
   let { id } = ctx.params as IParams; 
   // Resolve a slug back to the Notion page ID (a page ID works as-is)
   let match = await findPostBySlug(id);
   let pageId = match ? match.id : id;
   // Get the dynamic id
   let page_result = await post(pageId); 
   // Fetch the post
   let { results } = await blocks(pageId); 
   // Get the children
   return {
     props: {
       id,
       post: page_result,
       blocks: results
     }
   }
}
export const getStaticPaths: GetStaticPaths = async () => {
   let { results } = await posts(); 
   // Get all posts
   return {
     paths: results.map((post) => { 
       // Go through every post
       return {
         params: { 
           // set a params object with an id in it
           id: getSlug(post)
         }
       }
     }),
     fallback: false
   }
} 

interface Props {
   id: string,
   post: any,
   blocks: [any]
}

// Convert a YouTube watch/shorts URL to an embed URL, or null.
function youtubeEmbedUrl(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

// Plain text of any block, for types without a dedicated renderer.
function blockText(block: any): string {
  const data = block[block.type];
  const arr = data?.rich_text || data?.text || [];
  return arr.map((t: any) => t.plain_text || t.text?.content || '').join('');
}

const renderBlock = (block: any) => {
   switch (block.type) {
     case 'heading_1': 
     // For a heading
       return <h1>{ block['heading_1'].text[0].plain_text } </h1> 
     case 'image': {
     // For an image
       const imageUrl = block['image'].external?.url || block['image'].file?.url;
       return imageUrl ? <img src={ imageUrl } width = { 650} height = { 400} /> : null;
     }
     case 'video':
     case 'embed': {
     // For a video or embed (e.g. a YouTube link)
       const videoUrl = block[block.type].external?.url || block[block.type].file?.url || block[block.type].url;
       const embedUrl = videoUrl ? youtubeEmbedUrl(videoUrl) : null;
       if (embedUrl) return <iframe src={ embedUrl } width = { 650 } height = { 400 } frameBorder="0" allowFullScreen />;
       return videoUrl ? <a href={ videoUrl }>{ videoUrl }</a> : null;
     }
       case 'bulleted_list_item': 
       // For an unordered list
       return <ul><li>{ block['bulleted_list_item'].text[0].plain_text } </li></ul >
       case 'paragraph': 
       // For a paragraph
       return <p>{ block['paragraph'].text[0]?.text?.content } </p>
     default: {
     // Any other type: show its text if it has any, else nothing
       const text = blockText(block);
       return text ? <p>{ text }</p> : null;
     }
   }
}
    
const Post:NextPage<Props> = ({id,post,blocks}) => {
   const title = post.properties.Name.title[0]?.plain_text || '';
   return (
     <div className={styles.blogPageHolder}>
       <Head>
         <title>
           {title}
         </title>
       </Head>
       <div className={styles.blogPageNav}>
         <nav>
           <Link href="/">
             <a>Home</a>
           </Link>
         </nav>
       </div>
       <h1>{title}</h1>
       {
         blocks.map((block,index) => {
           return (
             <div key={index} className={styles.blogPageContent}>
               {
                 renderBlock(block)
               }
             </div>
           )})
       }
     </div>
   )
}

export default Post;