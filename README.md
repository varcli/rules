# Clash / Mihomo 配置

个人订阅转换模板、Clash Party 覆写和自定义列表。

## 使用方式

| 文件 | 用法 |
| --- | --- |
| [在线 INI 模板](clash/template_online.ini) | 在 Subconverter 的「远程配置」中填入下方地址，输出类型选 Clash。将生成的订阅链接或 YAML 导入 Mihomo 客户端 |
| [JS 覆写](clash/override-rule.js) | 在 Clash Party 的「覆写」中导入，并绑定到原始订阅 |
| [YAML 覆写](clash/override-rule.yaml) | 在 Clash Party 的「覆写」中导入，并绑定到原始订阅 |

JS 和 YAML 覆写任选其一。[Subconverter 文档](https://github.com/tindy2013/subconverter/blob/master/README-cn.md) · [Clash Party 覆写说明](https://clashparty.org/docs/guide/override)

在线 INI 模板地址

```text
https://raw.githubusercontent.com/varcli/rules/main/clash/template_online.ini
```

## 自定义列表

- [Custom_Direct.list](Custom_Direct.list)
- [Custom_Proxy.list](Custom_Proxy.list)
- [Custom_AI.list](Custom_AI.list)
- [Custom_Developer.list](Custom_Developer.list)
- [Custom_Google.list](Custom_Google.list)

在线配置读取 GitHub `main` 分支上的列表。更新后推送到 `main`，再刷新订阅。
