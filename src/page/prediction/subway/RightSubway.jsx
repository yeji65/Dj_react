import React from 'react'
import { useState,useEffect } from 'react';
import SubwayLineBar from './chart/SubwayLineBar'

const RightSubway = (props) => {

  const data = props.data

  const [theadTag, setTheadTag] = useState();
  const [tbodyTag, setTbodyTag] = useState();
  const pageKey = "rightsubway";



  let timeListTage = [];

  const getTimeList = () => {
    let timeList = [];
    for (var i = 0; i < 24; i++) {
        if (i < 10) {
            if(i!==1 && i!==2 && i!==3 && i!==4){
                timeList.push("0" + i + ":00");
            }
        } else if (i >= 10) {
            timeList.push(i + ":00");
        }
    }
    for (var j = 0; j < timeList.length; j++) {
        timeListTage.push(
            <th key={pageKey + '_head_timeList_' + j} scope='col'>{timeList[j]}</th>
        )
    }
    return timeListTage;
}

const theadList = () =>{
    let theadListTag = [];
	  var timeTag = getTimeList(); //시간 헤더

			theadListTag.push(
				<thead key={pageKey + '_head1'} >
					<tr key={pageKey + '_tr1'}>
						<th key={pageKey + '_head_predDate_'} scope='col'>일자</th>
						<th key={pageKey + '_head_sttnNm_'} scope='col'>도시철도역</th>
						{timeTag}
					</tr>
				</thead>
			)
		
		setTheadTag(theadListTag);
}

const getBodyList = () => {
  let bodyListTag = [];

  for(let i= 0 ; i < data?.content?.length; i++){
    let date = data?.content[i].pred_date.slice(0,4)+"년"+data?.content[i].pred_date.slice(4,6)+"월"+data?.content[i].pred_date.slice(6,8)+"일"
    bodyListTag.push(
    <tr key={pageKey + '_trBody1_'+i}>
      <td>{date}</td>
      <td>{data?.content[i].sttn_name}</td>
      <td>{(data?.content[i].pred_alight_0 + data?.content[i].pred_geton_0).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_5 + data?.content[i].pred_geton_5).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_6 + data?.content[i].pred_geton_6).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_7 + data?.content[i].pred_geton_7).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_8 + data?.content[i].pred_geton_8).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_9 + data?.content[i].pred_geton_9).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_10 + data?.content[i].pred_geton_10).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_11 + data?.content[i].pred_geton_11).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_12 + data?.content[i].pred_geton_12).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_13 + data?.content[i].pred_geton_13).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_14 + data?.content[i].pred_geton_14).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_15 + data?.content[i].pred_geton_15).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_16 + data?.content[i].pred_geton_16).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_17 + data?.content[i].pred_geton_17).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_18 + data?.content[i].pred_geton_18).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_19 + data?.content[i].pred_geton_19).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_20 + data?.content[i].pred_geton_20).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_21 + data?.content[i].pred_geton_21).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_22 + data?.content[i].pred_geton_22).toLocaleString()}</td>
      <td>{(data?.content[i].pred_alight_23 + data?.content[i].pred_geton_23).toLocaleString()}</td>
    </tr>
    )
  }
  return bodyListTag;
}

const tbodyList = () => {
  let tbodyListTag = [];
  var trbodyTag = getBodyList();
    tbodyListTag.push(
      <tbody key={pageKey + '_body1'}>
        {trbodyTag}
      </tbody>
    )
  
  setTbodyTag(tbodyListTag);
}

useEffect(()=>{
  theadList()
  tbodyList()
},[data])

  return (
    <>
        <section className="contWrap">
          <h3>도시철도 승하차</h3>
          <div className="titleArea">
            <em className="metaData">
                  지난 기간 중 도시철도 이용 내역을 사용하여 생성한 표본을 기준으로, 당일 이후 6일간의 도시철도역별 탑승객 수를 예측하여 표출한 차트입니다.
            </em>
					</div>
					<div className="divLine"/>{/*구분선*/}
            
            <h3>통계차트</h3>
            {data?.content?.length !== 0 && data?.content !== '' && data !== undefined ? <SubwayLineBar data={data}/>:<div>데이터가 없습니다</div>}
            
          <div className="divLine"/>
              <h3>상세분석 정보</h3>
                {data?.content?.length !== 0 && data?.content !== '' && data !== undefined ?
                <div className='table'>
                <table className='table_data'>
                    {theadTag}
                    {tbodyTag}
                </table>
                </div>
                :<div>데이터가 없습니다</div>}
        </section>
    </>
  )
}

export default RightSubway