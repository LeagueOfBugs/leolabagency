# LeoLabAgency Registry

Module source files served via GitHub raw URLs.

## Adding a module — quick reference

```bash
# 1. Create structure
mkdir -p modules/{name}/versions/{version}/files

# 2. Write module.json + files (see root README for format)

# 3. Add entry to registry.json

# 4. Commit + tag + push
git add -A
git commit -m "Add {name}@{version}"
git tag {name}@{version}
git push origin main --tags
```

## Releasing a new version

```bash
cp -r modules/{name}/versions/1.0.0 modules/{name}/versions/1.1.0
# edit files and module.json version field
# update registry.json: add to versions[], update latestVersion
git add -A
git commit -m "Release {name}@1.1.0"
git tag {name}@1.1.0
git push origin main --tags
```

## Rules

- `files` in `module.json` must list every file exactly — the CLI fetches this list verbatim
- API routes go in `installPaths` so they land in `app/api/` not `src/modules/`
- Inter-module imports use `@/modules/{name}/` path alias
- Money: integer cents only, never floats
- Client components need `"use client"` at the top
