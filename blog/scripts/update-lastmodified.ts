#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

/**
 * Updates the lastModified field in the frontmatter of changed blog post files.
 * Only processes .mdx files in the blog-posts directory that have been modified according to git.
 */

function getCurrentTimestamp(): string {
  const now = new Date();
  // Format: '2025-08-29T16:00:00+02:00'
  return now.toISOString().replace(/\.\d{3}Z$/, '+02:00');
}

function getChangedBlogPosts(): string[] {
  try {
    // Get both staged and unstaged changes for .mdx files in blog-posts directory
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim();
    const unstagedFiles = execSync('git diff --name-only', { encoding: 'utf8' }).trim();

    // Combine and deduplicate files
    const allChangedFiles = new Set([
      ...stagedFiles.split('\n').filter(Boolean),
      ...unstagedFiles.split('\n').filter(Boolean)
    ]);

    // Filter for blog post MDX files
    const blogPostFiles = Array.from(allChangedFiles).filter(file =>
      file.includes('app/blog-posts/') && file.endsWith('.mdx')
    );

    return blogPostFiles;
  } catch (error) {
    console.error('Error getting changed files from git:', error);
    return [];
  }
}

function updateLastModifiedInFile(filePath: string): boolean {
  try {
    if (!existsSync(filePath)) {
      console.warn(`File does not exist: ${filePath}`);
      return false;
    }

    const content = readFileSync(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);

    // Check if the file has frontmatter with lastModified field
    if (!data || typeof data !== 'object') {
      console.warn(`No frontmatter found in: ${filePath}`);
      return false;
    }

    // Update lastModified field
    const currentTimestamp = getCurrentTimestamp();
    data.lastModified = currentTimestamp;

    // Recreate the file content with updated frontmatter
    const updatedContent = matter.stringify(markdownContent, data);
    writeFileSync(filePath, updatedContent, 'utf8');

    console.log(`Updated ${filePath} - lastModified: ${currentTimestamp}`);
    return true;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
    return false;
  }
}

function main() {
  console.log('Checking for changed blog posts...');

  const changedFiles = getChangedBlogPosts();

  if (changedFiles.length === 0) {
    console.log('No changed blog post files found.');
    return;
  }

  console.log(`Found ${changedFiles.length} changed blog post file(s):`);
  changedFiles.forEach(file => console.log(`   - ${file}`));
  console.log();

  let successCount = 0;
  const workspaceRoot = process.cwd();

  for (const relativeFilePath of changedFiles) {
    const absoluteFilePath = join(workspaceRoot, relativeFilePath);
    if (updateLastModifiedInFile(absoluteFilePath)) {
      successCount++;
    }
  }

  console.log();
  console.log(`Summary: ${successCount}/${changedFiles.length} files updated successfully.`);

  if (successCount > 0) {
    console.log('Remember to stage the updated files if you want to commit them:');
    console.log('   git add .');
  }
}

main();
