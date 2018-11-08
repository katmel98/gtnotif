# GTNotifications (gtnotif)

## Description

GTNotifications, is an effort to materialize a platform that allow external platform, in a simple way, to send notifications in differents formats *(email, SMS, app notification)*, from senders to receivers.  

**Senders** could be any entity: person, platform, apps, etc.; in the other hand, **Receivers** could be any entity that allows to receive the notification and is capable to do so.

It will allow to be used to **generate statistics, querys, and connection between the external platform and gtnotif** in order to obtain the differents notification statuses. In this sense, we have in roadmap, creation of a frontend easy to use that will allow us to create easily, dashboards, data querys, etc. to let us understand the notificationes behaviors.

The backend will use a **REST API** to allow easy integration with any platform.

The platform is **multiuser**, so any platform/user can register in it, and send notifications once it obtain a TokenID from the gtnotif and can be authenticated using the token.

## Installation steps

* git clone https://github.com/katmel98/gtnotif.git
* cd gtnotif/backend  
* npm install
* cd ..
* If it's the first time (if not jump to next point):  
    * node backend/resources/db/init_script.js
* node backend/server/server.js

## Directory Structure

1. **backend:** Contains all the files neccesary to run the server side of the platform. It rise a REST API and allow to manage all models that create the environment to work with the database.
2. **docs:** Contains all the markdown documentation served by a tool called DAUX.IO. If you want to run it in your computer or in a separate server please refer to DAUX.IO website.

## Tools

1. **Loopback:** Opensource IBM Node Express framework, creates in an agile manner, the environment to create a webapp quickly.
2. **MongoDB:** NoSQL Database with a simple implementation and a great scalable potential. 

## Contact

Please, for any suggestion, problem, trouble, etc., feel free to contact me using any of the following:

*Twitter:* @katmel98  
*Email:* katmel98@gmail.com
