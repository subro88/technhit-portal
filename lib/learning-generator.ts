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

// Generic Drill Generator for all other technical posts
export function generateLearningDrill(post: Post): LearningDrillData {
  if (post.slug === "install-and-config-brotli-compression-with-apache") {
    return BROTLI_DRILL;
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
