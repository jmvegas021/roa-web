import {
  BLOG_MARKDOWN_PREFIX,
  CLUSTER_FILE_PATH,
  DEFAULT_GITHUB_BRANCH,
  DEFAULT_GITHUB_OWNER,
  DEFAULT_GITHUB_REPO,
} from "./constants";
import type { GithubRepoFile } from "./types";

interface GitRefResponse {
  object?: { sha?: string };
}

interface GitCommitResponse {
  tree?: { sha?: string };
}

interface GitShaResponse {
  sha?: string;
}

export function getGithubRepo(): { owner: string; repo: string } {
  const fromActions = process.env.GITHUB_REPOSITORY?.trim();
  if (fromActions?.includes("/")) {
    const [owner, repo] = fromActions.split("/");
    if (owner && repo) return { owner, repo };
  }
  return {
    owner: process.env.BLOG_GITHUB_OWNER?.trim() || DEFAULT_GITHUB_OWNER,
    repo: process.env.BLOG_GITHUB_REPO?.trim() || DEFAULT_GITHUB_REPO,
  };
}

export function getGithubBranch(): string {
  return process.env.BLOG_GITHUB_BRANCH?.trim() || DEFAULT_GITHUB_BRANCH;
}

export function getGithubToken(): string | undefined {
  return (
    process.env.BLOG_GITHUB_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim()
  );
}

export function blogMarkdownPath(slug: string): string {
  return `${BLOG_MARKDOWN_PREFIX}${slug}.md`;
}

export function isAllowlistedPath(filePath: string): boolean {
  if (filePath === CLUSTER_FILE_PATH) return true;
  return /^content\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(filePath);
}

export async function githubFileExists(filePath: string): Promise<boolean> {
  const response = await githubRequest(
    `/contents/${filePath}?ref=${encodeURIComponent(getGithubBranch())}`
  );
  return response.ok;
}

export async function readGithubFile(filePath: string): Promise<string | null> {
  const response = await githubRequest(
    `/contents/${filePath}?ref=${encodeURIComponent(getGithubBranch())}`
  );
  if (!response.ok) return null;
  const payload = (await response.json()) as { content?: string; encoding?: string };
  if (!payload.content) return null;
  return Buffer.from(payload.content, "base64").toString("utf8");
}

export async function listGithubBlogSlugs(): Promise<string[]> {
  const response = await githubRequest(
    `/contents/${BLOG_MARKDOWN_PREFIX}?ref=${encodeURIComponent(getGithubBranch())}`
  );
  if (!response.ok) return [];
  const entries = (await response.json()) as { name?: string; type?: string }[];
  if (!Array.isArray(entries)) return [];
  return entries
    .filter(
      (entry) =>
        entry.type === "file" &&
        entry.name?.endsWith(".md") &&
        !entry.name.startsWith("_")
    )
    .map((entry) => entry.name!.replace(/\.md$/, ""));
}

export async function commitAllowlistedFiles(
  files: GithubRepoFile[],
  message: string
): Promise<{ sha: string; files: string[] }> {
  const token = getGithubToken();
  if (!token) throw new Error("Missing BLOG_GITHUB_TOKEN (or GITHUB_TOKEN).");

  const invalid = files.filter((file) => !isAllowlistedPath(file.path));
  if (invalid.length > 0) {
    throw new Error(
      `Refusing paths outside the blog allowlist: ${invalid.map((file) => file.path).join(", ")}`
    );
  }
  if (files.length === 0) throw new Error("No files to commit.");

  const branch = getGithubBranch();
  const ref = await githubJson<GitRefResponse>(
    `/git/ref/heads/${encodeURIComponent(branch)}`
  );
  const parentSha = ref.object?.sha;
  if (!parentSha) throw new Error("Could not resolve main commit SHA.");

  const parent = await githubJson<GitCommitResponse>(`/git/commits/${parentSha}`);
  const baseTree = parent.tree?.sha;
  if (!baseTree) throw new Error("Could not resolve base tree SHA.");

  const treeItems = [];
  for (const file of files) {
    const blob = await githubJson<GitShaResponse>("/git/blobs", {
      method: "POST",
      body: JSON.stringify({ content: file.content, encoding: "utf-8" }),
    });
    if (!blob.sha) throw new Error(`Blob create failed for ${file.path}.`);
    treeItems.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    });
  }

  const tree = await githubJson<GitShaResponse>("/git/trees", {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTree, tree: treeItems }),
  });
  if (!tree.sha) throw new Error("Tree create failed.");

  const commit = await githubJson<GitShaResponse>("/git/commits", {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: tree.sha,
      parents: [parentSha],
    }),
  });
  if (!commit.sha) throw new Error("Commit create failed.");

  const update = await githubRequest(`/git/refs/heads/${encodeURIComponent(branch)}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });
  if (!update.ok) {
    const detail = await update.text();
    throw new Error(`Updating ${branch} failed: ${update.status} ${detail.slice(0, 300)}`);
  }

  return { sha: commit.sha, files: files.map((file) => file.path) };
}

async function githubJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await githubRequest(path, init);
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub ${path} failed: ${response.status} ${detail.slice(0, 300)}`);
  }
  return (await response.json()) as T;
}

async function githubRequest(path: string, init?: RequestInit): Promise<Response> {
  const token = getGithubToken();
  if (!token) throw new Error("Missing BLOG_GITHUB_TOKEN (or GITHUB_TOKEN).");
  const { owner, repo } = getGithubRepo();
  return fetch(`https://api.github.com/repos/${owner}/${repo}${path}`, {
    ...init,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "x-github-api-version": "2022-11-28",
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}
