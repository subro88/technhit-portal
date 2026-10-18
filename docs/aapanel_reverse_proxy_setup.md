# aaPanel Production Reverse Proxy Setup Guide for TechNHIT

**Domain**: `https://technhit.in` & `https://www.technhit.in`  
**Internal Port**: `127.0.0.1:3000`  
**Container**: `technhit_app`  
**Install Directory**: `/www/wwwroot/technhit.in`

---

## Architecture on aaPanel

```
[ Visitor Browser (HTTPS) ]
            │
            ▼
[ aaPanel Nginx (Port 80/443 with Let's Encrypt SSL) ]
   ├── /_next/static/   ───> Cached for 365 Days (Immutable)
   ├── /uploads/        ───> Cached for 30 Days
   ├── /images/         ───> Cached for 7 Days
   ├── /admin & /api    ───> Direct Pass (No Cache + Rate Limiting)
   └── /                ───> Reverse Proxy (http://127.0.0.1:3000)
                              │
                              ▼
                     [ Docker Container: technhit_app ]
                     Next.js 15 Standalone Node Server
```

---

## Step 1: Run Backend Installer on Production Server

SSH into your server and run the dedicated TechNHIT installer:

```bash
# Option A: Standalone TechNHIT Installer
sudo bash /www/wwwroot/technhit.in/scripts/install-technhit.sh

# Option B: Via Master NHIT Suite Installer
cd /www/wwwroot && sudo bash install-aapanel-all.sh --app technhit
```

The script will automatically:
- Clone or pull `https://github.com/subro88/technhit-portal.git` into `/www/wwwroot/technhit.in`.
- Generate a cryptographic 32-byte `AUTH_SECRET` and secure `ADMIN_FALLBACK_PASSWORD`.
- Set directory permissions (`775`) on `content/` and `public/uploads/`.
- Build and launch Docker container `technhit_app` bound strictly to `127.0.0.1:3000`.
- Verify the internal health check (`http://127.0.0.1:3000/api/health`).

---

## Step 2: Create the Website in aaPanel

1. Open your **aaPanel Web Console** (`https://your-server-ip:8888`).
2. Navigate to **Website** in the left sidebar and click **Add site**.
3. Fill in the website parameters:
   - **Domain Name**: 
     ```
     technhit.in
     www.technhit.in
     ```
   - **Description**: `TechNHIT Engineering Portal`
   - **Root directory**: `/www/wwwroot/technhit.in`
   - **FTP**: `Do not create`
   - **Database**: `Do not create` (managed internally via Markdown & GitOps)
   - **PHP Version**: `Pure static` (or any installed version)
4. Click **Submit**.

---

## Step 3: Issue SSL Certificate (Let's Encrypt)

1. In the **Website** list, click on the domain name `technhit.in` to open website settings.
2. Navigate to the **SSL** tab on the left.
3. Select **Let's Encrypt**:
   - Check both `technhit.in` and `www.technhit.in`.
   - Select verification method (File verification or DNS verification).
   - Click **Apply**.
4. Once the certificate is issued, toggle **Force HTTPS** to `ON`.

---

## Step 4: Configure aaPanel Reverse Proxy

1. Still in the website settings window, click on the **Reverse Proxy** tab on the left.
2. Click **Add reverse proxy**.
3. Configure the proxy parameters:
   - **Proxy Name**: `technhit_proxy`
   - **Target URL**: `http://127.0.0.1:3000`
   - **Sent Domain**: `$host`
   - **Proxy dir**: `/`
4. Toggle **Advanced** settings:
   - Ensure WebSocket support is enabled (passes `Upgrade` and `Connection` headers).
5. Click **Submit**.

---

## Step 5: (Recommended) Configure Next.js Static Caching

To ensure maximum performance and offload Next.js from serving static files repeatedly:

1. In the website settings window, navigate to the **Config** (Nginx Configuration) tab.
2. Locate the `location /` proxy block or replace the proxy section with the contents of:
   ```
   /www/wwwroot/technhit.in/nginx/aapanel-technhit.conf
   ```
3. Specifically ensure this static block is present before the general `location /`:
   ```nginx
   # Next.js Static Chunks (1-Year Immutable Caching)
   location /_next/static/ {
       proxy_pass http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header Connection "";
       expires 365d;
       add_header Cache-Control "public, max-age=31536000, immutable";
       access_log off;
   }

   # Media Uploads (30-Day Cache)
   location /uploads/ {
       proxy_pass http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header Connection "";
       expires 30d;
       add_header Cache-Control "public, max-age=2592000";
       access_log off;
   }
   ```
4. Click **Save**. aaPanel will automatically test and reload Nginx.

---

## Step 6: Verify Deployment

1. Visit `https://technhit.in` in your browser:
   - Verify the dark industrial shell, Tux Gear logo, and 3D server rack render smoothly.
2. Visit `https://technhit.in/api/health`:
   - Returns JSON: `{"status":"healthy","service":"technhit-portal","cluster":"ONLINE",...}`.
3. Visit `https://technhit.in/admin`:
   - Admin Studio login screen.

---

## Routine Operations: Zero-Downtime Hot Updates

Whenever you make updates and push commits to `https://github.com/subro88/technhit-portal`:

```bash
sudo bash /www/wwwroot/technhit.in/scripts/update-technhit.sh
```

The script backs up your production `.env`, synchronizes `origin/main`, builds the standalone image in the background, swaps the container in place, and confirms health status with zero downtime.
