import React, { useEffect, useState } from 'react'

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Datepicker Default 스타일 
import { ko } from "date-fns/esm/locale";
import RightSubway from './subway/RightSubway';
import * as Axios from '../../context/axios';
import axios from 'axios';

const Subway = () => {
  const [Selected,setSelected] = useState();
  const [dateTag, setDateTag] = useState();
  const [useDunit, setUseDunit] = useState("perD"); //EgovRadioButton
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [rangeStartDate, setRangeStartDate] = useState(new Date());
  const [rangeEndDate, setRangeEndDate] = useState(new Date());
	const pageKey = "LeftSubway";
  const [checkItems,setCheckItems] = useState([]);
  const [date,setDate] = useState()
  const [onSelect,setOnSelect] = useState()
  const [prediction,setPrediction] = useState()
  const [keyword,setKeyword] = useState('')

//도시철도역 리스트
useEffect(()=>{
    Axios.requestPost('/web-service/api/v1/road/getSttnList'
    ,{
    }
    ,(resp)=>{
      setDate(resp.data)
    }
  )
},[])


//예측 날짜 리스트
const predList = (sDate) => {
  Axios.requestPost("/web-service/api/v1/road/getPredDate"
  ,{
    gubun: 'si',
    regDate: sDate || '',
  }
  ,(resp)=>{
    setPrediction(resp.data)
  }
  )
}


const predictClick = (e) =>{
  switch(e){
    case "predictionDate0":
      selectParam(prediction[0])
      break;
    case "predictionDate1":
      selectParam(prediction[1])
      break;
    case "predictionDate2":
      selectParam(prediction[2])
      break;
    case "predictionDate3":
      selectParam(prediction[3])
      break;
    case "predictionDate4":
      selectParam(prediction[4])
      break;
    case "predictionDate5":
      selectParam(prediction[5])
      break;
  }
}

//검색
const onKeyDown = (e)=>{
  if(e.key == 'Enter'){
   setKeyword(e.target.value)
   setCheckItems('') //체크박스 true 초기화
  }
}

const onKeyButton = (e)=>{
  console.log("dd",e)
  //setKeyword(e.target.value)
}


  //단일체크박스
  const handleSingleCheck = (checked,id)=> {
    if(checked){
        setCheckItems(prev =>[...prev,id])
    }else{
        setCheckItems(checkItems.filter((d)=>d !== id)) //체크 해제시 해당 id값 제외한 값 배열에 넣기
    }

  }

  //체크박스 전체선택
  const handleAllCheck = (checked) =>{
      if(checked){
          const idArray = [];
          date.forEach(d=>idArray.push(d.sttn_id));
          setCheckItems(idArray);
       }
      else{
          setCheckItems([]);
      }
  }


  //날짜
  const dateList = async () => {
    let dateListTag = [];

    dateListTag.push(
      <div className="date">
        <DatePicker
						locale={ko}
						selected={startDate}	//하루 전날이 초기값
						dateFormat="yyyy-MM-dd"  // 날짜 형식
						placeholderText="시작일"
						onChange={date => setStartDate(date)}
						selectsStart
						startDate={rangeStartDate}
						endDate={rangeEndDate} />
      </div>
    )
  
  setDateTag(dateListTag)
}


//조회
const selectParam = async(searchDate) => {

  var sDate = startDate.getFullYear() + ("0" + (1 + startDate.getMonth())).slice(-2) + ("0" + startDate.getDate()).slice(-2);

  predList(sDate) //예측날짜리스트 표출

  Axios.requestPost("/web-service/api/v1/road/getSubwayPredictData"
    , {
      regDate: sDate || '',
      predDate: searchDate || '',
      sttnIdList: checkItems.length > 0 ? checkItems : ['0'],
    }
    , (resp) => {
      const _inputData = {
        content: resp.data,
        regDate: sDate,
        predDate: searchDate,
        sttnIdList: checkItems,
        page: "subway",
        //alert: alertContent,
    }
    setOnSelect(_inputData)

    }
    , (error) => {
      console.log(error);
     }
  );
  
  }




  useEffect(()=>{

  },[Selected,keyword])

  useEffect(() => {
		dateList()
	}, [useDunit, startDate, endDate]);


  return (
    <div className='container'>
        <div className='sidebar'>
            <h2>도시철도 승하차</h2>

            <div className="divLine"/>{/*구분선*/}
            <h3>분석지표</h3>
                <select className='side_title'>
                  <option value="section">도시철도 승하차</option>
                </select>

            <div className="divLine"/>{/*구분선*/}
              <h3>일자선택</h3>
                  <label><input type="radio"/>일별</label> 
                {dateTag}
          
            <div className="divLine"/>{/*구분선*/}
              <div>
                  <span className='title_Checkbox'>
                      <h3>도시철도역 선택</h3>
                      <label className='allCheckbox'><input type="checkbox" onChange={(e)=>handleAllCheck(e.target.checked)}/>전체선택(취소)</label>                        
                   </span>   
                    <div>
                      <input type='text' id={pageKey +"sttnInput"} placeholder='도시철도역 입력' onKeyDown={(e)=>onKeyDown(e)} />
                      <button type="submit" id="btn_search" className="icon_search" onClick={(e)=>onKeyButton(e)} >검색</button>
                    </div>
              </div>
              <div className='subList'>

                  { keyword ?
                    (date?.find((date)=>date.sttn_name==keyword)?
                      date?.filter((date)=>date.sttn_name==keyword).map((date,key)=>
                        <div key={pageKey +key}>
                          <label><input type='checkbox' onChange={(e) => handleSingleCheck(e.target.checked, date.sttn_id)} checked={checkItems.includes(date.sttn_id) ? true : false} />{date.sttn_name}</label>
                        </div>)
                        : 
                        <div>조회 결과가 없습니다.</div>)
                     :
                    date?.map((date,key)=><div key={pageKey +key}><label><input type='checkbox' onChange={(e) => handleSingleCheck(e.target.checked, date.sttn_id)} checked={checkItems.includes(date.sttn_id) ? true : false}/>{date.sttn_name}</label></div>)
                  } 

              </div>
                
           <div className="divLine"/>{/*구분선*/}
	          <button type="button" className="search" onClick={e => { selectParam(startDate.getFullYear() + ("0" + (1 + startDate.getMonth())).slice(-2) + ("0" + startDate.getDate()).slice(-2)) }} >조회</button>
              <div className='predictionList' >
              {prediction?.map((name,key)=>(
                <div onClick={() => predictClick("predictionDate" + key)} >
                <h4>{name.substring(0, 4)}년{name.substring(4, 6)}월{name.substring(6, 8)}일</h4></div>))}
              </div>
        </div>
        {<RightSubway data={onSelect}/>}
    </div>
  )
}

export default Subway;