# Install guide
# linux
## basic installs
### install kubectl 
linux: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/
### install helm
```shell
> curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" INSTALL_K3S_EXEC="server --disable=traefik" sh -
> chmod 700 get_helm.sh
> ./get_helm.sh
```
note: if you do not plan on using Azure arc for deploying logic apps or functions you can do curl -sfL **https://get.k3s.io | sh -** to have traefik.
### Install azure cli
#### linux
```shell
> curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```
## Step1: kubernetes
First check is there is a cluster running with **kubectl cluster-info**. if not:
### Linux
```shell
> curl -sfL https://get.k3s.io | sh - 
```

setup kubectl access
```shell
> sudo mkdir ~/.kube
> sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
> sudo chmod 666 ~/.kube/config
```
## Step 2: pull HELM chart
Download the **helm.zip** folder in this repository and unzip it
or 
```shell
> wget https://github.com/invictus-integration/docs-ifa/raw/laurent-hybrid-solution/framework/hybrid/helm.zip
```
todo: update this to master before pull request
## Step 3: deploy HELM chart
in the helm directory open a terminal and execute:
```shell
> helm upgrade --install {name} . --values values.yaml --set imagePullSecret.username={username} --set imagePullSecret.password={password} --set Framework.APPINSIGHTS_INSTRUMENTATIONKEY={appinsights_instrumentationkey} --set Framework.InvictusDashboardConnectionString="{InvictusDashboardConnectionString}" --set SQL.sapassword={sqlpassword} --set rabbitMQ.authentication.password={rabbitmqpassword} --set rabbitMQ.authentication.erlangCookie={erlangcookie} --set tag={releaseverion}
```

replace the bracketed values with the wanted ones
| Variable                              | Description                                               |
| ------------------------------------- | --------------------------------------------------------- |
| `{name}`                              | wanted name of the helm chart                             |
| `{username}`                          | username given by codit products                          |
| `{password}`                          | password given by codit products                          |
| `{appinsights_instrumentationkey}`    | the appinstights key                                      |
| `{InvictusDashboardConnectionString}` | dashboard connection string                               |
| `{sqlpassword}`                       | the sql password you want to set (any random string)      |
| `{rabbitmqpassword}`                  | the rabbitmq password you want to set (any random string) |
| `{erlangcookie}`                      | the erlang cookie (any random string)                     |
| `{releaseverion}`                     | the version of the release you want                       |



### optional settings
In the README.md you can find all the optional parameters.
Some interesting are:
If the below parameters are set, the corresponding resource will not be created on the cluster but will instead use the provided connection string
```shell
--set existingSQLConnectionString={connectionstring}
--set PubSub.RmqConnectionString={amqpconnectionstring}
--set existingDurableSQLConnectionString={durableconnectionstring}
```

If you want to deploy it into an other namespace the default
`-n {namespace}`

## Step 4: enable arc

login to azure

```shell
> az login
```

Register providers for Azure Arc-enabled Kubernetes
```shell
> az provider register --namespace Microsoft.Kubernetes
> az provider register --namespace Microsoft.KubernetesConfiguration
> az provider register --namespace Microsoft.ExtendedLocation
```

Connect an existing Kubernetes cluster
```shell
> az connectedk8s connect --name {name} --resource-group {resource-group}
```

| Variable           | Description                        |
| ------------------ | ---------------------------------- |
| `{name}`           | wanted name arc cluster            |
| `{resource-group}` | resource group for the arc cluster |

# Windows
note: i advice using a base linux operating system. But kubernetes can run anywhere even on Windows OS.
## basic installs
### install kubectl 
windows: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
### Install azure cli
https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli
## Step1: kubernetes
https://microk8s.io/microk8s-installer.exe
follow the installer
 - press next
 - pressI Agree
 -  **add microk8s to PATH** is needed, 'kubectl' is optional
  ![add microk8s to PATH](./images/microk8s_selection.png)
 - press install
 - press next
 - pressI Agree
 - select Microsoft Hyper-V (Recommended)
  ![Select Hypervisor](./images/selecthyperV.png)
 - press next
 - select Add multipass to current user's PATH  (Recommended) => **this is very important**
 - press next
 - press next again
 - press install
 - press Finnish
  
next run:
```shell
> microk8s start
```
run **microk8s status** to make sure the microk8s is running
### Install helm
```shell
> microk8s enable helm3
```

## Step 2: pull HELM chart
```shell
> multipass shell microk8s-vm
> wget https://github.com/invictus-integration/docs-ifa/raw/laurent-hybrid-solution/framework/hybrid/helm.zip
> sudo apt install unzip
> unzip helm.zip
```

## Step 3: deploy HELM chart
in the helm directory open a terminal and execute:
```shell
helm upgrade --install {name} . --values values.yaml --set imagePullSecret.username={username} --set imagePullSecret.password={password} --set Framework.APPINSIGHTS_INSTRUMENTATIONKEY={appinsights_instrumentationkey} --set Framework.InvictusDashboardConnectionString="{InvictusDashboardConnectionString}" --set SQL.sapassword={sqlpassword} --set rabbitMQ.authentication.password={rabbitmqpassword} --set rabbitMQ.authentication.erlangCookie={erlangcookie} --set tag={releaseverion}
```

replace the bracketed values with the wanted ones
| Variable                              | Description                                               |
| ------------------------------------- | --------------------------------------------------------- |
| `{name}`                              | wanted name of the helm chart                             |
| `{username}`                          | username given by codit products                          |
| `{password}`                          | password given by codit products                          |
| `{appinsights_instrumentationkey}`    | the appinstights key                                      |
| `{InvictusDashboardConnectionString}` | dashboard connection string                               |
| `{sqlpassword}`                       | the sql password you want to set (any random string)      |
| `{rabbitmqpassword}`                  | the rabbitmq password you want to set (any random string) |
| `{erlangcookie}`                      | the erlang cookie (any random string)                     |
| `{releaseverion}`                     | the version of the release you want                       |

### optional settings
In the README.md you can find all the optional parameters.
Some interesting are:
If the below parameters are set, the corresponding resource will not be created on the cluster but will instead use the provided connection string
```shell
--set existingSQLConnectionString={connectionstring}
`-set PubSub.RmqConnectionString={amqpconnectionstring}
--set existingDurableSQLConnectionString={durableconnectionstring}
```

If you want to deploy it into an other namespace the default
`-n {namespace}`

## Step 4: enable arc
enable kubectl
```shell
> cd %USERPROFILE%
> mkdir .kube
> cd .kube
> microk8s config > config
```

enable kubernetes dns extension
```shell
> microk8s enable dns</code></pre>
```

login to azure
```shell
> az login
```

Register providers for Azure Arc-enabled Kubernetes
```shell
> az provider register --namespace Microsoft.Kubernetes
> az provider register --namespace Microsoft.KubernetesConfiguration
> az provider register --namespace Microsoft.ExtendedLocation
```

Connect an existing Kubernetes cluster
```shell
az connectedk8s connect --name {name} --resource-group {resource-group}
```
| Variable           | Description                        |
| ------------------ | ---------------------------------- |
| `{name}`           | wanted name arc cluster            |
| `{resource-group}` | resource group for the arc cluster |
