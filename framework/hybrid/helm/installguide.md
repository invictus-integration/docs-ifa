# intall guide
# linux
## basic installs
### install kubectl 
linux: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/
### install helm
<pre><code>curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
 ./get_helm.sh
</code></pre>
### Install azure cli
#### linux
<pre><code>curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
</code></pre>
## Step1: kubernetes
First check is there is a cluster running with **kubectl cluster-info**. if not:
### Linux
<pre><code>curl -sfL https://get.k3s.io | sh - 
</code></pre>
setup kubectl access
<pre><code>sudo mkdir ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chmod 666 ~/.kube/config
</code></pre>
## Step 2: pull HELM chart
Download the **helm.zip** folder in this repository and unzip it
or 
<pre><code>
wget https://github.com/invictus-integration/docs-ifa/raw/laurent-hybrid-solution/framework/hybrid/helm.zip
</code></pre>
todo: update this to master before pull request
## Step 3: deploy HELM chart
in the helm directory open a terminal and execute:
<pre><code>helm upgrade --install {name} . --values values.yaml --set imagePullSecret.username={username} --set imagePullSecret.password={password} --set Framework.APPINSIGHTS_INSTRUMENTATIONKEY={appinsights_instrumentationkey} --set Framework.InvictusDashboardConnectionString="{InvictusDashboardConnectionString}"
</code></pre>
replace the bracketed values with the wanted ones
| Variable                         | Description                      |
|----------------------------------|----------------------------------|
| {name}                           | wanted name of the helm chart    |
| {username}                       | username given by codit products |
| {password}                       | password given by codit products |
| {appinsights_instrumentationkey} | the appinstights key             |
| {InvictusDashboardConnectionString} | dashboard connection string   |


### optional settings
In the README.md you can find all the optional parameters.
Some interesting are:
<pre><code>--set existingSQLConnectionString={connectionstring}</code></pre>
<pre><code>--set PubSub.RmqConnectionString={amqpconnectionstring}</code></pre>
If you set these the corresponding resource will not be used but the one you gave will.
## Step 4: enable arc

login to azure

<pre><code>az login
</code></pre>
Register providers for Azure Arc-enabled Kubernetes
<pre><code>az provider register --namespace Microsoft.Kubernetes
az provider register --namespace Microsoft.KubernetesConfiguration
az provider register --namespace Microsoft.ExtendedLocation
</code></pre>
Connect an existing Kubernetes cluster
<pre><code>az connectedk8s connect --name {name} --resource-group {resource-group}
</code></pre>
| Variable                         | Description                      |
|----------------------------------|----------------------------------|
| {name}                           | wanted name arc cluster    |
| {resource-group}                       | resource group for the arc cluster |
# Windows
note: i advice using a base linux operating system. But kubernetes can run anywhere even on Windows OS.
## basic installs
### install kubectl 
windows: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
### Install azure cli
#### linux
<pre><code>curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
</code></pre>
#### windows
https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli
## Step1: kubernetes
### Windows
https://microk8s.io/microk8s-installer.exe
follow the installer

## Step 2: pull HELM chart
Download the **helm.zip** folder in this repository and unzip it
## Step 3: deploy HELM chart
in the helm directory open a terminal and execute:
<pre><code>helm upgrade --install {name} . --values values.yaml --set imagePullSecret.username={username} --set imagePullSecret.password={password} --set Framework.APPINSIGHTS_INSTRUMENTATIONKEY={appinsights_instrumentationkey} --set Framework.InvictusDashboardConnectionString="{InvictusDashboardConnectionString}"
</code></pre>
replace the bracketed values with the wanted ones
| Variable                         | Description                      |
|----------------------------------|----------------------------------|
| {name}                           | wanted name of the helm chart    |
| {username}                       | username given by codit products |
| {password}                       | password given by codit products |
| {appinsights_instrumentationkey} | the appinstights key             |
| {InvictusDashboardConnectionString} | dashboard connection string   |


### optional settings
In the README.md you can find all the optional parameters.
Some interesting are:
<pre><code>--set existingSQLConnectionString={connectionstring}</code></pre>
<pre><code>--set PubSub.RmqConnectionString={amqpconnectionstring}</code></pre>
If you set these the corresponding resource will not be used but the one you gave will.
## Step 4: enable arc

login to azure

<pre><code>az login
</code></pre>
Register providers for Azure Arc-enabled Kubernetes
<pre><code>az provider register --namespace Microsoft.Kubernetes
az provider register --namespace Microsoft.KubernetesConfiguration
az provider register --namespace Microsoft.ExtendedLocation
</code></pre>
Connect an existing Kubernetes cluster
<pre><code>az connectedk8s connect --name {name} --resource-group {resource-group}
</code></pre>
| Variable                         | Description                      |
|----------------------------------|----------------------------------|
| {name}                           | wanted name arc cluster    |
| {resource-group}                       | resource group for the arc cluster |