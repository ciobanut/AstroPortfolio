---
layout: '../../layouts/SingleBlogLayout.astro'
title: 'How I Got Typesense Running in Docker Swarm Using a Secret API Key'
description: ''
isDraft: false
pubDate: '13-05-2025'
image:
  src: 'https://www.scrut.io/wp-content/uploads/2022/10/typesense-1.jpg'
  alt: 'laravel'
tags:
  - 'laravel'
  - 'Livewire'
  - 'FilePond'
  - 'MediaLibrary'
  - 'Uploads'
---

Recently, I needed to run <a href="https://typesense.org " target="_blank" rel="noopener noreferrer">Typesense</a>, a fast and open-source full-text search engine, inside a **Docker Swarm** environment. Everything went smoothly... until I tried to securely pass the API key using **Docker Secrets**.

The official documentation doesn’t directly cover this scenario, and the seemingly “correct” solutions didn’t work at all. In this post, I’ll document everything I tried — and the one solution that actually worked.

---

## ⚠️ First attempt: Classic environment variable

At first, I tried something simple almost like in <a href="https://typesense.org/docs/guide/install-typesense.html#docker" target="_blank" rel="noopener noreferrer">official documentation</a>:

```yaml
command: '--api-key=xyz ...'
```

✅ Works for **development**
❌ But it’s **insecure** — the key appears in `docker inspect`, logs, and debugging tools, and Github repository.

Next try also not working:

```yaml
environment:
  api-key: xyz
```

So I moved on to a safer method: **Docker Secrets**.

---

## ❌ Second attempt: Secret mount + `_FILE` variable

Then I tried a common pattern that works with many official Docker images like MySQL:

```yaml
secrets:
  - typesense_api_key
environment:
  TYPESENSE_API_KEY_FILE: /run/secrets/typesense_api_key
```

But **Typesense doesn’t read these variables automatically**. It doesn’t have an `entrypoint.sh` that parses `_FILE` variables like other images do.

➡️ **Result:** Typesense **didn’t start at all**. Running:

```bash
docker service logs po_typesense
```

showed the message:

```
You can also pass these arguments as environment variables such as TYPESENSE_DATA_DIR, TYPESENSE_API_KEY, etc.
```

This means the server didn’t receive the API key — not via CLI args, not via standard environment variables. So the service failed to start entirely.

---

## ❌ Third attempt: Interpolation with `cat`

Next, I tried reading the secret using `cat` in the `command`:

```yaml
command: '--api-key=$(cat /run/secrets/typesense_api_key)'
```

💥 Result: Docker Compose throws a parsing error:

```
invalid interpolation format... you may need to escape any $ with another $
```

Even with `sh -c` and escaping, this approach didn’t work in this form.

---

## ✅ The correct solution: `entrypoint` with shell + `cat`

The **only working solution** was using a custom `entrypoint` that runs a shell script and reads the secret at runtime:

```yaml
entrypoint: >
  sh -c "exec /opt/typesense-server --data-dir /data --api-key=$$(cat /run/secrets/typesense_api_key)"
```

### Full working `docker-compose.yml` for Swarm:

```yaml
version: '3.8'

services:
  typesense:
    image: 'typesense/typesense:26.0'
    volumes:
      - typesense_data:/data
    secrets:
      - typesense_api_key
    entrypoint: >
      sh -c "exec /opt/typesense-server --data-dir /data --api-key=$$(cat /run/secrets/typesense_api_key)"
    ports:
      - '8108:8108'

secrets:
  typesense_api_key:
    file: ./typesense_api_key.txt

volumes:
  typesense_data:
```

📌 Key points:

- The `$$` is required to escape the `$` so Docker Compose doesn’t try to interpret it.
- Using `exec` ensures `typesense-server` is PID 1, so signals and restarts work correctly.

---

## 🧪 Testing

After deploying:

```bash
docker stack deploy -c docker-compose.yml search
```

Check the logs:

```bash
docker service logs search_typesense
```

You should see something like:

```
[info][server] API Key provided
[info][server] Typesense server listening on port 8108
```

---

I must mention that this is not enough to keep the api-key secret. For example: my laravel application uses `typesense/typesense-instantsearch-adapter` which displays the api-key in the frontend. And in order not to display the main api-key to the public I generated an api-key exclusively for search according to the official documentation.

## 🧩 Conclusion

While this setup might seem simple, using Docker Secrets with applications that **don’t support `_FILE` variables** requires a little scripting. In the case of Typesense, the only reliable way is to **read the secret using `cat` inside a shell command** at container startup.

If you’re running Typesense in production and need a secure setup, this method is safe and Swarm-compatible.
