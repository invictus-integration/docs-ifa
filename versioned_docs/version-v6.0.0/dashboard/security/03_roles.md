---
sidebar_label: Roles
---

# Role Management
Permissions in the Invictus Dashboard are separated into two categories: user roles and folder level roles.

* **User roles**: A user or group of users can be assigned a role in the application.

  * *System admin*: has all rights and access to all pages, functionality and flows.
 
  * *Non admin*: has only access to certain pages, cannot perform any system-wide operations, and flow-access is granted for each folder.

  | System functionality | Non admin   | System admin   |
  | -------------------- | :---------: | :------------: |
  | CRUD users           | 🔴          | 🟢            |
  | CRUD groups          | 🔴          | 🟢            |
  | CRUD settings        | 🔴          | 🟢            |
  | CRUD alerts          | 🔴          | 🟢            |
  | CRUD folder/flows    | 🟡          | 🟢            |
  | View audits          | 🔴          | 🟢            |
  | View flow traces     | 🟡          | 🟢            |
  | View statistics      | 🟢          | 🟢            |


* **Flow permissions**: Anything folder- or flow-related is authorized with a more fine-grained role management system for *Non admin* users/groups.

  | Folder functionality     | Reader   | Operator   | Folder admin   |
  | ------------------------ | :------: | :--------: | :------------: |
  | CRUD folder/flows        | 🔴       | 🔴        | 🟢             |
  | Grant flow permissions   | 🔴       | 🔴        | 🟢             |
  | Operations on flows*     | 🔴       | 🟢        | 🟢             |
  | View folder/flows        | 🟢       | 🟢        | 🟢             |

> \* *Flows originating from Azure Logic Apps workflows can be resubmitted, resumed, and ignored via the Dashboard.*
