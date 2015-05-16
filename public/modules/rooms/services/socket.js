'use strict';

//socket factory that provides the socket service
angular.module('core').factory('Socket', ['socketFactory',
    function(socketFactory) {
        return socketFactory({
            prefix: '',
            ioSocket: io.connect('http://uckk89a260b1.crowdsourcecreativity.koding.io:3000')
        });
    }
]);