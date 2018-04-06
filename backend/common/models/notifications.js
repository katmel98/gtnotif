'use strict';

var config = require('../../server/config.json');
var path = require('path');

module.exports = function(Notifications) {
  var app = require('../../server/server');
  var moment = require('moment');
  var myGlobals = require('../../resources/support/constants');
  const CONSTANTES = myGlobals.CONSTANTS;

  // Mecanismo para deshabilitar los métodos que no se requieren
  var methodsToBeDisable = [
    // 'create',
    'replaceOrCreate',
    'patchOrCreate',
    // 'exists',
    // 'findById',
    // 'find',
    'findOne',
    // 'destroyById',
    // 'deleteById',
    // 'count',
    'replaceById',
    // 'prototype.patchAttributes',
    'createChangeStream',
    'updateAll',
    'replaceOrCreate',
    'replaceById',
    'upsertWithWhere',
  ];

  for (var i = 0, len = methodsToBeDisable.length; i < len; i++) {
    Notifications.disableRemoteMethodByName(methodsToBeDisable[i]);
  }

  // Método a ejecutar antes de guardar los datos de un modelo
  Notifications.observe('before save', function(ctx, next) {
    let object = null;
    var err = null;
    if (ctx.instance) {
      object = ctx.instance;
    } else {
      object = ctx.data;
    }
    if ((object.receivers == null) || (object.receivers.length == 0)) {
      console.log(object.receivers);
      err = new Error('Error from the API');
      err.status = 422;
      err.code = 'RECEIVERS_EMAILS_REQUIRED';
      err.message = 'Es necesario identificar los emails a los que se le envían los mensajes.';
      next(err);
    } else {
      next();
    }
  });

  // Método a ejecutar antes de guardar los datos de un modelo
  Notifications.observe('after save', function(ctx, next) {
    let object = null;
    if (ctx.instance) {
      object = ctx.instance;
    } else {
      object = ctx.data;
    }

    var Email = app.models.Email;
    var NotificationReceivers = app.models.Notification_Receivers;

    console.log('****** OBJETO ******');
    console.log(object);
    console.log('****** ****** ******');

    var a = 0;

    // Realizando las operaciones por cada usuario que debe recibir la notificacion
    object.receivers.forEach(element => {
      // Identifica el tipo de notificación
      a = a + 1;
      if (object.type == 'email') {
        // Construye el mensaje
        let message = {
          to: element,
          from: object.sender,
          subject: object.subject,
          text: object.message,
        };
        // Envía el correo electrónico
        Email.send(
          message,
          function(err, mail) {
            if (err) console.log(err);
            console.log('email sent!');
            console.log(mail);
          });
      }

      // Creamos el objeto necesario para hacer seguimiento del estado de la notificación
      let receiver = {
        receiver: element,
        notifUuid: object.notifUuid,
        platformId: object.platformId,
      };

      // Persistimos el objeto
      NotificationReceivers.create(
        receiver, function(err, notif) {
          if (err) console.log(err);
          console.log('****** RECEPTOR DE NOTIFICACION REGISTRADO ******');
          console.log(notif);
          console.log('****** ************************************ ******');
          a = a - 1;
          if (a == 0) {
            next();
          }
        }
      );
    });
    // next();
  });
};
