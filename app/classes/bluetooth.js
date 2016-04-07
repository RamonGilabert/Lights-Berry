/* Bluetooth handler */

module.exports = function(controller, bookshelf, berry) {

  var Light = require('../models/light.js')(bookshelf);
  var Requester = require('../classes/requester.js');
  var util = require('util')
  var exec = require('child_process').exec;
  var noble = require('noble');

  exec("sudo hciconfig hci0 up");

  noble.on('stateChange', function(state) {

    if (state === "poweredOn") {
      noble.startScanning([], true);
      console.log("Starting to look for peripherals.");
    } else {
      noble.stopScanning();
      console.log("Stopped looking for peripherals.");
    }
  });

  noble.on('discover', function(peripheral) {
    if (peripheral.advertisement.localName === "BLE Shield") {

      var address = peripheral.address;

      connect(peripheral, "713d0003503e4c75ba943148f18d941e")
      .then(function(characteristic) {
        console.log("Ready to write.");

        new Light()
        .fetchAll()
        .then(function(bookshelfLights) {

          var addresses = [];
          bookshelfLights.models.forEach(function(light) {
            addresses.push(light.attributes.address);
          });

          if (addresses.indexOf(address) < 0) {
            Requester.postLight(controller.id, address)
            .then(function(light) {
              new Light()
              .save(light)
              .then(function(light) {
                console.log('A new light was saved!');
                berry.lights.push(light.id);
              });
            });
          } else {
            var index = addresses.indexOf(address)
            berry.lights.push(bookshelfLights.models[index].id);
          }

          berry.peripherals.push(peripheral);
          berry.characteristics.push(characteristic);

          setTimeout(function() {
            noble.startScanning([], true);
          }, 3000);
        });
      });
    } else if (peripheral.advertisement.localName === "Lights") {
      connect(peripheral, "7DAB97504510410CB030D5597D3EBE6D".toLowerCase())
      .then(function(characteristic) {
        console.log("Ready to send information.")

        var buffer = new Buffer(
          controller.token.toString() + controller.id.toString(), "utf-8");

        characteristic.write(buffer, false);

        setTimeout(function() {
          noble.startScanning([], true);
        }, 3000);
      });
    }
  });

  function connect(peripheral, UUID) {
    return new Promise(function(resolve, reject) {
      peripheral.connect(function(error) {
        peripheral.discoverServices([], function(error, services) {
          services.forEach(function(service) {
            service.discoverCharacteristics([], function(error, characteristics) {
              characteristics.forEach(function(characteristic) {
                if (characteristic.uuid == UUID) {
                  resolve(characteristic);
                }
              });
            });
          })
        });
      });
    });
  }
}
