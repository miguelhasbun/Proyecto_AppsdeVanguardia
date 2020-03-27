'use strict';

//const request = require('request');


var fs = require('fs');
var https = require('https');
var config = require('./config');
/**
 * Call MS face detection
 * 
 * @param {*} imageData image as dataURL
 * @param {*} onSuccess success callback
 * @param {*} onError error callback
 */
function faceDetect(imageData, onSuccess, onError) {
    var msDetectOptions = {
        host: config.FACE_API_HOST,
        method: 'POST',
        port: 443,
        path: config.FACE_API_PATH_DETECT,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': Buffer.byteLength(imageData),
            'Ocp-Apim-Subscription-Key': config.FACE_API_KEY
        }
    };

    var msDetectReq = https.request(msDetectOptions, function(msDetectResponse) {
        msDetectResponse.setEncoding('utf8');
        msDetectResponse.on('data', function(msDetectData){
            onSuccess(JSON.parse(msDetectData));
        });
    });
    msDetectReq.on('error', onError);
    msDetectReq.write(imageData);
    msDetectReq.end();
}

/**
 * 
 * @param {*} faceId1 face1 to compare
 * @param {*} faceId2 face2 to compare
 * @param {*} onSuccess success callback
 * @param {*} onError error callback
 */
 function faceCompare(faceId1, faceId2, onSuccess, onError) {
    var msVerifyOptions = {
        host: config.FACE_API_HOST,
        method: 'POST',
        port: 443,
        path: config.FACE_API_PATH_VERIFY,
        headers: {
            'Ocp-Apim-Subscription-Key': config.FACE_API_KEY
        }
    }

    var msVerifyReq = https.request(msVerifyOptions, function(msVerifyResponse) {
        msVerifyResponse.setEncoding('utf8');
        msVerifyResponse.on('data', function(msVerifyData) {
            onSuccess(JSON.parse(msVerifyData));
        });
    })

    msVerifyReq.on('error', onError);
    msVerifyReq.write(JSON.stringify({faceId1: faceId1, faceId2: faceId2}));
    msVerifyReq.end();
}


exports.faceDetect=faceDetect;
exports.faceCompare=faceCompare;