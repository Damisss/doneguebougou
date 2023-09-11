import React, { useState, useEffect, FunctionComponent } from 'react'
import socketClient from 'socket.io-client'
import { GraphComponent } from '../graph-component'

type GraphData = {
    timestamp:string
    compartment: number
    nitrogen:number
    potassuim:number
    phosphorus:number
    humidity:number
    temperature:number
}

type CompartmentData={
    [key:string]: GraphData[] 
}

export const Graph:FunctionComponent = ()=>{
    const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })
    const [filterSize, setFilterSize] = useState(0)
    const [sensorData, setSensorData] = useState<CompartmentData>({
        'doneguebougou/1/state': [],
        'doneguebougou/2/state': [],
        'doneguebougou/3/state': [],
        'doneguebougou/4/state': [],
        'doneguebougou/5/state': []
    })

    const oneHourFilter = ()=>{
        setFilterSize(6)
    }

    const fourHourFilter = ()=>{
        setFilterSize(24)
    }

    const oneDayFilter = ()=>{
        setFilterSize(0)
    }
    
    useEffect(()=>{
        const soket = socketClient("http://3.67.88.93")
        Object.keys(sensorData).forEach((event:string, ind)=>{
            soket.on(event, (data:GraphData[])=>{
            setSensorData((prevState)=>{
                return{
                    ...prevState,
                    [event]: data
                }
            })
        })
        })
        
    }, [])

    useEffect(() => {
        const handleResize = () => {
        const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        setScreenSize({ width, height });
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Set initial screen size 

        return () => {
        window.removeEventListener('resize', handleResize);
        }
    }, [])


    
   
    const displayGraph = (item: string, index:number)=>{
        if(!sensorData[item].length) return null
        return (
            <div  key={index} className='mt-6'>
                    <h1 className='text-center text-xl font-bold m-0 p-0'>{`COMPARTIMENT ${item.split('/')[1]}`}</h1>
                    <GraphComponent 
                        data={sensorData[item]} 
                        screenWidth={screenSize.width}
                        oneHourFilter={oneHourFilter}
                        fourHourFilter={fourHourFilter}
                        oneDayFilter={oneDayFilter}
                        filterSize={filterSize}
                    />
            </div>
        )
    }
    
    return (
        <div className='mt-20 md:grid grid-cols-2 gap-4'>
            {
                Object.keys(sensorData).map(displayGraph)
            }

        </div>
    )
}