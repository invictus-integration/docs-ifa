## Adaptive Re-Indexing

In the Invictus coditcip database we have added a number of storedprocedures which can be used to reorganize or rebuild the Indexes for each table. 
Although the DataFactory re-index pipeline has been disabled, this is still available for developers to manually trigger this.

The occurrence when re-indexing needs to be done will vary from client to client, depending on their load and frequency of their cleanup jobs. These SPRs can be very expensive to run and might take a long time to complete, they also tend to use 100% DTU usage each time they are executed.

We suggest that before triggering the re-indexing, the DTUs for the database is increased. Most likely the DTUs will always reach 100% but at least it will complete in a shorter time. If you follow this step, please make sure to downgrade the Database DTU to the original size. Although it is possible to trigger the SPRs manually from the database we still suggest using the DataFactory Pipeline. It is also suggested that this is done during off-peak hours. 

To start the re-index process:

1. Scale up the coditcip database (optional)
2. Go to the client's subscription and find the Invictus resource group
3. Find the DataFactory service (ex: "invictus-dev-we-sft-datafactory")
4. After clicking on the DataFactory, click on "Author & Monitor"
5. When the DataFactory page loads, click on the "Author" button (pencil icon)
6. Click on the "RebuildReorganizeIndexes_Pipeline"
7. Click on "Triggers" and then "Trigger now"
8. Confirm by clicking OK
9. You can monitor the progress from the "Monitor section"
10. Once complete Scale down the database (only if you have done Step 1)



