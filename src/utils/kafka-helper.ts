import { Kafka, Consumer, Producer, KafkaMessage } from 'kafkajs';

export class KafkaHelper {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'playwright-tests',
      brokers: ['localhost:9092'], // Replace with your test environment bootstrap servers
      /* If your cluster requires SSL/SASL:
      ssl: true,
      sasl: { mechanism: 'plain', username: 'my-user', password: 'my-password' }
      */
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: `playwright-group-${Date.now()}` }); // Dynamic group to avoid conflict
  }

  // Connect both producer and consumer
  async connect() {
    await Promise.all([this.producer.connect(), this.consumer.connect()]);
  }

  // Disconnect both
  async disconnect() {
    await Promise.all([this.producer.disconnect(), this.consumer.disconnect()]);
  }

  // Helper to publish a message (Use case: Triggering backend events via Kafka)
  async sendMessage(topic: string, key: string, value: object) {
    await this.producer.send({
      topic,
      messages: [{ key, value: JSON.stringify(value) }],
    });
  }

  // Helper to wait and catch a specific message (Use case: Asserting UI actions triggered an event)
  async waitForMessage(topic: string, evaluationFn: (msg: KafkaMessage) => boolean, timeout = 10000): Promise<KafkaMessage> {
    await this.consumer.subscribe({ topic, fromBeginning: false });

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.consumer.stop();
        reject(new Error(`Timeout: Message matching criteria not found in topic ${topic} within ${timeout}ms`));
      }, timeout);

      this.consumer.run({
        eachMessage: async ({ message }) => {
          if (evaluationFn(message)) {
            clearTimeout(timer);
            await this.consumer.stop();
            resolve(message);
          }
        },
      });
    });
  }
}