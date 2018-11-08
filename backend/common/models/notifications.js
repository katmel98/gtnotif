'use strict';

var http = require('http');
var loopback = require('loopback');

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

  Notifications.observe('access', function logQuery(ctx, next) {
    console.log('Accessing %s matching %s', ctx.Model.modelName, ctx.query.where);
    next();
  });

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

    let platform = {};

    console.log(object.platform_id);

    if ((object.platformId == null) || (object.platformId == '')) {
      console.log(object);
      let err;
      err = new Error('Error from the API');
      err.status = 400;
      err.code = 'PLATFORM_TOKEN_NOT_VALID';
      err.message = 'El token de cliente NO ES VALIDO';
      next(err);
    } else {
      let Customer = app.models.Customers;
      Customer.findOne({where: {tokenId: object.platformId, softDelete: false}})
        .then(function(result) {
          // console.log('*** RESULTADO DE LA BUSQUEDA ***');
          // console.log(result);
          // console.log('********************************');

          if (result) {
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
                var myMessage = {heading: 'Welcome to MyCompany', text: 'We are happy to have you on board.'};

                var renderer = loopback.template(path.resolve(__dirname, '../views/email-template.ejs'));
                var htmlBody = renderer(myMessage);

                // Construye el mensaje

                let message = {
                  to: element,
                  from: object.sender,
                  subject: object.subject,
                  html: htmlBody,
                };

                // Envía el correo electrónico
                console.log(' **** ENVIANDO EL CORREO **** ');
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
          } else {
            let err;
            err = new Error('Error from the API');
            err.status = 400;
            err.code = 'PLATFORM_TOKEN_NOT_REGISTERED';
            err.message = 'El CLIENTE NO ESTA REGISTRADO';
            next(err);
          }
        })
        .catch(function(error) {
            console.log(error);
            next(error);
        });
    }
  });
};
