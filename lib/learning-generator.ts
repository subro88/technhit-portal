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
    type: "reverse-proxy" | "cluster" | "network" | "stem" | "php-fpm" | "kernel-firewall";
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
