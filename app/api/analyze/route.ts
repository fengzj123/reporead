import { NextRequest, NextResponse } from "next/server";

interface GitHubRepo {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  license: { name: string } | null;
  pushed_at: string | null;
  updated_at: string | null;
}

interface KimiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

async function fetchGitHub(path: string, owner: string, repo: string) {
  const headers = { Accept: "application/vnd.github.v3+json", "User-Agent": "RepoRead-App" };
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}${path}`, { headers });
  return { res, headers };
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Extract owner/repo from GitHub URL
    const match = url.match(/github\.com\/([\w-]+)\/([\w.-]+)/);
    if (!match) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
    }
    const owner = match[1];
    const repo = match[2].replace(/\/tree\/[\w.-]+$/, "");

    // Fetch GitHub repo metadata
    const headers = { Accept: "application/vnd.github.v3+json", "User-Agent": "RepoRead-App" };
    const metaRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!metaRes.ok) {
      if (metaRes.status === 404) return NextResponse.json({ error: "Repository not found" }, { status: 404 });
      if (metaRes.status === 403) return NextResponse.json({ error: "GitHub API rate limit exceeded" }, { status: 429 });
      return NextResponse.json({ error: `GitHub API error: ${metaRes.status}` }, { status: 500 });
    }
    const meta: GitHubRepo = await metaRes.json();

    // Fetch README
    let readmeContent = "";
    const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      readmeContent = atob(readmeData.content);
    }

    // Fetch package.json if exists
    let packageJson: Record<string, unknown> | null = null;
    const pkgRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, { headers });
    if (pkgRes.ok) {
      try {
        const pkgData = await pkgRes.json();
        packageJson = JSON.parse(atob(pkgData.content));
      } catch {
        // ignore parse errors
      }
    }

    // Fetch file tree (top 50 files for analysis)
    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, { headers });
    let fileTree: { path: string; type: string }[] = [];
    if (treeRes.ok) {
      const treeData = await treeRes.json();
      fileTree = treeData.tree
        .filter((f: { type: string }) => f.type === "blob")
        .slice(0, 50) as { path: string; type: string }[];
    }

    const top20Files = fileTree.slice(0, 20).map((f) => f.path);

    // Fetch content of key files (entry files, config files)
    const keyFilePaths = [
      ...top20Files.filter((p) => p.endsWith(".json")).slice(0, 3),
      ...top20Files.filter((p) => /^(src|lib|app|cmd|internal|packages)\//.test(p)).slice(0, 5),
    ].slice(0, 6);

    const keyFileContents: Record<string, string> = {};
    for (const filePath of keyFilePaths) {
      try {
        const fileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}`, { headers });
        if (fileRes.ok) {
          const fileData = await fileRes.json();
          const content = atob(fileData.content);
          // Only store first 300 lines for each file
          const lines = content.split("\n").slice(0, 300);
          keyFileContents[filePath] = lines.join("\n");
        }
      } catch {
        // ignore errors for individual files
      }
    }

    // Call Qwen API (通义千问)
    const qwenApiKey = process.env.KIMI_API_KEY;
    if (!qwenApiKey) {
      return NextResponse.json({ error: "API_KEY is not configured" }, { status: 500 });
    }

    const packageJsonStr = packageJson
      ? `\n## package.json\n\`\`\`json\n${JSON.stringify(
          {
            name: packageJson.name,
            version: packageJson.version,
            dependencies: packageJson.dependencies,
            devDependencies: packageJson.devDependencies,
            scripts: packageJson.scripts,
            description: packageJson.description,
          },
          null,
          2
        )}\n\`\`\``
      : "";

    const keyFilesStr =
      Object.keys(keyFileContents).length > 0
        ? `\n## Key Source Files (first 300 lines each)\n${Object.entries(keyFileContents)
            .map(([path, content]) => `### ${path}\n\`\`\`\n${content}\n\`\`\``)
            .join("\n\n")}`
        : "";

    const qwenPrompt = `You are an expert software developer performing a deep code-level analysis of a GitHub repository.

## Repository Info
- Name: ${meta.full_name}
- Description: ${meta.description || "No description"}
- Stars: ${meta.stargazers_count.toLocaleString()} | Forks: ${meta.forks_count.toLocaleString()} | Language: ${meta.language || "N/A"}
- License: ${meta.license?.name || "None specified"}
- Last pushed: ${meta.pushed_at || "Unknown"}

## README (first 3000 chars)
${readmeContent.slice(0, 3000)}

## File Structure (top 20 files by tree order)
${top20Files.join("\n")}${packageJsonStr}${keyFilesStr}

## Your Task
Perform a REAL code-level analysis. Do NOT just summarize the README. Use the package.json, file structure, and source code to give an authentic technical assessment.

### Analysis Dimensions (MUST cover ALL):
1. **真实的 Tech Stack**: Identify from package.json dependencies + actual imports/frameworks seen in source code. Be specific (e.g., "React 18.2", "Next.js 14 App Router", "Zustand state management")
2. **关键模块/核心文件 (keyModules)**: Identify major modules from directory structure. For each module explain its responsibility.
3. **代码质量线索**: Look for signs of code quality - TypeScript usage, test files (jest, vitest, rtl), linting configs, monorepo structure
4. **Watch Out**: Outdated dependencies, missing types/tests, security concerns, missing CI/CD

### Output Format (return ONLY valid JSON, no markdown, no explanation):
{
  "techStack": ["React 18.2", "Next.js 14 (App Router)", "TypeScript", "TailwindCSS", "Zustand"],
  "keyModules": [
    {"name": "模块名", "path": "路径", "desc": "职责描述"},
    ...
  ],
  "keyFeatures": ["feature1", "feature2", ...],
  "howToRun": ["step1", "step2", ...],
  "pitfalls": ["pitfall1", "pitfall2", ...],
  "healthScore": 0-100,
  "healthDetails": {
    "dependencyFreshness": "good|concerning|outdated",
    "hasTests": true|false,
    "hasTypes": true|false,
    "maintenanceStatus": "active|stalled|dead"
  }
}

Rules:
- healthScore: 100=perfect, 80+=good, 60-79=concerning, <60=outdated/risky
- dependencyFreshness: "good" if deps are recent, "concerning" if some outdated, "outdated" if many major deps are old
- hasTests: true if test files or test directories exist
- hasTypes: true if TypeScript is used or @types packages exist
- maintenanceStatus: "active" if pushed recently (<6mo), "stalled" if 6-24mo, "dead" if >24mo
- Return ONLY the JSON object, no text before or after`;

    const qwenRes = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${qwenApiKey}`,
      },
      body: JSON.stringify({
        model: "qwen-plus",
        messages: [{ role: "user", content: qwenPrompt }] as KimiMessage[],
        temperature: 0.3,
      }),
    });

    if (!qwenRes.ok) {
      const errText = await qwenRes.text();
      return NextResponse.json({ error: `Qwen API error: ${qwenRes.status} - ${errText}` }, { status: 500 });
    }

    const qwenData = await qwenRes.json();
    const rawContent = qwenData.choices?.[0]?.message?.content || "";

    // Parse JSON from response (handle potential markdown code blocks)
    let analysis;
    try {
      const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[2]) : rawContent;
      analysis = JSON.parse(jsonStr.trim());
    } catch {
      // Fallback if parsing fails
      analysis = {
        techStack: [meta.language || "Unknown"],
        keyModules: [],
        keyFeatures: [
          `${meta.stargazers_count.toLocaleString()} stars on GitHub`,
          `${meta.forks_count.toLocaleString()} forks`,
          meta.language ? `Written in ${meta.language}` : "Open source project",
          meta.license?.name ? `Licensed under ${meta.license.name}` : "No specific license mentioned",
          "Active open source project",
        ],
        howToRun: [
          `git clone https://github.com/${owner}/${repo}.git`,
          `cd ${repo}`,
          "npm install",
          "npm run dev",
          "Open http://localhost:3000",
        ],
        pitfalls: [
          "Check Node.js version compatibility before installing",
          "Review license terms for commercial use",
          "Test in development environment first",
        ],
        healthScore: 60,
        healthDetails: {
          dependencyFreshness: "concerning",
          hasTests: false,
          hasTypes: !!meta.language,
          maintenanceStatus: "active",
        },
      };
    }

    // Ensure healthDetails fields are present
    if (!analysis.healthDetails) {
      analysis.healthDetails = {
        dependencyFreshness: "concerning",
        hasTests: false,
        hasTypes: false,
        maintenanceStatus: "active",
      };
    }
    if (typeof analysis.healthScore !== "number") {
      analysis.healthScore = 60;
    }

    return NextResponse.json({
      repoName: meta.full_name,
      description: meta.description,
      stars: meta.stargazers_count,
      forks: meta.forks_count,
      language: meta.language,
      license: meta.license?.name,
      url,
      ...analysis,
    });
  } catch (err) {
    console.error("Analyze error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
