// Bleno handler.

var controllerID = parseInt(process.argv[2]);
var databaseAddress = process.argv[3];
var bleno = require('bleno');
var PrimaryService = bleno.PrimaryService;
var BlenoCharacteristic = bleno.Characteristic;
var util = require('util')
var exec = require('child_process').exec;
var bookshelf = require('../classes/database.js')(databaseAddress);
var Controller = require('../models/controller.js')(bookshelf);

exec("sudo hciconfig hci0 up");

var name = "raspberrypi";
var serviceUUID = "E20A39F4-73F5-4BC4-A12F-17D1AD07A961";
var characteristicUUID = "08590F7E-DB05-467E-8757-72F6FAEB13D4"
var serviceUUIDS = [serviceUUID];

bleno.on('stateChange', function(state) {
  console.log("Peripheral set.");

  if (state === 'poweredOn') {
    bleno.startAdvertising(name, serviceUUIDS);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  bleno.setServices([
    new BluetoothService()
  ]);
});

var NotifyCharacteristic = function() {
  NotifyCharacteristic.super_.call(this, {
    uuid: characteristicUUID,
    properties: ['notify'],
    value: new Buffer("Simply Easy Learning", "utf-8"),
    onSubscribe: function(maxValueSize, updateValueCallback) {
      console.log("Device subscribed");
      this._updateValueCallback = updateValueCallback;

      new Controller()
      .fetchAll()
      .then(function(controller) {
        if (controller.models.length != 0) {
          var buffer = new Buffer(
            controller.models[0].attributes.token.toString() + controllerID.toString(), "utf-8")
          updateValueCallback(buffer);
        }
      });
    },
  });
};

function BluetoothService() {
  BluetoothService.super_.call(this, {
    uuid: serviceUUID,
    characteristics: [
      new NotifyCharacteristic()
    ]
  });
}

util.inherits(NotifyCharacteristic, BlenoCharacteristic);
util.inherits(BluetoothService, PrimaryService);
