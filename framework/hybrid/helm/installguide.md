# intall guide
## basic installs
### install kubectl:  
linux: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/
windows: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
## Step1: kubernetes
First check is there is a cluster running with **kubectl cluster-info**. if not:
### Linux:
<pre><code>curl -sfL https://get.k3s.io | sh - 
</code></pre>
### Windows:
todo: look into k3d or alternative for windows
## Step 2: Get the Helm chart
download the helm.zip in docs-ifa\framework\hybrid and unzip it.
## Step 3: deploy HELM chart
<pre><code>helm upgrade --install {name} . --values .values.yaml --set imagePullSecret.username={username} --set imagePullSecret.password={password} --set Framework.APPINSIGHTS_INSTRUMENTATIONKEY={appinsights_instrumentationkey} --set Framework.AzureWebJobsStorage={azurewebjobsstorage} --set Framework.InvictusDashboardConnectionString={InvictusDashboardConnectionString}
</code></pre>
replace the bracketed values with the wanted ones
| Variable                            | Description                      |
| ----------------------------------- | -------------------------------- |
| {name}                              | wanted name of the helm chart    |
| {username}                          | username given by codit products |
| {password}                          | password given by codit products |
| {appinsights_instrumentationkey}    | the appinstights key             |
| {azurewebjobsstorage}               | idk                              |
| {InvictusDashboardConnectionString} | dashboard connection string      |


### optional settings
In the README.md you can find all the optional parameters.
Some interesting are:
<pre><code>--set existingSQLConnectionString={connectionstring}</code></pre>
<pre><code>--set PubSub.RmqConnectionString={amqpconnectionstring}</code></pre>
If you set these the corresponding resource will not be used but the one you gave will.
## Step 4: enbale arc

make sure you are logged into a valid azure account with **az login**
<pre><code>az extension add --name connectedk8s</code></pre>
<pre><code>az provider register --namespace Microsoft.Kubernetes</code></pre>
<pre><code>az provider register --namespace Microsoft.KubernetesConfiguration</code></pre>
<pre><code>az provider register --namespace Microsoft.ExtendedLocation</code></pre>
<pre><code>az connectedk8s connect --name {name} --resource-group {resource-group}</code></pre>
| Variable         | Description                                               |
| ---------------- | --------------------------------------------------------- |
| {name}           | name of the arc kubernetes cluster                        |
| {resource-group} | the resource group where the arc cluster is deployed into |

