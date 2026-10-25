import type { Post } from "@/lib/posts";

export interface ReconCard {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  definition: string;
  seenInProd: string;
}

export interface MotiveBenchmark {
  headline: string;
  subheadline: string;
  uncompressedBytes: number;
  compressedBytes: number;
  savingsPercentage: number;
  explanation: string;
  networkProfiles: {
    name: string;
    speedKbps: number;
    uncompressedTimeMs: number;
    compressedTimeMs: number;
  }[];
}

export interface DebateStatement {
  id: string;
  scenario: string;
  proposedAction: string;
  isValid: boolean; // true = Valid/Accept, false = Flawed/Reject
  explanation: string;
  badgeTag: string;
}

export interface TerminalStep {
  id: string;
  title: string;
  description: string;
  command: string;
  output: string;
  verificationRegex?: string;
}

export interface SimulatorSpec {
  headline: string;
  description: string;
  defaultHost: string;
  terminalSteps: TerminalStep[];
  defaultPayloadBytes: number;
  compressedPayloadBytes: number;
  responseHeaders: Record<string, string>;
}

export interface DebriefRule {
  id: string;
  number: string;
  title: string;
  rule: string;
  antiPattern: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningDrillData {
  slug: string;
  title: string;
  category: string;
  badgeName: string;
  badgeDescription: string;
  architectureDiagram?: {
    type: "reverse-proxy" | "cluster" | "network" | "stem" | "php-fpm" | "kernel-firewall" | "ssh-handshake" | "apache-vhost" | "system-telemetry";
    title: string;
  };
  reconCards: ReconCard[];
  motive: MotiveBenchmark;
  debateStatements: DebateStatement[];
  simulator: SimulatorSpec;
  debriefRules: DebriefRule[];
  quiz: QuizQuestion[];
}

// Handcrafted Flagship Drill for Brotli Compression
const BROTLI_DRILL: LearningDrillData = {
  slug: "install-and-config-brotli-compression-with-apache",
  title: "Install and config Brotli Compression with Apache",
  category: "linux-server-admin",
  badgeName: "Brotli Performance Architect",
  badgeDescription: "Mastered mod_brotli Apache deployment, compression ratio calibration, and HTTP/2 packet optimization.",
  reconCards: [
    {
      id: "rc-1",
      tag: "ALGORITHM",
      title: "BROTLI (RFC 7932)",
      subtitle: "LZ77 + Huffman + 120KB Dict",
      definition: "An open-source lossless compression algorithm developed by Google using a static dictionary of common web words to achieve 15-25% better ratios than Gzip.",
      seenInProd: "Serves static HTML/JS/CSS on high-traffic CDNs (Cloudflare, Fastly, Google).",
    },
    {
      id: "rc-2",
      tag: "APACHE MODULE",
      title: "MOD_BROTLI",
      subtitle: "Filter Provider Mechanism",
      definition: "Apache HTTP Server module that provides BROTLI_COMPRESS output filter, intercepting outgoing response bodies before TCP transmission.",
      seenInProd: "Activated via 'a2enmod brotli' on Ubuntu 20.04/22.04/24.04 LTS clusters.",
    },
    {
      id: "rc-3",
      tag: "COMPRESSION LEVELS",
      title: "QUALITY SCALE (1-11)",
      subtitle: "CPU vs Ratio Tradeoff",
      definition: "Brotli scales from quality 1 (fastest, lightweight CPU) to 11 (maximum compression, heavy CPU). Quality 4-6 is optimal for dynamic traffic; 11 is strictly for pre-compressed static assets.",
      seenInProd: "Apache defaults to quality 5 for dynamic content to avoid worker thread saturation.",
    },
    {
      id: "rc-4",
      tag: "HTTP HEADERS",
      title: "CONTENT-ENCODING: BR",
      subtitle: "Client-Server Negotiation",
      definition: "The client announces support via 'Accept-Encoding: gzip, deflate, br'. The server responds with 'Content-Encoding: br' and 'Vary: Accept-Encoding'.",
      seenInProd: "Enforced automatically by modern Chromium, Safari, Firefox, and Edge over HTTPS.",
    },
    {
      id: "rc-5",
      tag: "MIME FILTERING",
      title: "ADDOUTPUTFILTERBYTYPE",
      subtitle: "Selective Compression",
      definition: "Directive restricting Brotli compression strictly to text-based assets (HTML, CSS, JS, SVG, JSON). Applying Brotli to JPEG/PNG/WebP is an anti-pattern that wastes CPU for negative compression.",
      seenInProd: "Specified inside <IfModule mod_brotli.c> in VirtualHost configuration.",
    },
    {
      id: "rc-6",
      tag: "SECURITY",
      title: "BREACH / CRIME MITIGATION",
      subtitle: "Compression Side-Channels",
      definition: "HTTP compression over HTTPS can leak secrets via response size variance. Mitigated by disabling compression on authenticated CSRF responses or using SameSite cookies.",
      seenInProd: "Sensitive dynamic token endpoints bypass BROTLI_COMPRESS filters.",
    },
  ],
  motive: {
    headline: "THE LATENCY DEATH SPIRAL VS. 1-SECOND CONVERSION TAX",
    subheadline: "Google studies prove 40% of users abandon sites exceeding 3-second load times. A 1-second delay erodes 7% of conversions.",
    uncompressedBytes: 184500, // 184.5 KB
    compressedBytes: 38200,   // 38.2 KB
    savingsPercentage: 79.3,
    explanation: "On a production bundle containing modern React/Vue libraries, CSS, and HTML, Brotli reduces over-the-wire payload by ~79%, slashing Time to Interactive (TTI) on mobile cellular connections.",
    networkProfiles: [
      { name: "3G Mobile (750 Kbps, 150ms RTT)", speedKbps: 750, uncompressedTimeMs: 2110, compressedTimeMs: 560 },
      { name: "4G LTE (15 Mbps, 45ms RTT)", speedKbps: 15000, uncompressedTimeMs: 145, compressedTimeMs: 65 },
      { name: "Fiber Gigabit (1 Gbps, 8ms RTT)", speedKbps: 1000000, uncompressedTimeMs: 10, compressedTimeMs: 8 },
    ],
  },
  debateStatements: [
    {
      id: "ds-1",
      scenario: "Dynamic REST API JSON Responses",
      proposedAction: "Configure Brotli compression level 11 on all dynamic MySQL database query responses in Apache.",
      isValid: false,
      explanation: "FLAWED: Quality 11 takes hundreds of milliseconds of intense CPU calculation per request. Dynamic responses should use Brotli level 4-5 or Gzip level 5 to prevent severe CPU starvation.",
      badgeTag: "CPU_BUDGET",
    },
    {
      id: "ds-2",
      scenario: "Static Production Assets (Vite / Webpack / Next.js chunks)",
      proposedAction: "Pre-compress .js and .css files into .js.br at level 11 during CI/CD build, and configure Apache to serve them with fallback.",
      isValid: true,
      explanation: "VALID ARCHITECTURE: Pre-compression runs once during CI. Serving pre-compressed .br files incurs zero runtime CPU cost and delivers maximum 82%+ compression directly from NVMe/ZFS cache.",
      badgeTag: "BUILD_PIPELINE",
    },
    {
      id: "ds-3",
      scenario: "Image File Extension Targeting",
      proposedAction: "Add 'image/jpeg', 'image/png', and 'image/webp' to the AddOutputFilterByType BROTLI_COMPRESS directive.",
      isValid: false,
      explanation: "FLAWED: JPEG, PNG, and WebP are already heavily compressed binary formats. Re-compressing them with Brotli burns server CPU cycles and frequently results in larger file sizes due to header overhead.",
      badgeTag: "MIME_TARGETING",
    },
    {
      id: "ds-4",
      scenario: "Legacy Client Compatibility",
      proposedAction: "Ensure 'Vary: Accept-Encoding' is always sent with compressed responses so intermediary proxies and caches do not serve .br to clients that only support gzip.",
      isValid: true,
      explanation: "VALID: The 'Vary: Accept-Encoding' header is essential for cache coordination. Without it, a shared ISP or corporate proxy might cache a Brotli response and serve it to a legacy HTTP client.",
      badgeTag: "CACHE_COORDINATION",
    },
    {
      id: "ds-5",
      scenario: "Testing Over Plain HTTP (Port 80)",
      proposedAction: "Assume Brotli will be used by Chrome and Safari when browsing unencrypted http:// websites.",
      isValid: false,
      explanation: "FLAWED: Chrome and major browsers only advertise 'br' encoding over HTTPS connections to prevent legacy network middleboxes from corrupting unfamiliar stream types.",
      badgeTag: "HTTPS_ENFORCEMENT",
    },
    {
      id: "ds-6",
      scenario: "Apache Restart vs Reload",
      proposedAction: "Run 'apache2ctl configtest' before restarting or reloading Apache after modifying VirtualHost configuration.",
      isValid: true,
      explanation: "VALID: Always run 'apache2ctl configtest' or 'apachectl -t' to verify syntax validity before applying changes. A typo in an active VirtualHost will crash production daemon threads upon reload.",
      badgeTag: "ZERO_DOWNTIME",
    },
  ],
  simulator: {
    headline: "MOD_BROTLI TERMINAL & PACKET INSPECTION DRILL",
    description: "Execute the production deployment sequence in the simulated Ubuntu 24.04 terminal, then inspect live HTTP response headers and bandwidth metrics.",
    defaultHost: "https://technhit.in",
    terminalSteps: [
      {
        id: "step-1",
        title: "Install Brotli Binary & Libraries",
        description: "Pull the native Brotli compression utility package from Ubuntu/Debian mirrors.",
        command: "sudo apt install -y brotli",
        output: "Reading package lists... Done\nBuilding dependency tree... Done\nbrotli is already the newest version (1.1.0-2build2).\n0 upgraded, 0 newly installed, 0 to remove.",
      },
      {
        id: "step-2",
        title: "Enable Apache mod_brotli",
        description: "Activate the Apache Brotli filter provider module.",
        command: "sudo a2enmod brotli",
        output: "Enabling module brotli.\nTo activate the new configuration, you need to run:\n  systemctl restart apache2",
      },
      {
        id: "step-3",
        title: "Syntax Sanity Check",
        description: "Verify Apache configuration syntax integrity prior to service reload.",
        command: "sudo apache2ctl configtest",
        output: "Syntax OK",
      },
      {
        id: "step-4",
        title: "Graceful Daemon Reload",
        description: "Reload Apache systemd unit without dropping existing TCP sockets.",
        command: "sudo systemctl restart apache2",
        output: "[OK] Restarted The Apache HTTP Server.",
      },
      {
        id: "step-5",
        title: "CURL Handshake Verification",
        description: "Request header inspection requesting 'br' compression over HTTP.",
        command: "curl -I -H \"Accept-Encoding: br\" http://localhost",
        output: "HTTP/1.1 200 OK\nDate: Sat, 24 Oct 2026 12:45:00 GMT\nServer: Apache/2.4.58 (Ubuntu)\nVary: Accept-Encoding\nContent-Encoding: br\nContent-Type: text/html; charset=UTF-8\nTransfer-Encoding: chunked",
      },
    ],
    defaultPayloadBytes: 248900,
    compressedPayloadBytes: 49800,
    responseHeaders: {
      "HTTP/1.1": "200 OK",
      "Server": "Apache/2.4.58 (Ubuntu)",
      "Content-Encoding": "br",
      "Vary": "Accept-Encoding",
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    },
  },
  debriefRules: [
    {
      id: "rule-1",
      number: "01",
      title: "STATIC PRE-COMPRESS OVER RUNTIME COMPRESSION",
      rule: "Run 'brotli -q 11 *.js *.css' during build phase. Serve pre-compressed assets with Fallback to zero runtime CPU overhead.",
      antiPattern: "Running Brotli level 11 on dynamic server workers.",
    },
    {
      id: "rule-2",
      number: "02",
      title: "TARGET TEXTUAL MIME TYPES EXCLUSIVELY",
      rule: "Configure AddOutputFilterByType strictly on text/html, text/css, text/javascript, application/json, image/svg+xml.",
      antiPattern: "Adding Brotli filter to JPEGs, MP4s, or WebP files.",
    },
    {
      id: "rule-3",
      number: "03",
      title: "ALWAYS PRESERVE VARY: ACCEPT-ENCODING",
      rule: "Ensure intermediary CDNs and reverse proxies store separate cache keys for br, gzip, and identity payloads.",
      antiPattern: "Stripping Vary headers causing garbled text on legacy browsers.",
    },
    {
      id: "rule-4",
      number: "04",
      title: "CALIBRATE QUALITY 4-5 FOR DYNAMIC TRAFFIC",
      rule: "When compressing real-time SSR HTML or API output, limit Brotli quality to 4 or 5 to match Gzip CPU speed while gaining 15% better size.",
      antiPattern: "Defaulting dynamic filters to maximum quality.",
    },
    {
      id: "rule-5",
      number: "05",
      title: "ALWAYS VERIFY CONFIGTEST BEFORE RELOAD",
      rule: "Execute 'apache2ctl configtest' or 'nginx -t' before applying configuration to live edge clusters.",
      antiPattern: "Restarting web servers blindly without syntax checks.",
    },
  ],
  quiz: [
    {
      id: "q-1",
      scenario: "A client reports that when requesting your website using Chrome over HTTPS, the response is compressed with Brotli, but when using plain HTTP (port 80), it falls back to Gzip.",
      question: "What is the primary technical reason for this behavior?",
      options: [
        "Apache mod_brotli contains a bug on unencrypted sockets.",
        "Major browsers intentionally restrict 'Accept-Encoding: br' to HTTPS connections to prevent proxy corruption.",
        "Port 80 disables all compression at the Linux kernel nftables layer.",
        "Brotli requires TLS certificate keys to calculate dictionary hashing.",
      ],
      correctIndex: 1,
      explanation: "Chrome, Firefox, Edge, and Safari deliberately omit 'br' from Accept-Encoding on plain HTTP connections to prevent legacy corporate middleboxes from corrupting unrecognized compression streams.",
    },
    {
      id: "q-2",
      scenario: "During an audit of your Apache VirtualHost, you notice that server CPU usage spikes to 100% whenever an API endpoint serving 5MB JSON payloads is requested.",
      question: "What misconfiguration is most likely causing this severe CPU spike?",
      options: [
        "The Brotli compression level is set to quality 11 on dynamic responses.",
        "mod_brotli is missing the Linux kernel sysctl TCP window scaling flag.",
        "The server is missing the zlib compatibility symlink.",
        "Apache worker threads do not support Brotli streaming.",
      ],
      correctIndex: 0,
      explanation: "Brotli quality 11 performs exhaustive heuristic search and is intended exclusively for offline pre-compression. Running quality 11 dynamically consumes massive CPU cycles and causes request queuing.",
    },
    {
      id: "q-3",
      scenario: "You want to verify in terminal that your live Apache server returns Brotli-encoded assets.",
      question: "Which cURL command correctly requests and inspects the response headers?",
      options: [
        "curl -X POST -d 'compress=brotli' http://example.com",
        "curl -I -H 'Accept-Encoding: br' https://example.com",
        "curl --brotli-force https://example.com",
        "curl -s https://example.com | brotli -d",
      ],
      correctIndex: 1,
      explanation: "'curl -I -H \"Accept-Encoding: br\" <url>' sends a HEAD request advertising client support for Brotli, allowing you to verify 'Content-Encoding: br' and 'Vary: Accept-Encoding' in the returned headers.",
    },
    {
      id: "q-4",
      scenario: "A junior engineer recommends adding 'image/jpeg' and 'image/png' to the 'AddOutputFilterByType BROTLI_COMPRESS' directive.",
      question: "Why should you reject this recommendation?",
      options: [
        "Apache mod_brotli crashes when encountering binary signatures.",
        "JPEG and PNG images are already compressed; re-compressing burns CPU and often increases payload size.",
        "Brotli is only legally licensed for text files by Google.",
        "Browsers will refuse to render images with Content-Encoding headers.",
      ],
      correctIndex: 1,
      explanation: "JPEGs, PNGs, and WebPs already use advanced lossy/lossless compression. Re-compressing already compressed binary files wastes CPU and often bloats the file due to metadata and header overhead.",
    },
    {
      id: "q-5",
      scenario: "After editing /etc/apache2/sites-available/000-default.conf, what command must you run before executing 'systemctl restart apache2' to prevent accidental downtime?",
      question: "Which command performs the syntax check?",
      options: [
        "sudo apache2ctl configtest",
        "sudo systemctl status apache2 --check",
        "sudo a2chkcfg",
        "sudo brotli --test-config",
      ],
      correctIndex: 0,
      explanation: "'apache2ctl configtest' (or 'apachectl -t') parses all Apache configuration files and returns 'Syntax OK' or pinpoints exact line numbers with syntax errors, preventing broken restarts.",
    },
  ],
};

// Handcrafted Flagship Drill for Nginx Reverse Proxy
const NGINX_REVERSE_PROXY_DRILL: LearningDrillData = {
  slug: "setting-up-an-nginx-reverse-proxy",
  title: "Setting up an Nginx Reverse Proxy",
  category: "linux-server-admin",
  badgeName: "Reverse Proxy & Ingress Architect",
  badgeDescription: "Mastered Nginx reverse proxying, SSL/TLS termination, upstream keepalive pooling, and mod_remoteip header propagation.",
  architectureDiagram: {
    type: "reverse-proxy",
    title: "Nginx Edge Reverse Proxy & Apache Origin Mesh",
  },
  reconCards: [
    {
      id: "rc-1",
      tag: "CORE ARCHITECTURE",
      title: "REVERSE PROXY (RFC 7230)",
      subtitle: "Intermediary Ingress Gateway",
      definition: "An edge server that intercepts client web requests, applies caching, SSL termination, and rate limits, then delegates processing to origin backends across local or VPC sockets.",
      seenInProd: "Deployed as the public entry point (ports 80/443) on modern Kubernetes Ingress, AWS ALBs, and dedicated VPS nodes.",
    },
    {
      id: "rc-2",
      tag: "UPSTREAM ROUTING",
      title: "UPSTREAM DIRECTIVE & POOLING",
      subtitle: "Backend Socket Balancing",
      definition: "Groups backend application servers into a named cluster with support for load balancing algorithms (round-robin, least_conn, ip_hash) and persistent TCP keepalive pools.",
      seenInProd: "Configured via 'upstream backend { server 127.0.0.1:8080; keepalive 32; }' inside /etc/nginx/conf.d/.",
    },
    {
      id: "rc-3",
      tag: "CONCURRENCY SHOCK ABSORBER",
      title: "PROXY BUFFERING",
      subtitle: "Memory Buffer Isolation",
      definition: "Nginx reads full backend responses at Gigabit loopback speeds into memory buffers, liberating heavy Apache worker threads before trickling payloads out to slow cellular mobile clients.",
      seenInProd: "Tuned via 'proxy_buffering on; proxy_buffers 256 16k; proxy_buffer_size 128k;' in production proxy_params.",
    },
    {
      id: "rc-4",
      tag: "SECURITY & IDENTITY",
      title: "TRANSPARENT CLIENT IP FORWARDING",
      subtitle: "X-Forwarded-For & RemoteIP",
      definition: "Nginx passes real visitor IPs in the 'X-Forwarded-For' header. Origin Apache instances use 'mod_remoteip' to log the actual visitor IP instead of the 127.0.0.1 loopback address.",
      seenInProd: "Activated in Apache via 'a2enmod remoteip' and 'RemoteIPHeader X-Forwarded-For'.",
    },
    {
      id: "rc-5",
      tag: "ZERO-COPY I/O",
      title: "SENDFILE STATIC CACHE",
      subtitle: "Kernel-Level Direct Streaming",
      definition: "Nginx serves static HTML, CSS, JavaScript, and images directly from NVMe storage using the Linux kernel 'sendfile()' syscall, bypassing user space completely in <1ms without touching Apache.",
      seenInProd: "Mapped inside 'location ~* \\.(css|js|png|jpg|svg)$ { root /var/www/html; expires 30d; }'.",
    },
    {
      id: "rc-6",
      tag: "PROTOCOL EVOLUTION",
      title: "WEBSOCKET & HTTP/2 UPGRADE",
      subtitle: "Duplex Connection Tunneling",
      definition: "Enables bidirectional, full-duplex communication pipelines by dynamically passing HTTP 'Upgrade' and 'Connection: upgrade' headers to real-time microservices and Node.js daemons.",
      seenInProd: "Required for live terminal consoles, chat engines, and Socket.io instances.",
    },
  ],
  motive: {
    headline: "THREAD EXHAUSTION VS. 100K ASYNC EPOLL WORKERS",
    subheadline: "Apache MPM prefork allocates 1 dedicated OS process (~25MB RAM) per connection. 1,000 slow mobile clients consume 25GB RAM and freeze the server. Nginx handles 100,000 clients in 50MB.",
    uncompressedBytes: 540000,
    compressedBytes: 86000,
    savingsPercentage: 84.1,
    explanation: "By decoupling fast backend application execution (1.2ms) from slow client network drains (500ms-4000ms), Nginx prevents thread starvation and multiplies server request capacity by 12x.",
    networkProfiles: [
      { name: "3G Mobile (750 Kbps, 150ms RTT)", speedKbps: 750, uncompressedTimeMs: 4800, compressedTimeMs: 420 },
      { name: "4G LTE (15 Mbps, 45ms RTT)", speedKbps: 15000, uncompressedTimeMs: 450, compressedTimeMs: 85 },
      { name: "Fiber Gigabit (1 Gbps, 8ms RTT)", speedKbps: 1000000, uncompressedTimeMs: 35, compressedTimeMs: 4 },
    ],
  },
  debateStatements: [
    {
      id: "ds-1",
      scenario: "Origin Server Network Binding",
      proposedAction: "Configure Apache to listen on 0.0.0.0:8080 so developers can query backend scripts directly over the public internet.",
      isValid: false,
      explanation: "FLAWED ARCHITECTURE: Binding backend Apache to 0.0.0.0 exposes origin ports directly to automated scanners and DDoS attacks, bypassing Nginx security filters and SSL termination. Apache MUST listen strictly on 127.0.0.1:8080 or a private VPC subnet.",
      badgeTag: "SECURITY_PERIMETER",
    },
    {
      id: "ds-2",
      scenario: "Preserving Client Identity in Logs",
      proposedAction: "Include 'proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' and 'proxy_set_header Host $http_host;' in proxy configuration.",
      isValid: true,
      explanation: "VALID ARCHITECTURE: Passing the original Host header preserves name-based VirtualHost resolution on Apache, while $proxy_add_x_forwarded_for chains client IPs so the backend can record true visitor origins.",
      badgeTag: "HEADER_PROPAGATION",
    },
    {
      id: "ds-3",
      scenario: "Client IP Translation on Modern Ubuntu LTS",
      proposedAction: "Compile and install the third-party libapache2-mod-rpaf package on Ubuntu 22.04 or 24.04 LTS.",
      isValid: false,
      explanation: "FLAWED: mod_rpaf is obsolete and unmaintained. Apache 2.4+ includes native 'mod_remoteip' (sudo a2enmod remoteip), configured cleanly with 'RemoteIPHeader X-Forwarded-For' and 'RemoteIPInternalProxy 127.0.0.1'.",
      badgeTag: "LTS_MODERNIZATION",
    },
    {
      id: "ds-4",
      scenario: "Static File Delivery Strategy",
      proposedAction: "Configure Nginx to serve images, CSS, and JavaScript directly from /var/www/html while passing only dynamic / requests to Apache.",
      isValid: true,
      explanation: "VALID OPTIMIZATION: Nginx uses the Linux kernel 'sendfile()' zero-copy mechanism to serve static assets in microsecond timeframes without allocating memory or CPU in Apache worker processes.",
      badgeTag: "SENDFILE_OFFLOAD",
    },
    {
      id: "ds-5",
      scenario: "Proxy Buffer Management",
      proposedAction: "Disable proxy buffering globally ('proxy_buffering off;') on general web applications to ensure raw byte-for-byte streaming.",
      isValid: false,
      explanation: "FLAWED: Disabling buffering forces Apache backend workers to stay alive and blocked while slow mobile clients trickle download bytes over poor cellular connections. Keep buffering enabled except for SSE and LLM token streams.",
      badgeTag: "BUFFER_DISCIPLINE",
    },
    {
      id: "ds-6",
      scenario: "Applying Configuration Updates",
      proposedAction: "Run 'sudo nginx -t' followed by 'sudo systemctl reload nginx' to activate new reverse proxy VirtualHosts.",
      isValid: true,
      explanation: "VALID: 'nginx -t' validates syntax integrity, and 'reload' instructs the master process to spawn new workers while allowing existing workers to drain active TCP connections gracefully without dropping client traffic.",
      badgeTag: "ZERO_DOWNTIME",
    },
  ],
  simulator: {
    headline: "PRODUCTION NGINX REVERSE PROXY & APACHE INTEGRATION TERMINAL",
    description: "Re-bind Apache to localhost:8080, enable mod_remoteip, install Nginx with proxy_params, test configuration syntax, and verify transparent header passthrough via cURL.",
    defaultHost: "http://10.0.50.57",
    terminalSteps: [
      {
        id: "step-1",
        title: "Re-bind Apache to Localhost:8080",
        description: "Restrict Apache to loopback port 8080 so port 80 is freed for Nginx ingress.",
        command: "sudo sed -i 's/Listen 80/Listen 127.0.0.1:8080/' /etc/apache2/ports.conf && sudo apache2ctl configtest",
        output: "Syntax OK",
      },
      {
        id: "step-2",
        title: "Activate Apache mod_remoteip",
        description: "Enable the modern Apache remote IP translation module to log true client IPs.",
        command: "sudo a2enmod remoteip && sudo systemctl restart apache2",
        output: "Enabling module remoteip.\nTo activate the new configuration, you need to run:\n  systemctl restart apache2\n[OK] Restarted apache2.service.",
      },
      {
        id: "step-3",
        title: "Install & Start Nginx Ingress Daemon",
        description: "Deploy Nginx web server and reverse proxy package from Ubuntu repositories.",
        command: "sudo apt update && sudo apt install -y nginx && sudo systemctl enable --now nginx",
        output: "Reading package lists... Done\nSetting up nginx (1.24.0-2ubuntu7) ...\nSynchronizing state of nginx.service with SysV service script...\n[OK] Started nginx.service.",
      },
      {
        id: "step-4",
        title: "Verify Nginx Syntax Validity",
        description: "Parse /etc/nginx/sites-available/default to verify proxy_pass directives before applying.",
        command: "sudo nginx -t",
        output: "nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful",
      },
      {
        id: "step-5",
        title: "Zero-Downtime Daemon Reload",
        description: "Instruct Nginx master process to hot-reload worker configuration without dropping sockets.",
        command: "sudo systemctl reload nginx",
        output: "[OK] Reloaded nginx.service.",
      },
      {
        id: "step-6",
        title: "cURL Ingress Handshake Verification",
        description: "Query the public server IP to confirm Nginx edge proxy responds with Apache backend content.",
        command: "curl -I -H \"X-Test-Probe: technhit\" http://10.0.50.57",
        output: "HTTP/1.1 200 OK\nServer: nginx/1.24.0 (Ubuntu)\nDate: Sun, 25 Oct 2026 09:30:00 GMT\nContent-Type: text/html; charset=UTF-8\nConnection: keep-alive\nVary: Accept-Encoding\nX-Powered-By: Apache/2.4.58 (Ubuntu) Backend\nX-Real-IP-Propagated: 10.0.50.57",
      },
    ],
    defaultPayloadBytes: 420000,
    compressedPayloadBytes: 74000,
    responseHeaders: {
      "HTTP/1.1": "200 OK",
      "Server": "nginx/1.24.0 (Ubuntu)",
      "Date": "Sun, 25 Oct 2026 09:30:00 GMT",
      "Content-Type": "text/html; charset=UTF-8",
      "Connection": "keep-alive",
      "Vary": "Accept-Encoding",
      "X-Powered-By": "Apache/2.4.58 (Ubuntu) Backend",
      "X-Real-IP-Propagated": "10.0.50.57",
      "Cache-Control": "public, max-age=86400",
    },
  },
  debriefRules: [
    {
      id: "rule-1",
      number: "01",
      title: "BIND ORIGIN SERVERS STRICTLY TO LOCALHOST OR PRIVATE VPC",
      rule: "Never allow backend application ports (Apache 8080, Node 3000, Python 8000) to listen on 0.0.0.0. Force all WAN traffic through Nginx ingress.",
      antiPattern: "Leaving origin ports exposed directly to public internet probing.",
    },
    {
      id: "rule-2",
      number: "02",
      title: "USE NATIVE MOD_REMOTEIP OVER DEPRECATED MOD_RPAF",
      rule: "Configure 'RemoteIPHeader X-Forwarded-For' and 'RemoteIPInternalProxy 127.0.0.1' in Apache to record genuine client IPs across all access logs.",
      antiPattern: "Allowing access logs to show 127.0.0.1 for every single visitor request.",
    },
    {
      id: "rule-3",
      number: "03",
      title: "OFFLOAD STATIC ASSETS DIRECTLY WITH SENDFILE",
      rule: "Configure location blocks in Nginx to serve images, CSS, and JS directly from disk with long cache headers, bypassing backend processes completely.",
      antiPattern: "Routing static file requests through heavy dynamic application workers.",
    },
    {
      id: "rule-4",
      number: "04",
      title: "PRESERVE PROXY BUFFERING FOR MOBILE CONCURRENCY PROTECTION",
      rule: "Keep 'proxy_buffering on;' enabled so Nginx can absorb backend responses in 1ms and trickle bytes to slow mobile networks without tying up backend threads.",
      antiPattern: "Disabling proxy buffering globally on web and API endpoints.",
    },
    {
      id: "rule-5",
      number: "05",
      title: "ALWAYS VERIFY CONFIGTEST BEFORE RELOAD",
      rule: "Execute 'sudo nginx -t' followed by 'sudo systemctl reload nginx' to achieve zero-downtime configuration rollouts with continuous connection draining.",
      antiPattern: "Blindly running systemctl restart nginx during high production traffic.",
    },
  ],
  quiz: [
    {
      id: "q-1",
      scenario: "During a security audit, you discover that the backend Apache server is listening on 0.0.0.0:8080 while Nginx is listening on 0.0.0.0:80.",
      question: "What is the primary security hazard of this configuration?",
      options: [
        "Apache will reject all requests forwarded by Nginx due to IP conflicts.",
        "Attackers can bypass Nginx WAF, rate limits, and SSL termination by connecting directly to port 8080.",
        "The Linux kernel will drop TCP SYN packets due to socket duplication.",
        "Nginx will be unable to generate X-Forwarded-For headers.",
      ],
      correctIndex: 1,
      explanation: "When origin services bind to 0.0.0.0, external attackers can bypass Nginx ingress controls (rate limiting, SSL policies, WAF rules, and DDoS buffers) by querying port 8080 directly.",
    },
    {
      id: "q-2",
      scenario: "On an Ubuntu 24.04 LTS server running Apache behind an Nginx reverse proxy, all entries in Apache's /var/log/apache2/access.log show the client IP as 127.0.0.1.",
      question: "What is the recommended modern solution to restore genuine client IP logging in Apache 2.4+?",
      options: [
        "Install the legacy third-party libapache2-mod-rpaf package.",
        "Enable native 'mod_remoteip' and configure 'RemoteIPHeader X-Forwarded-For' with 'RemoteIPInternalProxy 127.0.0.1'.",
        "Disable Nginx proxy buffering and run Apache in host network mode.",
        "Configure Apache to use raw TCP socket sniffing via libpcap.",
      ],
      correctIndex: 1,
      explanation: "Apache 2.4+ provides native 'mod_remoteip'. When enabled with 'RemoteIPHeader X-Forwarded-For' and 'RemoteIPInternalProxy 127.0.0.1', Apache automatically replaces the loopback IP with the true client IP in all access logs.",
    },
    {
      id: "q-3",
      scenario: "Your web server experiences severe response latency whenever hundreds of mobile users on poor 3G connections download reports from your application.",
      question: "How does Nginx 'proxy_buffering on;' mitigate this thread exhaustion problem?",
      options: [
        "It forces the mobile clients to switch to HTTP/3 UDP packets.",
        "It reads the full response from Apache in milliseconds at local bus speed, freeing the backend worker while Nginx trickles bytes to the slow client.",
        "It compresses all response payloads using Brotli quality 11.",
        "It temporarily halts incoming GET requests until existing sockets close.",
      ],
      correctIndex: 1,
      explanation: "Proxy buffering allows Nginx to consume the backend response at gigabit loopback speed in 1-2ms, releasing the backend thread back to the pool while Nginx handles the slow transfer to the client.",
    },
    {
      id: "q-4",
      scenario: "You need to update proxy parameters inside /etc/nginx/sites-available/default on a high-traffic production server.",
      question: "Which command sequence applies the updates with ZERO dropped user connections?",
      options: [
        "sudo systemctl restart nginx",
        "sudo killall -9 nginx && sudo nginx",
        "sudo nginx -t && sudo systemctl reload nginx",
        "sudo a2enmod proxy && sudo service nginx restart",
      ],
      correctIndex: 2,
      explanation: "'sudo nginx -t' verifies configuration syntax first, and 'systemctl reload nginx' gracefully spawns new workers while letting existing workers finish servicing ongoing client requests without dropping a single packet.",
    },
    {
      id: "q-5",
      scenario: "A real-time dashboard microservice using WebSockets fails to connect through Nginx with an HTTP 400 Bad Request error.",
      question: "Which two headers MUST be configured in Nginx location block to enable WebSocket reverse proxying?",
      options: [
        "proxy_set_header Upgrade $http_upgrade; and proxy_set_header Connection \"upgrade\";",
        "proxy_set_header X-WebSocket-Mode auto; and proxy_set_header Accept-Encoding br;",
        "proxy_buffering off; and proxy_ssl_server_name on;",
        "proxy_set_header Transfer-Encoding chunked; and proxy_pass_header Set-Cookie;",
      ],
      correctIndex: 0,
      explanation: "WebSockets begin with an HTTP handshake requesting a protocol upgrade. Nginx requires 'proxy_set_header Upgrade $http_upgrade;' and 'proxy_set_header Connection \"upgrade\";' to pass this handshake to the upstream backend.",
    },
  ],
};

// Handcrafted Flagship Drill for Multiple PHP Versions with Apache
const MULTI_PHP_DRILL: LearningDrillData = {
  slug: "install-and-configure-multiple-php-version-with-apache-on-ubuntu-20-04",
  title: "Install and Configure Multiple PHP Version with Apache on Ubuntu 20.04",
  category: "linux-server-admin",
  badgeName: "Multi-PHP Runtime Architect",
  badgeDescription: "Mastered Ondřej Surý PPA repository deployment, PHP-FPM Unix domain socket pool tuning, and Apache mod_proxy_fcgi VirtualHost isolation.",
  architectureDiagram: {
    type: "php-fpm",
    title: "Apache FastCGI & Multi-PHP FPM Domain Socket Mesh",
  },
  reconCards: [
    {
      id: "rc-1",
      tag: "CORE RUNTIME",
      title: "PHP-FPM ARCHITECTURE",
      subtitle: "FastCGI Process Manager",
      definition: "An advanced FastCGI daemon for PHP featuring master-worker process pooling, dynamic worker scaling, slow-log tracing, and independent memory management.",
      seenInProd: "Runs as systemd services: 'php7.4-fpm.service', 'php8.1-fpm.service', 'php8.3-fpm.service'.",
    },
    {
      id: "rc-2",
      tag: "IPC HIGH SPEED",
      title: "UNIX DOMAIN SOCKETS",
      subtitle: "Zero TCP/IP Stack Overhead",
      definition: "Bidirectional inter-process communication channels residing in the Linux VFS (/run/php/*.sock), completely bypassing the kernel TCP network stack for maximum throughput.",
      seenInProd: "Specified as 'unix:/run/php/php8.1-fpm.sock' inside VirtualHost configuration files.",
    },
    {
      id: "rc-3",
      tag: "APACHE DISPATCH",
      title: "MOD_PROXY_FCGI",
      subtitle: "Protocol Translation Engine",
      definition: "The Apache module that translates incoming HTTP client requests into FastCGI protocol frames and routes them directly to the designated PHP-FPM socket.",
      seenInProd: "Enabled via 'sudo a2enmod proxy proxy_fcgi' with 'SetHandler proxy:unix:...' in VirtualHost blocks.",
    },
    {
      id: "rc-4",
      tag: "REPOSITORY ANCHOR",
      title: "ONDŘEJ SURÝ PPA",
      subtitle: "Canonical Debian/Ubuntu PHP Source",
      definition: "The definitive repository maintained by Ondřej Surý (Debian PHP team lead) providing cleanly partitioned, co-installable PHP versions from 5.6 to 8.4.",
      seenInProd: "Added via 'sudo add-apt-repository ppa:ondrej/php' on Ubuntu/Debian production servers.",
    },
    {
      id: "rc-5",
      tag: "APACHE MPM EVOLUTION",
      title: "EVENT MPM OVER PREFORK",
      subtitle: "Thread-Safe Async Architecture",
      definition: "Because PHP code execution is offloaded outside Apache into FPM daemons, Apache can safely switch from memory-heavy prefork to asynchronous event MPM, saving ~80% RAM.",
      seenInProd: "Activated via 'sudo a2dismod mpm_prefork && sudo a2enmod mpm_event'.",
    },
    {
      id: "rc-6",
      tag: "PERFORMANCE JIT",
      title: "OPCACHE & JIT ENGINE",
      subtitle: "Pre-compiled Bytecode Optimization",
      definition: "Caches precompiled PHP script bytecode directly in shared RAM and compiles hot loops to native x86_64 machine code via JIT in PHP 8.1+, avoiding parse penalties on every hit.",
      seenInProd: "Configured in '/etc/php/X.Y/fpm/conf.d/10-opcache.ini' with 'opcache.enable=1'.",
    },
  ],
  motive: {
    headline: "LEGACY MONOLITH MIGRATION DEADLOCK: ZERO-DOWNTIME MULTI-RUNTIME ISOLATION",
    subheadline: "Enterprise crisis: Upgrading system PHP breaks legacy core applications, while refusing to upgrade blocks modern high-speed frameworks. Running multi-PHP FPM resolves this deadlock completely.",
    uncompressedBytes: 490000,
    compressedBytes: 94000,
    savingsPercentage: 80.8,
    explanation: "Decoupling PHP execution from the Apache core process allows distinct VirtualHosts to execute different PHP runtimes simultaneously on the same hardware with 100% process isolation and 4x greater concurrency.",
    networkProfiles: [
      { name: "3G Mobile (750 Kbps, 150ms RTT)", speedKbps: 750, uncompressedTimeMs: 3400, compressedTimeMs: 480 },
      { name: "4G LTE (15 Mbps, 45ms RTT)", speedKbps: 15000, uncompressedTimeMs: 380, compressedTimeMs: 72 },
      { name: "Fiber Gigabit (1 Gbps, 8ms RTT)", speedKbps: 1000000, uncompressedTimeMs: 28, compressedTimeMs: 3 },
    ],
  },
  debateStatements: [
    {
      id: "ds-1",
      scenario: "Co-existence of Multiple mod_php Modules",
      proposedAction: "Enable both 'libapache2-mod-php7.4' and 'libapache2-mod-php8.1' simultaneously inside Apache using 'a2enmod'.",
      isValid: false,
      explanation: "FLAWED ARCHITECTURE: Apache cannot load two distinct mod_php shared objects into its binary address space at the same time. The MPM module will segfault or crash on startup. Multi-PHP strictly requires FastCGI / PHP-FPM.",
      badgeTag: "BINARY_CONFLICT",
    },
    {
      id: "ds-2",
      scenario: "FastCGI Socket Connection Protocol",
      proposedAction: "Route Apache traffic to PHP-FPM using Unix domain sockets ('unix:/run/php/php8.1-fpm.sock') instead of TCP loopback ('127.0.0.1:9000').",
      isValid: true,
      explanation: "VALID ARCHITECTURE: Unix domain sockets operate directly within the kernel virtual filesystem, bypassing network buffer allocations, TCP handshakes, and local port exhaustion under high load.",
      badgeTag: "SOCKET_IPC",
    },
    {
      id: "ds-3",
      scenario: "Apache MPM Selection After FPM Migration",
      proposedAction: "Keep Apache running on 'mpm_prefork' after migrating all VirtualHosts to PHP-FPM.",
      isValid: false,
      explanation: "FLAWED: mpm_prefork was only mandatory because mod_php was not thread-safe. With PHP-FPM handling execution, Apache should immediately switch to 'mpm_event' for modern asynchronous multithreading and 80% RAM savings.",
      badgeTag: "MPM_MODERNIZATION",
    },
    {
      id: "ds-4",
      scenario: "Granular VirtualHost Runtime Assignment",
      proposedAction: "Specify the target PHP version inside each VirtualHost block using a <FilesMatch \\.php$> container.",
      isValid: true,
      explanation: "VALID ARCHITECTURE: Wrapping SetHandler inside <FilesMatch \\.php$> guarantees that only PHP script extensions are routed to the socket, while images, CSS, and static assets are served directly by Apache.",
      badgeTag: "VHOST_SCOPING",
    },
    {
      id: "ds-5",
      scenario: "Configuration Reload Strategy",
      proposedAction: "Run 'sudo systemctl restart apache2' whenever modifying a 'php.ini' value in /etc/php/8.1/fpm/php.ini.",
      isValid: false,
      explanation: "FLAWED: Apache does not parse FPM php.ini files. Only the specific FPM daemon needs to be reloaded ('sudo systemctl reload php8.1-fpm'). Restarting Apache drops active client web connections unnecessarily.",
      badgeTag: "DAEMON_ISOLATION",
    },
    {
      id: "ds-6",
      scenario: "Security and Process Isolation",
      proposedAction: "Configure separate FPM pools with distinct system users and groups for client sites hosted on the same server.",
      isValid: true,
      explanation: "VALID: Creating dedicated pool files (/etc/php/8.1/fpm/pool.d/client1.conf) with unique 'user = client1' and 'group = client1' prevents compromised scripts on one site from accessing files on another site.",
      badgeTag: "LEAST_PRIVILEGE",
    },
  ],
  simulator: {
    headline: "MULTI-PHP FASTCGI DEPLOYMENT & SOCKET VALIDATION TERMINAL",
    description: "Add Ondřej Surý PPA, install PHP 7.4 & 8.1 FPM runtimes, switch Apache to Event MPM, verify Unix domain sockets, and test VirtualHost domain routing via cURL.",
    defaultHost: "http://10.0.50.57",
    terminalSteps: [
      {
        id: "step-1",
        title: "Add Ondřej Surý Canonical PHP PPA",
        description: "Register the trusted repository for co-installable PHP binaries on Ubuntu.",
        command: "sudo add-apt-repository -y ppa:ondrej/php && sudo apt update",
        output: "Hit:1 http://archive.ubuntu.com/ubuntu focal InRelease\nGet:2 http://ppa.launchpad.net/ondrej/php/ubuntu focal InRelease [24.6 kB]\nFetched 24.6 kB in 1s (21.4 kB/s)\nReading package lists... Done",
      },
      {
        id: "step-2",
        title: "Install PHP 7.4 & 8.1 FPM Runtimes",
        description: "Deploy legacy and modern FPM daemons alongside Apache FastCGI modules.",
        command: "sudo apt install -y php7.4-fpm php8.1-fpm libapache2-mod-fcgid",
        output: "Setting up php7.4-fpm (7.4.33-12+ubuntu20.04.1+deb.sury.org+1) ...\nCreated symlink /etc/systemd/system/multi-user.target.wants/php7.4-fpm.service.\nSetting up php8.1-fpm (8.1.30-1+ubuntu20.04.1+deb.sury.org+1) ...\nCreated symlink /etc/systemd/system/multi-user.target.wants/php8.1-fpm.service.\n[OK] Both FPM daemons initialized.",
      },
      {
        id: "step-3",
        title: "Switch Apache to Event MPM & Enable FastCGI Proxy",
        description: "Deactivate blocking prefork and activate asynchronous event MPM with proxy_fcgi.",
        command: "sudo a2dismod mpm_prefork && sudo a2enmod mpm_event proxy proxy_fcgi",
        output: "Module mpm_prefork disabled.\nEnabling module mpm_event.\nEnabling module proxy.\nEnabling module proxy_fcgi.\nTo activate the new configuration, you need to run:\n  systemctl restart apache2",
      },
      {
        id: "step-4",
        title: "Verify Active Unix Domain Sockets",
        description: "Confirm that both PHP-FPM daemons have mounted their IPC socket endpoints in /run/php/.",
        command: "ls -la /run/php/php*-fpm.sock",
        output: "srw-rw---- 1 www-data www-data 0 Oct 25 09:30 /run/php/php7.4-fpm.sock\nsrw-rw---- 1 www-data www-data 0 Oct 25 09:30 /run/php/php8.1-fpm.sock",
      },
      {
        id: "step-5",
        title: "Validate Apache Configuration Integrity",
        description: "Run syntax check on VirtualHost socket handlers before reloading service.",
        command: "sudo apache2ctl configtest",
        output: "Syntax OK",
      },
      {
        id: "step-6",
        title: "Test VirtualHost Runtime Routing via cURL",
        description: "Query both virtual host domains to verify independent PHP versions are returned.",
        command: "curl -s http://app74.local/info.php | grep -i 'php version' | head -n 1 && curl -s http://app81.local/info.php | grep -i 'php version' | head -n 1",
        output: "<tr><td class=\"e\">PHP Version </td><td class=\"v\">7.4.33</td></tr>\n<tr><td class=\"e\">PHP Version </td><td class=\"v\">8.1.30</td></tr>",
      },
    ],
    defaultPayloadBytes: 380000,
    compressedPayloadBytes: 68000,
    responseHeaders: {
      "HTTP/1.1": "200 OK",
      "Server": "Apache/2.4.58 (Ubuntu)",
      "Date": "Sun, 25 Oct 2026 09:30:00 GMT",
      "Content-Type": "text/html; charset=UTF-8",
      "X-Powered-By": "PHP/8.1.30",
      "Connection": "Keep-Alive",
      "Keep-Alive": "timeout=5, max=100",
    },
  },
  debriefRules: [
    {
      id: "rule-1",
      number: "01",
      title: "NEVER LOAD MULTIPLE MOD_PHP IN THE SAME APACHE PROCESS",
      rule: "Apache cannot link two distinct mod_php shared libraries. Always use FastCGI / PHP-FPM to decouple runtime versions into isolated external daemons.",
      antiPattern: "Attempting 'a2enmod php7.4' and 'a2enmod php8.1' simultaneously.",
    },
    {
      id: "rule-2",
      number: "02",
      title: "PREFER UNIX DOMAIN SOCKETS OVER LOOPBACK TCP PORTS",
      rule: "Route requests via 'proxy:unix:/run/php/phpX.Y-fpm.sock|fcgi://localhost' to eliminate network buffer overhead and prevent local port exhaustion.",
      antiPattern: "Binding FPM pools to 127.0.0.1:9000, 9001 on high-traffic nodes.",
    },
    {
      id: "rule-3",
      number: "03",
      title: "ALWAYS MIGRATE APACHE TO EVENT MPM",
      rule: "Once mod_php is eliminated, immediately disable mpm_prefork and enable mpm_event to reclaim 80% RAM and enable asynchronous HTTP/2 multiplexing.",
      antiPattern: "Leaving Apache on blocking mpm_prefork after adopting PHP-FPM.",
    },
    {
      id: "rule-4",
      number: "04",
      title: "SCOPE RUNTIMES USING <FILESMATCH \\.PHP$>",
      rule: "Confine SetHandler proxy directives strictly to PHP script extensions within the VirtualHost so static assets are served directly from disk without touching FPM.",
      antiPattern: "Applying SetHandler globally across the entire VirtualHost root.",
    },
    {
      id: "rule-5",
      number: "05",
      title: "RELOAD FPM DAEMONS INDEPENDENTLY OF APACHE",
      rule: "Execute 'sudo systemctl reload phpX.Y-fpm' when updating php.ini or pool settings. Do not restart Apache, preserving zero-downtime uptime for active clients.",
      antiPattern: "Restarting apache2.service for PHP configuration changes.",
    },
  ],
  quiz: [
    {
      id: "q-1",
      scenario: "A junior administrator attempts to enable both 'php7.4' and 'php8.1' inside Apache using 'sudo a2enmod php7.4 && sudo a2enmod php8.1'.",
      question: "What is the technical outcome when restarting Apache?",
      options: [
        "Apache automatically creates two worker pools and round-robins requests.",
        "Apache fails to start with a symbol collision error because two conflicting PHP C-libraries cannot be linked into the same memory space.",
        "Apache silently ignores PHP 7.4 and defaults all VirtualHosts to PHP 8.1.",
        "The Linux kernel terminates both modules with an SELinux violation.",
      ],
      correctIndex: 1,
      explanation: "mod_php embeds the entire PHP interpreter directly into Apache worker processes. Loading two distinct mod_php shared libraries causes symbol collisions and immediate daemon crash. PHP-FPM is required.",
    },
    {
      id: "q-2",
      scenario: "You are benchmarking Apache performance against an API receiving 10,000 requests per minute.",
      question: "Why does connecting to PHP-FPM via Unix domain sockets (/run/php/php8.1-fpm.sock) outperform TCP 127.0.0.1:9000?",
      options: [
        "Unix domain sockets bypass TCP protocol headers, checksums, and network queue buffers, running entirely within kernel VFS memory.",
        "TCP sockets on Linux are throttled by default to 100 requests per second.",
        "Unix domain sockets automatically compress PHP output with Brotli.",
        "TCP connections require root privileges on Linux.",
      ],
      correctIndex: 0,
      explanation: "Unix domain sockets avoid TCP handshake overhead, port exhaustion (ephemeral port allocation limits), and checksum calculations, providing lower latency and higher throughput for local IPC.",
    },
    {
      id: "q-3",
      scenario: "After migrating your Apache server from mod_php to PHP-FPM, you want to optimize memory utilization and concurrency.",
      question: "Which Apache Multi-Processing Module (MPM) should you activate?",
      options: [
        "mpm_worker",
        "mpm_prefork",
        "mpm_event",
        "mpm_single",
      ],
      correctIndex: 2,
      explanation: "mpm_event is the modern asynchronous event-driven MPM for Apache. Because PHP execution is handled externally by FPM, Apache workers can safely use asynchronous threads, handling thousands of connections with minimal RAM.",
    },
    {
      id: "q-4",
      scenario: "You have increased 'memory_limit' to 512M in /etc/php/8.1/fpm/php.ini for a memory-intensive data processing app.",
      question: "Which command applies this new configuration without dropping existing web traffic?",
      options: [
        "sudo systemctl restart apache2",
        "sudo systemctl reload php8.1-fpm",
        "sudo killall -9 php",
        "sudo service php-fpm restart-all",
      ],
      correctIndex: 1,
      explanation: "'sudo systemctl reload php8.1-fpm' sends a graceful USR2 signal to the PHP-FPM master process, which reloads configuration files and recycles worker processes as they finish active requests without touching Apache.",
    },
    {
      id: "q-5",
      scenario: "You need to configure an Apache VirtualHost for legacy.example.com to use PHP 7.4 via FastCGI.",
      question: "Which configuration block correctly forwards .php files to the PHP 7.4 socket?",
      options: [
        "<FilesMatch \\.php$>\n    SetHandler \"proxy:unix:/run/php/php7.4-fpm.sock|fcgi://localhost\"\n</FilesMatch>",
        "AddHandler application/x-httpd-php74 .php",
        "ProxyPass / http://localhost/php7.4/",
        "PHPIniDir /etc/php/7.4/apache2/php.ini",
      ],
      correctIndex: 0,
      explanation: "The '<FilesMatch \\.php$> SetHandler \"proxy:unix:/run/php/php7.4-fpm.sock|fcgi://localhost\" </FilesMatch>' directive tells Apache mod_proxy_fcgi to route any request ending in .php to the specified Unix domain socket.",
    },
  ],
};

// Handcrafted Flagship Drill for Linux Kernel Hardening & Nftables
const KERNEL_HARDENING_DRILL: LearningDrillData = {
  slug: "hardening-linux-kernel-sysctl-nftables",
  title: "Hardening Linux Kernel with sysctl & nftables Firewall rules",
  category: "linux-server-admin",
  badgeName: "Kernel Fortress Engineer",
  badgeDescription: "Mastered Linux TCP/IP stack sysctl hardening, SYN cookie flood defense, and atomic stateful nftables ruleset deployment.",
  architectureDiagram: {
    type: "kernel-firewall",
    title: "Linux Netfilter Ingress & TCP Stack Hardening Pipeline",
  },
  reconCards: [
    {
      id: "rc-1",
      tag: "TCP/IP DEFENSE",
      title: "TCP SYN COOKIES (RFC 4987)",
      subtitle: "State-Free Handshake Protection",
      definition: "Protects against connection table exhaustion by cryptographically encoding state into the initial SYN-ACK sequence number, allocating kernel memory only when client returns valid ACK.",
      seenInProd: "Enabled via 'net.ipv4.tcp_syncookies = 1' in /etc/sysctl.d/99-security.conf.",
    },
    {
      id: "rc-2",
      tag: "SPOOF MITIGATION",
      title: "REVERSE PATH FILTER (RP_FILTER)",
      subtitle: "Ingress Source Route Validation",
      definition: "Kernel drops incoming packets if their source IP cannot be routed back through the same physical interface (RFC 3704), stopping IP address spoofing attacks dead.",
      seenInProd: "Tuned via 'net.ipv4.conf.all.rp_filter = 1' (Strict Mode) on single-homed nodes.",
    },
    {
      id: "rc-3",
      tag: "FIREWALL VM",
      title: "NFTABLES ATOMIC FRAMEWORK",
      subtitle: "In-Kernel Bytecode Virtual Machine",
      definition: "Modern replacement for legacy iptables. Compiles rules into compact in-kernel bytecode, evaluating packets in <0.2µs and executing atomic ruleset replacements with zero table locking.",
      seenInProd: "Managed as the default packet filtering systemd unit 'nftables.service' on Ubuntu 24.04 and Debian 12.",
    },
    {
      id: "rc-4",
      tag: "ANOMALY DETECTION",
      title: "MARTIAN PACKET LOGGING",
      subtitle: "Impossible Route Detection",
      definition: "Logs incoming packets with impossible source addresses (e.g. broadcast or loopback addresses arriving over public WAN interfaces) to the kernel syslog ring buffer.",
      seenInProd: "Configured via 'net.ipv4.conf.all.log_martians = 1', audited via 'journalctl -k'.",
    },
    {
      id: "rc-5",
      tag: "REFLECTOR DEFENSE",
      title: "ICMP SMURF MITIGATION",
      subtitle: "Broadcast Echo Suppression",
      definition: "Prevents a host from being leveraged as an unwitting reflection amplifier in distributed ping attacks by unconditionally ignoring ICMP echo requests sent to broadcast subnets.",
      seenInProd: "Enforced via 'net.ipv4.icmp_echo_ignore_broadcasts = 1'.",
    },
    {
      id: "rc-6",
      tag: "SOCKET CYCLING",
      title: "TIME_WAIT REUSE & BACKLOG",
      subtitle: "High-Frequency Socket Allocation",
      definition: "Allows the kernel to safely recycle sockets stuck in TIME_WAIT state for outgoing connections and expands the connection queue to 8,192 entries to endure bursty traffic.",
      seenInProd: "Configured via 'net.ipv4.tcp_tw_reuse = 1' and 'net.ipv4.tcp_max_syn_backlog = 8192'.",
    },
  ],
  motive: {
    headline: "SYN QUEUE EXHAUSTION: 50,000 HALF-OPEN SOCKETS VS ZERO-RAM SYN COOKIES",
    subheadline: "A 100 Mbps SYN flood exhausts standard Linux connection queues in 1.4 seconds, dropping legitimate users. SYN cookies allow infinite connection attempts with zero allocated RAM.",
    uncompressedBytes: 620000,
    compressedBytes: 52000,
    savingsPercentage: 91.6,
    explanation: "By dropping invalid packets at the netfilter prerouting hook and deferring TCP socket allocation until valid cryptographic ACK responses, server availability remains at 100% during saturation attacks.",
    networkProfiles: [
      { name: "3G Mobile (750 Kbps, 150ms RTT)", speedKbps: 750, uncompressedTimeMs: 4600, compressedTimeMs: 380 },
      { name: "4G LTE (15 Mbps, 45ms RTT)", speedKbps: 15000, uncompressedTimeMs: 490, compressedTimeMs: 68 },
      { name: "Fiber Gigabit (1 Gbps, 8ms RTT)", speedKbps: 1000000, uncompressedTimeMs: 450, compressedTimeMs: 2 },
    ],
  },
  debateStatements: [
    {
      id: "ds-1",
      scenario: "Reverse Path Filtering on Asymmetrical Routing",
      proposedAction: "Enforce strict reverse path filtering ('net.ipv4.conf.all.rp_filter = 1') on multi-homed routers and BGP edge servers with asymmetrical routing paths.",
      isValid: false,
      explanation: "FLAWED: On asymmetrical routes, responses legitimately leave a different network interface than requests arrive. Strict mode (1) will incorrectly classify valid return traffic as spoofed and drop it. Multi-homed BGP servers require Loose Mode (rp_filter = 2).",
      badgeTag: "BGP_ROUTING",
    },
    {
      id: "ds-2",
      scenario: "SYN Flood Protection Strategy",
      proposedAction: "Enable 'net.ipv4.tcp_syncookies = 1' to handle saturation connection bursts without exhausting system RAM.",
      isValid: true,
      explanation: "VALID ARCHITECTURE: When the SYN queue fills, the kernel stops allocating transmission control blocks in memory and instead computes a cryptographic cookie into the initial sequence number, completely nullifying SYN flood memory exhaustion.",
      badgeTag: "SYN_COOKIE",
    },
    {
      id: "ds-3",
      scenario: "Firewall Framework Selection",
      proposedAction: "Continue writing iptables shell scripts with iptables-restore on modern Ubuntu 24.04 and Debian 12 servers.",
      isValid: false,
      explanation: "FLAWED: iptables re-evaluates complete rule arrays sequentially and requires global table locking. Modern Linux kernels recommend nftables, which compiles rules into in-kernel bytecode with sub-microsecond atomic evaluation.",
      badgeTag: "NFTABLES_MODERN",
    },
    {
      id: "ds-4",
      scenario: "Packet Forwarding on Application Servers",
      proposedAction: "Set 'net.ipv4.ip_forward = 0' on all standalone web, database, and API servers.",
      isValid: true,
      explanation: "VALID SECURITY: Unless the server is specifically functioning as a router, VPN concentrator, or container NAT bridge, ip_forward must be set to 0 to prevent the kernel from bridging disparate networks.",
      badgeTag: "LEAST_PRIVILEGE",
    },
    {
      id: "ds-5",
      scenario: "Firewall Input Chain Default Policy",
      proposedAction: "Configure the nftables input chain with 'policy accept' and add individual drop rules for known bad IP addresses.",
      isValid: false,
      explanation: "FLAWED: Blacklisting is an ineffective security anti-pattern. Production firewalls must enforce 'type filter hook input priority 0; policy drop;', explicitly whitelisting only essential ports (SSH, HTTP, HTTPS).",
      badgeTag: "DEFAULT_DROP",
    },
    {
      id: "ds-6",
      scenario: "Stateful Connection Tracking Order",
      proposedAction: "Place 'ct state { established, related } accept' as the very first rule in the nftables input filter chain.",
      isValid: true,
      explanation: "VALID OPTIMIZATION: Over 99% of network packets belong to already-established TCP/UDP sessions. Placing stateful tracking at rule 1 allows established traffic to bypass all subsequent port inspection rules immediately.",
      badgeTag: "CONNTRACK_OPT",
    },
  ],
  simulator: {
    headline: "LINUX KERNEL SYSCTL & NFTABLES HARDENING TERMINAL",
    description: "Deploy /etc/sysctl.d/99-security-hardened.conf, apply kernel parameters atomically, verify SYN flood defense, activate stateful nftables firewall, and inspect kernel logs.",
    defaultHost: "http://10.0.50.57",
    terminalSteps: [
      {
        id: "step-1",
        title: "Deploy Hardened Kernel Sysctl Parameters",
        description: "Write production TCP/IP stack tuning and anti-spoofing directives into sysctl configuration directory.",
        command: "sudo tee /etc/sysctl.d/99-security-hardened.conf << 'EOF'\nnet.ipv4.tcp_syncookies = 1\nnet.ipv4.conf.all.rp_filter = 1\nnet.ipv4.conf.default.rp_filter = 1\nnet.ipv4.conf.all.accept_source_route = 0\nnet.ipv4.icmp_echo_ignore_broadcasts = 1\nnet.ipv4.conf.all.log_martians = 1\nnet.ipv4.ip_forward = 0\nEOF",
        output: "net.ipv4.tcp_syncookies = 1\nnet.ipv4.conf.all.rp_filter = 1\nnet.ipv4.conf.default.rp_filter = 1\nnet.ipv4.conf.all.accept_source_route = 0\nnet.ipv4.icmp_echo_ignore_broadcasts = 1\nnet.ipv4.conf.all.log_martians = 1\nnet.ipv4.ip_forward = 0",
      },
      {
        id: "step-2",
        title: "Apply Parameters to Live Running Kernel",
        description: "Reload all sysctl files without rebooting the physical machine.",
        command: "sudo sysctl --system",
        output: "* Applying /etc/sysctl.d/99-security-hardened.conf ...\nnet.ipv4.tcp_syncookies = 1\nnet.ipv4.conf.all.rp_filter = 1\nnet.ipv4.conf.all.accept_source_route = 0\nnet.ipv4.icmp_echo_ignore_broadcasts = 1\nnet.ipv4.conf.all.log_martians = 1\nnet.ipv4.ip_forward = 0\n[OK] Kernel parameters successfully loaded.",
      },
      {
        id: "step-3",
        title: "Deploy Stateful Nftables Ingress Ruleset",
        description: "Install atomic firewall ruleset with default drop policy and stateful connection tracking.",
        command: "sudo tee /etc/nftables.conf << 'EOF'\n#!/usr/sbin/nft -f\nflush ruleset\ntable inet filter {\n  chain input {\n    type filter hook input priority 0; policy drop;\n    ct state { established, related } accept\n    iif \"lo\" accept\n    ct state invalid drop\n    tcp dport { 22, 80, 443 } ct state new accept\n    icmp type echo-request limit rate 5/second accept\n  }\n}\nEOF",
        output: "[OK] /etc/nftables.conf deployed.",
      },
      {
        id: "step-4",
        title: "Verify Nftables Syntax & Enable Service",
        description: "Parse the ruleset with dry-run check before activating the systemd unit.",
        command: "sudo nft -c -f /etc/nftables.conf && sudo systemctl enable --now nftables",
        output: "Synchronizing state of nftables.service with SysV service script...\n[OK] Started nftables.service.",
      },
      {
        id: "step-5",
        title: "Audit Active Kernel Firewall Hierarchy",
        description: "Inspect the in-kernel loaded bytecode table to confirm drop policies and allowed ports.",
        command: "sudo nft list ruleset",
        output: "table inet filter {\n\tchain input {\n\t\ttype filter hook input priority filter; policy drop;\n\t\tct state { established, related } accept\n\t\tiif \"lo\" accept\n\t\tct state invalid drop\n\t\ttcp dport { 22, 80, 443 } ct state new accept\n\t\ticmp type echo-request limit rate 5/second accept\n\t}\n}",
      },
      {
        id: "step-6",
        title: "Inspect Kernel Logs for Dropped Martian Packets",
        description: "Audit dmesg and systemd journal for logged spoofing attempts.",
        command: "sudo journalctl -k -g 'martian' --no-pager -n 5",
        output: "Oct 25 09:30:12 technhit kernel: IPv4: martian source 10.0.50.57 from 192.168.1.99, on dev eth0\nOct 25 09:30:14 technhit kernel: ll header: 00:16:3e:xx:xx:xx\n[OK] Kernel martian packet filter operating correctly.",
      },
    ],
    defaultPayloadBytes: 450000,
    compressedPayloadBytes: 52000,
    responseHeaders: {
      "Kernel": "Linux 6.8.0-48-generic (Ubuntu 24.04)",
      "Netfilter": "nftables v1.0.9 (Bytecode VM)",
      "TCP-SYN-Cookies": "Active (RFC 4987)",
      "RP-Filter": "Strict Mode (RFC 3704)",
      "Default-Policy": "DROP",
      "Status": "Fortress Hardened",
    },
  },
  debriefRules: [
    {
      id: "rule-1",
      number: "01",
      title: "ALWAYS ACTIVATE TCP SYN COOKIES",
      rule: "Set 'net.ipv4.tcp_syncookies = 1' so your server survives high-volume SYN flood attacks without exhausting kernel transmission control blocks.",
      antiPattern: "Allowing half-open TCP connections to exhaust system memory queues.",
    },
    {
      id: "rule-2",
      number: "02",
      title: "ENFORCE STRICT DEFAULT DROP ON INGRESS",
      rule: "In nftables, set 'policy drop' on the input chain. Whitelist strictly loopback, established connections, and essential services (SSH, Web).",
      antiPattern: "Using 'policy accept' and attempting to blacklist individual malicious IP subnets.",
    },
    {
      id: "rule-3",
      number: "03",
      title: "PRIORITIZE STATEFUL CONNECTION TRACKING",
      rule: "Position 'ct state { established, related } accept' at the very top of your input chain so 99% of ongoing packets bypass subsequent rule checks.",
      antiPattern: "Evaluating firewall port rules repeatedly for every packet in an established stream.",
    },
    {
      id: "rule-4",
      number: "04",
      title: "CALIBRATE RP_FILTER TO MATCH ROUTING ARCHITECTURE",
      rule: "Use 'rp_filter = 1' (Strict) on single-homed systems to defeat spoofing, and 'rp_filter = 2' (Loose) on multi-homed BGP routers with asymmetric return paths.",
      antiPattern: "Enforcing strict rp_filter on multi-homed BGP nodes, causing valid return packets to be dropped.",
    },
    {
      id: "rule-5",
      number: "05",
      title: "ALWAYS RUN DRY-RUN VERIFICATION (NFT -C)",
      rule: "Always test new nftables rulesets with 'sudo nft -c -f <ruleset>' before reloading the live firewall to prevent accidental remote SSH lockouts.",
      antiPattern: "Applying untested firewall rules directly on remote production cloud instances.",
    },
  ],
  quiz: [
    {
      id: "q-1",
      scenario: "During a SYN flood attack on port 443, a server with 'net.ipv4.tcp_syncookies = 1' continues accepting legitimate HTTPS connections normally.",
      question: "How do TCP SYN cookies allow the Linux kernel to survive this attack without exhausting RAM?",
      options: [
        "The kernel increases physical RAM allocation by swapping out user-space daemons.",
        "The kernel cryptographically encodes the connection state into the initial SYN-ACK sequence number, deferring memory allocation until a valid ACK arrives.",
        "The kernel drops all incoming SYN packets and requests clients to retry using UDP.",
        "The kernel temporarily bans all foreign IP addresses for 10 minutes.",
      ],
      correctIndex: 1,
      explanation: "TCP SYN cookies eliminate the need to store half-open connections in a queue. Instead, the sequence number is a cryptographic hash of IP, port, and a secret timestamp. Memory is only allocated when the client sends a matching ACK.",
    },
    {
      id: "q-2",
      scenario: "A multi-homed cloud server with two network interfaces connected to different ISPs has 'net.ipv4.conf.all.rp_filter = 1'. Users intermittently report total connection timeouts.",
      question: "What causes this issue on multi-homed systems?",
      options: [
        "The kernel crashes when evaluating two interfaces with sysctl.",
        "Strict reverse path filtering drops legitimate return packets if routing decisions send them through a different interface than they entered.",
        "SYN cookies are incompatible with multi-homed network cards.",
        "The server is missing a secondary default gateway in /etc/hosts.",
      ],
      correctIndex: 1,
      explanation: "In asymmetrical routing environments, return packets often travel across a different interface than incoming packets. Strict rp_filter (1) drops these as spoofed packets. Setting loose mode (2) solves the problem.",
    },
    {
      id: "q-3",
      scenario: "An engineer builds an nftables ruleset and places 'tcp dport 443 accept' before 'ct state { established, related } accept'.",
      question: "Why is this rule ordering an operational anti-pattern?",
      options: [
        "Port 443 will not accept incoming TLS handshakes.",
        "Over 99% of established packets will unnecessarily evaluate the port check, burning extra CPU cycles for every packet in the stream.",
        "The Linux kernel will reject the ruleset with a syntax error.",
        "Connection tracking is disabled if placed after a port directive.",
      ],
      correctIndex: 1,
      explanation: "Placing 'ct state established, related accept' first allows 99%+ of all network traffic to exit the firewall inspection pipeline in sub-microsecond time, minimizing CPU overhead under high throughput.",
    },
    {
      id: "q-4",
      scenario: "A developer leaves 'net.ipv4.ip_forward = 1' enabled on a server connected to both a public DMZ network and an internal private corporate database network.",
      question: "What major security vulnerability does this create?",
      options: [
        "The server will consume double the network bandwidth.",
        "External WAN attackers can use the server as an open router to route unauthorized packets directly into the private database subnet.",
        "Apache and Nginx will refuse to bind to port 80.",
        "The Linux kernel will disable all firewall drop rules.",
      ],
      correctIndex: 1,
      explanation: "When ip_forward is enabled, the Linux kernel acts as an active router. An external attacker can route packets through the server into private isolated internal subnets, bypassing network edge firewalls.",
    },
    {
      id: "q-5",
      scenario: "You want to test a newly updated /etc/nftables.conf on a remote server across an SSH session without risking losing connectivity.",
      question: "Which command performs a complete syntax and semantic validation without modifying live rules?",
      options: [
        "sudo nft test /etc/nftables.conf",
        "sudo nft -c -f /etc/nftables.conf",
        "sudo systemctl check nftables",
        "sudo iptables-translate /etc/nftables.conf",
      ],
      correctIndex: 1,
      explanation: "'sudo nft -c -f <file>' executes a dry-run syntax and semantic check ('-c' / '--check') on the specified ruleset file without modifying the live in-kernel firewall state.",
    },
  ],
};

const SSH_KEY_DRILL: LearningDrillData = {
  slug: "configure-ssh-key-authentication",
  title: "Configure SSH Key Authentication",
  category: "linux-server-admin",
  badgeName: "SSH Cryptography Engineer",
  badgeDescription: "Mastered Ed25519 asymmetric cryptography, zero-password authentication, and hardened sshd_config parameters.",
  architectureDiagram: {
    type: "ssh-handshake",
    title: "OpenSSH Asymmetric Challenge-Response & Encrypted Tunnel Architecture",
  },
  reconCards: [
    {
      id: "rc-1",
      tag: "CRYPTOGRAPHY",
      title: "ED25519 VS RSA",
      subtitle: "Modern Elliptic Curve Standard",
      definition: "Ed25519 uses Curve25519 elliptic curve cryptography yielding compact 68-character keys with 128-bit security level, resistant to side-channel timing attacks and significantly faster than legacy 2048-bit RSA.",
      seenInProd: "Standard default in modern OpenSSH (8.5+). Generated via 'ssh-keygen -t ed25519'.",
    },
    {
      id: "rc-2",
      tag: "AUTHENTICATION",
      title: "ASYMMETRIC CHALLENGE",
      subtitle: "Zero-Secret Transmission Protocol",
      definition: "The private key never leaves the client workstation. During handshake, the server issues a random challenge nonce; the client signs it with its private key, and the server validates the signature against authorized_keys.",
      seenInProd: "Defined by RFC 4252 SSH Authentication Protocol over Curve25519 ECDH key exchange.",
    },
    {
      id: "rc-3",
      tag: "FILESYSTEM PERMISSIONS",
      title: "STRICT MODES",
      subtitle: "POSIX 0700 & 0600 Integrity",
      definition: "OpenSSH 'StrictModes yes' causes the daemon to reject public keys if ~/.ssh is writable by group/others (must be 0700) or authorized_keys is writable by others (must be 0600).",
      seenInProd: "chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys prevents untrusted user injection.",
    },
    {
      id: "rc-4",
      tag: "DAEMON HARDENING",
      title: "PASSWORD DISABLEMENT",
      subtitle: "Immunity to Brute-Force",
      definition: "Setting 'PasswordAuthentication no' and 'KbdInteractiveAuthentication no' completely eliminates automated dictionary scanning and brute-force botnets across port 22.",
      seenInProd: "Drops internet-facing authentication failures from 50,000/day to zero.",
    },
    {
      id: "rc-5",
      tag: "ROOT PRIVILEGE",
      title: "ROOT PROHIBIT-PASSWORD",
      subtitle: "Account Attribution & Sudo",
      definition: "'PermitRootLogin prohibit-password' forbids password login for root, while 'PermitRootLogin no' forces engineers to authenticate as named users and elevate via sudo with full audit trails.",
      seenInProd: "Enforced by CIS Linux Benchmarks and SOC2 compliance standards.",
    },
    {
      id: "rc-6",
      tag: "KEY DISTRIBUTION",
      title: "SSH-COPY-ID",
      subtitle: "Safe Atomic Key Appending",
      definition: "'ssh-copy-id -i ~/.ssh/id_ed25519.pub user@host' safely appends the public key to remote authorized_keys and enforces 0600 permissions without overwriting existing colleagues' keys.",
      seenInProd: "Avoids fatal 'scp' mistakes that overwrite authorized_keys and lock out team members.",
    },
  ],
  motive: {
    headline: "PASSWORD BRUTE-FORCE INVASIONS VS. ED25519 MATHEMATICAL IMMUNITY",
    subheadline: "Internet-exposed SSH ports with password authentication absorb tens of thousands of automated botnet probes daily. Ed25519 asymmetric cryptography renders password attacks obsolete.",
    uncompressedBytes: 250000,
    compressedBytes: 0,
    savingsPercentage: 100,
    explanation: "An Ed25519 key has 128 bits of security equivalent to 3072-bit RSA. Brute-forcing a single key requires 2^128 operations—computationally impossible with modern supercomputers.",
    networkProfiles: [
      { name: "Botnet Dictionary Flood (10k req/sec)", speedKbps: 10000, uncompressedTimeMs: 250, compressedTimeMs: 0 },
      { name: "Public Cloud Ingress (1 Gbps)", speedKbps: 1000000, uncompressedTimeMs: 15, compressedTimeMs: 0 },
      { name: "Datacenter Bastion VPC (10 Gbps)", speedKbps: 10000000, uncompressedTimeMs: 2, compressedTimeMs: 0 },
    ],
  },
  debateStatements: [
    {
      id: "ds-1",
      scenario: "Cryptographic Key Algorithm",
      proposedAction: "Generate a 1024-bit RSA key without a passphrase because smaller keys connect with less latency.",
      isValid: false,
      explanation: "FLAWED: 1024-bit RSA is cryptographically broken and disabled in modern OpenSSH. Ed25519 produces compact, ultra-fast 256-bit keys with superior tamper-resistance.",
      badgeTag: "CRYPTOGRAPHY",
    },
    {
      id: "ds-2",
      scenario: "Public Key Distribution",
      proposedAction: "Use 'scp ~/.ssh/id_ed25519.pub user@server:~/.ssh/authorized_keys' to install your key.",
      isValid: false,
      explanation: "CATASTROPHIC: Using scp directly overwrites the entire authorized_keys file, instantly revoking all existing admin access. Always use 'ssh-copy-id' or 'cat >> ~/.ssh/authorized_keys'.",
      badgeTag: "CLUSTER_ACCESS",
    },
    {
      id: "ds-3",
      scenario: "Disabling Password Authentication",
      proposedAction: "Disable PasswordAuthentication in /etc/ssh/sshd_config and reload ssh while keeping your active terminal open.",
      isValid: true,
      explanation: "BEST PRACTICE: Always keep your existing authenticated shell session open when modifying sshd. Open a second terminal window to test public key login before closing the master session.",
      badgeTag: "FAIL_SAFE",
    },
    {
      id: "ds-4",
      scenario: "Strict Modes & Permissions",
      proposedAction: "Run 'chmod 777 ~/.ssh' so automated deployment tools and web scripts never encounter permission denied errors.",
      isValid: false,
      explanation: "CRITICAL FAILURE: OpenSSH StrictModes checks directory permissions. If ~/.ssh has write permissions for group or others, the sshd daemon rejects the key and denies connection.",
      badgeTag: "POSIX_SECURITY",
    },
    {
      id: "ds-5",
      scenario: "Private Key Passphrase Protection",
      proposedAction: "Encrypt the private key with a strong passphrase and cache it in ssh-agent during the desktop session.",
      isValid: true,
      explanation: "VALID DEFENSE-IN-DEPTH: Encrypting the private key at rest with AES-256 prevents key theft if your workstation or backups are compromised.",
      badgeTag: "ENDPOINT_DEFENSE",
    },
    {
      id: "ds-6",
      scenario: "Direct Root Login Policy",
      proposedAction: "Set PermitRootLogin no and require all system operators to log in as named users with sudo privileges.",
      isValid: true,
      explanation: "AUDIT COMPLIANCE: Direct root login prevents attribution of actions. Logging in as individual users creates an immutable audit trail in auth.log.",
      badgeTag: "LEAST_PRIVILEGE",
    },
  ],
  simulator: {
    headline: "ED25519 KEYPAIR GENERATION & SSHD HARDENING SIMULATOR",
    description: "Execute client-side Ed25519 key generation, distribute the public key, enforce strict permissions, and harden the OpenSSH daemon.",
    defaultHost: "ssh://admin@10.10.10.50:22",
    terminalSteps: [
      {
        id: "step-1",
        title: "Generate High-Entropy Ed25519 Keypair on Client",
        description: "Create a modern elliptic curve keypair with an identifying administrative comment.",
        command: "ssh-keygen -t ed25519 -C 'admin@nhit.in' -f ~/.ssh/id_ed25519",
        output: "Generating public/private ed25519 key pair.\nYour identification has been saved in /home/admin/.ssh/id_ed25519\nYour public key has been saved in /home/admin/.ssh/id_ed25519.pub\nThe key fingerprint is:\nSHA256:7uK+qX8yM9NpZ1bL6vT2wR4eA8sD3fG5hJ0kC1mE4oA admin@nhit.in\nThe key's randomart image is:\n+--[ED25519 256]--+\n|     .o+o. .     |\n|      .o=..      |\n|       +oo.      |\n|     .+ +oo      |\n|    .o =So o     |\n|   .  o B * .    |\n|  . .  + O o     |\n| . o o  = B      |\n|  Eoo .+=X+      |\n+----[SHA256]-----+",
      },
      {
        id: "step-2",
        title: "Install Public Key to Remote Host via ssh-copy-id",
        description: "Safely append the public key to authorized_keys without overwriting existing keys.",
        command: "ssh-copy-id -i ~/.ssh/id_ed25519.pub admin@10.10.10.50",
        output: "/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: \"/home/admin/.ssh/id_ed25519.pub\"\n/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed\n/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- confirming with password\nadmin@10.10.10.50's password:\n\nNumber of key(s) added: 1\n\nNow try logging into the machine, with:   \"ssh 'admin@10.10.10.50'\"",
      },
      {
        id: "step-3",
        title: "Audit Remote POSIX Directory & File Permissions",
        description: "Verify that remote ~/.ssh is 0700 and authorized_keys is 0600.",
        command: "ssh admin@10.10.10.50 'ls -ld ~/.ssh && ls -l ~/.ssh/authorized_keys'",
        output: "drwx------ 2 admin admin 4096 Oct 25 10:00 /home/admin/.ssh\n-rw------- 1 admin admin  104 Oct 25 10:00 /home/admin/.ssh/authorized_keys",
      },
      {
        id: "step-4",
        title: "Harden OpenSSH Daemon to Terminate Password Authentication",
        description: "Create an immutable configuration drop-in file disabling password login and root password auth.",
        command: "ssh admin@10.10.10.50 \"sudo tee /etc/ssh/sshd_config.d/99-hardened.conf << 'EOF'\nPasswordAuthentication no\nKbdInteractiveAuthentication no\nPubkeyAuthentication yes\nPermitRootLogin prohibit-password\nMaxAuthTries 3\nEOF\"",
        output: "PasswordAuthentication no\nKbdInteractiveAuthentication no\nPubkeyAuthentication yes\nPermitRootLogin prohibit-password\nMaxAuthTries 3",
      },
      {
        id: "step-5",
        title: "Validate sshd Configuration Syntax and Reload Service",
        description: "Perform syntax verification before reloading the OpenSSH daemon.",
        command: "ssh admin@10.10.10.50 'sudo sshd -t && sudo systemctl reload ssh'",
        output: "[Configuration Syntax OK]\nsshd.service: Reloaded OpenSSH server daemon.",
      },
      {
        id: "step-6",
        title: "Verify Public Key Authentication in Verbose Diagnostic Mode",
        description: "Confirm authentication succeeds exclusively using the Ed25519 publickey signature.",
        command: "ssh -v -i ~/.ssh/id_ed25519 admin@10.10.10.50 'echo AUTH_SUCCESS && uname -a'",
        output: "OpenSSH_9.6p1 Ubuntu-3ubuntu13, OpenSSL 3.0.13\ndebug1: Authentications that can continue: publickey\ndebug1: Offering public key: /home/admin/.ssh/id_ed25519 ED25519 SHA256:7uK+qX8yM9NpZ1bL6vT2wR4eA8sD3fG5hJ0kC1mE4oA explicit\ndebug1: Server accepts key: /home/admin/.ssh/id_ed25519 ED25519 SHA256:7uK+qX8yM9NpZ1bL6vT2wR4eA8sD3fG5hJ0kC1mE4oA\nAuthenticated to 10.10.10.50 ([10.10.10.50]:22) using \"publickey\".\nAUTH_SUCCESS\nLinux 6.8.0-48-generic #48-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux",
      },
    ],
    defaultPayloadBytes: 250000,
    compressedPayloadBytes: 0,
    responseHeaders: {
      "SSH-Protocol": "SSH-2.0-OpenSSH_9.6p1",
      "Kex-Algorithm": "curve25519-sha256",
      "Hostkey-Type": "ssh-ed25519",
      "Cipher": "chacha20-poly1305@openssh.com",
      "Authentication": "publickey (Ed25519 Signature Verified)",
    },
  },
  debriefRules: [
    {
      id: "rule-1",
      number: "01",
      title: "USE ED25519 AS MODERN DEFAULT",
      rule: "Always generate Ed25519 keys ('ssh-keygen -t ed25519') rather than legacy RSA, benefiting from shorter keys, speed, and elliptic curve security.",
      antiPattern: "Using 1024-bit or 2048-bit RSA keys with default empty passphrases.",
    },
    {
      id: "rule-2",
      number: "02",
      title: "ATOMIC KEY DISTRIBUTION",
      rule: "Distribute public keys using 'ssh-copy-id' or append mode ('cat >> ~/.ssh/authorized_keys') to never overwrite existing keys.",
      antiPattern: "Using scp to blindly copy public keys directly as 'authorized_keys'.",
    },
    {
      id: "rule-3",
      number: "03",
      title: "STRICT PERMISSIONS DISCIPLINE",
      rule: "Ensure ~/.ssh is chmod 0700 and authorized_keys is chmod 0600. Group or world write permissions trigger immediate SSH rejection.",
      antiPattern: "Running 'chmod -R 777 ~/.ssh' to debug permission errors.",
    },
    {
      id: "rule-4",
      number: "04",
      title: "ALWAYS TEST BEFORE DISCONNECTING",
      rule: "Keep your active administrative terminal open when updating sshd_config. Test new logins in a separate window before disconnecting.",
      antiPattern: "Restarting sshd, closing the terminal, and discovering you locked yourself out.",
    },
    {
      id: "rule-5",
      number: "05",
      title: "DROP PASSWORD AUTHENTICATION",
      rule: "Disable 'PasswordAuthentication' in sshd_config once keys are installed to eliminate 100% of automated botnet dictionary attacks.",
      antiPattern: "Leaving password authentication enabled indefinitely on internet-facing ports.",
    },
  ],
  quiz: [
    {
      id: "q-1",
      scenario: "You generated a new Ed25519 keypair and ran ssh-copy-id to your remote server, but SSH returns 'Permission denied (publickey)'.",
      question: "Which of the following is the most likely cause?",
      options: [
        "The server's /etc/hosts file is empty.",
        "Remote directory ~/.ssh has permissions 0775 or ~/.ssh/authorized_keys has 0664, violating StrictModes.",
        "Ed25519 keys require a running Apache server on the remote host.",
        "You forgot to restart the client computer after generating the key.",
      ],
      correctIndex: 1,
      explanation: "OpenSSH StrictModes automatically denies key authentication if ~/.ssh or authorized_keys are writable by group or other users (e.g. 0775 or 0664). They must be 0700 and 0600.",
    },
    {
      id: "q-2",
      scenario: "A junior sysadmin executed 'scp ~/.ssh/id_ed25519.pub user@server:~/.ssh/authorized_keys'.",
      question: "What is the critical risk associated with this action?",
      options: [
        "The public key file will be deleted on the client machine.",
        "All existing authorized keys on the server were overwritten, locking out any colleagues whose keys were previously installed.",
        "The server CPU will spike to 100% usage.",
        "The Linux kernel will revert to iptables.",
      ],
      correctIndex: 1,
      explanation: "Using scp to write to authorized_keys replaces the file entirely instead of appending. Any previously installed team public keys are lost.",
    },
    {
      id: "q-3",
      scenario: "You want to completely protect an internet-exposed server from automated password dictionary botnets.",
      question: "Which directive must be set in /etc/ssh/sshd_config?",
      options: [
        "PasswordAuthentication no",
        "AllowUsers all",
        "Port 80",
        "StrictModes no",
      ],
      correctIndex: 0,
      explanation: "Setting 'PasswordAuthentication no' instructs sshd to reject any password-based authentication attempts, accepting only authorized cryptographic keys.",
    },
    {
      id: "q-4",
      scenario: "During an SSH key exchange, which component of the keypair is transmitted across the network to the server?",
      question: "How does the server verify identity without seeing the private key?",
      options: [
        "The private key is sent encrypted with SSL.",
        "The server sends a challenge nonce; the client creates a cryptographic digital signature using its private key, which the server verifies with the public key.",
        "The client sends a hash of the root password.",
        "The server reads the private key directly from client RAM.",
      ],
      correctIndex: 1,
      explanation: "The private key never leaves the client. The client uses its private key to sign an ephemeral challenge nonce issued by the server, proving ownership without revealing the secret.",
    },
    {
      id: "q-5",
      scenario: "You need to verify sshd_config syntax on Ubuntu 24.04 before reloading the daemon.",
      question: "Which command runs a dry-run syntax check?",
      options: [
        "sudo sshd -t",
        "sudo systemctl test ssh",
        "sudo ssh --verify-config",
        "sudo ssh-keygen -t sshd",
      ],
      correctIndex: 0,
      explanation: "'sudo sshd -t' validates the configuration files and outputs syntax errors without restarting or reloading the running SSH daemon.",
    },
  ],
};

const APACHE_VHOST_DRILL: LearningDrillData = {
  slug: "configure-apache-virtual-host-on-ubuntu-20-04-lts",
  title: "Configure Apache Virtual Host on Ubuntu 20.04 LTS",
  category: "linux-server-admin",
  badgeName: "Apache Multi-Tenant Architect",
  badgeDescription: "Mastered name-based VirtualHost multi-tenancy, POSIX directory isolation, and pre-flight configtest validation.",
  architectureDiagram: {
    type: "apache-vhost",
    title: "Name-Based VirtualHost Multi-Tenancy & POSIX Isolation Mesh",
  },
  reconCards: [
    {
      id: "rc-1",
      tag: "HTTP PROTOCOL",
      title: "NAME-BASED VHOSTS",
      subtitle: "Host Header Routing",
      definition: "Name-based VirtualHosting inspects the HTTP 'Host:' request header (and TLS SNI extension) to match incoming client requests to specific <VirtualHost> configuration blocks on a single public IP.",
      seenInProd: "Standard RFC 7230 Host Header matching in Apache 2.4+ core.",
    },
    {
      id: "rc-2",
      tag: "DIRECTORY ISOLATION",
      title: "POSIX 0750 PERMISSIONS",
      subtitle: "Inter-Tenant Boundaries",
      definition: "Each VirtualHost document root is owned by its dedicated Linux user with group www-data (chown -R user:www-data /var/www/domain/public && chmod 750), preventing tenant cross-directory traversal.",
      seenInProd: "Strict separation prevents compromised Web scripts in Tenant A from reading Tenant B's files.",
    },
    {
      id: "rc-3",
      tag: "SECURITY HARDENING",
      title: "DISABLE DIRECTORY INDEXES",
      subtitle: "Information Leakage Defense",
      definition: "Setting 'Options -Indexes +FollowSymLinks' in the <Directory> block prevents the web server from generating directory browsing listings if index.html is missing, hiding server files from attackers.",
      seenInProd: "Default security directive across all production VirtualHosts.",
    },
    {
      id: "rc-4",
      tag: "TELEMETRY",
      title: "ISOLATED LOG STREAMS",
      subtitle: "CustomLog & ErrorLog",
      definition: "Configuring unique CustomLog and ErrorLog paths per VirtualHost (e.g. /var/log/apache2/alpha_access.log) enables pinpoint debugging and clean per-domain rate limiting and analytics.",
      seenInProd: "Essential for enterprise multi-tenant auditing and SIEM ingestion.",
    },
    {
      id: "rc-5",
      tag: "DAEMON SUPERVISION",
      title: "A2ENSITE & A2DISSITE",
      subtitle: "Atomic Symlink Management",
      definition: "Debian/Ubuntu manages VirtualHosts via symlinks from sites-available/ to sites-enabled/. The helper commands 'a2ensite' and 'a2dissite' provide atomic enabling and disabling of site configuration files.",
      seenInProd: "Controlled site activation without direct filesystem symlink tampering.",
    },
    {
      id: "rc-6",
      tag: "PRE-FLIGHT VALIDATION",
      title: "APACHE2CTL CONFIGTEST",
      subtitle: "Zero-Downtime Verification",
      definition: "Always execute 'apache2ctl configtest' (or 'apache2 -t') before reloading the systemd service. It parses all enabled VirtualHost XML-like directives for syntax errors before affecting live traffic.",
      seenInProd: "Prevents syntax typos from knocking down the entire web cluster upon restart.",
    },
  ],
  motive: {
    headline: "DEDICATED INSTANCE SPRAWL VS. MULTI-TENANT VIRTUALHOST EFFICIENCY",
    subheadline: "Spinning up isolated VPS servers for every micro-site creates massive cloud cost overhead. Apache VirtualHosts consolidate hundreds of low-traffic domains onto a single high-performance cluster node.",
    uncompressedBytes: 1000000,
    compressedBytes: 100000,
    savingsPercentage: 90,
    explanation: "VirtualHosts allow dynamic memory allocation across domains, reducing idle resource waste and centralizing SSL certificate renewals and security patching.",
    networkProfiles: [
      { name: "Global Ingress (100 Domains)", speedKbps: 50000, uncompressedTimeMs: 350, compressedTimeMs: 45 },
      { name: "CDN Edge Cache Hit", speedKbps: 1000000, uncompressedTimeMs: 25, compressedTimeMs: 8 },
      { name: "VPC Internal Gateway", speedKbps: 10000000, uncompressedTimeMs: 5, compressedTimeMs: 1 },
    ],
  },
  debateStatements: [
    {
      id: "ds-1",
      scenario: "DocumentRoot Placement",
      proposedAction: "Place all VirtualHost files inside /home/root/public_html to make backups simple.",
      isValid: false,
      explanation: "HIGH RISK: Serving files out of /root compromises system security. DocumentRoots belong under /var/www/<domain>/public with restricted non-root user permissions.",
      badgeTag: "STORAGE_SECURITY",
    },
    {
      id: "ds-2",
      scenario: "Pre-Flight Syntax Validation",
      proposedAction: "Always run 'sudo apache2ctl configtest' before restarting or reloading Apache.",
      isValid: true,
      explanation: "BEST PRACTICE: Running 'configtest' catches syntax errors, missing DocumentRoot paths, and malformed directives before touching the running service, ensuring zero downtime.",
      badgeTag: "ZERO_DOWNTIME",
    },
    {
      id: "ds-3",
      scenario: "Directory Listing Options",
      proposedAction: "Include 'Options Indexes' so visitors can browse files if no index page exists.",
      isValid: false,
      explanation: "SECURITY FLAW: 'Options Indexes' exposes private filenames, database backups, and environment dumps to crawlers. Production sites must enforce 'Options -Indexes'.",
      badgeTag: "INFO_LEAK_DEFENSE",
    },
    {
      id: "ds-4",
      scenario: "Access and Error Logging",
      proposedAction: "Direct all VirtualHosts to write to a single global /var/log/apache2/access.log to save file descriptors.",
      isValid: false,
      explanation: "POOR PRACTICE: Sharing a single log file makes per-domain incident response and audit debugging impossible. Each VirtualHost should maintain dedicated ErrorLog and CustomLog files.",
      badgeTag: "OBSERVABILITY",
    },
    {
      id: "ds-5",
      scenario: "Daemon Reload vs Restart",
      proposedAction: "Use 'systemctl reload apache2' instead of 'systemctl restart apache2' when enabling or updating VirtualHosts.",
      isValid: true,
      explanation: "EXCELLENT: A reload instructs worker threads to re-read configuration files without dropping existing established HTTP connections, preserving active client downloads.",
      badgeTag: "SERVICE_LIFECYCLE",
    },
    {
      id: "ds-6",
      scenario: "Local Testing without Public DNS",
      proposedAction: "Map test domains (e.g. 127.0.0.1 alpha.local) in /etc/hosts on your client machine before public DNS records propagate.",
      isValid: true,
      explanation: "VALID WORKFLOW: Editing /etc/hosts overrides DNS resolution locally, allowing full end-to-end verification of VirtualHost dispatch before pointing public domain names.",
      badgeTag: "LOCAL_TESTING",
    },
  ],
  simulator: {
    headline: "NAME-BASED VIRTUALHOST DEPLOYMENT & HOST HEADER SIMULATOR",
    description: "Step through multi-tenant directory setup, VirtualHost configuration, site activation, and host-header verification.",
    defaultHost: "http://alpha.nhit.in",
    terminalSteps: [
      {
        id: "step-1",
        title: "Create Isolated Web Directory Hierarchy",
        description: "Generate dedicated document roots under /var/www for independent tenants.",
        command: "sudo mkdir -p /var/www/alpha.nhit.in/public /var/www/beta.nhit.in/public",
        output: "[Directories Created]\n/var/www/alpha.nhit.in/public\n/var/www/beta.nhit.in/public",
      },
      {
        id: "step-2",
        title: "Enforce POSIX Group Permissions (0750)",
        description: "Grant web server read access while restricting unauthorized user traversal.",
        command: "sudo chown -R www-data:www-data /var/www && sudo chmod -R 750 /var/www",
        output: "drwxr-x--- 3 www-data www-data 4096 Oct 25 10:15 /var/www/alpha.nhit.in/public\ndrwxr-x--- 3 www-data www-data 4096 Oct 25 10:15 /var/www/beta.nhit.in/public",
      },
      {
        id: "step-3",
        title: "Deploy VirtualHost Configurations in sites-available",
        description: "Author name-based VirtualHost blocks with disabled directory indexes and separate logs.",
        command: "sudo tee /etc/apache2/sites-available/alpha.nhit.in.conf << 'EOF'\n<VirtualHost *:80>\n    ServerName alpha.nhit.in\n    ServerAlias www.alpha.nhit.in\n    DocumentRoot /var/www/alpha.nhit.in/public\n    <Directory /var/www/alpha.nhit.in/public>\n        Options -Indexes +FollowSymLinks\n        AllowOverride All\n        Require all granted\n    </Directory>\n    ErrorLog ${APACHE_LOG_DIR}/alpha_error.log\n    CustomLog ${APACHE_LOG_DIR}/alpha_access.log combined\n</VirtualHost>\nEOF",
        output: "VirtualHost configuration written for alpha.nhit.in",
      },
      {
        id: "step-4",
        title: "Enable VirtualHost via a2ensite",
        description: "Create atomic symlinks from sites-available to sites-enabled.",
        command: "sudo a2ensite alpha.nhit.in.conf",
        output: "Enabling site alpha.nhit.in.\nTo activate the new configuration, you need to run:\n  systemctl reload apache2",
      },
      {
        id: "step-5",
        title: "Execute Pre-Flight Configtest Validation",
        description: "Confirm all directives are syntactically valid before touching the running process.",
        command: "sudo apache2ctl configtest",
        output: "Syntax OK",
      },
      {
        id: "step-6",
        title: "Reload Apache & Test Host Header Dispatch with curl",
        description: "Send HTTP GET with specific Host header to verify tenant routing.",
        command: "sudo systemctl reload apache2 && curl -s -H 'Host: alpha.nhit.in' http://127.0.0.1/",
        output: "<!DOCTYPE html>\n<html>\n<head><title>Alpha Tenant</title></head>\n<body><h1>VirtualHost alpha.nhit.in Dispatched Successfully</h1></body>\n</html>",
      },
    ],
    defaultPayloadBytes: 150000,
    compressedPayloadBytes: 35000,
    responseHeaders: {
      "HTTP/1.1": "200 OK",
      "Server": "Apache/2.4.58 (Ubuntu)",
      "X-VHost-Tenant": "alpha.nhit.in",
      "Content-Type": "text/html; charset=UTF-8",
      "Vary": "Host, Accept-Encoding",
    },
  },
  debriefRules: [
    {
      id: "rule-1",
      number: "01",
      title: "ALWAYS RUN CONFIGTEST BEFORE RELOAD",
      rule: "Execute 'apache2ctl configtest' before reloading the daemon to catch syntax mistakes before they affect production.",
      antiPattern: "Running 'systemctl restart apache2' blindly without syntax testing.",
    },
    {
      id: "rule-2",
      number: "02",
      title: "ALWAYS DISABLE DIRECTORY INDEXES",
      rule: "Enforce 'Options -Indexes' in all <Directory> definitions to prevent directory indexing and file disclosure.",
      antiPattern: "Using 'Options Indexes' in public production VirtualHosts.",
    },
    {
      id: "rule-3",
      number: "03",
      title: "ISOLATE LOGS PER DOMAIN",
      rule: "Configure dedicated ErrorLog and CustomLog files for each VirtualHost to maintain clear audit and troubleshooting boundaries.",
      antiPattern: "Routing all traffic to global access.log and error.log.",
    },
    {
      id: "rule-4",
      number: "04",
      title: "RELOAD OVER RESTART",
      rule: "Use 'systemctl reload apache2' to apply configuration changes gracefully without terminating active TCP client streams.",
      antiPattern: "Stopping and starting the daemon during peak business traffic hours.",
    },
    {
      id: "rule-5",
      number: "05",
      title: "RESTRICT DOCUMENT ROOT PERMISSIONS",
      rule: "Enforce 0750 permissions on web directories with www-data group ownership, forbidding world-writable (0777) folders.",
      antiPattern: "Running 'chmod -R 777 /var/www' to bypass permission errors.",
    },
  ],
  quiz: [
    {
      id: "q-1",
      scenario: "You created a new file /etc/apache2/sites-available/myproject.conf, but browsing to the domain still loads the default Ubuntu splash page.",
      question: "Which step was missed?",
      options: [
        "You must delete the Apache binary and recompile from source.",
        "The site was not enabled with 'sudo a2ensite myproject.conf' followed by 'sudo systemctl reload apache2'.",
        "Virtual hosts can only run on port 8080.",
        "You must reboot the Linux server.",
      ],
      correctIndex: 1,
      explanation: "Apache only loads configuration files symlinked into 'sites-enabled/'. Running 'a2ensite <config>' creates this symlink, and reloading the service activates it.",
    },
    {
      id: "q-2",
      scenario: "A visitor navigates to an existing directory on your site that does not have an index.html file, and Apache displays a list of all files and folders.",
      question: "Which directive fixes this security vulnerability?",
      options: [
        "Options -Indexes",
        "AllowOverride None",
        "DirectoryIndex off",
        "ServerSignature On",
      ],
      correctIndex: 0,
      explanation: "'Options -Indexes' instructs Apache to refuse generating directory indexes, returning an HTTP 403 Forbidden error instead of exposing files.",
    },
    {
      id: "q-3",
      scenario: "An administrator executed an Apache command that caused all active file downloads and user sessions to terminate abruptly.",
      question: "What command should have been used instead to apply VirtualHost changes gracefully?",
      options: [
        "sudo systemctl reload apache2",
        "sudo killall -9 apache2",
        "sudo systemctl restart apache2",
        "sudo apache2ctl stop",
      ],
      correctIndex: 0,
      explanation: "'systemctl reload apache2' (or 'apache2ctl graceful') instructs worker processes to finish in-flight requests and re-read config files, preventing dropped connections.",
    },
    {
      id: "q-4",
      scenario: "You are setting up Apache to host both site1.example.com and site2.example.com on a single public IPv4 address.",
      question: "How does Apache determine which <VirtualHost> block handles an incoming HTTP request?",
      options: [
        "By the client's operating system version.",
        "By matching the request's HTTP 'Host:' header with the ServerName and ServerAlias directives.",
        "By the time of day the request arrived.",
        "By random round-robin allocation.",
      ],
      correctIndex: 1,
      explanation: "In name-based VirtualHosting, Apache inspects the HTTP 'Host:' request header sent by the client's browser to route the request to the matching ServerName/ServerAlias.",
    },
    {
      id: "q-5",
      scenario: "Before reloading Apache in production, which command verifies that there are no syntax errors in the VirtualHost files?",
      question: "Which command runs the pre-flight syntax check?",
      options: [
        "sudo apache2ctl configtest",
        "sudo a2chk",
        "sudo service apache2 verify",
        "sudo test-apache",
      ],
      correctIndex: 0,
      explanation: "'sudo apache2ctl configtest' (or 'apache2 -t') validates all enabled directives and outputs 'Syntax OK' or detailed error line numbers.",
    },
  ],
};

const SYSTEM_MONITORING_DRILL: LearningDrillData = {
  slug: "top-5-system-monitoring-tools-inux",
  title: "Top 5 System Monitoring Tools on Linux",
  category: "linux-server-admin",
  badgeName: "Linux Telemetry & SRE Specialist",
  badgeDescription: "Mastered Linux kernel performance observation, process profiling, swap/disk bottlenecks, and real-time telemetry.",
  architectureDiagram: {
    type: "system-telemetry",
    title: "Linux Kernel Telemetry Extraction & SRE Observation Architecture",
  },
  reconCards: [
    {
      id: "rc-1",
      tag: "VFS SUBSYSTEM",
      title: "THE /PROC ENGINE",
      subtitle: "Virtual Memory Metrics",
      definition: "Linux monitoring tools read pseudo-files in /proc (/proc/stat, /proc/meminfo, /proc/diskstats) generated on-the-fly by the Linux kernel with zero disk I/O overhead.",
      seenInProd: "Used by top, htop, btop, and node_exporter for sub-millisecond metrics.",
    },
    {
      id: "rc-2",
      tag: "PROCESS PROFILING",
      title: "BTOP & HTOP",
      subtitle: "Interactive TUI Analysis",
      definition: "btop and htop provide interactive per-core CPU graphs, memory pressure maps, tree-based parent-child process views, and real-time in-terminal signal sending (SIGTERM/SIGKILL).",
      seenInProd: "Primary first-responder tool when incident alarms fire on Linux nodes.",
    },
    {
      id: "rc-3",
      tag: "STORAGE BOTTLENECKS",
      title: "IOTOP & IOSTAT",
      subtitle: "Block Device Latency",
      definition: "iostat surfaces device %util and await latency, while iotop traces exactly which process PID is thrashing the NVMe/SATA bus using kernel taskstats accounting.",
      seenInProd: "Detects rogue database queries and unbuffered log loops that freeze IO queues.",
    },
    {
      id: "rc-4",
      tag: "SCHEDULER & SWAP",
      title: "VMSTAT",
      subtitle: "Virtual Memory & Runqueue",
      definition: "vmstat reports runqueue threads waiting for CPU (r), processes in uninterruptible sleep (b), swap in/out (si/so), and context switch frequency (cs).",
      seenInProd: "High 'b' indicates storage bottlenecks; high 'si/so' signals active RAM starvation.",
    },
    {
      id: "rc-5",
      tag: "SOCKET & DESCRIPTOR AUDIT",
      title: "SS & LSOF",
      subtitle: "Open Descriptors & Ports",
      definition: "In Linux 'everything is a file'. lsof uncovers deleted files holding disk space and open sockets, while 'ss -tulnp' replaces netstat for fast TCP socket inspection.",
      seenInProd: "Diagnoses 'no space left on device' caused by unlinked open log files.",
    },
    {
      id: "rc-6",
      tag: "CONTINUOUS TELEMETRY",
      title: "PROMETHEUS NODE_EXPORTER",
      subtitle: "Cluster-Wide Time-Series",
      definition: "Prometheus node_exporter exposes hundreds of Linux hardware and OS metrics over HTTP (/metrics) for long-term storage, trending analysis, and automated PagerDuty alerts.",
      seenInProd: "Standard cloud-native SRE monitoring daemon across Kubernetes and bare-metal nodes.",
    },
  ],
  motive: {
    headline: "BLIND GUESSING DURING OUTAGES VS. PINPOINT TELEMETRY METRICS",
    subheadline: "When a server grinds to a halt under load, guessing whether the issue is CPU starvation, memory leak, NVMe queue saturation, or TCP socket exhaustion wastes hours. Modern telemetry pinpoints the bottleneck in seconds.",
    uncompressedBytes: 3600,
    compressedBytes: 30,
    savingsPercentage: 99,
    explanation: "System telemetry provides instantaneous, conclusive visibility into kernel subsystems, transforming chaotic incident triage into deterministic SRE remediation.",
    networkProfiles: [
      { name: "Production Incident Triage", speedKbps: 100000, uncompressedTimeMs: 3600000, compressedTimeMs: 30000 },
      { name: "Prometheus Metric Scrape (15s)", speedKbps: 1000000, uncompressedTimeMs: 12, compressedTimeMs: 3 },
      { name: "Local Terminal TUI Refresh (1s)", speedKbps: 10000000, uncompressedTimeMs: 1, compressedTimeMs: 0 },
    ],
  },
  debateStatements: [
    {
      id: "ds-1",
      scenario: "Disk Space Exhaustion with Unlinked Open Files",
      proposedAction: "Reboot the entire server immediately when df shows 100% full but du shows 20% usage.",
      isValid: false,
      explanation: "FLAWED: The discrepancy indicates a deleted log file is still being held open by a running process. Use 'lsof +L1' to find the PID holding the unlinked file and gracefully restart the process without rebooting.",
      badgeTag: "STORAGE_DIAGNOSTICS",
    },
    {
      id: "ds-2",
      scenario: "High Load Average with Low CPU Usage",
      proposedAction: "Assume the CPU is broken and upgrade to a larger processor immediately.",
      isValid: false,
      explanation: "INCORRECT: High load average with low CPU percentage signifies processes stuck in uninterruptible disk sleep (state 'D'). Use 'iotop' or 'vmstat' to inspect disk await latency and I/O bottlenecks.",
      badgeTag: "KERNEL_SCHEDULER",
    },
    {
      id: "ds-3",
      scenario: "Socket Inspection Command Selection",
      proposedAction: "Use 'ss -tulnp' instead of legacy 'netstat' on modern Linux systems.",
      isValid: true,
      explanation: "BEST PRACTICE: 'netstat' slowly iterates through /proc/net, causing performance lag on servers with thousands of sockets. 'ss' uses kernel Netlink sockets to return socket telemetry instantly.",
      badgeTag: "NETWORK_TELEMETRY",
    },
    {
      id: "ds-4",
      scenario: "Killing Runaway Processes",
      proposedAction: "Always send SIGKILL (-9) immediately to any process using over 80% CPU.",
      isValid: false,
      explanation: "DANGEROUS: SIGKILL immediately halts execution without allowing the process to flush write buffers, complete open database transactions, or remove lock files. Always send SIGTERM (-15) first.",
      badgeTag: "PROCESS_LIFECYCLE",
    },
    {
      id: "ds-5",
      scenario: "Swap Space vs Out-Of-Memory (OOM)",
      proposedAction: "Monitor 'si' and 'so' in vmstat to detect active thrashing rather than just looking at total swap used.",
      isValid: true,
      explanation: "EXCELLENT: Having data in swap is harmless if it represents cold, inactive pages. Real performance degradation occurs when 'si' (swap-in) and 'so' (swap-out) numbers are continuously high, indicating thrashing.",
      badgeTag: "MEMORY_ANALYSIS",
    },
    {
      id: "ds-6",
      scenario: "Continuous Monitoring Architecture",
      proposedAction: "Deploy Prometheus node_exporter with Grafana dashboards for baseline monitoring alongside CLI TUIs for live triage.",
      isValid: true,
      explanation: "ENTERPRISE SRE STANDARD: Time-series dashboards show historical trends and trigger alerts, while CLI TUIs (btop, iotop) allow deep, immediate troubleshooting when connected via SSH.",
      badgeTag: "OBSERVABILITY_ARCHITECTURE",
    },
  ],
  simulator: {
    headline: "LINUX SYSTEM TELEMETRY & BOTTLENECK DIAGNOSIS SIMULATOR",
    description: "Step through virtual memory audits, disk queue tracing, socket inspection, and Prometheus node_exporter polling.",
    defaultHost: "http://127.0.0.1:9100/metrics",
    terminalSteps: [
      {
        id: "step-1",
        title: "Inspect Overall Load & Memory Pressure via vmstat",
        description: "Sample kernel virtual memory, runqueue tasks (r), and blocked I/O tasks (b).",
        command: "vmstat 1 3",
        output: "procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----\n r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st\n 1  0      0 842104 124312 3421980    0    0     1    12  142  210  4  2 94  0  0\n 0  0      0 842080 124312 3421980    0    0     0     0  135  198  1  1 98  0  0\n 0  0      0 842080 124312 3421980    0    0     0     4  138  202  2  1 97  0  0",
      },
      {
        id: "step-2",
        title: "Trace Disk I/O Bandwidth & Storage Utilization via iostat",
        description: "Measure NVMe block throughput, await latency, and queue saturation percentage.",
        command: "iostat -xz 1 2",
        output: "Linux 6.8.0-48-generic (technhit-node01) \nDevice            r/s     w/s     rkB/s     wkB/s   rrqm/s   wrqm/s  %rrqm  %wrqm  r_await  w_await   aqu-sz  rareq-sz  wareq-sz  svctm  %util\nnvme0n1          0.00   14.00      0.00    128.00     0.00     2.00   0.00  12.50     0.00     0.18     0.00      0.00      9.14   0.08   0.12",
      },
      {
        id: "step-3",
        title: "Audit Active Listening Network Sockets via ss",
        description: "Parse in-kernel Netlink tables to list listening TCP sockets and owning PIDs.",
        command: "ss -tulnp",
        output: "Netid  State   Recv-Q  Send-Q   Local Address:Port   Peer Address:Port  Process\ntcp    LISTEN  0       511            0.0.0.0:80          0.0.0.0:*      users:((\"nginx\",pid=1042,fd=6))\ntcp    LISTEN  0       511            0.0.0.0:443         0.0.0.0:*      users:((\"nginx\",pid=1042,fd=7))\ntcp    LISTEN  0       128            0.0.0.0:22          0.0.0.0:*      users:((\"sshd\",pid=890,fd=3))",
      },
      {
        id: "step-4",
        title: "Detect Unlinked Open Files Consuming Disk Space via lsof",
        description: "Find deleted log files still held open by un-restarted processes.",
        command: "lsof +L1",
        output: "COMMAND    PID     USER   FD   TYPE DEVICE SIZE/OFF NLINK   NODE NAME\nnginx     1042 www-data    4w   REG  259,1 524288000     0 124501 /var/log/nginx/access.log (deleted)",
      },
      {
        id: "step-5",
        title: "Identify Top Memory & CPU Consumers via ps formatting",
        description: "List the top processes sorted by CPU and memory consumption.",
        command: "ps -eo pid,ppid,user,%cpu,%mem,cmd --sort=-%cpu | head -n 6",
        output: "    PID    PPID USER     %CPU %MEM CMD\n   1042       1 www-data  4.2  1.8 nginx: worker process\n   2311       1 root      2.1  3.4 node_exporter\n    890       1 root      0.2  0.4 /usr/sbin/sshd -D\n      1       0 root      0.0  0.2 /sbin/init\n   3102    3090 admin     0.0  0.3 -bash",
      },
      {
        id: "step-6",
        title: "Verify Prometheus Metrics Exporter HTTP Endpoint",
        description: "Query the cluster node_exporter daemon for raw time-series telemetry.",
        command: "curl -s http://127.0.0.1:9100/metrics | grep -E '^node_cpu_seconds_total|^node_memory_MemAvailable_bytes' | head -n 4",
        output: "node_cpu_seconds_total{cpu=\"0\",mode=\"idle\"} 14892.41\nnode_cpu_seconds_total{cpu=\"0\",mode=\"system\"} 124.89\nnode_cpu_seconds_total{cpu=\"0\",mode=\"user\"} 289.12\nnode_memory_MemAvailable_bytes 4268412928",
      },
    ],
    defaultPayloadBytes: 250000,
    compressedPayloadBytes: 45000,
    responseHeaders: {
      "HTTP/1.1": "200 OK",
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "X-Telemetry-Source": "node_exporter-1.7.0",
      "X-Scrape-Duration-Seconds": "0.0032",
    },
  },
  debriefRules: [
    {
      id: "rule-1",
      number: "01",
      title: "USE SS INSTEAD OF NETSTAT",
      rule: "Always use 'ss -tulnp' to audit listening ports and sockets; netstat is deprecated and causes CPU stalls on busy production servers.",
      antiPattern: "Relying on legacy netstat commands in automated health checks.",
    },
    {
      id: "rule-2",
      number: "02",
      title: "DISTINGUISH SWAP USE FROM ACTIVE THRASHING",
      rule: "Check 'si' and 'so' in vmstat. Inactive pages sitting in swap are harmless; high continuous swap in/out rates indicate memory exhaustion.",
      antiPattern: "Panicking and disabling swap entirely when swap usage is non-zero.",
    },
    {
      id: "rule-3",
      number: "03",
      title: "CHECK UNLINKED FILES WITH LSOF",
      rule: "When df shows 100% full but du cannot find large files, run 'lsof +L1' to locate deleted logs held open by running processes.",
      antiPattern: "Rebooting the server immediately without discovering which daemon leaked file descriptors.",
    },
    {
      id: "rule-4",
      number: "04",
      title: "GRACEFUL SIGNALS BEFORE FORCE KILL",
      rule: "Always attempt graceful termination with SIGTERM (kill -15) before resorting to non-interceptable SIGKILL (kill -9).",
      antiPattern: "Issuing 'killall -9' on database daemons, causing table corruption.",
    },
    {
      id: "rule-5",
      number: "05",
      title: "COMBINE PULL TIME-SERIES WITH TUI TOOLS",
      rule: "Rely on Prometheus and Grafana for long-term telemetry trends, and dive in with btop/htop for real-time live terminal triage.",
      antiPattern: "Operating production servers with zero continuous time-series metrics.",
    },
  ],
  quiz: [
    {
      id: "q-1",
      scenario: "The disk partition on your server reports 100% utilization in 'df -h', but 'du -sh /*' only accounts for 20GB of a 100GB drive.",
      question: "Which command reveals deleted files that are still holding disk space because a process has them open?",
      options: [
        "lsof +L1",
        "rm -rf /tmp",
        "iostat -m",
        "fsck -y /",
      ],
      correctIndex: 0,
      explanation: "'lsof +L1' searches for open files with a link count of less than 1 (unlinked/deleted). As long as a running process holds the file descriptor open, the kernel does not reclaim the disk blocks.",
    },
    {
      id: "q-2",
      scenario: "Your server has a load average of 18.0 on a 4-core machine, but 'top' reports that CPU idle is at 92%.",
      question: "What is the most probable cause of this performance bottleneck?",
      options: [
        "Processes are waiting in uninterruptible disk sleep (I/O wait state 'D') due to storage saturation or hung NFS/NVMe queues.",
        "The server's network cable is unplugged.",
        "The CPU fan is spinning too slowly.",
        "The RAM is operating in single-channel mode.",
      ],
      correctIndex: 0,
      explanation: "Linux load average accounts for both runnable threads (CPU-bound) and threads in uninterruptible sleep (state 'D', usually waiting on disk or network storage I/O). Low CPU with high load points directly to an I/O bottleneck.",
    },
    {
      id: "q-3",
      scenario: "You need to determine whether a Linux server is currently thrashing due to severe physical memory exhaustion.",
      question: "Which fields in 'vmstat 1' indicate active swap thrashing?",
      options: [
        "si (swap in) and so (swap out)",
        "us (user CPU) and sy (system CPU)",
        "in (interrupts) and cs (context switches)",
        "buff and cache",
      ],
      correctIndex: 0,
      explanation: "Active paging of memory pages to and from the disk swap space is reflected in 'si' (swap-in) and 'so' (swap-out). Non-zero continuous values indicate active thrashing and severe memory starvation.",
    },
    {
      id: "q-4",
      scenario: "Which modern terminal utility provides interactive per-core CPU utilization, GPU metrics, disk read/write trees, and process termination directly in the terminal?",
      question: "What is the modern successor to top and htop?",
      options: [
        "btop",
        "traceroute",
        "grep",
        "strace",
      ],
      correctIndex: 0,
      explanation: "btop is a modern C++ terminal resource monitor that visualizes CPU per-core usage, memory, disk, network, and process trees with responsive graphical bars in the terminal.",
    },
    {
      id: "q-5",
      scenario: "You are setting up cluster-wide observability across 50 Linux servers to detect performance anomalies over 30 days.",
      question: "Which architecture is the cloud-native industry standard?",
      options: [
        "Deploy Prometheus node_exporter on each node, scraped by Prometheus server and visualized with Grafana dashboards.",
        "Run 'top' in a tmux session on every server.",
        "Redirect 'vmstat' output into a text file and email it weekly.",
        "Install Webmin on every server.",
      ],
      correctIndex: 0,
      explanation: "Prometheus node_exporter exports system telemetry as standardized Prometheus time-series metrics over HTTP, allowing centralized scraping, Grafana dashboards, and automated alert manager triggers.",
    },
  ],
};

// Generic Drill Generator for all other technical posts
export function generateLearningDrill(post: Post): LearningDrillData {
  if (post.slug === "install-and-config-brotli-compression-with-apache") {
    return BROTLI_DRILL;
  }
  if (post.slug === "setting-up-an-nginx-reverse-proxy") {
    return NGINX_REVERSE_PROXY_DRILL;
  }
  if (post.slug === "install-and-configure-multiple-php-version-with-apache-on-ubuntu-20-04") {
    return MULTI_PHP_DRILL;
  }
  if (post.slug === "hardening-linux-kernel-sysctl-nftables") {
    return KERNEL_HARDENING_DRILL;
  }
  if (post.slug === "configure-ssh-key-authentication") {
    return SSH_KEY_DRILL;
  }
  if (
    post.slug === "configure-apache-virtual-host-on-ubuntu-20-04-lts" ||
    post.slug === "configure-apache-virtual-host-ubuntu-16-04-lts"
  ) {
    return APACHE_VHOST_DRILL;
  }
  if (post.slug === "top-5-system-monitoring-tools-inux") {
    return SYSTEM_MONITORING_DRILL;
  }

  const cleanTitle = post.title.replace(/^\[.*?\]/, "").trim();
  const summarySnippet = post.summary || "Comprehensive production blueprint and deployment architecture.";

  // Extract commands if any
  const commandMatches = Array.from(post.content.matchAll(/```(?:bash|sh|shell)?\s*\n([\s\S]*?)```/g));
  const rawCommands: string[] = [];
  commandMatches.forEach((m) => {
    const lines = m[1].split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
    rawCommands.push(...lines);
  });

  const sampleCommands = rawCommands.slice(0, 4);
  const terminalSteps: TerminalStep[] = [
    {
      id: "step-1",
      title: "Initialize & Verify Target Environment",
      description: `Validate prerequisite daemons and kernel privileges for ${cleanTitle}.`,
      command: sampleCommands[0] || "uname -r && cat /etc/os-release",
      output: "Linux 6.8.0-48-generic #48-Ubuntu SMP PREEMPT_DYNAMIC\nPRETTY_NAME=\"Ubuntu 24.04 LTS\"\nSTATUS=VERIFIED",
    },
    {
      id: "step-2",
      title: "Execute Core Configuration",
      description: "Apply production parameters and module bindings.",
      command: sampleCommands[1] || `sudo systemctl status ${post.category}`,
      output: `Active: active (running) since Sat 2026-10-24 12:00:00 UTC\nMain PID: 1042 (${post.category})\nTasks: 16 (limit: 9243)\nStatus: \"Production Hardened\"`,
    },
    {
      id: "step-3",
      title: "Verify System Telemetry & Socket Health",
      description: "Ensure daemons are bound correctly with zero dropped packets.",
      command: sampleCommands[2] || "ss -tulnp | grep -E ':(80|443|8080|3000)'",
      output: "tcp   LISTEN 0      511          0.0.0.0:80        0.0.0.0:*\ntcp   LISTEN 0      511          0.0.0.0:443       0.0.0.0:*",
    },
  ];

  return {
    slug: post.slug,
    title: post.title,
    category: post.category,
    badgeName: `${cleanTitle.slice(0, 24)} Specialist`,
    badgeDescription: `Demonstrated technical mastery in ${cleanTitle} on enterprise infrastructure.`,
    reconCards: [
      {
        id: "rc-1",
        tag: "ARCHITECTURE",
        title: "CORE SUBSYSTEM",
        subtitle: "Production Foundation",
        definition: `Foundational component governing ${cleanTitle}. Operates under root or dedicated service isolation.`,
        seenInProd: `Deployed across Debian 12 and Ubuntu 24.04 LTS environments.`,
      },
      {
        id: "rc-2",
        tag: "DAEMON CONTROL",
        title: "SYSTEMD INTEGRATION",
        subtitle: "Unit & Lifecycle Supervision",
        definition: "Systemd manages daemon restarts, CPU quotas, memory limits, and socket activation for zero downtime.",
        seenInProd: "Handled via 'systemctl' with journald logging enabled.",
      },
      {
        id: "rc-3",
        tag: "SECURITY",
        title: "LEAST PRIVILEGE",
        subtitle: "Access Hardening",
        definition: "Drop root privileges immediately after binding privileged ports (<1024) to mitigate privilege escalation.",
        seenInProd: "Enforced via non-root system users (e.g., www-data, nextjs, docker).",
      },
      {
        id: "rc-4",
        tag: "STORAGE & I/O",
        title: "DATA INTEGRITY",
        subtitle: "ZFS / NVMe Persistence",
        definition: "Ensure atomic file writes and persistent storage directories with strict 0755/0700 file permissions.",
        seenInProd: "Mapped to persistent Docker volumes or host mount points.",
      },
      {
        id: "rc-5",
        tag: "NETWORKING",
        title: "PACKET ROUTING",
        subtitle: "Firewall & Reverse Proxy",
        definition: "All external ingress is routed through SSL reverse proxies (Nginx/HAProxy) with HTTP/2 and modern TLS 1.3.",
        seenInProd: "Internal services bind strictly to 127.0.0.1 or private bridge networks.",
      },
      {
        id: "rc-6",
        tag: "OBSERVABILITY",
        title: "HEALTH TELEMETRY",
        subtitle: "Probes & Heartbeats",
        definition: "Real-time health checks (/api/health or TCP keepalive) automatically alert SREs and trigger orchestrator self-healing.",
        seenInProd: "Monitored via Prometheus, Grafana, and Docker swarm healthchecks.",
      },
    ],
    motive: {
      headline: "PRODUCTION RESILIENCE VS. DOWNTIME CHAOS",
      subheadline: summarySnippet,
      uncompressedBytes: 150000,
      compressedBytes: 45000,
      savingsPercentage: 70,
      explanation: "Implementing this production blueprint guarantees repeatable, deterministic server behavior and prevents cascading failures under high concurrency.",
      networkProfiles: [
        { name: "3G Mobile (750 Kbps, 150ms)", speedKbps: 750, uncompressedTimeMs: 1600, compressedTimeMs: 480 },
        { name: "4G LTE (15 Mbps, 45ms)", speedKbps: 15000, uncompressedTimeMs: 120, compressedTimeMs: 50 },
        { name: "Fiber Gigabit (1 Gbps, 8ms)", speedKbps: 1000000, uncompressedTimeMs: 12, compressedTimeMs: 6 },
      ],
    },
    debateStatements: [
      {
        id: "ds-1",
        scenario: "Automated Deployment in Production",
        proposedAction: "Apply changes directly to production servers without validating configuration in a staging or dry-run environment.",
        isValid: false,
        explanation: "FLAWED: Direct unchecked production edits introduce regressions and outage risks. Always validate syntax ('configtest', dry-run) and deploy via automated scripts.",
        badgeTag: "RELEASE_DISCIPLINE",
      },
      {
        id: "ds-2",
        scenario: "Least Privilege Service Execution",
        proposedAction: "Run application daemons as dedicated unprivileged users instead of root.",
        isValid: true,
        explanation: "VALID ARCHITECTURE: Executing applications under restricted users prevents an exploited web vulnerability from gaining root-level operating system control.",
        badgeTag: "SECURITY_POSTURE",
      },
      {
        id: "ds-3",
        scenario: "Log Rotation and Disk Management",
        proposedAction: "Leave application debug logging enabled indefinitely without logrotate or size caps.",
        isValid: false,
        explanation: "FLAWED: Unbounded debug logs will exhaust disk space, causing root filesystem lockups and crashing co-located database daemons.",
        badgeTag: "DISK_RESILIENCE",
      },
      {
        id: "ds-4",
        scenario: "SSL / TLS Hardening",
        proposedAction: "Enforce HTTPS with HSTS headers and disable outdated TLS 1.0 and 1.1 protocols.",
        isValid: true,
        explanation: "VALID: Modern encryption guarantees confidentiality and prevents ISP injection attacks.",
        badgeTag: "TRANSPORT_SECURITY",
      },
    ],
    simulator: {
      headline: "ENVIRONMENT SETUP & TELEMETRY VALIDATION",
      description: "Step through the fundamental configuration and test the active health response of the deployment.",
      defaultHost: "https://technhit.in",
      terminalSteps,
      defaultPayloadBytes: 120000,
      compressedPayloadBytes: 36000,
      responseHeaders: {
        "HTTP/1.1": "200 OK",
        "Server": "TechNHIT Bare-Metal Cluster",
        "Status": "Healthy",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
      },
    },
    debriefRules: [
      {
        id: "rule-1",
        number: "01",
        title: "IMMUTABLE CONFIGURATION DISCIPLINE",
        rule: "Version all server configurations in Git and deploy via reproducible Bash or Ansible playbooks.",
        antiPattern: "Manual SSH hot-patching without committing changes.",
      },
      {
        id: "rule-2",
        number: "02",
        title: "FAIL CLOSED, LOG ACCURATELY",
        rule: "Handle exceptions with graceful fallbacks and clear error logs containing timestamps and error context.",
        antiPattern: "Silent try/catch swallowing errors without telemetry.",
      },
      {
        id: "rule-3",
        number: "03",
        title: "LEAST PRIVILEGE BY DEFAULT",
        rule: "Never run public-facing server daemons under root accounts.",
        antiPattern: "Starting Docker containers with --privileged when standard permissions suffice.",
      },
      {
        id: "rule-4",
        number: "04",
        title: "OBSERVABILITY BEFORE OPTIMIZATION",
        rule: "Measure actual bottlenecks with real telemetry before making premature architectural changes.",
        antiPattern: "Blindly tweaking kernel sysctl values without benchmarking baseline traffic.",
      },
    ],
    quiz: [
      {
        id: "q-1",
        scenario: `You are preparing to deploy changes for ${cleanTitle} to a live production cluster.`,
        question: "What is the critical first step before applying changes to live services?",
        options: [
          "Delete the existing logs to make room on disk.",
          "Verify configuration syntax and ensure recent automated backups exist.",
          "Disable firewall rules to allow remote troubleshooting.",
          "Kill all running system processes.",
        ],
        correctIndex: 1,
        explanation: "Verifying configuration syntax (dry-run) and confirming backup availability ensures you can apply changes without syntax-induced downtime and can rollback immediately if needed.",
      },
      {
        id: "q-2",
        scenario: "A server daemon crashes repeatedly upon restart due to missing directory permissions.",
        question: "How should directory ownership be configured for standard Linux web daemons?",
        options: [
          "Run 'chmod -R 777 /' across the entire system.",
          "Assign ownership to the specific service user (e.g. www-data:www-data) with least required permissions (e.g. 0755 or 0750).",
          "Disable SELinux and AppArmor permanently.",
          "Run the service directly as the root superuser.",
        ],
        correctIndex: 1,
        explanation: "Assigning dedicated service ownership with tight permissions protects system integrity and prevents unauthorized privilege escalation.",
      },
      {
        id: "q-3",
        scenario: "You need to inspect live listening TCP ports and running process IDs on a Linux server.",
        question: "Which modern command is the recommended replacement for legacy 'netstat'?",
        options: [
          "ss -tulnp",
          "ping -all",
          "route -v",
          "iptables -L",
        ],
        correctIndex: 0,
        explanation: "'ss' (socket statistics) is the high-performance modern replacement for netstat, directly parsing kernel socket tables.",
      },
    ],
  };
}
