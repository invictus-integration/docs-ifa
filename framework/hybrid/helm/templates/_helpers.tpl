{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "invictus.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "invictus.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- printf .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "rabbitmq.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "rabbitmq.labels" -}}
helm.sh/chart: {{ include "rabbitmq.chart" . }}
{{ include "rabbitmq.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "rabbitmq.selectorLabels" -}}
app.kubernetes.io/name: {{ include "invictus.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "rabbitmq.serviceAccountName" -}}
{{- if .Values.rabbitMQ.serviceAccount.create }}
{{- default (include "invictus.fullname" .) .Values.rabbitMQ.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.rabbitMQ.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Return the number of bytes given a value
following a base 2 o base 10 number system.
Usage:
{{ include "rabbitmq.toBytes" .Values.rabbitMQ.path.to.the.Value }}
*/}}
{{- define "rabbitmq.toBytes" -}}
{{- $value := int (regexReplaceAll "([0-9]+).*" . "${1}") }}
{{- $unit := regexReplaceAll "[0-9]+(.*)" . "${1}" }}
{{- if eq $unit "Ki" }}
    {{- mul $value 1024 }}
{{- else if eq $unit "Mi" }}
    {{- mul $value 1024 1024 }}
{{- else if eq $unit "Gi" }}
    {{- mul $value 1024 1024 1024 }}
{{- else if eq $unit "Ti" }}
    {{- mul $value 1024 1024 1024 1024 }}
{{- else if eq $unit "Pi" }}
    {{- mul $value 1024 1024 1024 1024 1024 }}
{{- else if eq $unit "Ei" }}
    {{- mul $value 1024 1024 1024 1024 1024 1024 }}
{{- else if eq $unit "K" }}
    {{- mul $value 1000 }}
{{- else if eq $unit "M" }}
    {{- mul $value 1000 1000 }}
{{- else if eq $unit "G" }}
    {{- mul $value 1000 1000 1000 }}
{{- else if eq $unit "T" }}
    {{- mul $value 1000 1000 1000 1000 }}
{{- else if eq $unit "P" }}
    {{- mul $value 1000 1000 1000 1000 1000 }}
{{- else if eq $unit "E" }}
    {{- mul $value 1000 1000 1000 1000 1000 1000 }}
{{- end }}
{{- end -}}

{{/*
Management UI plugin options (when plugin is enabled)
*/}}
{{- define "rabbitmq.managementPluginOptions" -}}
{{- if .Values.rabbitMQ.managementPlugin.enabled }}
## Management UI plugin options
management.tcp.port = {{ .Values.rabbitMQ.managementPlugin.tcp.port }}
{{- end }}
{{- end -}}

{{/*
K8 peer discovery cluster plugin options (when plugin is enabled)
*/}}
{{- define "rabbitmq.k8sPeerDiscoveryPluginOptions" -}}
{{- if .Values.rabbitMQ.k8sPeerDiscoveryPlugin.enabled }}
## Clustering with K8s peer discovery plugin
cluster_formation.peer_discovery_backend = rabbit_peer_discovery_k8s
cluster_formation.k8s.host = kubernetes.default.svc.{{ .Values.rabbitMQ.clusterDomain }}
cluster_formation.k8s.address_type = {{ .Values.rabbitMQ.k8sPeerDiscoveryPlugin.addressType }}
cluster_formation.k8s.service_name = {{ template "invictus.fullname" . }}-internal
cluster_formation.k8s.hostname_suffix = .{{ template "invictus.fullname" . }}-internal.{{ .Release.Namespace }}.svc.{{ .Values.rabbitMQ.clusterDomain }}
{{- end }}
{{- end -}}

{{/*
Prometheus plugin options (when plugin is enabled)
*/}}
{{- define "rabbitmq.prometheusPluginOptions" -}}
{{- if .Values.rabbitMQ.prometheusPlugin.enabled }}
## Prometheus plugin options
prometheus.tcp.port = {{ .Values.rabbitMQ.prometheusPlugin.tcp.port }}
{{- end }}
{{- end -}}

{{/*
Main RabbitMQ options
*/}}
{{- define "rabbitmq.options" -}}
## Initial login user
default_user = {{ (.Values.rabbitMQ.authentication).user | default "guest" }}
default_pass = {{ (.Values.rabbitMQ.authentication).password | default "guest" }}
loopback_users.guest = false
## RabbitMQ options
listeners.tcp.default = {{ .Values.rabbitMQ.options.tcp.port }}
{{- with .Values.rabbitMQ.options.ssl }}
{{- if .enabled }}
## SSL options
listeners.ssl.default = {{ .port }}
{{- if .verify }}
ssl_options.verify = verify_peer
{{- else }}
ssl_options.verify = verify_none
{{- end }}
ssl_options.fail_if_no_peer_cert = {{ .failIfNoPeerCert }}
{{- if .depth }}
ssl_options.depth = {{ .depth }}
{{- end }}
{{- end }}
{{- end }}
{{- with .Values.rabbitMQ.certificates }}
{{- if .enabled }}
{{- if .cacert }}
ssl_options.cacertfile = /ssl/cacert
{{- end }}
{{- if .cert }}
ssl_options.certfile = /ssl/cert
{{- end }}
{{- if .key }}
ssl_options.keyfile = /ssl/key
{{- end }}
{{- if .password }}
ssl_options.password = {{ .password }}
{{- end }}
{{- end }}
{{- end }}
## Memory options
{{- if ((.Values.rabbitMQ.options).memory).calculationStrategy }}
vm_memory_calculation_strategy = {{ .Values.rabbitMQ.options.memory.calculationStrategy }}
{{- end}}
{{- if ((.Values.rabbitMQ.options).memory).totalAvailableOverrideValue }}
total_memory_available_override_value = {{ .Values.rabbitMQ.options.memory.totalAvailableOverrideValue }}
{{- else }}
{{- $memLimit := ((.Values.rabbitMQ.resources).limits).memory -}}
{{- if $memLimit }}
total_memory_available_override_value = {{ include "rabbitmq.toBytes" $memLimit }}
{{- end }}
{{- end }}
{{- with .Values.rabbitMQ.options.memoryHighWatermark }}
{{- if .enabled }}
## Memory Threshold
vm_memory_high_watermark.{{ .type }} = {{ .value }}
{{- if .pagingRatio }}
vm_memory_high_watermark_paging_ratio = {{ .pagingRatio }}
{{- end }}
{{- end }}
{{- end }}
{{- end -}}
{{- define "connectionstringmsSQL" }}
{{- if .Values.existingSQLConnectionString }}
{{- .Values.existingSQLConnectionString -}}
{{- else }}
{{- $passwd := include "sql.sapassword" .}}
{{- printf "Server=mssql;Database=master;User=sa;Password=%s;" $passwd -}}
{{- end }}
{{- end }}
{{/*
Random keys if none are given
*/}}
{{- define "erlangCookie" -}}
{{- if not .Values.rabbitMQ.authentication.erlangCookie}}
{{-  randAlphaNum 20 | nospace -}}
{{- else}} 
{{-  .Values.rabbitMQ.authentication.erlangCookie -}}
{{- end -}}   
{{- end }}
{{- define "rabbitMQ.password" -}}
{{- if not .Values.rabbitMQ.authentication.password}}
{{-  randAlphaNum 20 | nospace -}}
{{- else}} 
{{-  .Values.rabbitMQ.authentication.password -}}
{{- end -}}   
{{- end }}
{{- define "sql.sapassword" -}}
{{- if not .Values.SQL.sapassword }}
{{- randAlphaNum 20 | nospace -}}
{{- else}} 
{{- .Values.SQL.sapassword -}}
{{- end -}}   
{{- end }}
{{/*
generate the rabbitMq connection
*/}}
{{- define "rabbitMQ.connection" -}}
amqp://{{.Values.rabbitMQ.authentication.user}}:{{ template "rabbitMQ.password" .}}@host/vhost
{{- end}}
{{/*
create imagePullSecret
*/}}
{{- define "imagePullSecret" }}
{{- with .Values.imagePullSecret }}
{{- printf "{\"auths\":{\"%s\":{\"username\":\"%s\",\"password\":\"%s\",\"auth\":\"%s\"}}}" .registryURL .username .password  (printf "%s:%s" .username .password | b64enc) | b64enc }}
{{- end }}
{{- end }}
{{/*
create FunctionKeys
*/}}
{{- define "PubSub-hostmaster-function-key" }}
{{- randAlphaNum 20 | nospace -}}
{{- end }}
{{- define "PubSub-HttpTrigger-function-key" }}
{{- randAlphaNum 20 | nospace -}}
{{- end }}
{{- define "RegexTranslation-hostmaster-function-key" }}
{{- randAlphaNum 20 | nospace -}}
{{- end }}
{{- define "RegexTranslation-HttpTrigger-function-key" }}
{{- randAlphaNum 20 | nospace -}}
{{- end }}
{{- define "SequenceController-hostmaster-function-key" }}
{{- randAlphaNum 20 | nospace -}}
{{- end }}
{{- define "SequenceController-HttpTrigger-function-key" }}
{{- randAlphaNum 20 | nospace -}}
{{- end }}
{{- define "TimeSequencer-hostmaster-function-key" }}
{{- randAlphaNum 20 | nospace -}}
{{- end }}
{{- define "TimeSequencer-HttpTrigger-function-key" }}
{{- randAlphaNum 20 | nospace -}}
{{- end }}
{{- define "XmlJsonConverter-hostmaster-function-key" }}
{{- randAlphaNum 20 | nospace -}}
{{- end }}
{{- define "XmlJsonConverter-HttpTrigger-function-key" }}
{{- randAlphaNum 20 | nospace -}}
{{- end }}
{{- define "XsdValidator-hostmaster-function-key" }}
{{- randAlphaNum 20 | nospace -}}
{{- end }}
{{- define "XsdValidator-HttpTrigger-function-key" }}
{{- randAlphaNum 20 | nospace -}}
{{- end }}
{{- define "transco-hostmaster-function-key" }}
{{- randAlphaNum 20 | nospace -}}
{{- end }}
{{- define "transco-HttpTrigger-function-key" }}
{{- randAlphaNum 20 | nospace -}}
{{- end }}