import fs from 'node:fs';
import path from 'node:path';
import { getAllPostsMetaFromFS } from '../lib/posts-fs';
import { getAllSeries } from '../lib/series';

async function generatePostsMetadata() {
  console.log('[METADATA] Generating posts and series metadata...');
  
  try {
    // posts metadata
    const posts = await getAllPostsMetaFromFS();
    console.log(`[METADATA] Found ${posts.length} posts`);
    
    // series metadata
    const series = await getAllSeries(posts);
    console.log(`[METADATA] Found ${series.length} series`);
    
    const outputDir = path.join(process.cwd(), 'public', 'api');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const postsPath = path.join(outputDir, 'posts-metadata.json');
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));
    console.log(`[METADATA] Posts metadata written to ${postsPath}`);
    
    const seriesPath = path.join(outputDir, 'series-metadata.json');
    fs.writeFileSync(seriesPath, JSON.stringify(series, null, 2));
    console.log(`[METADATA] Series metadata written to ${seriesPath}`);
    
    console.log('[METADATA] Metadata generation completed successfully');
    
    return { posts, series };
  } catch (error) {
    console.error('[METADATA] Error generating metadata:', error);
    process.exit(1);
  }
}

// run if called directly
if (require.main === module) {
  generatePostsMetadata();
}

export { generatePostsMetadata };
