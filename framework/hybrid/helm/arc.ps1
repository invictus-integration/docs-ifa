$user = $args[2]
az login
az provider register --namespace Microsoft.Kubernetes
az provider register --namespace Microsoft.KubernetesConfiguration
az provider register --namespace Microsoft.ExtendedLocation
az connectedk8s connect --name $args[0] --resource-group $args[1]
kubectl create serviceaccount $user
kubectl create clusterrolebinding $user-binding --clusterrole cluster-admin --serviceaccount default:$user
New-Item ".\$user-secret.yaml" -ItemType File -Value "apiVersion: v1
kind: Secret
metadata:
  name: $user-secret
  annotations:
    kubernetes.io/service-account.name: $user
type: kubernetes.io/service-account-token"
kubectl apply -f $user-secret.yaml
remove-item -fo ./$user-secret.yaml
$TOKEN = ([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String((kubectl get secret $user-secret -o jsonpath='{$.data.token}'))))
write-host "bearer Token:" $TOKEN
