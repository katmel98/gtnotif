'use strict';

var config = require('../../server/config.json');
var path = require('path');

module.exports = function(NotificationReceivers) {
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
    NotificationReceivers.disableRemoteMethodByName(methodsToBeDisable[i]);
  }
};
