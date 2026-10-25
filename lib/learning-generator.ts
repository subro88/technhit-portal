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
    type: "reverse-proxy" | "cluster" | "network" | "stem";
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

// Generic Drill Generator for all other technical posts
export function generateLearningDrill(post: Post): LearningDrillData {
  if (post.slug === "install-and-config-brotli-compression-with-apache") {
    return BROTLI_DRILL;
  }
  if (post.slug === "setting-up-an-nginx-reverse-proxy") {
    return NGINX_REVERSE_PROXY_DRILL;
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
