// Clash Party JS 覆盖脚本

const HEALTH_URL = "http://cp.cloudflare.com/generate_204";
const INTERVAL = 600;
const TOLERANCE = 50;

function main(config) {
  // 清理机场原有策略组和规则
  config["proxy-groups"] = [];
  config.rules = [];

  // 删除可能存在的旧字段（可选）
  delete config["global-client-fingerprint"];

  const groups = [
    // ---------- 总控 ----------
    {
      name: "🚀 手动选择",
      type: "select",
      proxies: ["🏠 自建美国", "🇺🇸 美国优选", "⚡ 节点优选", "DIRECT"]
    },
    {
      name: "🎯 全球直连",
      type: "select",
      proxies: ["DIRECT", "🚀 手动选择"]
    },
    {
      name: "🛑 广告拦截",
      type: "select",
      proxies: ["REJECT", "DIRECT"]
    },

    // ---------- 物理节点池（注意：使用 "include-all"） ----------
    {
      name: "🏠 自建美国",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      tolerance: TOLERANCE,
      lazy: true,
      "include-all": true,          // ← 关键：必须用带连字符的写法
      filter: "(?i)us-?[a-z]([|]|-vless)"
    },
    {
      name: "🇺🇸 美国优选",
      type: "url-test",
      url: HEALTH_URL,
      interval: INTERVAL,
      tolerance: TOLERANCE,
      lazy: true,
      "include-all": true,
      filter: "(?=.*(🇺🇸|美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|纽约|纽纽|亚特兰大|迈阿密|华盛顿|\\bUS(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|United States|USA|America|JFK|EWR|IAD|ATL|ORD|MIA|NYC|LAX|SFO|SEA|DFW|SJC))"
    },
    {
      name: "⚡ 节点优选",
      type: "url-test",
      url: HEALTH_URL,
      interval: INTERVAL,
      tolerance: TOLERANCE,
      lazy: true,
      "include-all": true,
      filter: "(?!.*(?i)us-?[a-z]([|]|-vless))"
    },

    // ---------- 生产力系列 ----------
    {
      name: "🧑‍💻 AI编程",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["🚀 手动选择", "🏠 自建美国", "🇺🇸 美国优选"]
    },
    {
      name: "🤖 AI模型",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["🚀 手动选择", "🏠 自建美国", "🇺🇸 美国优选"]
    },
    {
      name: "🎨 AI媒体",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["⚡ 节点优选", "🇺🇸 美国优选", "🏠 自建美国", "🚀 手动选择"]
    },
    {
      name: "👨‍💻 开发专属",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["🚀 手动选择", "🏠 自建美国", "🇺🇸 美国优选", "🎯 全球直连"]
    },
    {
      name: "🚀 GitHub",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["🚀 手动选择", "🏠 自建美国", "🇺🇸 美国优选", "🎯 全球直连"]
    },
    {
      name: "🔍 谷歌服务",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["🚀 手动选择", "🏠 自建美国", "🇺🇸 美国优选"]
    },
    {
      name: "📢 谷歌FCM",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["🚀 手动选择", "🏠 自建美国", "🇺🇸 美国优选"]
    },
    {
      name: "💳 PayPal",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["🚀 手动选择", "🏠 自建美国", "🇺🇸 美国优选", "🎯 全球直连"]
    },
    {
      name: "🛒 国外电商",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["🚀 手动选择", "🏠 自建美国", "🇺🇸 美国优选"]
    },

    // ---------- 微软 / 苹果 优先直连 ----------
    {
      name: "Ⓜ️ 微软服务",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["🎯 全球直连", "🚀 手动选择", "🏠 自建美国", "🇺🇸 美国优选"]
    },
    {
      name: "🍎 苹果服务",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["🎯 全球直连", "🚀 手动选择", "🏠 自建美国", "🇺🇸 美国优选"]
    },
    {
      name: "💾 OneDrive",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["🎯 全球直连", "🚀 手动选择", "🏠 自建美国", "🇺🇸 美国优选"]
    },

    // ---------- 影音社交 + GFW ----------
    {
      name: "🎥 媒体解锁",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["⚡ 节点优选", "🇺🇸 美国优选", "🏠 自建美国", "🚀 手动选择"]
    },
    {
      name: "💬 聊天社交",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["⚡ 节点优选", "🇺🇸 美国优选", "🏠 自建美国", "🚀 手动选择"]
    },
    {
      name: "🛡️ GFW",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["⚡ 节点优选", "🇺🇸 美国优选", "🏠 自建美国", "🚀 手动选择"]
    },
    {
      name: "⏬ PT站点",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["🎯 全球直连", "⚡ 节点优选", "🇺🇸 美国优选", "🏠 自建美国", "🚀 手动选择"]
    },

    // ---------- 游戏与工具 ----------
    {
      name: "🎮 游戏平台",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["🎯 全球直连", "⚡ 节点优选", "🏠 自建美国", "🇺🇸 美国优选", "🚀 手动选择"]
    },
    {
      name: "🎮 Steam",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["🎯 全球直连", "⚡ 节点优选", "🏠 自建美国", "🇺🇸 美国优选", "🚀 手动选择"]
    },
    {
      name: "🚀 测速工具",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["🚀 手动选择", "⚡ 节点优选", "🏠 自建美国", "🇺🇸 美国优选", "🎯 全球直连"]
    },

    // ---------- 兜底 ----------
    {
      name: "🐟 漏网之鱼",
      type: "fallback",
      url: HEALTH_URL,
      interval: INTERVAL,
      proxies: ["🎯 全球直连", "⚡ 节点优选", "🚀 手动选择", "🏠 自建美国", "🇺🇸 美国优选"]
    }
  ];

  config["proxy-groups"] = groups;

  // 规则保持不变
  config.rules = [
    "GEOSITE,private,🎯 全球直连",
    "GEOIP,private,🎯 全球直连,no-resolve",
    "GEOSITE,cloudflare,👨‍💻 开发专属",
    "GEOSITE,category-ads-all,🛑 广告拦截",
    "GEOSITE,telegram,💬 聊天社交",
    "GEOIP,telegram,💬 聊天社交,no-resolve",
    "GEOSITE,whatsapp,💬 聊天社交",
    "GEOSITE,discord,💬 聊天社交",
    "GEOSITE,twitter,💬 聊天社交",
    "GEOIP,twitter,💬 聊天社交,no-resolve",
    "GEOSITE,reddit,💬 聊天社交",
    "GEOSITE,category-social-media-!cn,💬 聊天社交",
    "GEOSITE,openai,🤖 AI模型",
    "DOMAIN-SUFFIX,openai.com,🤖 AI模型",
    "DOMAIN-SUFFIX,anthropic.com,🤖 AI模型",
    "DOMAIN-SUFFIX,claude.ai,🤖 AI模型",
    "DOMAIN-SUFFIX,x.ai,🤖 AI模型",
    "DOMAIN-SUFFIX,grok.com,🤖 AI模型",
    "DOMAIN-SUFFIX,cursor.com,🧑‍💻 AI编程",
    "DOMAIN-SUFFIX,cursor.sh,🧑‍💻 AI编程",
    "GEOSITE,youtube,🎥 媒体解锁",
    "GEOSITE,netflix,🎥 媒体解锁",
    "GEOIP,netflix,🎥 媒体解锁,no-resolve",
    "GEOSITE,disney,🎥 媒体解锁",
    "GEOSITE,tiktok,🎥 媒体解锁",
    "GEOSITE,hbo,🎥 媒体解锁",
    "GEOSITE,primevideo,🎥 媒体解锁",
    "GEOSITE,spotify,🎥 媒体解锁",
    "GEOSITE,bahamut,🎥 媒体解锁",
    "GEOSITE,category-entertainment,🎥 媒体解锁",
    "GEOSITE,docker,👨‍💻 开发专属",
    "GEOSITE,category-dev,👨‍💻 开发专属",
    "GEOSITE,github,🚀 GitHub",
    "GEOSITE,microsoft,Ⓜ️ 微软服务",
    "GEOSITE,onedrive,💾 OneDrive",
    "GEOSITE,apple,🍎 苹果服务",
    "GEOSITE,google,🔍 谷歌服务",
    "GEOSITE,googlefcm,📢 谷歌FCM",
    "GEOSITE,gfw,🛡️ GFW",
    "GEOSITE,steam,🎮 Steam",
    "GEOSITE,category-games,🎮 游戏平台",
    "GEOSITE,category-games@cn,🎯 全球直连",
    "GEOSITE,paypal,💳 PayPal",
    "GEOSITE,category-ecommerce,🛒 国外电商",
    "GEOSITE,category-speedtest,🚀 测速工具",
    "GEOSITE,category-pt,⏬ PT站点",
    "GEOSITE,cn,🎯 全球直连",
    "GEOIP,cn,🎯 全球直连,no-resolve",
    "MATCH,🐟 漏网之鱼"
  ];

  config.mode = "rule";
  config.ipv6 = true;
  config["unified-delay"] = true;
  config["tcp-concurrent"] = true;

  return config;
}
