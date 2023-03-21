const amqplib = require('amqplib/callback_api');
const connection = require('./model/connection');

// import collection // 
// const storeModel = require('./model/storeModel');

// import collection //
const {ConvertDataFlow} = require("./controller/controlling");

const queue = 'inserting';
const rabbitUser = "admin";
const rabbitPass = "1234";

// const hosting = `amqp://${rabbitUser}:${rabbitPass}@localhost`   

connection.connect();
const hosting = `amqp://${rabbitUser}:${rabbitPass}@host.docker.internal`

amqplib.connect(hosting, (err: any, conn: any) => {
    console.log("connected at rabbitMQ at amqp://localhost as receiver")
    if (err) throw err;

    // Listener
    conn.createChannel((err: any, ch2: any) => {
        if (err) throw err;

        ch2.assertQueue(queue);

        ch2.consume(queue, async (msg: any) => {
            if (msg !== null) {
                const stringData = msg.content.toString();
                // console.log("stringData => ", stringData)
                const jsonData = JSON.parse(stringData);
                // console.log("jsonData => ",jsonData)
                const insertingData = new ConvertDataFlow.InsertData(jsonData.device_name, jsonData.timestamp);
                const dataOut = await insertingData.haddleInsertData();
                console.log("dataout => ",dataOut)
                ch2.ack(msg);
            } else {
                console.log('Consumer cancelled by server');
            }
        });
    });
});



