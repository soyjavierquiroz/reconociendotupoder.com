# Capture Server Environment

Operational notes for the server-side `CAPTURE_*` configuration used by `public/capture.php`.

## Location

The live `CAPTURE_*` variables are configured server-side in:

```text
/usr/local/lsws/conf/vhosts/reconociendotupoder.com/vhost.conf
```

They live inside the OpenLiteSpeed vhost extprocessor named `recon3297`.

## Backup And Reload

Backup created before the current server env change:

```text
/usr/local/lsws/conf/vhosts/reconociendotupoder.com/vhost.conf.bak-20260607-142352
```

Reload command used after editing the vhost:

```bash
/usr/local/lsws/bin/lswsctrl reload
```

## Current Variables

```bash
CAPTURE_SITE_ID=reconociendo-tu-poder
CAPTURE_ALLOWED_ORIGINS=https://reconociendotupoder.com,https://www.reconociendotupoder.com
CAPTURE_ALLOWED_CHANNELS=ads,organic
CAPTURE_DEFAULT_LIST_SLUG=rtp-main-list
CAPTURE_ORGANIC_LIST_SLUG=rtp-organic-list
CAPTURE_TIMEOUT_SECONDS=10
CAPTURE_LOG_PII=false
CAPTURE_DRY_RUN=true
CAPTURE_MAX_BODY_BYTES=32768
```

No real webhooks are configured yet. `CAPTURE_DRY_RUN=true`, so allowed requests validate routing and list selection without sending leads to an external webhook.

Do not commit real webhook URLs, tokens, or secrets.

## Logs

Observed capture logs are written through OpenLiteSpeed/PHP error logging:

```text
/usr/local/lsws/logs/error.log
```

## Validation Curls

These commands validate the current dry-run behavior without including secrets.

### Ads Allowed

```bash
curl -i https://reconociendotupoder.com/capture.php \
  -H 'Origin: https://reconociendotupoder.com' \
  -H 'Content-Type: application/json' \
  --data '{"name":"RTP Test","email":"rtp-test@example.com","traffic_channel":"ads","page_url":"https://reconociendotupoder.com/x9m"}'
```

Expected result: `200` with `dry_run: true`, `channel: "ads"`, and `list: "rtp-main-list"`.

### Organic Allowed

```bash
curl -i https://reconociendotupoder.com/capture.php \
  -H 'Origin: https://reconociendotupoder.com' \
  -H 'Content-Type: application/json' \
  --data '{"name":"RTP Test","email":"rtp-test@example.com","traffic_channel":"organic","page_url":"https://reconociendotupoder.com/"}'
```

Expected result: `200` with `dry_run: true`, `channel: "organic"`, and `list: "rtp-organic-list"`.

### Blocked Origin

```bash
curl -i https://reconociendotupoder.com/capture.php \
  -H 'Origin: https://example.invalid' \
  -H 'Content-Type: application/json' \
  --data '{"name":"RTP Test","email":"rtp-test@example.com","traffic_channel":"ads","page_url":"https://reconociendotupoder.com/x9m"}'
```

Expected result: `403` with `error: "origin_not_allowed"`.

### Invalid Email

```bash
curl -i https://reconociendotupoder.com/capture.php \
  -H 'Origin: https://reconociendotupoder.com' \
  -H 'Content-Type: application/json' \
  --data '{"name":"RTP Test","email":"not-an-email","traffic_channel":"ads","page_url":"https://reconociendotupoder.com/x9m"}'
```

Expected result: `422` with `error: "email_invalid"`.
