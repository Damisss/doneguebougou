import { FunctionComponent, useState, useEffect } from 'react'
import {COMPARTMENTS} from '../../utils/config'
import { IrrigationComponent } from '../irrigation-component'
import { Api } from '../../api'

type CompartmentStatus = {
    [key: string]: boolean
}
type Compartment={id:string, compartment:string, topic:string}

export const Irrigation:FunctionComponent = ()=>{

    const [irrigationStatus, setIrrigationStatus] = useState<CompartmentStatus>({
        doneguebougou_4: false,
        doneguebougou_16: false,
        doneguebougou_17: false,
        doneguebougou_18: false,
        doneguebougou_19: false
    })
    
    const [irrigationState, setIrrigationState] = useState(false)
    
    const [api, setApi] = useState<Api>()

   useEffect(()=>{
    const newApi = new Api(
        process.env.REACT_APP_URL_BASE as string,
        process.env.REACT_APP_BROKER_URL as string,
        process.env.REACT_APP_PORT as string,
        process.env.REACT_APP_PROTOCOL as string,
        process.env.REACT_APP_USERNAME as string,
        process.env.REACT_APP_PASSWORD as string
    )
    newApi.onMessage(onEventCallback)
    setApi(newApi)

    return  ()=> {
        newApi.disconnect()
    }
    },[])

    const onOnClick = (topic:string, id:string)=>{
        api?.mqttSend(`${topic}/tap`, 'on')
        api?.mqttSend(`irrigation/button/pressed`, 'true')
    }

    const onOffClick = (topic:string, id:string)=>{
        api?.mqttSend(`${topic}/tap`, 'off')
        api?.mqttSend(`irrigation/button/pressed`, 'false')
    }
    
    const onEventCallback = (topic:string, message:string)=>{
        const id = topic.split('/')[1]
            if(Object.keys(irrigationStatus).includes(id)){
                setIrrigationStatus((prevState:CompartmentStatus)=>({
                    ...prevState,
                    [id]: message.toString() === 'on'
                }))
            }
            
            if(topic.split('/')[3] === 'broken'){
                setIrrigationState(message.toString() === 'irriagation working')
            }
    }
    
    const showCompartment = (item:Compartment, ind:number)=>{
        return (
            <IrrigationComponent 
                key={ind}
                id={item.id}
                compartment={item.compartment}
                onOnClick={()=>onOnClick(item.topic, item.id)}
                onOffClick={()=>onOffClick(item.topic, item.id)}
                isTapOn={irrigationStatus[item.id] as boolean}
                api={api}
                irrigationState={irrigationState}
            />
        )
    }
    
    const displayLocation = (item:any, ind:number)=>{
        return (
            <div key={ind} className='pt-[30px]'>
              <h1 className='text-center text-bold text-xl'>{item.location}</h1>
              {
                 <div className="md:grid  grid-cols-2 gap-4 w-11/12 m-auto">
                    {
                        (item.compartments as any || []).map(showCompartment)
                    }
                </div>
              }
            </div>
        )
    }

    return(
       <div className="w-full mt-[70px]">
        {
            (COMPARTMENTS as any || []).map(displayLocation)
        }
       </div>
    )
}
