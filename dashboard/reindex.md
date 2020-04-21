## Adaptive ReIndexing

In the Invictus coditcip database we have added a number of storedprocedures which can be used to reorganize or rebuild the Indexes for each table. 
Altough the decission to disable the DataFActory reindex pipeline has been disabled, this is still available for developers to manually trigger this.

The occurance when re-indexing needs to be done will vary from client to client, depending on their load and frequency of their cleanup jobs. These SPRs can be very expensive to run and might take a long time to complete, they also tend to use 100% DTU usage each time they are executed.
We suggest that before triggering the re-indexing, the DTUs for the database is increased. Most likely the DTUs will always reach 100% but atleast it will complete in a shorter time. If you follow this step please make sure to downgrade the Database DTU to the original size.

