import paho.mqtt.client as mqtt

BROKER_URL = "broker.hivemq.com"
PORT = 8883


def on_connect(client, userdata, flags, reason_code, properties):
    print(f"Successfully connected")

def on_message(client, data, message):
    print(f"Message acquired: {message.payload.decode()} on {message.topic}")


client = mqtt.Client()
client.tls_set(ca_certs="/c/Users/adria/certificates/certificate.crt")
client.tls_insecure_set(True)
client.on_message = on_message
client.on_connect = on_connect
client.connect(BROKER_URL, PORT, 60)
