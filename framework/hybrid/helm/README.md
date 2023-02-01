# invictus on premise
![Version: 1.0.0](https://img.shields.io/badge/Version-1.0.0-informational?style=flat-square) ![Type: framework](https://img.shields.io/badge/Type-framework-informational?style=flat-square) ![AppVersion: 4.15.11](https://img.shields.io/badge/AppVersion-4.15.11-informational?style=flat-square)
## general variables
| Parameter                   | Type   | Default                  | Description                                                 |
|-----------------------------|--------|--------------------------|-------------------------------------------------------------|
| fullnameOverride            | string | `invictus`               | Fully override the deployment name                          |
| Invictusversion             | string | `4.15.11`                | The version of invictus                                     |
| imagePullSecret.username    | string | `nil`                    | Login username to access acr (provided by products team)     |
| imagePullSecret.password    | string | `nil`                    | Login password to access acr (provided by products team)     |
| tag                         | string | `latest`                 | Docker pull tag                                             |
| pullPolicy                  | string | `IfNotPresent`           | options: IfNotPresent                                       |
| replicaCount                | sting  | `1`                      | Copies of the framework you want deployed on the cluster    |
| port                        | int    | `7071`                   | Function port                                                |
| existingSQLConnectionString | string | `nil`                    | Provide a connectionstring if there is already a SQL server |
| existingDurableSQLConnectionString | string | `nil`             | Provide a connectionstring if there is already a SQL server for the durable state (must be a msSQL) |
| clusterDomain               | string | `"cluster.local"`        | Kubernetes cluster domain (DNS)suffix                       |

# Component specific variables
## general
| Parameter                                | Type   | Default  | Description                        |
|------------------------------------------|--------|----------|------------------------------------|
| Framework.APPINSIGHTS_INSTRUMENTATIONKEY | string | `nil`    | The appinsights instrumentationkey ||
| Framework.FUNCTIONS_EXTENSION_VERSION    | string    | `4`      | The funtion extension version      |
| Framework.FUNCTIONS_WORKER_RUNTIME       | string | `dotnet` |                                    |
| Framework.OpenApi__Info__Version         | sting    | `2.0.0`  |                                    |
| Framework.RunningEnvironment             | string | `onprem` | This for the correct libraries     |

## RegexTranslation
| Parameter                                                           | Type   | Default                                         | Description                                    |
|---------------------------------------------------------------------|--------|-------------------------------------------------|------------------------------------------------|
| Framework.RegexTranslation.image.repository                         | string | `invictusdevacracr.azurecr.io/regextranslation` | The arc repository where the images are hosted |
| Framework.RegexTranslation.OpenApi__Info__Title                     | string | `Regex Translator`                              | The OpenApi__Info__Title                       |
 All other components have the same settings just the **RegexTranslation** changed for
- SequenceController
- XmlJsonConverter
- XsdValidator
- TimeSequencer
- Transco
- PubSub
### pubsub 
The pubsub has one more config:
| Parameter                                | Type   | Default  | Description                        |
|------------------------------------------|--------|----------|------------------------------------|
| Framework.PubSub.RmqConnectionString | string | `nil`    | The rabbitmq connectionstring (leave empty for automatic deployment) |
# MQ SQL
## variables
| Parameter                     | Type  |  Default                           | Description                                                  |
|-------------------------------|-------------|----------------------------------|--------------------------------------------------------------|
| SQL.acceptEula.value              | string      | `y`                              | End-user license agreement (EULA) that needs to be accepted. |
| SQL.edition.value                 | string      | `Developer`                      | The edition of SQL Server to install. See section [Editions](#sql-server-for-linux-editions).|
| SQL.sapassword                    | string      | `Random (20-AlphNum)`<sup>1<sup> | Password for sa login                                        |
| SQL.image.repository              | string      | `microsoft/mssql-server-linux`   | The docker hub repo for SQL Server                           |
| SQL.image.tag                     | string      | `2019-CU16-ubuntu-20.04`         | The tag for the image                                        |
| SQL.image.pullPolicy              | string      | `IfNotPresent`                   | The pull policy for the deployment                           |
| SQL.image.pullSecrets             | string      | `Commented Out`                  | Specify an image pull secret if needed                       |
| SQL.nodeSelector                  | object      | `{}`                             | Node labels for pod assignment                               |
| SQL.service.headless              | boolean     | `false`                          | Allows you to setup a headless service                       |
| SQL.service.type                  | string      | `ClusterIP`                      | Service Type                                                 |
| SQL.service.port                  | int         | `1433`                           | Service Port                                                 |
| SQL.service.annotations           | object      | `{}`                             | Kubernetes service annotations                               |
| SQL.service.labels                | object      | `{}`                             | Kubernetes service labels                                    |
| SQL.deployment.annotations        | object      | `{}`                             | Kubernetes deployment annotations                            |
| SQL.deployment.labels             | object      | `{}`                             | Kubernetes deployment labels                                 |
| SQL.pod.annotations               | object      | `{}`                             | Kubernetes pod annotations                                   |
| SQL.pod.labels                    | object      | `{}`                             | Kubernetes pod labels                                        |
| SQL.collation                     | string      | `SQL_Latin1_General_CP1_CI_AS`   | Default collation for SQL Server                             |
| SQL.dataDir                       | string      | `/var/opt/mssql`                 | Specify the default SQL data directory                       |
| SQL.lcid                          | int         | `1033`                           | Default languages for SQL Server                             |
| SQL.hadr                          | int         | `0`                              | Enable Availability Group                                    |
| SQL.replicaCount                  | int         | `1`                              | Set the number of replica                                    |
| SQL.persistence.enabled           | boolean     | `false`                          | Persist the Data and Log files for SQL Server                |
| SQL.persistence.existingDataClaim | string      | `Commented Out`                  | Identify an existing Claim to be used for the Data Directory |
| SQL.persistence.storageClass      | string      | `Commented Out`                  | Storage Class to be used                                     |
| SQL.persistence.dataAccessMode    | string      | `ReadWriteOnce`                  | Data Access Mode to be used for the Data Directory           |
| SQL.persistence.dataSize          | string      | `1Gi`                            | PVC Size for Data Directory          

# RabbitMQ
## Deployment parameters

| Key                                         | Type   | Default           | Description                                                               |
| ------------------------------------------- | ------ | ----------------- | ------------------------------------------------------------------------- |
| rabbitMQ.image.pullPolicy                   | string | `"IfNotPresent"`  | Image pull policy                                                         |
| rabbitMQ.image.registry                     | string | `"docker.io"`     | Image registry                                                            |
| rabbitMQ.image.repository                   | string | `"rabbitmq"`      | Image name                                                                |
| rabbitMQ.image.tag                          | string | `""`              | Image tag                                                                 |
| rabbitMQ.initImage.pullPolicy               | string | `"IfNotPresent"`  | Init image pull policy                                                    |
| rabbitMQ.initImage.registry                 | string | `"docker.io"`     | Image registry                                                            |
| rabbitMQ.initImage.repository               | string | `"busybox"`       | Init image name                                                           |
| rabbitMQ.initImage.tag                      | string | `"latest"`        | Init image tag                                                            |
| rabbitMQ.imagePullSecrets                   | list   | `[]`              | Image pull secrets                                                        |
| rabbitMQ.extraInitContainers                | list   | `[]`              | Extra init containers                                                     |
| rabbitMQ.extaContainers                     | list   | `[]`              | Extra containers for usage as sidecars                                    |
| rabbitMQ.startupProbe                       | object | `see values.yaml` | Startup probe configuration                                               |
| rabbitMQ.livenessProbe                      | object | `see values.yaml` | Liveness probe configuration                                              |
| rabbitMQ.readinessProbe                     | object | `see values.yaml` | Readiness probe configuration                                             |
| rabbitMQ.customStartupProbe                 | object | `{}`              | Custom startup probe (overwrites default startup probe configuration)     |
| rabbitMQ.customLivenessProbe                | object | `{}`              | Custom liveness probe (overwrites default liveness probe configuration)   |
| rabbitMQ.customReadinessProbe               | object | `{}`              | Custom readiness probe (overwrites default readiness probe configuration) |
| rabbitMQ.resources                          | object | `{}`              | Resource limits and requests                                              |
| rabbitMQ.nodeSelector                       | object | `{}`              | Deployment node selector                                                  |
| rabbitMQ.podAnnotations                     | object | `{}`              | Additional pod annotations                                                |
| rabbitMQ.podSecurityContext                 | object | `see values.yaml` | Pod security context                                                      |
| rabbitMQ.securityContext                    | object | `see values.yaml` | Container security context                                                |
| rabbitMQ.env                                | list   | `[]`              | Additional container environmment variables                               |
| rabbitMQ.args                               | list   | `[]`              | Additional container command arguments                                    |
| rabbitMQ.terminationGracePeriodSeconds      | int    | `60`              | Container termination grace period in seconds                             |
| rabbitMQ.rbac.create                        | bool   | `true`            | Enable creation of RBAC                                                   |
| rabbitMQ.serviceAccount.annotations         | object | `{}`              | Additional service account annotations                                    |
| rabbitMQ.serviceAccount.create              | bool   | `true`            | Enable service account creation                                           |
| rabbitMQ.serviceAccount.name                | string | `""`              | Optional name of the service account                                      |
| rabbitMQ.affinity                           | object | `{}`              | Affinity for pod assignment                                               |
| rabbitMQ.tolerations                        | list   | `[]`              | Tolerations for pod assignment                                            |
| rabbitMQ.podManagementPolicy                | string | `"OrderedReady"`  | Pod management policy                                                     |
| rabbitMQ.updateStrategyType                 | string | `"RollingUpdate"` | Pod update strategy                                                       |
| rabbitMQ.replicaCount                       | int    | `1`               | Number of replicas                                                        |
| rabbitMQ.revisionHistoryLimit               | int    | `nil`             | Maximum number of revisions maintained in revision history                |
| rabbitMQ.podDisruptionBudget                | object | `{}`              | Pod disruption budget                                                     |
| rabbitMQ.podDisruptionBudget.minAvailable   | int    | `nil`             | Minimum number of pods that must be available after eviction              |
| rabbitMQ.podDisruptionBudget.maxUnavailable | int    | `nil`             | Maximum number of pods that can be unavailable after eviction             |

## Service parameters

| Key                                  | Type   | Default       | Description                                                              |
| ------------------------------------ | ------ | ------------- | ------------------------------------------------------------------------ |
| rabbitMQ.service.type                | string | `"ClusterIP"` | Service type                                                             |
| rabbitMQ.service.clusterIP           | string | `nil`         | The cluster ip address (only relevant for type LoadBalancer or NodePort) |
| rabbitMQ.service.loadBalancerIP      | string | `nil`         | The load balancer ip address (only relevant for type LoadBalancer)       |
| rabbitMQ.service.amqp.port           | int    | `5672`        | AMQP service port                                                        |
| rabbitMQ.service.amqp.nodePort       | int    | `nil`         | Service node port (only relevant for type LoadBalancer or NodePort)      |
| rabbitMQ.service.amqps.port          | int    | `5671`        | Secure AMQP service port                                                 |
| rabbitMQ.service.amqps.nodePort      | int    | `nil`         | Service node port (only relevant for type LoadBalancer or NodePort)      |
| rabbitMQ.service.mgmt.port           | int    | `15672`       | Management UI service port                                               |
| rabbitMQ.service.mgmt.nodePort       | int    | `nil`         | Service node port (only relevant for type LoadBalancer or NodePort)      |
| rabbitMQ.service.prometheus.port     | int    | `15692`       | Prometheus service port                                                  |
| rabbitMQ.service.prometheus.nodePort | int    | `nil`         | Service node port (only relevant for type LoadBalancer or NodePort)      |
| rabbitMQ.service.annotations         | object | `{}`          | Additional service annotations                                           |

## Extra services parameters

Section to define custom services

| Key                                     | Type   | Default | Description                                                              |
| --------------------------------------- | ------ | ------- | ------------------------------------------------------------------------ |
| rabbitMQ.extraServices[].name           | string | `nil`   | Unique name of the input service                                         |
| rabbitMQ.extraServices[].type           | string | `nil`   | Service type (ClusterIP / NodePort / LoadBalancer)                       |
| rabbitMQ.extraServices[].protocol       | string | `nil`   | Protocol type (TCP / UDP)                                                |
| rabbitMQ.extraServices[].containerPort  | int    | `nil`   | Container port                                                           |
| rabbitMQ.extraServices[].port           | int    | `nil`   | Service port                                                             |
| rabbitMQ.extraServices[].nodePort       | int    | `nil`   | The node port (only relevant for type LoadBalancer or NodePort)          |
| rabbitMQ.extraServices[].clusterIP      | string | `nil`   | The cluster ip address (only relevant for type LoadBalancer or NodePort) |
| rabbitMQ.extraServices[].loadBalancerIP | string | `nil`   | The load balancer ip address (only relevant for type LoadBalancer)       |
| rabbitMQ.extraServices[].annotations    | object | `{}`    | Additional service annotations                                           |

## Service monitor parameters

| Key                                             | Type     | Default | Description                                                                                                                                                             |
| ----------------------------------------------- | -------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rabbitMQ.serviceMonitor.enabled                 | bool     | `false` | Enable service monitor                                                                                                                                                  |
| rabbitMQ.serviceMonitor.additionalLabels        | object   | `{}`    | Additional labels for the service monitor object                                                                                                                        |
| rabbitMQ.serviceMonitor.annotations             | object   | `{}`    | Annotations for the service monitor object                                                                                                                              |
| rabbitMQ.serviceMonitor.interval                | Duration | `nil`   | Scrape interval for prometheus                                                                                                                                          |
| rabbitMQ.serviceMonitor.scrapeTimeout           | Duration | `nil`   | Scrape timeout value                                                                                                                                                    |
| rabbitMQ.serviceMonitor.extraEndpointParameters | object   | `nil`   | Extra parameters rendered to the [service monitor endpoint](https://github.com/prometheus-operator/prometheus-operator/blob/main/Documentation/api.md#endpoint)         |
| rabbitMQ.serviceMonitor.extraParameters         | object   | `nil`   | Extra parameters rendered to the [service monitor object](https://github.com/prometheus-operator/prometheus-operator/blob/main/Documentation/api.md#servicemonitorspec) |

## Storage parameters

| Key                                        | Type   | Default           | Description                                          |
| ------------------------------------------ | ------ | ----------------- | ---------------------------------------------------- |
| rabbitMQ.storage.accessModes[0]            | string | `"ReadWriteOnce"` | Storage access mode                                  |
| rabbitMQ.storage.persistentVolumeClaimName | string | `nil`             | PVC name when existing storage volume should be used |
| rabbitMQ.storage.requestedSize             | string | `nil`             | Size for new PVC, when no existing PVC is used       |
| rabbitMQ.storage.className                 | string | `nil`             | Storage class name                                   |

## Ingress parameters

| Key                                     | Type   | Default | Description                                  |
| --------------------------------------- | ------ | ------- | -------------------------------------------- |
| rabbitMQ.ingress.enabled                | bool   | `false` | Enable ingress for the Management UI service |
| rabbitMQ.ingress.annotations            | string | `nil`   | Additional annotations for ingress           |
| rabbitMQ.ingress.hosts[0].host:         | string | `""`    | Hostname for the ingress endpoint            |
| rabbitMQ.ingress.hosts[0].host.paths[0] | string | `"/"`   | Path for the RabbitMQ Management UI          |
| rabbitMQ.ingress.tls                    | list   | `[]`    | Ingress TLS parameters                       |

## RabbitMQ base parameters

| Key                                  | Type   | Default               | Description                                                                                                                   |
| ------------------------------------ | ------ | --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| rabbitMQ.plugins                     | list   | `[]`                  | List of additional RabbitMQ plugins that should be activated (see: [RabbitMQ plugins](https://www.rabbitmq.com/plugins.html)) |
| rabbitMQ.authentication.user         | string | `"InvictusMQ"`             | Initial user name                                                                                                             |
| rabbitMQ.authentication.password     | string | `"H^PL^SXATf(k5^cbb&Jw"`             | Initial password                                                                                                              |
| rabbitMQ.authentication.erlangCookie | string | `Random (20-AlphNum)` | Erlang cookie (MANDATORY) (Alternative: Set the environment variable ERLANG_COOKIE)                                           |
| rabbitMQ.clustering.rebalance        | bool   | `false`               | Enable rebalance queues with master when new replica is created                                                               |
| rabbitMQ.clustering.forceBoot        | bool   | `false`               | Force boot in case cluster peers are not available                                                                            |
| rabbitMQ.clustering.useLongName      | bool   | `true`                | Use FQDN for RabbitMQ node names                                                                                              |

## RabbitMQ memory parameters

| Key                                                 | Type   | Default      | Description                                                                                        |
| --------------------------------------------------- | ------ | ------------ | -------------------------------------------------------------------------------------------------- |
| rabbitMQ.options.memoryHighWatermark.enabled        | bool   | `false`      | Enables high memory watermark configuration                                                        |
| rabbitMQ.options.memoryHighWatermark.type           | string | `"relative"` | Type of watermark value (relative or absolute)                                                     |
| options.memoryHighWatermark.value                   | float  | `0.4`        | Watermark value (default: 40%)                                                                     |
| options.memoryHighWatermark.pagingRatio             | float  | `nil`        | Paging threshold when RabbitMQ starts paging queue content before high memory watermark is reached |
| rabbitMQ.options.memory.totalAvailableOverrideValue | int    | `nil`        | Overwrites the value that is automatically calculated from resource.limits.memory                  |
| rabbitMQ.options.memory.calculationStrategy         | string | `nil`        | Strategy for memory usage report (rss or allocated)                                                |

## RabbitMQ communication parameters

| Key                                   | Type | Default | Description                                                      |
| ------------------------------------- | ---- | ------- | ---------------------------------------------------------------- |
| rabbitMQ.options.tcp.port             | int  | `5672`  | AMQP tcp port                                                    |
| rabbitMQ.options.ssl.enabled          | bool | `false` | Enable secure AMQP (amqps)                                       |
| rabbitMQ.options.ssl.port             | int  | `5671`  | AMQPS tcp port                                                   |
| rabbitMQ.options.ssl.verify           | bool | `false` | Enables or disables peer verification                            |
| rabbitMQ.options.ssl.failIfNoPeerCert | bool | `false` | Reject TLS connection when client fails to provide a certificate |
| rabbitMQ.options.ssl.depth            | int  | `nil`   | Client certificate verification depth                            |

## RabbitMQ certificate parameters

Section for certificate support
(cacert,cert,key,password will be used for AMQP-over-SSL (AMPQS) - see: options.ssl)

| Key                                     | Type   | Default | Description                                                                                                                                      |
| --------------------------------------- | ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| rabbitMQ.certificates.enabled           | bool   | `false` | Enable mounting following certificates into folder /ssl                                                                                          |
| rabbitMQ.certificates.cacert            | string | `nil`   | CA certificate(s) in base64 format                                                                                                               |
| rabbitMQ.certificates.cert              | string | `nil`   | Server certificate in base64 format                                                                                                              |
| rabbitMQ.certificates.key               | string | `nil`   | Private key in base64 format                                                                                                                     |
| rabbitMQ.certificates.password          | string | `nil`   | Optional private key password                                                                                                                    |
| rabbitMQ.certificates.extraCerts        | list   | `[]`    | List of extra certificates that will be mounted to the container into /ssl and can be used for custom/advanced configuration (see: customConfig) |
| rabbitMQ.certificates.extraCerts[].name | string | `nil`   | Name of the certificate (will be the filename of the mounted certificate - i.e.: /ssl/{name})                                                    |
| rabbitMQ.certificates.extraCerts[].cert | string | `nil`   | The certificate content in base64 format                                                                                                         |
| rabbitMQ.extraSecrets                   | list   | `[]`    | A list of additional existing secrets that will be mounted into the container                                                                    |
| rabbitMQ.extraSecrets[].name            | string | `nil`   | Name of the existing K8s secret                                                                                                                  |
| rabbitMQ.extraSecrets[].mountPath       | string | `nil`   | Mount path where the secret should be mounted into the container (f.e. /mysecretfolder)                                                          |

## RabbitMQ plugin base parameters

| Key                                         | Type   | Default      | Description                                                                           |
| ------------------------------------------- | ------ | ------------ | ------------------------------------------------------------------------------------- |
| rabbitMQ.managementPlugin.enabled           | bool   | `true`       | Enable management UI plugin with default configuration                                |
| rabbitMQ.managementPlugin.tcp.port          | int    | `15672`      | Management UI port                                                                    |
| rabbitMQ.prometheusPlugin.enabled           | bool   | `true`       | Enable prometheus monitoring plugin with default configuration                        |
| rabbitMQ.prometheusPlugin.tcp.port          | int    | `15692`      | Prometheus plugin TCP port                                                            |
| rabbitMQ.k8sPeerDiscoveryPlugin.enabled     | bool   | `true`       | Enable K8s peer discovery plugin for a RabbitMQ HA-cluster with default configuration |
| rabbitMQ.k8sPeerDiscoveryPlugin.addressType | string | `"hostname"` | K8s peer discovery plugin address type (hostname or ip)                               |

## RabbitMQ custom configuration parameters

| Key                                 | Type   | Default | Description                                                                                                                                              |
| ----------------------------------- | ------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rabbitMQ.customConfig               | string | `nil`   | Custom configuration entries for rabbitmq.conf (see [RabbitMQ config](https://www.rabbitmq.com/configure.html#config-file))                              |
| rabbitMQ.extraSecretConfigs         | string | `nil`   | An existing secret with files that will be added to the `rabbitmq.conf`                                                                                  |
| rabbitMQ.customAdvancedConfig       | string | `nil`   | Custom advanced configuration entries for advanced.config (see [RabbitMQ advanced config](https://www.rabbitmq.com/configure.html#advanced-config-file)) |
| rabbitMQ.extraSecretAdvancedConfigs | string | `nil`   | An existing secret with files that will be added to the `advanced.conf`                                                                                  |
| rabbitMQ.extraEnvSecrets            | list   | `[]`    | A list of existing secrets that will be mounted into the container as environment variables                                                              |