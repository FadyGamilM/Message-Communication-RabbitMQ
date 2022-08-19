// require the rabbitMQ library
const amqplib = require("amqplib");

// create a queue name
const queueName = "hello-broker-no2";

// function to publish a message to the message broker
const consumeMsg = async () => {
	// setup a connection
	const connection = await amqplib.connect("amqp://localhost");
	// now setup a channel which is the pipeline to the rabbitMQ
	const channel = await connection.createChannel();
	// create a queue with the passed queue name if its not exist
	// this is important because we might start the consumer before the publisher
	// so we need to make sure that there is a queue before start consuming
	await channel.assertQueue(queueName, { durable: false });
	console.log(`--> Waiting for consuming a msg from queue : ${queueName}`);
	channel.consume(
		queueName,
		(msg) => {
			console.log("[X] Recieved --> ", msg.content.toString());
		},
		{
			noAck: true,
		}
	);
};

consumeMsg();
