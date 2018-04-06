'use strict';

module.exports = function(app) {
  var db = app.dataSources.gtnotif;
  var obj = null;

  // Instances JSON documents
  var notification = {
    sender: 'katmel98@gmail.com',
    receivers: ['katmel98@yahoo.com'],
    subject: null,
    message: null,
    type: 'email',
    platform_id: '8229ef73-d014-4df2-8088-84199a8e8dcb',
    created_date: '2018-04-06T12:10:06.726Z',
    notif_uuid: '3a4c6963-bf52-4672-b8d1-10718ecc7154'};

  var notification_receiver = [
    {
      receiver: 'danireth2006@gmail.com',
      delivery: null,
      read: null,
      notif_uuid: '3a4c6963-bf52-4672-b8d1-10718ecc7154',
      delivery_date: null,
      read_date: null,
      created_date: '2018-04-06T09:51:52.711Z',
      platform_id: '8229ef73-d014-4df2-8088-84199a8e8dcb',
    },
    {
      receiver: 'kathelyn.sequera@gmail.com',
      delivery: null,
      read: null,
      notif_uuid: '3a4c6963-bf52-4672-b8d1-10718ecc7154',
      delivery_date: null,
      read_date: null,
      created_date: '2018-04-06T09:53:18.485Z',
      platform_id: '8229ef73-d014-4df2-8088-84199a8e8dcb'},
  ];

  var customer = {
    name: 'Uilyo',
    token_id: '8229ef73-d014-4df2-8088-84199a8e8dcb',
  };

  // Create a model from the user instance
  var Notification = db.buildModelFromInstance('Notifications', notification, {idInjection: true});

  // Use the model for create, retrieve, update, and delete
  obj = new Notification(notification);

  console.log(obj.toObject());

  Notification.create(notification, function(err, n1) {
    console.log('Created: ', n1.toObject());
    Notification.findById(n1.id, function(err, n2) {
      console.log('Found: ', n2.toObject());
    });
  });

  // Create a model from the user notification_receiver instance
  var NotificationReceiver = db.buildModelFromInstance('Notification_Receivers', notification_receiver, {idInjection: true});

  // Use the model for create, retrieve, update, and delete
  obj = new NotificationReceiver(notification_receiver);

  console.log(obj.toObject());

  notification_receiver.forEach(function(item) {
    NotificationReceiver.create(item, function(err, n1) {
      console.log('Created: ', n1.toObject());
      NotificationReceiver.findById(n1.id, function(err, n2) {
        console.log('Found: ', n2.toObject());
      });
    });
  });

  // Create a model from the user instance
  var Customer = db.buildModelFromInstance('Customers', notification, {idInjection: true});

  // Use the model for create, retrieve, update, and delete
  obj = new Customer(customer);

  console.log(obj.toObject());

  Customer.create(customer, function(err, n1) {
    console.log('Created: ', n1.toObject());
    Customer.findById(n1.id, function(err, n2) {
      console.log('Found: ', n2.toObject());
    });
  });
};

