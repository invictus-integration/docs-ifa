#API Functions

The below script has a sample of the most used/requested API functions. These can be called externally to execute functionality without having to go through the Dashboard or Database. 

As a prerequisite, the Dashboard's setup has to be completed since an Admin role user is required to trigger the OAuth call. The below script can be executed multiple times to generate some sample User/Folders/Flows. You can then extract the parts you need to create your own customized script.

```
##SET THE BELOW VARIABLES

$username = "{Enter Admin username here}" #A valid Admin role username
$password = "{Enter Admin password here}" #A valid Admin role password
$url = '{Enter Dashboard URL here - Do not include / in the end}'+'/api' #The dashboard Url
$randomValue = (Get-Random) #used for testing/running script multiple times

##FUNCTIONS URL

$authUrl = $url + '/oauth/token'
$createFlowUrl = $url + '/config/flowtypesLa'
$deleteFlowUrl = $url + '/config/flowtypes'
$createFolderUrl = $url + '/config/folders'
$addUserUrl = $url + '/users'
$addUserToFolderUrl = $url + '/config/folders/users'

##GET AUTH TOKEN
$postParams = @{grant_type='password';username=$username;password=$password}
$authResponse = Invoke-WebRequest -Uri $authUrl -Method POST -Body $postParams
$authObject = ConvertFrom-Json –InputObject $authResponse.Content
$authHeader = "Bearer " +$authObject.access_token

##ADD FOLDER
$FolderName = "Folder" + $randomValue
$createFolderJson = '{"friendlyName":"'+$FolderName+'"}'
$headers = @{Authorization=$authHeader;'Content-Type'="application/json"}
$createFolderResponse = Invoke-WebRequest -Uri $createFolderUrl -Method POST -Body $createFolderJson -Headers $headers
$folderObject = ConvertFrom-Json –InputObject $createFolderResponse.Content
$FolderId = $folderObject.id

##ADD SUB FOLDER
$SubFolderName = "SubFolder" + $randomValue
$createSubFolderJson = '{"friendlyName":"'+$SubFolderName+'","parentFolderId":'+$FolderId+'}'
$headers = @{Authorization=$authHeader;'Content-Type'="application/json"}
$createSubFolderRespone = Invoke-WebRequest -Uri $createFolderUrl -Method POST -Body $createSubFolderJson -Headers $headers

##ADD FLOW
$FlowName = "Flow" + $randomValue
$createFlowJson = '{"name":"'+$FlowName+'","mappings":[{"workFlowName":"","version":"","domain":"","service":"","action":"","state":0,"id":0}],"properties":[],"flowTypeHttpHeadersResubmit":[],"flowTypeHttpHeadersResume":[],"isCustomResubmitEnabled":false,"isCustomResumeEnabled":false,"customResubmitUrl":null,"customResumeUrl":null,"flowTypeHttpHeaders":[],"folderId":'+$folderId+',"connectedDashboard":false}'
$headers = @{Authorization=$authHeader;'Content-Type'="application/json"}
$createFlowResponse = Invoke-WebRequest -Uri $createFlowUrl -Method POST -Body $createFlowJson -Headers $headers
$flowObject = ConvertFrom-Json –InputObject $createFlowResponse.Content

##ADD USER 
$userEmail = "$randomValue" + "@codit.eu"
$username  = "User" + $randomValue
$password  = "Demo*9999"
$createUserJson = '{"email":"'+$userEmail+'","firstName":"AdminName","lastName":"AdminSurname","role":"admin","username":"'+$username+'","password":"'+$password+'"}'
$headers = @{Authorization=$authHeader;'Content-Type'="application/json"}
$createUserResponse = Invoke-WebRequest -Uri $addUserUrl -Method POST -Body $createUserJson -Headers $headers
$userObject = ConvertFrom-Json –InputObject $createUserResponse.Content

##ADD USER TO FOLDER
$addUserToFolderJson = '{"folderId":'+$folderId+',"userId":"'+$userObject.user.userId+'"}'
$headers = @{Authorization=$authHeader;'Content-Type'="application/json"}
$createUserResponse = Invoke-WebRequest -Uri $addUserToFolderUrl -Method POST -Body $addUserToFolderJson -Headers $headers

$confirmation = Read-Host "Proceed with cleanup? (y/n):"

if ($confirmation -eq 'y') {
    ##REMOVE USER FROM FOLDER
    $removeUserFromFolderUrl = $addUserToFolderUrl+'?userId='+$userObject.user.userId + '&FolderId=' + $FolderId
    $headers = @{Authorization=$authHeader;'Content-Type'="application/json"}
    $createUserResponse = Invoke-WebRequest -Uri $removeUserFromFolderUrl -Method DELETE -Headers $headers

    ##DELETE Flow
    $deleteFlowUrlWithId = $deleteFlowUrl+'?id='+$flowObject.id
    $headers = @{Authorization=$authHeader;'Content-Type'="application/json"}
    Invoke-WebRequest -Uri $deleteFlowUrlWithId -Method DELETE -Headers $headers
    
    ##DELETE FOLDER
    $deleteFolderUrl = $createFolderUrl+'?id='+$folderObject.id
    $headers = @{Authorization=$authHeader;'Content-Type'="application/json"}
    Invoke-WebRequest -Uri $deleteFolderUrl -Method DELETE -Headers $headers

    ##DELETE USER
    $deleteUserUrl = $addUserUrl+'?userid='+$userObject.user.userId
    $headers = @{Authorization=$authHeader;'Content-Type'="application/json"}
    Invoke-WebRequest -Uri $deleteUserUrl -Method DELETE -Headers $headers
}
```
