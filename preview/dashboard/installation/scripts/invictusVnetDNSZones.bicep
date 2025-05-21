param invictus_vnet_name string = 'invictus-vnet'

var location = resourceGroup().location
var lowerLocation = replace(toLower(location), ' ', '')

resource privatelink_azurecr_io 'Microsoft.Network/privateDnsZones@2018-09-01' = {
  name: 'privatelink.azurecr.io'
  location: 'global'
  properties: {
    maxNumberOfRecordSets: 25000
    maxNumberOfVirtualNetworkLinks: 1000
    maxNumberOfVirtualNetworkLinksWithRegistration: 100
    numberOfRecordSets: 1
    numberOfVirtualNetworkLinks: 1
    numberOfVirtualNetworkLinksWithRegistration: 0
  }
}
resource privatelink_blob_core_windows_net 'Microsoft.Network/privateDnsZones@2018-09-01' = {
  name: 'privatelink.blob.core.windows.net'
  location: 'global'
  properties: {
    maxNumberOfRecordSets: 25000
    maxNumberOfVirtualNetworkLinks: 1000
    maxNumberOfVirtualNetworkLinksWithRegistration: 100
    numberOfRecordSets: 1
    numberOfVirtualNetworkLinks: 1
    numberOfVirtualNetworkLinksWithRegistration: 0
  }
}

resource privatelink_file_core_windows_net 'Microsoft.Network/privateDnsZones@2018-09-01' = {
  name: 'privatelink.file.core.windows.net'
  location: 'global'
  properties: {
    maxNumberOfRecordSets: 25000
    maxNumberOfVirtualNetworkLinks: 1000
    maxNumberOfVirtualNetworkLinksWithRegistration: 100
    numberOfRecordSets: 1
    numberOfVirtualNetworkLinks: 1
    numberOfVirtualNetworkLinksWithRegistration: 0
  }
}

resource privatelink_queue_core_windows_net 'Microsoft.Network/privateDnsZones@2018-09-01' = {
  name: 'privatelink.queue.core.windows.net'
  location: 'global'
  properties: {
    maxNumberOfRecordSets: 25000
    maxNumberOfVirtualNetworkLinks: 1000
    maxNumberOfVirtualNetworkLinksWithRegistration: 100
    numberOfRecordSets: 1
    numberOfVirtualNetworkLinks: 1
    numberOfVirtualNetworkLinksWithRegistration: 0
  }
}

resource privatelink_servicebus_windows_net 'Microsoft.Network/privateDnsZones@2018-09-01' = {
  name: 'privatelink.servicebus.windows.net'
  location: 'global'
  properties: {
    maxNumberOfRecordSets: 25000
    maxNumberOfVirtualNetworkLinks: 1000
    maxNumberOfVirtualNetworkLinksWithRegistration: 100
    numberOfRecordSets: 1
    numberOfVirtualNetworkLinks: 1
    numberOfVirtualNetworkLinksWithRegistration: 0
  }
}

resource privatelink_table_core_windows_net 'Microsoft.Network/privateDnsZones@2018-09-01' = {
  name: 'privatelink.table.core.windows.net'
  location: 'global'
  properties: {
    maxNumberOfRecordSets: 25000
    maxNumberOfVirtualNetworkLinks: 1000
    maxNumberOfVirtualNetworkLinksWithRegistration: 100
    numberOfRecordSets: 1
    numberOfVirtualNetworkLinks: 1
    numberOfVirtualNetworkLinksWithRegistration: 0
  }
}

resource privatelink_table_cosmos_azure_com 'Microsoft.Network/privateDnsZones@2018-09-01' = {
  name: 'privatelink.table.cosmos.azure.com'
  location: 'global'
  properties: {
    maxNumberOfRecordSets: 25000
    maxNumberOfVirtualNetworkLinks: 1000
    maxNumberOfVirtualNetworkLinksWithRegistration: 100
    numberOfRecordSets: 1
    numberOfVirtualNetworkLinks: 1
    numberOfVirtualNetworkLinksWithRegistration: 0
  }
}

resource privatelink_vaultcore_azure_net 'Microsoft.Network/privateDnsZones@2018-09-01' = {
  name: 'privatelink.vaultcore.azure.net'
  location: 'global'
  properties: {
    maxNumberOfRecordSets: 25000
    maxNumberOfVirtualNetworkLinks: 1000
    maxNumberOfVirtualNetworkLinksWithRegistration: 100
    numberOfRecordSets: 1
    numberOfVirtualNetworkLinks: 1
    numberOfVirtualNetworkLinksWithRegistration: 0
  }
}

resource privatelink_mongo_cosmos_azure_com 'Microsoft.Network/privateDnsZones@2018-09-01' = {
  name: 'privatelink.mongo.cosmos.azure.com'
  location: 'global'
  properties: {
    maxNumberOfRecordSets: 25000
    maxNumberOfVirtualNetworkLinks: 1000
    maxNumberOfVirtualNetworkLinksWithRegistration: 100
    numberOfRecordSets: 1
    numberOfVirtualNetworkLinks: 1
    numberOfVirtualNetworkLinksWithRegistration: 0
  }
}

resource privatelink_region_azurecontainerapps_io 'Microsoft.Network/privateDnsZones@2018-09-01' = {
  name: 'privatelink.${lowerLocation}.azurecontainerapps.io'
  location: 'global'
  properties: {
    maxNumberOfRecordSets: 25000
    maxNumberOfVirtualNetworkLinks: 1000
    maxNumberOfVirtualNetworkLinksWithRegistration: 100
    numberOfRecordSets: 1
    numberOfVirtualNetworkLinks: 1
    numberOfVirtualNetworkLinksWithRegistration: 0
  }
}

resource privatelink_azurecr_io_vnet_link 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2018-09-01' = {
  parent: privatelink_azurecr_io
  name: 'vnet-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: resourceId('Microsoft.Network/virtualNetworks', invictus_vnet_name)
    }
  }
}

resource privatelink_blob_core_windows_net_vnet_link 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2018-09-01' = {
  parent: privatelink_blob_core_windows_net
  name: 'vnet-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: resourceId('Microsoft.Network/virtualNetworks', invictus_vnet_name)
    }
  }
}

resource privatelink_file_core_windows_net_vnet_link 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2018-09-01' = {
  parent: privatelink_file_core_windows_net
  name: 'vnet-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: resourceId('Microsoft.Network/virtualNetworks', invictus_vnet_name)
    }
  }
}

resource privatelink_queue_core_windows_net_vnet_link 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2018-09-01' = {
  parent: privatelink_queue_core_windows_net
  name: 'vnet-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: resourceId('Microsoft.Network/virtualNetworks', invictus_vnet_name)
    }
  }
}

resource privatelink_servicebus_windows_net_vnet_link 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2018-09-01' = {
  parent: privatelink_servicebus_windows_net
  name: 'vnet-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: resourceId('Microsoft.Network/virtualNetworks', invictus_vnet_name)
    }
  }
}

resource privatelink_table_core_windows_net_vnet_link 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2018-09-01' = {
  parent: privatelink_table_core_windows_net
  name: 'vnet-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: resourceId('Microsoft.Network/virtualNetworks', invictus_vnet_name)
    }
  }
}

resource privatelink_table_cosmos_azure_com_vnet_link 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2018-09-01' = {
  parent: privatelink_table_cosmos_azure_com
  name: 'vnet-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: resourceId('Microsoft.Network/virtualNetworks', invictus_vnet_name)
    }
  }
}

resource Microsoft_Network_privateDnsZones_virtualNetworkLinks_privatelink_vaultcore_azure_net_vnet_link 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2018-09-01' = {
  parent: privatelink_vaultcore_azure_net
  name: 'vnet-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: resourceId('Microsoft.Network/virtualNetworks', invictus_vnet_name)
    }
  }
}

resource Microsoft_Network_privateDnsZones_virtualNetworkLinks_privatelink_mongo_cosmos_azure_net_vnet_link 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2018-09-01' = {
  parent: privatelink_mongo_cosmos_azure_com
  name: 'vnet-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: resourceId('Microsoft.Network/virtualNetworks', invictus_vnet_name)
    }
  }
}

resource Microsoft_Network_privateDnsZones_virtualNetworkLinks_privatelink_region_azurecontainerapps_io_vnet_link 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2018-09-01' = {
  parent: privatelink_region_azurecontainerapps_io
  name: 'vnet-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: resourceId('Microsoft.Network/virtualNetworks', invictus_vnet_name)
    }
  }
}

