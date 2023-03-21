"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const amqplib = require('amqplib/callback_api');
const mqtt = require("mqtt");
require("dotenv").config({ path: "../.env" });
const username = process.env.USERNAME || "admin";
const password = process.env.PASSWORD || "1234";
const isTopic = process.env.TOPIC || "wb/message";
const queueTopicInsert = 'inserting';
const rabbitUser = "admin";
const rabbitPass = "1234";
// const connMQTT = process.env.CONN || "mqtt://localhost:1883";
// const connRabbitMQ = process.env.CONNRABBITMQ || "amqp://localhost";
const connMQTT = process.env.CONN || "mqtt://host.docker.internal:1883";
const connRabbitMQ = process.env.CONNRABBITMQ || `amqp://${rabbitUser}:${rabbitPass}@host.docker.internal`;
// const port = process.env.PORT 
const mqttClient = mqtt.connect(connMQTT, {
    username: username,
    password: password
});
mqttClient.on("connect", () => {
    console.log("MQTT service wb is running.");
    mqttClient.subscribe(isTopic, (err) => {
        if (err) {
            console.log("error subcribe");
        }
    });
    mqttClient.on("message", (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(`on sub ${topic} shot msg => ${message}`);
            // sender //
            amqplib.connect(connRabbitMQ, (err, conn) => {
                if (err)
                    throw err;
                conn.createChannel((err, ch) => {
                    if (err)
                        throw err;
                    ch.assertQueue(queueTopicInsert);
                    ch.sendToQueue(queueTopicInsert, Buffer.from(message));
                });
            });
        }
        catch (err) {
            console.log(`error => ${err}`);
        }
    }));
});
