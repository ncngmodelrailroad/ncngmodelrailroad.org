/**
 * Minimal GitHub REST client for the content editor: read a file, create a
 * branch, commit content, and open or list pull requests. All calls use the
 * installation token from app.ts.
 */
import type { Env } from '../config';
import { EDIT_BRANCH_PREFIX } from '../config';
import { base64Encode, getInstallationToken } from './app';
import { base64DecodeToBytes, fromUtf8 } from '../util/encoding';

const API = 'https://api.github.com';

async function gh<T>(
  env: Env,
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = await getInstallationToken(env);
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'ncng-content-editor',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`GitHub ${method} ${path} failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as T;
}

function repoPath(env: Env, suffix: string): string {
  return `/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}${suffix}`;
}

/** Resolve a branch head commit sha. */
export async function getBranchSha(env: Env, branch: string): Promise<string> {
  const ref = await gh<{ object: { sha: string } }>(
    env,
    'GET',
    repoPath(env, `/git/ref/heads/${encodeURIComponent(branch)}`),
  );
  return ref.object.sha;
}

/** Create a new branch ref from a base sha. */
export async function createBranch(env: Env, branch: string, fromSha: string): Promise<void> {
  await gh(env, 'POST', repoPath(env, '/git/refs'), {
    ref: `refs/heads/${branch}`,
    sha: fromSha,
  });
}

export interface FileContent {
  sha: string;
  text: string;
}

/** Read a file's content on a ref, or null if it does not exist. */
export async function getFile(
  env: Env,
  path: string,
  ref: string,
): Promise<FileContent | null> {
  const token = await getInstallationToken(env);
  const res = await fetch(
    `${API}${repoPath(env, `/contents/${path}`)}?ref=${encodeURIComponent(ref)}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'ncng-content-editor',
      },
    },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub get file failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { sha: string; content: string };
  return { sha: data.sha, text: fromUtf8(base64DecodeToBytes(data.content.replace(/\n/g, ''))) };
}

/** Create or update a file on a branch. */
export async function putFile(
  env: Env,
  args: { path: string; branch: string; message: string; text: string; sha?: string },
): Promise<void> {
  await gh(env, 'PUT', repoPath(env, `/contents/${args.path}`), {
    message: args.message,
    content: base64Encode(args.text),
    branch: args.branch,
    ...(args.sha ? { sha: args.sha } : {}),
  });
}

export interface PullRequest {
  number: number;
  html_url: string;
  title: string;
  head: { ref: string };
  created_at: string;
}

export async function openPullRequest(
  env: Env,
  args: { head: string; title: string; body: string },
): Promise<PullRequest> {
  return gh<PullRequest>(env, 'POST', repoPath(env, '/pulls'), {
    title: args.title,
    head: args.head,
    base: env.BASE_BRANCH,
    body: args.body,
  });
}

export interface DirEntry {
  name: string;
  path: string;
  sha: string;
  type: 'file' | 'dir' | string;
}

/** List a directory's entries on a ref. Returns [] if the path is missing. */
export async function listDir(env: Env, path: string, ref: string): Promise<DirEntry[]> {
  const token = await getInstallationToken(env);
  const res = await fetch(
    `${API}${repoPath(env, `/contents/${path}`)}?ref=${encodeURIComponent(ref)}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'ncng-content-editor',
      },
    },
  );
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub list dir failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as DirEntry[];
  return Array.isArray(data) ? data : [];
}

/** List open content-editor pull requests (those on edit branches). */
export async function listEditorPulls(env: Env): Promise<PullRequest[]> {
  const pulls = await gh<PullRequest[]>(
    env,
    'GET',
    repoPath(env, '/pulls?state=open&per_page=100'),
  );
  return pulls.filter((p) => p.head.ref.startsWith(EDIT_BRANCH_PREFIX));
}
