from kafka import KafkaProducer
from kafka.admin import KafkaAdminClient, NewTopic
import json
import time

from booking_producer import seat_to_be_booked

TOPIC = "booking"
BROKER = 'kafka:9092'

def create_topic(topic_name, broker, num_partitions=1, replication_factor=1):
    """
    Ensure the Kafka topic exists; create it if it does not.
    """
    admin_client = None
    try:
        admin_client = KafkaAdminClient(bootstrap_servers=broker)
        
        # Check if the topic exists
        existing_topics = admin_client.list_topics()
        if topic_name in existing_topics:
            print(f"Topic '{topic_name}' already exists.")
        else:
            # Create the topic
            topic = NewTopic(name=topic_name, num_partitions=num_partitions, replication_factor=replication_factor)
            admin_client.create_topics([topic])
            print(f"Topic '{topic_name}' created successfully.")
    except Exception as e:
        print(f"Failed to create topic '{topic_name}': {e}")
    finally:
        if admin_client is not None:
            admin_client.close()


def main():
    create_topic(TOPIC, BROKER)

    # Initialize the Kafka producer
    producer = KafkaProducer(
        bootstrap_servers=BROKER,
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )

    print(producer.bootstrap_connected())
    print("Starting Kafka producer...")

    try:
        while True:
            message = seat_to_be_booked()
            if message is None:
                time.sleep(120)
                continue

            producer.send(TOPIC, message)
            print(f"Produced: {json.dumps(message)}")

            time.sleep(300)

    except KeyboardInterrupt:
        print("Stopping Kafka producer.")
    finally:
        producer.flush()
        producer.close()

if __name__ == "__main__":
    main()
