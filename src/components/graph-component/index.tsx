import react, {FC} from 'react'
import {
    LineChart,
    Line, 
    XAxis, 
    YAxis, 
    Tooltip, 
    Legend,
    CartesianGrid
} from 'recharts'

type GraphComponent = {
    screenWidth: number
    data: {
        timestamp:string,
        nitrogen:number, 
        potassuim:number,
        phosphorus:number,
        humidity:number,
        temperature:number
    }[]
    oneHourFilter: ()=>void
    fourHourFilter: ()=>void
    oneDayFilter: ()=>void
    filterSize:number

}
export const GraphComponent: FC<GraphComponent>  = ({
    screenWidth, 
    data,
    oneHourFilter,
    fourHourFilter,
    oneDayFilter,
    filterSize
})=>{

     const adjustGraphWidth = (screenWidth:number)=>{
      
        if(screenWidth <= 1085 && screenWidth > 759){
            return 420
        }

        if(screenWidth <= 770 && screenWidth > 620){
            return 600
        }

        if(screenWidth <= 592  && screenWidth > 450){
            return 500
        }

        if(screenWidth <= 450 ){
            return 350
        }

        return 600
    }
    const start = filterSize > 0 && data.length>filterSize ? data.length-filterSize : 0

    return (
        <>
        <div className='flex justify-cols justify-center items-center mt-4'>
            <div 
                onClick={oneDayFilter}
                className={`${filterSize === 0? 'bg-[#07f55e]': 'bg-[#003a14]'} shadow-xl p-2 mr-2 cursor-pointer rounded`}>
                <span className='font-bold text-center text-white'>1 JOUR</span>
            </div>
            <div 
                onClick={fourHourFilter}
                className={`${filterSize === 24? 'bg-[#07f55e]': 'bg-[#003a14]'} shadow-xl  p-2 mr-2 cursor-pointer rounded`}>
                <span className='font-bold text-center text-white'> 4 HEURES</span>
            </div>
            <div 
                onClick={oneHourFilter}
                className={`${filterSize === 6? 'bg-[#07f55e]': 'bg-[#003a14]'} shadow-xl  p-2 mr-2 cursor-pointer rounded`}>
                <span className='font-bold text-center text-white'>1 HEURE </span>
            </div>
        </div>
        <LineChart 
        width={ adjustGraphWidth(screenWidth)} 
        height={200} 
        data={data.slice(start)} 
        margin={{ top: 20, left:10 , bottom: 5 }} 
        >
            <XAxis dataKey="timestamp" hide/>
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend verticalAlign="top" height={40}/>
            <Line name={'Humidité'} type="monotone" dataKey={'moisture'} stroke="#07c1f5" strokeWidth={3}/>
            <Line name={'Température'} type="monotone" dataKey={'temperature'} stroke="#f50707" strokeWidth={3}/>
        </LineChart>
         <LineChart 
        width={ adjustGraphWidth(screenWidth)} 
        height={200} 
        data={data.slice(start)} 
        margin={{ top: 10, left: 10, bottom: 5 }} 
        >
            <XAxis dataKey="timestamp" hide/>
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend verticalAlign="top" height={40}/>
            <Line name={'Azote'} type="monotone" dataKey={'nitrogen'} stroke="#1307f5" strokeWidth={3}/>
            <Line name={'Phosphore'} type="monotone" dataKey={'phosphorus'} stroke="#f59607" strokeWidth={3}/>
            <Line name={'Potassuim'} type="monotone" dataKey={'potassuim'} stroke="#07f55e" strokeWidth={3}/>
        </LineChart>
        </>
    )
}