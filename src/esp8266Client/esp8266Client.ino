#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

char *SSID = "";
char *PASSWORD = "";
const char *MQTT_BROKER_IP = "";

const int LED_PIN = 2;
const int PUSH_BUTTON_PIN = D2;

WiFiClient espClient;
PubSubClient client(espClient);

bool isPushed = false;

void connectToWifi(char *SSID, char *PASSWORD)
{
    WiFi.mode(WIFI_STA);
    WiFi.begin(SSID, PASSWORD);

    Serial.println("");
    Serial.print("Connecting to \"");
    Serial.print(SSID);
    Serial.println("\"");
    Serial.println("");

    bool blink = true;
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
        digitalWrite(LED_PIN, blink ? LOW : HIGH); // active low led
        blink = !blink;
    }
    digitalWrite(LED_PIN, HIGH); // active low led

    Serial.println("");
    Serial.print("Connected to ");
    Serial.println(SSID);
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
}

void callback(char *topic, byte *payload, unsigned int length)
{
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    for (int i = 0; i < length; i++)
    {
        Serial.print((char)payload[i]);
    }

    if (!strcmp(topic, "is_pill_taken_today"))
    {
        if (!strncmp((char *)payload, "true", length))
        {
            digitalWrite(LED_PIN, HIGH);
        }
        else
        {
            digitalWrite(LED_PIN, LOW);
        }
    }

    if (!strcmp(topic, "pill_taken"))
    {
        digitalWrite(LED_PIN, HIGH);
    }
}

void reconnect()
{
    // Loop until we're reconnected
    while (!client.connected())
    {
        Serial.print("Attempting MQTT connection...");
        // Create a random client ID
        String clientId = "ESP8266Client-";
        clientId += String(random(0xffff), HEX);
        // Attempt to connect
        if (client.connect(clientId.c_str()))
        {
            Serial.println("connected");

            client.subscribe("is_pill_taken_today");
            client.subscribe("pill_taken");

            client.publish("client_connected", "");
        }
        else
        {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            // Wait 5 seconds before retrying
            delay(5000);
        }
    }
}

void setup(void)
{
    pinMode(PUSH_BUTTON_PIN, INPUT);
    pinMode(LED_PIN, OUTPUT);

    Serial.begin(115200);

    connectToWifi(SSID, PASSWORD);

    Serial.print("http://");
    Serial.print(WiFi.localIP());

    client.setServer(MQTT_BROKER_IP, 1883);
    client.setCallback(callback);

    Serial.print("PUSH_BUTTON_PIN: ");
    Serial.println(PUSH_BUTTON_PIN);
}

void loop(void)
{
    if (!client.connected())
    {
        reconnect();
        // TODO: Blink if not connected
    }

    client.loop();

    bool latestIsPushed = digitalRead(PUSH_BUTTON_PIN);

    bool changedStateToPushed = !isPushed && latestIsPushed;

    if (changedStateToPushed)
    {
        Serial.println("PUSH");
        client.publish("button_push", "");
    }

    isPushed = latestIsPushed;
}