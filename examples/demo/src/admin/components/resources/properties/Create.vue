<template>
  <EaActionWrapper :title="title" :resource="resource.name" :display-mode="displayMode" @cancel="onCancelAction">
    <EaForm
      :id="id"
      :value="item"
      :resource="resource.name"
      @saved="handleFormSaved"
      :redirect="displayMode === 'page' ? 'retrieve' : false"
    >
      <EaTextInput source="application" required />
      <EaSelectInput source="profile" enumKey="profiles" required />
      <EaTextInput source="label" required />
      <EaAutocompleteInput
        label-mode
        :chip="false"
        :items="keys"
        item-value="key"
        item-text="desc"
        source="key"
        required
      />
      <EaTextInput source="value" />
    </EaForm>
  </EaActionWrapper>
</template>

<script>
import ResourceForm from "../../../mixins/resource-form"
export default {
  mixins: [ResourceForm],
  props: {
    title: String,
  },
  data() {
    return {
      keys: [
        { key: "spring", desc: "spring配置" },
        { key: "spring.database.username", desc: "数据库用户名" },
        { key: "spring.database.password", desc: "数据库密码" },
        { key: "spring.database.url", desc: "数据库url" },
        { key: "spring.rabbitmq.host", desc: "rabbitmq 主机" },
        { key: "spring.rabbitmq.port", desc: "rabbitmq 端口" },
        { key: "spring.cloud.bus.destination", desc: "消息总线目的地; 默认值: com.edian.mserv.bus" },
        { key: "spring.jpa", desc: "spring jpa配置" },
        { key: "spring.jpa.hibernate", desc: "jpa hibernate配置" },
        { key: "spring.jpa.hibernate.ddl-auto", desc: "hibernate ddl-auto" },
        { key: "security.oauth2.resource.token-info-uri", desc: "资源服务token验证端点" },
        // eureka
        { key: "eureka.datacenter", desc: "eureka所在数据中心; 默认值: ali-cn-hangzhou" },
        { key: "eureka.environment", desc: "eureka 环境" },
        { key: "com.edian", desc: "易电业务配置" },
        { key: "com.edian.mserv", desc: "易电微服务配置" },
        // auth service
        { key: "com.edian.mserv.auth", desc: "认证服务配置" },
        {
          key: "com.edian.mserv.auth.token-store-key-prefix",
          desc: "token存储key的前缀; 默认值: 'com.edian.mserv.auth:'",
        },
        { key: "com.edian.mserv.auth.min-password-length", desc: "密码最小长度; 默认值: 8" },
        { key: "com.edian.mserv.auth.auto-register-clients", desc: "启用自动注册的client; 默认值: []" },
        { key: "com.edian.mserv.auth.sms", desc: "短信认证配置" },
        { key: "com.edian.mserv.auth.sms.enabled", desc: "是否启用短信验证码认证; 默认值: false" },
        { key: "com.edian.mserv.auth.sms.random-code-length", desc: "短信验证码的长度; 默认值: 6" },
        {
          key: "com.edian.mserv.auth.sms.cache-key",
          desc: "短信验证码缓存的键; 默认值: com.edian.mserv.auth.sms.cache",
        },
        { key: "com.edian.mserv.auth.sms.expire-in-seconds", desc: "短信验证码过期时间(单位秒); 默认值: 60" },
        { key: "com.edian.mserv.auth.wechat", desc: "微信认证配置" },
        { key: "com.edian.mserv.auth.wechat.enabled", desc: "是否启用微信认证; 默认值: false" },
        { key: "com.edian.mserv.auth.wechat.apps", desc: "用于微信认证的app信息; 默认值: []" },
        { key: "com.edian.mserv.auth.wechat.apps[0].app-id", desc: "微信appId" },
        { key: "com.edian.mserv.auth.wechat.apps[0].secret", desc: "微信app secret" },
        { key: "com.edian.mserv.auth.wechat.apps[0].name", desc: "微信app名称" },
        // message service
        { key: "com.edian.mserv.message", desc: "消息服务配置" },
        { key: "com.edian.mserv.message.push", desc: "推送配置" },
        { key: "com.edian.mserv.message.push.we-chat", desc: "微信推送配置" },
        { key: "com.edian.mserv.message.push.we-chat.apps", desc: "用于推送的app列表; 默认值: []" },
        { key: "com.edian.mserv.message.push.we-chat.apps[0].app-id", desc: "微信appId" },
        { key: "com.edian.mserv.message.push.we-chat.apps[0].secret", desc: "微信app secret" },
        { key: "com.edian.mserv.message.push.we-chat.apps[0].name", desc: "微信app名称" },
        { key: "com.edian.mserv.message.push.email", desc: "邮件推送配置" },
        { key: "com.edian.mserv.message.push.email.default-from-name", desc: "邮件发送者名称" },
        { key: "com.edian.mserv.message.push.email.from", desc: "邮件发送者邮件地址" },
        // wechat bridge
        { key: "com.edian.bridge", desc: "桥配置" },
        { key: "com.edian.bridge.wechat", desc: "微信桥配置" },
        { key: "com.edian.bridge.wechat.apps", desc: "支持的微信app列表; 默认值: []" },
        { key: "com.edian.bridge.wechat.apps[0].app-id", desc: "微信appId" },
        { key: "com.edian.bridge.wechat.apps[0].secret", desc: "微信app secret" },
        { key: "com.edian.bridge.wechat.apps[0].name", desc: "微信app名称" },
        {
          key: "com.edian.bridge.wechat.callback-url",
          desc: "认证回调地址; 默认值: https://api.365edian.com/v3/bridge/we-chat/authorize/callback",
        },
        {
          key: "com.edian.bridge.wechat.authorize-url",
          desc: "认证地址; 默认值: https://api.365edian.com/v3/bridge/we-chat/authorize",
        },
        {
          key: "com.edian.bridge.wechat.authorize-cache-key-prefix",
          desc: "认证缓存key前缀; 默认值: com.edian.bridge.wechat.authorize.cache",
        },
        // commons
        { key: "com.edian.commons", desc: "公共组件配置" },
        { key: "com.edian.commons.management.security", desc: "管理端点安全配置" },
        { key: "com.edian.commons.management.security.enabled", desc: "启用管理端点安全配置" },
        { key: "com.edian.commons.ali.oss", desc: "阿里OSS组件配置" },
        { key: "com.edian.commons.ali.oss.access-id", desc: "阿里OSS access id" },
        { key: "com.edian.commons.ali.oss.access-key", desc: "阿里OSS access key" },
        { key: "com.edian.commons.ali.oss.default-bucket", desc: "阿里OSS默认Bucket" },
        { key: "com.edian.commons.ali.oss.endpoint", desc: "阿里OSS访问端点" },
        { key: "com.edian.commons.ali.oss.extranet-endpoint", desc: "阿里OSS公网访问端点" },
        { key: "com.edian.commons.ali.oss.callback-url", desc: "阿里OSS回调地址" },
        { key: "com.edian.commons.ali.oss.callback-service-prefix", desc: "阿里OSS回调地址前缀;默认值: '' " },
        { key: "com.edian.commons.ali.oss.def-dir", desc: "阿里OSS默认上传文件夹;默认值: 'temp/' " },
        {
          key: "com.edian.commons.ali.oss.upload-policy-expire-second",
          desc: "阿里OSS上传策略过期时间（单位秒）;默认值: 60 ",
        },
        { key: "com.edian.commons.ali.oss.client", desc: "阿里OSS客户端配置" },
        { key: "com.edian.commons.ali.oss.client.protocol", desc: "阿里OSS客户端协议; HTTPS or HTTP " },
        { key: "com.edian.commons.ali.oss.client.user-agent", desc: "阿里OSS客户端自定义user-agent " },
        { key: "com.edian.commons.ali.oss.sts", desc: "阿里OSS STS配置" },
        {
          key: "com.edian.commons.ali.oss.sts.endpoint",
          desc: "阿里OSS-STS端点;默认值: 'sts-vpc.cn-hangzhou.aliyuncs.com' ",
        },
        { key: "com.edian.commons.ali.oss.sts.role-arn", desc: "阿里OSS-STS扮演角色" },
        { key: "com.edian.commons.ali.oss.sts.duration-seconds", desc: "阿里OSS-STS持续时间（单位秒）;默认值: 900 " },
        { key: "com.edian.commons.baidu.map", desc: "百度地图组件配置" },
        { key: "com.edian.commons.baidu.map.ak", desc: "百度地图SDK访问AK" },
        { key: "com.edian.commons.exception", desc: "异常处理配置" },
        { key: "com.edian.commons.exception.show-detail", desc: "显示异常详细信息" },
        { key: "com.edian.commons.exception.print-stack-trace", desc: "打印异常堆栈" },
        { key: "com.edian.commons.feign", desc: "feign组件配置" },
        { key: "com.edian.commons.feign.service-authenticate", desc: "服务认证相关配置" },
        { key: "com.edian.commons.feign.service-authenticate", desc: "服务认证相关配置" },
        { key: "com.edian.commons.feign.service-authenticate.client-id", desc: "认证client id" },
        { key: "com.edian.commons.feign.service-authenticate.client-secret", desc: "认证client secret" },
        { key: "com.edian.commons.feign.service-authenticate.access-token-uri", desc: "获取token的端点" },
        {
          key: "com.edian.commons.feign.service-authenticate.grant-type",
          desc: "授权类型; 目前只有 client_credentials",
        },
        {
          key: "com.edian.commons.feign.service-authenticate.client-authentication-scheme",
          desc: "客户端授权信息所在位置; form or header",
        },
        { key: "com.edian.commons.jpa", desc: "JPA组件配置" },
        { key: "com.edian.commons.jpa.auditing", desc: "JPA审计配置" },
        { key: "com.edian.commons.jpa.auditing.enabled", desc: "开启JPA审计功能" },
        { key: "com.edian.commons.jpa.auditing.auditor-key", desc: "Auditor提取key; 多个值用英文逗号分隔" },
        { key: "com.edian.commons.logging", desc: "日志组件配置" },
        { key: "com.edian.commons.logging.logstash-endpoint", desc: "logstash端点; 默认值: logstash:4560" },
        { key: "com.edian.commons.logging.root-level", desc: "root level; 默认值: INFO" },
        { key: "com.edian.commons.logging.access", desc: "access日志配置" },
        { key: "com.edian.commons.logging.access.enabled", desc: "启用access日志; 默认值: false" },
        {
          key: "com.edian.commons.logging.access.ignore-params",
          desc: '记录时忽略的参数; 默认值: ["password", "key", "access_token", "accessToken", "token", "secret", "secret_key", "secretKey"] ',
        },
        { key: "com.edian.commons.logging.access.excluded-urls", desc: '排除的url列表; 默认值: ["/actuator/**"]' },
        {
          key: "com.edian.commons.logging.access.ignore-params-replacement",
          desc: '忽略参数时的替换内容; 默认值: "******"',
        },
        {
          key: "com.edian.commons.logging.access.record-request-headers",
          desc: '需要记录的请求头; 默认值: ["user-agent"]',
        },
        { key: "com.edian.commons.logging.access.deserialize-body", desc: "反序列化请求/响应体; 默认值: false" },
        { key: "com.edian.commons.logging.access.enabled-record-request-body", desc: "记录请求体; 默认值: true" },
        { key: "com.edian.commons.logging.access.enabled-record-response-body", desc: "记录响应体; 默认值: false" },
        { key: "com.edian.commons.logging.access.enabled-record-response-body", desc: "记录响应体; 默认值: false" },
        {
          key: "com.edian.commons.logging.access.record-body-types",
          desc: '记录请求/响应体的类型; 默认值: ["application/json", "text/*", "application/x-www-form-urlencoded", "multipart/form-data"]',
        },
        { key: "com.edian.commons.logging.access.max-payload-length", desc: "最大接受载荷长度; 默认值: 1024" },
        { key: "com.edian.commons.logging.access.record-response-headers", desc: "需要记录的响应头; 默认值: []" },
        { key: "com.edian.commons.robot-verification", desc: "机器人检测组件配置" },
        { key: "com.edian.commons.robot-verification.default-tester", desc: "默认的检测器; useless,tencent" },
        { key: "com.edian.commons.robot-verification.tencent", desc: "腾讯防水墙检测配置" },
        { key: "com.edian.commons.robot-verification.tencent.app-id", desc: "腾讯防水墙id" },
        { key: "com.edian.commons.robot-verification.tencent.app-secret-key", desc: "腾讯防水墙key" },
        { key: "com.edian.commons.security", desc: "安全组件配置" },
        { key: "com.edian.commons.sms", desc: "短信组件配置" },
        { key: "com.edian.commons.sms.max-batch-size", desc: "批量发送最大限制; 默认值: 50 " },
        { key: "com.edian.commons.sms.lingkai", desc: "凌凯短信网关配置" },
        { key: "com.edian.commons.sms.lingkai.url", desc: "凌凯url" },
        { key: "com.edian.commons.sms.lingkai.encoding", desc: "请求编码; 默认值: utf-8" },
        { key: "com.edian.commons.sms.lingkai.sign", desc: "企业签名; 默认值: 【易电】" },
        { key: "com.edian.commons.sms.lingkai.unsubscribe", desc: '退订提示内容; 默认值: "，退订回N" ' },
        { key: "com.edian.commons.thread", desc: "线程池配置" },
        { key: "com.edian.commons.thread.size", desc: "线程池初始大小; 默认值: 5" },
        { key: "com.edian.commons.thread.max-size", desc: "线程池最大; 默认值: 10" },
        { key: "com.edian.commons.thread.queue-capacity", desc: "队列容量; 默认值: 25" },
        { key: "com.edian.commons.wechat", desc: "微信组件配置" },
        { key: "com.edian.commons.wechat.token-cache", desc: "token缓存配置" },
        { key: "com.edian.commons.wechat.token-cache.enabled", desc: "启用token缓存" },
        {
          key: "com.edian.commons.wechat.token-cache.cache-key",
          desc: "缓存的key; 默认值: com.edian.commons.wechat.token",
        },
        { key: "com.edian.commons.wechat.ticket-cache", desc: "ticket缓存配置" },
        { key: "com.edian.commons.wechat.ticket-cache.enabled", desc: "启用ticket缓存" },
        {
          key: "com.edian.commons.wechat.ticket-cache.cache-key",
          desc: "缓存的key; 默认值: com.edian.commons.wechat.ticket",
        },
      ],
    }
  },
}
</script>

<style scoped></style>
