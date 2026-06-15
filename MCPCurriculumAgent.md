# Build Instruction: MCP Curriculum Agent for pranavsrivastava.com

## Goal

Build a maintainable MCP Curriculum Agent system for `pranavsrivastava.com`.

The purpose of this system is to keep the MCP learning track updated over time. It should track meaningful changes in the MCP ecosystem, suggest new course modules, update existing lessons, create practical examples, and prepare draft content for human approval.

This should not be a single magical agent. It should be a clean combination of:

* Agent
* Skill files
* MCP tools
* Scheduled workflow
* Course content repository
* Observability
* Human approval before publishing

## Core Principle

Use this separation:

```text
Agent = who performs the work
Skill file = how the work should be done
MCP server = what tools/data the agent can access
Workflow = when and in what order tasks run
Human approval = what protects quality and trust
```

The agent must never directly publish course updates without approval. It should create drafts, structured proposals, or GitHub pull requests.

---

## Agent Name

Create an agent called:

```text
mcp-curriculum-agent
```

## Agent Mission

The MCP Curriculum Agent keeps the MCP learning track fresh, practical, example-rich, and aligned with current changes in the MCP ecosystem.

It should:

1. Track MCP-related updates.
2. Read trusted sources.
3. Detect meaningful changes.
4. Map changes to existing course modules.
5. Suggest new lessons, labs, examples, or updates.
6. Write draft course content.
7. Create practical code examples.
8. Validate examples where possible.
9. Add changelog entries.
10. Open a draft/PR for human review.

---

## Course Area

This agent is responsible for the MCP learning area under:

```text
/courses/mcp
```

Possible structure:

```text
courses/
  mcp/
    course.manifest.json
    changelog.md
    modules/
      01-mcp-foundations.mdx
      02-mcp-servers.mdx
      03-mcp-clients.mdx
      04-tools-resources-prompts.mdx
      05-local-mcp-with-wsl2.mdx
      06-remote-mcp-oauth.mdx
      07-mcp-security.mdx
      08-real-world-use-cases.mdx
    labs/
      build-your-first-mcp-server/
      connect-mcp-to-filesystem/
      remote-mcp-with-auth/
      mcp-course-content-server/
    examples/
      typescript/
      python/
    assets/
      images/
      diagrams/
```

---

## Required Skill Files

Create these skill files:

```text
skills/mcp/evaluate-mcp-update.skill.md
skills/mcp/update-mcp-curriculum.skill.md
skills/mcp/write-mcp-course-module.skill.md
skills/mcp/create-mcp-example-lab.skill.md
skills/mcp/validate-mcp-lesson.skill.md
skills/mcp/public-private-boundary-check.skill.md
```

### 1. evaluate-mcp-update.skill.md

Purpose:

Evaluate whether a new MCP-related update is meaningful enough to affect the course.

Should classify updates as:

```text
breaking_change
new_feature
new_sdk_or_tool
new_example_or_use_case
security_relevant
minor_doc_change
not_relevant
```

Output format:

```json
{
  "title": "",
  "source_url": "",
  "date_checked": "",
  "classification": "",
  "importance": "low | medium | high",
  "course_impact": "",
  "recommended_action": "ignore | add_note | update_lesson | create_new_lesson | create_lab",
  "reasoning_summary": ""
}
```

---

### 2. update-mcp-curriculum.skill.md

Purpose:

Map an MCP update to the right course location.

The skill should decide:

```text
Should this update modify an existing module?
Should it become a new chapter?
Should it become a lab?
Should it only appear in the changelog?
Should it be ignored?
```

The output must include:

```text
affected files
suggested changes
why the change matters
learner level
prerequisites
expected outcome
```

---

### 3. write-mcp-course-module.skill.md

Purpose:

Write course lessons in a consistent style.

Style requirements:

```text
Simple English
Practical examples
Beginner-friendly where possible
Clear structure
No hype
No unexplained jargon
Use diagrams or code where helpful
Always include "what you will learn"
Always include "why this matters"
Always include a small exercise or reflection
```

Lesson format:

```md
---
title:
track: MCP
level:
prerequisites:
updated:
status: draft
---

# Title

## What you will learn

## Why this matters

## Concept

## Simple explanation

## Practical example

## Code or configuration

## Common mistakes

## Mini exercise

## Summary

## Next step
```

---

### 4. create-mcp-example-lab.skill.md

Purpose:

Create practical labs connected to course lessons.

Each lab must include:

```text
Goal
Prerequisites
Folder structure
Setup steps
Code
How to run
Expected output
Troubleshooting
Extension ideas
```

The lab should be small enough to complete in 30–90 minutes.

Prefer examples that can run locally using:

```text
WSL2 Ubuntu
Node.js / TypeScript
Python
Docker where useful
```

---

### 5. validate-mcp-lesson.skill.md

Purpose:

Review draft lessons before they are proposed for publishing.

Checklist:

```text
Is the lesson accurate?
Are sources mentioned for recent changes?
Does the lesson match the learner level?
Are examples runnable?
Are code blocks complete?
Are there any broken links?
Is the tone practical and clear?
Is anything sensitive exposed?
Is it ready for human review?
```

Output:

```json
{
  "ready_for_review": true,
  "issues": [],
  "suggested_fixes": [],
  "risk_level": "low | medium | high"
}
```

---

### 6. public-private-boundary-check.skill.md

Purpose:

Ensure private information is not published.

Never publish:

```text
API keys
access tokens
personal notes
private prompts
private agent memory
client details
internal architecture secrets
production deployment secrets
private file paths
personal sensitive information
```

Public content may include:

```text
architecture overview
safe code samples
tutorials
public demos
lessons learned
general diagrams
sanitized examples
```

---

## MCP Servers / Tools Required

Create or prepare integration points for these MCP servers.

### mcp-course-content

Purpose:

Read and write course content files.

Allowed paths:

```text
courses/
content/
public/course-assets/
```

Never allow this tool to access the entire machine.

---

### mcp-github

Purpose:

Create branches, commits, and pull requests.

Rules:

```text
Never push to main directly
Always create a branch
Always open PR in draft mode
Include summary of changes
Include source references
Include validation checklist
```

---

### mcp-docs-research

Purpose:

Track trusted MCP sources.

It should read from a curated source registry file:

```text
config/mcp-source-registry.json
```

Example fields:

```json
{
  "name": "",
  "url": "",
  "type": "docs | spec | github | release_notes | blog",
  "trust_level": "official | high | medium | low",
  "check_frequency": "daily | weekly | manual"
}
```

Only official and high-trust sources should trigger course changes automatically.

---

### mcp-code-runner

Purpose:

Run example code in a sandbox.

Rules:

```text
No production credentials
No access to personal folders
No destructive commands
Run only inside a temporary project folder
Log command output
Return pass/fail
```

---

### mcp-vector-memory

Purpose:

Search existing course content, previous update decisions, notes, and examples.

This helps avoid duplicate lessons and repeated explanations.

---

### mcp-observability

Purpose:

Log:

```text
agent run ID
timestamp
model used
input sources
tokens used
cost estimate
tools called
files changed
errors
validation result
human approval status
```

---

## Workflow

Create a workflow called:

```text
mcp-curriculum-update-workflow
```

It can run manually first. Later it can run weekly.

Steps:

```text
1. Load source registry
2. Check latest MCP-related updates
3. Summarize each update
4. Run evaluate-mcp-update.skill.md
5. Filter out low-value changes
6. Search existing course content
7. Run update-mcp-curriculum.skill.md
8. Generate draft lesson/lab if needed
9. Run validate-mcp-lesson.skill.md
10. Run public-private-boundary-check.skill.md
11. Update changelog
12. Create GitHub branch
13. Open draft PR
14. Log run in observability
```

---

## Human Approval Rule

The agent must never directly publish.

Allowed:

```text
Create draft lesson
Create draft lab
Create changelog entry
Create GitHub branch
Open draft PR
Suggest course roadmap changes
```

Not allowed:

```text
Push to main
Deploy to production
Expose shell publicly
Publish unverified claims
Rewrite large course sections without review
```

---

## Changelog Format

Every course update should add an entry to:

```text
courses/mcp/changelog.md
```

Format:

```md
## YYYY-MM-DD

### Change

### Source

### Course impact

### Files changed

### Validation

### Human review status
```

---

## Course Manifest

Create:

```text
courses/mcp/course.manifest.json
```

Example:

```json
{
  "course_id": "mcp",
  "title": "Model Context Protocol",
  "track": "Applied AI",
  "status": "active",
  "last_reviewed": "",
  "modules": [
    {
      "id": "01-mcp-foundations",
      "title": "MCP Foundations",
      "level": "beginner",
      "status": "published",
      "last_updated": "",
      "dependencies": []
    }
  ]
}
```

---

## Output Expected From Agent

When the MCP Curriculum Agent runs, it should produce:

```text
1. Update summary
2. Source list
3. Course impact analysis
4. Proposed file changes
5. Draft lesson or lab if needed
6. Validation result
7. Draft PR link or patch summary
```

Example output:

```md
# MCP Curriculum Update Proposal

## Summary

## Sources checked

## Meaningful updates found

## Course impact

## Proposed changes

## Files modified

## Validation

## Human review checklist
```

---

## Initial MVP Scope

Do not overbuild.

Phase 1 should include:

```text
1. Static course folder structure
2. Skill files
3. Source registry
4. Manual agent run
5. Draft lesson generation
6. Changelog update
7. GitHub PR creation
```

Phase 2:

```text
1. Weekly scheduled update check
2. Observability dashboard
3. Code example validation
4. Vector search over existing course content
```

Phase 3:

```text
1. Multi-agent review
2. Remote MCP integration
3. Course versioning
4. Video script generation
5. Public learning dashboard
```

---

## Best Practice Summary

Do not build one giant autonomous agent.

Build a reliable system:

```text
MCP Curriculum Agent
+ MCP-specific skill files
+ curated source registry
+ course content repository
+ validation workflow
+ observability
+ human approval
```

The agent should behave like a careful curriculum assistant, not like an uncontrolled publisher.

The goal is not to produce a lot of content.

The goal is to produce trusted, useful, up-to-date, practical MCP learning material over time.
