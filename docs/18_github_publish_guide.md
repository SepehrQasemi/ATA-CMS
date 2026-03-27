# ATA-CMS GitHub Publish Guide

## Target repository

- Owner: `SepehrQasemi`
- Repository: `ATA-CMS`
- Visibility: `public`

## Recommended publish command

```bash
gh repo create SepehrQasemi/ATA-CMS --public --source=. --remote=origin --push
```

## Verification commands

```bash
git remote -v
git branch --show-current
git status --short
gh repo view SepehrQasemi/ATA-CMS
```

## Notes

- The package metadata already points to `https://github.com/SepehrQasemi/ATA-CMS`
- The repository is intended to be public on GitHub, but the npm package remains `private` because npm publication is not part of the MVP
- If GitHub creation fails because the repository already exists, add the remote manually and push:

```bash
git remote add origin https://github.com/SepehrQasemi/ATA-CMS.git
git push -u origin main
```
