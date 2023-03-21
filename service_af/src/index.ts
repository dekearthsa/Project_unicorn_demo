const amqplib = require('amqplib/callback_api');
const mqtt = require("mqtt");   

require("dotenv").config({path:"../.env"})


// const connMQTT = process.env.CONN || "mqtt://localhost:1883";
// const connRabbitMQ = process.env.CONNRABBITMQ || "amqp://localhost";
const username = process.env.USERNAME || "admin";
const password = process.env.PASSWORD || "1234";
const isTopic = process.env.TOPIC || "af/message";
const queueTopicInsert = 'inserting';
const queueTopicFinder = 'finder';
const rabbitUser = "admin";
const rabbitPass = "1234";

const queueTopicAf = "activeAirFlow";

const connMQTT = process.env.CONN || "mqtt://host.docker.internal:1883";
const connRabbitMQ = process.env.CONNRABBITMQ || `amqp://${rabbitUser}:${rabbitPass}@host.docker.internal`;

// const port = process.env.PORT 


const mqttClient = mqtt.connect(
    connMQTT,
    {
        username: username,
        password: password
    }
)

mqttClient.on("connect", () => {
    console.log("MQTT service af is running.")

    mqttClient.subscribe(isTopic, (err: any) => {
        if (err) {
            console.log("error subcribe")
        }
    })

    mqttClient.on("message", async (topic: string, message: string) => {
        try {
            // console.log(`on sub ${topic} shot msg => ${message}`)
            // sender //
            amqplib.connect(connRabbitMQ, (err:any, conn:any) => {
                if (err) throw err;
                conn.createChannel((err:any, ch:any) => {
                    if(err) throw err;

                    // ch.assertExchange(queueTopicFinder, 'topic', {
                    //     durable: true
                    // });
                    ch.assertQueue(queueTopicFinder,{ durable: true});
                    ch.sendToQueue(queueTopicFinder, Buffer.from(message),{persistent: true}, (err:any,ok:any) => {
                        if(err){
                            console.log(err);
                        }else{
                            console.log(ok);
                        }
                    });

                    // ch.assertExchange(queueTopicInsert, 'topic', {
                    //     durable: true
                    // });
                    ch.assertQueue(queueTopicInsert, { durable: true});
                    ch.sendToQueue(queueTopicInsert, Buffer.from(message),{persistent: true});
                })
            })
            
        } catch (err) {
            console.log(`error => ${err}`)
        }
    })

})



amqplib.connect(connRabbitMQ, (err: any, conn: any) => {
    console.log("connected at rabbitMQ at amqp://localhost as receiver")
    if (err) throw err;

    // Listener
    conn.createChannel((err: any, ch2: any) => {
        if (err) throw err;

        ch2.assertQueue(queueTopicAf);

        ch2.consume(queueTopicAf, async (msg: any) => {
            if (msg !== null) {
                const stringData = msg.content.toString();
                const jsonData = JSON.parse(stringData);
                // send back to broker topic // 
                console.log(jsonData);
                // end send back // 
                ch2.ack(msg);

            } else {
                console.log('Consumer cancelled by server');
            }
        });
    });
});
