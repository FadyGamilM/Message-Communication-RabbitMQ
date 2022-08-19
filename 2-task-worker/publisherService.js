// require the rabbitMQ library
const amqplib = require("amqplib");

// create a queue name
const queueName = "task";

const msg = process.argv.slice(2).join(" ") || "hello world";

// function to publish a message to the message broker
const PublishMsg = async () => {
	// setup a connection
	const connection = await amqplib.connect("amqp://localhost");
	// now setup a channel which is the pipeline to the rabbitMQ
	const channel = await connection.createChannel();
	// create a queue with the passed queue name if its not exist
	await channel.assertQueue(queueName, { durable: true });
	// send the message to the queue
	// the first parameter will be the routing key
	channel.sendToQueue(queueName, Buffer.from(msg), { persistent: true });
	console.log("SENT --> ", msg);
	setTimeout(() => {
		connection.close();
		process.exit(0);
	}, 500);
};

PublishMsg();
