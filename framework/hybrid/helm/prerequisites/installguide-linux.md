# Install prerequisites on a Linux on-premise machine
This sub-installation guide will walk through the process of installing any prerequisites on a Linux OS-based on-premise machine.

## Install Kubectl
The Invictus framework components run in a hybrid solution on a [Kubernetes](https://kubernetes.io/docs/concepts/overview/) cluster, which means that the Kubernetes has to be installed on the on-premise machine.

[Installing Kuberctl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

## Install k3s
first run `kubectl cluster-info` to verify that there is no kubernetes cluster already running; if not run the following command:
```shell
> curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" INSTALL_K3S_EXEC="server --disable=traefik" sh -
```

To verify if Kubernetes is correctly installed and configured, check if there 
is a cluster running with `kubectl cluster-info`

> 💡 Note: if you do not plan on using Azure arc for deploying logic apps or functions you can do `curl -sfL https://get.k3s.io | sh -` to have traefik.

## Install helm
To deploy the Invictus framework components on a Kubernetes cluster, you need the [Helm](https://helm.sh/) package manager of Kubernetes.

Run the following shell commands to install Helm on your Linux machine:

```shell
> curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
> chmod 700 get_helm.sh
> ./get_helm.sh
```

## Install Azure CLI
To deploy the Invictus framework components using Azure ACR, you need to install the [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/what-is-azure-cli) command tool to interact with Azure.

```shell
> curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```
To verify that azure cli is installed you can run:
```shell
> az --version
```
## Kubeconfig access
Make sure that Kubernetes (`kubectl`) has the correct access, by running:
```shell
> sudo mkdir ~/.kube
> sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
> sudo chmod 666 ~/.kube/config
```

## Done
After installing Kubernetes, Helm, and Azure, you can continue with [installing and setting up the Invictus framework components](../installguide.md). 