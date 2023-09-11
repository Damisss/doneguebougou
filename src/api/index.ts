import * as mqtt from 'mqtt'

export class Api{
    client: mqtt.MqttClient
    topics = [
        'irrigation/doneguebougou_4/on',
        'irrigation/doneguebougou_16/on',
        'irrigation/doneguebougou_17/on',
        'irrigation/doneguebougou_18/on',
        'irrigation/doneguebougou_19/on',
        'irrigation/doneguebougou/tap/broken',
        'doneguebougou/1/broken'
    ]

    constructor(
        baseUrl:string,
        brokerUrl:string,
        port:string,
        protocol:string,
        username:string,
        password:string
    ){
        const options = {
            host: brokerUrl,
            port: port,
            protocol: protocol,
            username:username ,
            password:password,
            clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`, //can be changed for something more specific if you need it
        }
        
        //@ts-ignore
        this.client = mqtt.connect(`${baseUrl}://${brokerUrl}:${port}/mqtt`, options)
        this.client.on('connect', this.subscribeToTopics.bind(this))
    }
    
    subscribeToTopics(){
      //const topics = Object.keys()  
      this.client.subscribe(this.topics, {qos:0})
    }

    mqttSend(topic:string, payload:string){
        this.client.publish(topic, payload, {qos:1})
    }

    onMessage(callback:(topic:string, message:string)=>void){
        this.client.on('message', (topic, message) => {
            callback(topic, message.toString())
        });
    }

    disconnect(){
        this.client.unsubscribe(this.topics)
        this.client.end();
    }
      
}