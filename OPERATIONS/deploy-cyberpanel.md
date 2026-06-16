# Deploy CyberPanel

Operational notes for the `reconociendotupoder.com` child site deploy on CyberPanel/OpenLiteSpeed.

## Site

- Domain: `reconociendotupoder.com`
- Source: `/home/reconociendotupoder.com/source`
- Web root: `/home/reconociendotupoder.com/public_html`
- Child branch: `reconociendotupoder`
- Parent base: `funnel-boilerplate parent-clean-v1`

## Remotes

- `origin`: `reconociendotupoder.com`
- `upstream`: `funnel-boilerplate`

## Current Deploy Flow

The current production artifact is built from the child source and copied into the CyberPanel web root.

1. Build with `npm run build`.
2. Create a backup of the existing `public_html` before replacing files.
3. Deploy with `rsync` from `dist/` into `public_html`.
4. Correct ownership if the deploy is performed as `root`.

## Ownership

- `public_html` directory: `recon3297:nogroup`
- Files under `public_html`: `recon3297:recon3297`

Directories below `public_html` should use `recon3297:nogroup`.

## Reference Commands

Run these from `/home/reconociendotupoder.com/source`.

### Backup

```bash
BACKUP_DIR="/home/reconociendotupoder.com/backups/public_html-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$(dirname "$BACKUP_DIR")"
cp -a /home/reconociendotupoder.com/public_html "$BACKUP_DIR"
```

### Validation

```bash
npm test
php -l public/capture.php
npm run typecheck
npm run lint
npm run build
```

### Deploy

```bash
rsync -av --delete --exclude 'capture.php' dist/ /home/reconociendotupoder.com/public_html/
```

### Future Funnel Protection

When the immersive funnel is deployed under the same domain from a separate
repo, preserve its built folders during offer deploys. Once
`public_html/fi/` and `public_html/x9m/fi/` exist, add these excludes to the
offer deploy command:

```bash
rsync -av --delete \
  --exclude 'capture.php' \
  --exclude '/fi/' \
  --exclude '/x9m/fi/' \
  dist/ /home/reconociendotupoder.com/public_html/
```

Do not add the `/fi/` excludes to the active deploy command until those folders
exist and are owned by the funnel repo/deploy process.

### Ownership Repair

Use this after deploys run as `root`.

```bash
chown -R recon3297:recon3297 /home/reconociendotupoder.com/public_html
chown recon3297:nogroup /home/reconociendotupoder.com/public_html
find /home/reconociendotupoder.com/public_html -type d -exec chown recon3297:nogroup {} \;
find /home/reconociendotupoder.com/public_html -type f -exec chown recon3297:recon3297 {} \;
```

## Smoke Routes

```bash
curl -I https://reconociendotupoder.com/
curl -I https://reconociendotupoder.com/x9m
curl -I https://reconociendotupoder.com/no-le-escribas
curl -I https://reconociendotupoder.com/o/no-le-escribas
curl -I https://reconociendotupoder.com/x9m/no-le-escribas
curl -I https://reconociendotupoder.com/x9m/o/no-le-escribas
curl -I https://reconociendotupoder.com/oferta
curl -I https://reconociendotupoder.com/x9m/oferta
curl -I https://reconociendotupoder.com/confirmacion
curl -I https://reconociendotupoder.com/x9m/confirmacion
```
