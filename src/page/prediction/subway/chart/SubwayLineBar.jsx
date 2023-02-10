import React,{useState} from 'react'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { useEffect } from 'react';

const SubwayLineBar = (props) => {

const data = props.data

const [chartList,setChartList] = useState('')
const [lineData,setLineData] = useState([])
const [barData,setBarData] = useState([])
const [barCharVal , setValcChartVal] = useState('line');
const pageKey = "subway";


const hourList = [0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

useEffect(()=>{
    let dataF = []

    for(let i = 0; i<data?.sttnIdList.length; i++){
        let sttnName = data?.content[i]["sttn_name"]
        let dataIns = [];

        for(let hour of hourList){
            let dataXY = {
                "x": hour +":00",
                "y": data.content[i]["pred_geton_" + hour] + data.content[i]["pred_alight_" + hour]
            } 
        dataIns.push(dataXY)
        }

        let dataId = {
            "id":sttnName,
            "data":dataIns
        }
        dataF.push(dataId)
    }
    //return dataF
    setLineData(dataF)
},[data])


useEffect(()=>{
    let dataF = []  

    for(let i = 0; i<data?.sttnIdList.length; i++){
        for(let hour of hourList){
            if (barCharVal === data?.content[i].sttn_id){
            let dataXY = {
                "hour":hour+":00",
                "승차":data?.content[i]["pred_geton_" + hour],
                "하차":data?.content[i]["pred_alight_" + hour],
            }
            dataF.push(dataXY)
            }
        }
    
    }
    //return dataF
    setBarData(dataF);
},[data,barCharVal])


const BarGraph = () => {
    return (
        <div style={{ height: '250px', margin: '0 auto'}}>
            <ResponsiveBar
                data={barData}
                keys={['승차', '하차']}
                indexBy="hour"
                margin={{ top: 20, right: 50, bottom: 30, left: 60 }}
                padding={0.25}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'nivo' }}
                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1.6
                        ]
                    ]
                }}
                axisTop={null}
                axisRight={null}
                //axisBottom={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legendPosition: 'middle',
                    legendOffset: 32,
                    //tickValues: tickValues,    //x축 데이터 부분표출
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 2,
                    tickRotation: 0,
                    legend: '승/하차 승객 수',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                tooltip={({ data }) => {
                    return (
                        <div
                            style={{
                                background: 'white',
                                padding: '9px 12px',
                                border: '1px solid #ccc',
                                maxWidth: '180px'
                            }}
                        >
                            <div>• 시간 : {data.hour}</div>
                            <br/>
                            <div>› 승차(명) : {data.승차}</div>
                            <div>› 하차(명) : {data.하차}</div>
                        </div>
                    )
                }}
            />
        </div>
    );
}



const LineGraph = () =>{
    return(
        <div style={{ width: '90%', height: '250px', margin: '0 auto' }}>
            <ResponsiveLine
                    data={lineData}
                    margin={{ top: 20, right: 50, bottom: 30, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{
                        type: 'linear',
                        min: 'auto',
                        max: 'auto',
                        stacked: true,
                        reverse: false
                    }}
                    axisTop={null}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: '승하차 인원(명)',
                        legendOffset: -55,
                        legendPosition: 'middle'
                    }}
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legendOffset: 36,
                        //legendPosition: 'middle',
                        //tickValues: tickValues,    //x축 데이터 부분표출
                    }}
                    axisRight={null}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    colors={{ scheme: 'nivo' }}
                    useMesh={true}
                    //enableSlices="x"
                    tooltip={({ point }) => {
                        let label =point.id.split('.'); 
                        return (
                            <div
                                style={{
                                    background: 'white',
                                    padding: '7px 12px',
                                    border: '1px solid #ccc',
                                    maxWidth: '170px'
                                }}
                            >
                                <div>• 도시철도역 명 : {label[0]}</div>
                                <br/>
                                <div>› 시간 : {point.data.x}</div>
                                <div>› 승하차인원(명) : {point.data.y}</div>
                            </div>
                        )
                    }}
                />
   </div>
    )
}

//도로철도역 리스트
const button = ()=>{
    let list = []
    for(let i = 0 ; i<data?.sttnIdList.length; i++){
        list.push(<button className='button' onClick={(e)=>chart_button(e)} value={data?.sttnIdList[i]} key={pageKey+"button"+i}>{data?.content[i]["sttn_name"]}</button>)

    }
    setChartList(list)
}


const [chartSort,setChartSort] = useState(<LineGraph />)

//차트종류별
const chart_button = (e) =>{
     setValcChartVal(e.target.value)
 }

 useEffect(()=>{
    if(barCharVal === 'line'){
        setChartSort(<LineGraph />)
    }
    else{
        setChartSort(<BarGraph/>)
    }
    LineGraph()
 },[lineData,barData])


useEffect(()=>{
    button()

},[data])


  return (
    <>
        <div className='chart'>
            {chartSort}
        </div>
        <div className='chartButton'>
            <button onClick={(e)=>chart_button(e)} value='line'>전체</button>
            {chartList}
        </div>
    </>
  )
}

export default SubwayLineBar