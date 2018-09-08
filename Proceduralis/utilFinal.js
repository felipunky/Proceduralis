var AddEvent = function(object, type, callback) {

    if (object == null || typeof (object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);        { }
    }
    else if (object.attachEvent)
    {

        object.attachEvent('on' + type, callback);

    }
    else
    {

        object["on" + type] = callback;

    }

};

var RemoveEvent = function (object, type, callback) {

    if (object == null || typeof (object) == 'undefined') return;
    if (object.removeEventListener)
    {
        object.removeEventListener(type, callback, false);
    }
    else if (object.detachEvent)
    {

        object.detachEvent('on' + type, callback);

    }
    else
    {

        object['on' + type] = callback;

    }

}

// Load texture resource from a file over the network
var loadTextResource = function (url, callback) {

    var request = new XMLHttpRequest();
    request.open('GET', url + '?' + Math.random(), true);
    request.onload = function () {

        if (request.status < 200 || request.status > 299) {
            callback('Error: HTTP status ' + request.status + 'on resource ' + url);
        }
        else {
            callback(null, request.responseText);
        }
    };
    request.onerror = callback;
    request.send();
};

var loadImage = function (url, callback) {

    var image = new Image();
    image.onload = function () {

        callback(null, image);

    };
    image.src = url;
};

var loadJSONResource = function (url, callback) {

    loadTextResource(url, function (err, result) {

        if (err) {

            callback(err);

        } else {

            try {

                callback(null, JSON.parse(result));

            } catch (e) {

                callback(e);

            }
        }

    });

};