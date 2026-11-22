// Clash Party JavaScript 覆盖脚本

const HEALTH_URL = "http://cp.cloudflare.com/generate_204";
const RULE_MIRROR = "https://ghfast.top/https://raw.githubusercontent.com/";
const CUSTOM_RULES = "varcli/rules/main/";
const ACL4SSR = "ACL4SSR/ACL4SSR/master/Clash/";
const OPENCLASH_RULES = "Aethersailor/Custom_OpenClash_Rules/main/rule/";

const DIRECT = "➡️ 全球直连";
const MANUAL = "🎛️ 手动选择";
const DAILY = "🧭 日常代理";
const SELF = "🖥️ 自建节点";
const AIRPORT = "🚅 节点优选";
const US = "🗽 美国优选";
const ASIA = "🗺️ 亚洲优选";
const AI_NODES = "🧠 AI优选";
const FINAL = "📥 漏网之鱼";

const HOME_PATTERN = /wireguard|wg|回家|home|路由器|内网|家庭/i;
const SELF_PATTERN = /us-?[a-z](?:[|]|-vless)/i;
const AI_BACKUP_PATTERN = /\[AI\]|AI解锁/i;
const US_PATTERN = /(?=.*(🇺🇸|美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|纽约|纽纽|亚特兰大|迈阿密|华盛顿|\bUS(?:[-_ ]?\d+(?:[-_ ]?[A-Za-z]{2,})?)?\b|United States|USA|America|JFK|EWR|IAD|ATL|ORD|MIA|NYC|LAX|SFO|SEA|DFW|SJC))/;
const ASIA_PATTERN = /🇯🇵|🇰🇷|🇸🇬|🇭🇰|🇹🇼|日本|东京|東京|大阪|韩国|韓國|首尔|首爾|新加坡|狮城|獅城|香港|台湾|臺灣|台灣|台北|臺北|Japan|Tokyo|Osaka|Korea|Seoul|Singapore|Hong[ _-]?Kong|Taiwan|Taipei|(?<![a-z])(?:JP|KR|SG|HK|TW|NRT|HND|KIX|ICN|SIN|HKG|TPE)(?![a-z])/i;

const RULE_SOURCES = [
  ["custom-direct", CUSTOM_RULES + "Custom_Direct.list"],
  ["custom-proxy", CUSTOM_RULES + "Custom_Proxy.list"],
  ["custom-ai", CUSTOM_RULES + "Custom_AI.list"],
  ["custom-developer", CUSTOM_RULES + "Custom_Developer.list"],
  ["custom-google", CUSTOM_RULES + "Custom_Google.list"],
  ["steam-cdn", OPENCLASH_RULES + "Steam_CDN_Classical.yaml", "yaml", 28800],
  ["china-ip", ACL4SSR + "ChinaIp.list"],
  ["china-domain", ACL4SSR + "ChinaDomain.list"],
  ["china-company-ip", ACL4SSR + "ChinaCompanyIp.list"],
  ["gfw", ACL4SSR + "ProxyGFWlist.list"],
  ["download", ACL4SSR + "Download.list"],
  ["nonstandard-port", OPENCLASH_RULES + "Custom_Port_Direct.yaml", "yaml", 28800]
];

function select(name, ...proxies) {
  return { name, type: "select", proxies };
}

function testPool(name, filter, emptyFallback) {
  const group = {
    name,
    type: "url-test",
    "include-all": true,
    filter,
    url: HEALTH_URL,
    interval: 600,
    tolerance: 30,
    lazy: true
  };
  if (emptyFallback) group["empty-fallback"] = emptyFallback;
  return group;
}

function buildGroups(proxies) {
  const home = HOME_PATTERN.source;
  const self = SELF_PATTERN.source;
  const backupNames = proxies
    .map(({ name }) => name)
    .filter((name) => typeof name === "string" && !HOME_PATTERN.test(name) && AI_BACKUP_PATTERN.test(name));
  const nodeNames = proxies.map(({ name }) => name).filter((name) => typeof name === "string");
  const aiOptions = [...new Set([SELF, ...backupNames, MANUAL, ...nodeNames])];

  return [
    // --- 基础出口 ---
    { ...select(MANUAL, SELF, AIRPORT, DIRECT), "include-all": true },
    { ...select(DAILY, SELF, AIRPORT, MANUAL, ASIA), "include-all": true },
    select(DIRECT, "DIRECT"),

    // --- 节点池 ---
    { ...select("🛜 家庭内网", DIRECT), "include-all": true, filter: "(?i)(?:" + home + ")" },
    {
      name: SELF,
      type: "select",
      "include-all": true,
      filter: "(?i)^(?!.*(?:" + home + ")).*" + self,
      "empty-fallback": "REJECT"
    },
    testPool(US, US_PATTERN.source),
    testPool(ASIA, "(?i)^(?!.*(?:" + home + ")).*(?:" + ASIA_PATTERN.source + ")", "REJECT"),
    testPool(AIRPORT, "(?i)^(?!.*(?:" + self + "|" + home + ")).*", "REJECT"),
    // 静态节点中的 AI 备用优先显示，订阅提供器中的节点由内核追加
    { ...select(AI_NODES, ...aiOptions), "include-all-providers": true },

    // --- 应用策略 ---
    { ...select("✨ AI服务", AI_NODES, MANUAL), "include-all": true },
    { ...select("📦 开发下载", DAILY, MANUAL, DIRECT), "include-all": true },
    { ...select("🐙 GitHub", MANUAL, DAILY, DIRECT), "include-all": true },
    select("🪟 微软服务", DIRECT, MANUAL, SELF, US),
    select("🍏 苹果服务", DIRECT, MANUAL, SELF, US),
    select("☁️ OneDrive", DIRECT, MANUAL, SELF, US),
    { ...select("🔎 谷歌服务", US, DAILY, MANUAL), "include-all": true },
    { ...select("🔔 谷歌FCM", US, DAILY, MANUAL), "include-all": true },
    select("💰 PayPal", MANUAL, SELF, US, DIRECT),
    select("🛍️ 国外电商", MANUAL, SELF, US),

    // --- 流媒体、社交与 PT ---
    select("🍿 媒体解锁", ASIA, AIRPORT, US, SELF, MANUAL),
    select("🗨️ 聊天社交", ASIA, AIRPORT, US, SELF, MANUAL),
    select("🧲 PT站点", DIRECT, AIRPORT, US, SELF, MANUAL),

    // --- GFW 代理 ---
    select("🔓 GFW", ASIA, AIRPORT, US, SELF, MANUAL),

    // --- 游戏与测速 ---
    select("🧩 游戏平台", DIRECT, AIRPORT, US, SELF, MANUAL),
    select("🕹️ Steam", DIRECT, AIRPORT, US, SELF, MANUAL),
    select("⏱️ 测速工具", DIRECT, MANUAL, AIRPORT, SELF, US),

    // --- 兜底出口 ---
    select("🔌 非标端口", FINAL, DIRECT, MANUAL),
    select(FINAL, DIRECT, AIRPORT, MANUAL, SELF, US)
  ];
}

function main(config) {
  config["proxy-groups"] = buildGroups(config.proxies ?? []);
  config["rule-providers"] = {
    ...config["rule-providers"],
    ...Object.fromEntries(RULE_SOURCES.map(([name, source, format = "text", interval = 86400]) => [
      "varcli-" + name,
      {
        type: "http",
        behavior: "classical",
        format,
        url: RULE_MIRROR + source,
        path: "./ruleset/varcli-override/" + name + "." + (format === "yaml" ? "yaml" : "list"),
        interval
      }
    ]))
  };

  // === 分流规则 ===
  // 分流顺序与 template_online.ini 一致
  config.rules = [
    // --- 家庭内网与自定义规则 ---
    "IP-CIDR,172.30.123.0/24,🛜 家庭内网,no-resolve",
    "IP-CIDR,192.168.123.0/24,🛜 家庭内网,no-resolve",
    "GEOSITE,private,➡️ 全球直连",
    "GEOIP,private,➡️ 全球直连,no-resolve",
    "RULE-SET,varcli-custom-direct,➡️ 全球直连",
    "RULE-SET,varcli-custom-proxy,🎛️ 手动选择",

    // --- 聊天、AI 与流媒体 ---
    "GEOSITE,telegram,🗨️ 聊天社交",
    "GEOIP,telegram,🗨️ 聊天社交,no-resolve",
    "GEOSITE,whatsapp,🗨️ 聊天社交",
    "GEOSITE,discord,🗨️ 聊天社交",
    "GEOSITE,talkatone,🗨️ 聊天社交",
    "GEOSITE,twitter,🗨️ 聊天社交",
    "GEOIP,twitter,🗨️ 聊天社交,no-resolve",
    "GEOSITE,reddit,🗨️ 聊天社交",
    "RULE-SET,varcli-custom-ai,✨ AI服务",
    "GEOSITE,youtube,🍿 媒体解锁",
    "GEOSITE,netflix,🍿 媒体解锁",
    "GEOIP,netflix,🍿 媒体解锁,no-resolve",
    "GEOSITE,disney,🍿 媒体解锁",
    "GEOSITE,tiktok,🍿 媒体解锁",
    "GEOSITE,apple-tvplus,🍿 媒体解锁",
    "GEOSITE,hbo,🍿 媒体解锁",
    "GEOSITE,primevideo,🍿 媒体解锁",
    "GEOSITE,bahamut,🍿 媒体解锁",
    "GEOSITE,spotify,🍿 媒体解锁",

    // --- 开发下载与常用服务 ---
    "RULE-SET,varcli-custom-developer,📦 开发下载",
    "GEOSITE,github,🐙 GitHub",
    "GEOSITE,docker,📦 开发下载",
    "GEOSITE,cloudflare,📦 开发下载",
    "GEOSITE,onedrive,☁️ OneDrive",
    "GEOSITE,microsoft,🪟 微软服务",
    "GEOSITE,apple,🍏 苹果服务",
    "GEOSITE,category-dev,📦 开发下载",
    "GEOSITE,googlefcm,🔔 谷歌FCM",
    "RULE-SET,varcli-custom-google,🔎 谷歌服务",
    "GEOSITE,google-cn,➡️ 全球直连",
    "GEOSITE,google,🔎 谷歌服务",
    "RULE-SET,varcli-steam-cdn,➡️ 全球直连",
    "GEOSITE,category-social-media-!cn,🗨️ 聊天社交",

    // --- 国内直连与其他应用 ---
    "GEOSITE,category-games@cn,➡️ 全球直连",
    "GEOSITE,category-game-platforms-download,➡️ 全球直连",
    "GEOSITE,category-public-tracker,➡️ 全球直连",
    "RULE-SET,varcli-china-ip,➡️ 全球直连",
    "RULE-SET,varcli-china-domain,➡️ 全球直连",
    "RULE-SET,varcli-china-company-ip,➡️ 全球直连",
    "GEOSITE,category-emby,🍿 媒体解锁",
    "GEOSITE,category-entertainment,🍿 媒体解锁",
    "GEOSITE,steam,🕹️ Steam",
    "GEOSITE,category-games,🧩 游戏平台",
    "GEOSITE,paypal,💰 PayPal",
    "GEOSITE,category-ecommerce,🛍️ 国外电商",

    // --- 测速与 PT、GFW、直连和最终兜底 ---
    "GEOIP,google,🔎 谷歌服务,no-resolve",
    "GEOSITE,category-speedtest,⏱️ 测速工具",
    "GEOSITE,category-pt,🧲 PT站点",
    "RULE-SET,varcli-gfw,🔓 GFW",
    "GEOSITE,gfw,🔓 GFW",
    "RULE-SET,varcli-download,➡️ 全球直连",
    "GEOIP,cn,➡️ 全球直连,no-resolve",
    "GEOSITE,cn,➡️ 全球直连",
    "RULE-SET,varcli-nonstandard-port,🔌 非标端口",
    "MATCH,📥 漏网之鱼"
  ];

  delete config["global-client-fingerprint"];
  config.mode = "rule";
  config.ipv6 = true;
  config["unified-delay"] = true;
  config["tcp-concurrent"] = true;
  return config;
}
