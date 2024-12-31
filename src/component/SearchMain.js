import { useState, useEffect } from "react";
import SearchNav from "./SearchNav";

export default function SearchMain() {
  const [tdata, setTdata] = useState([]);
  const [c1, setC1] = useState([]);
  const [selC1, setSelC1] = useState();

  const [c2, setC2] = useState([]);
  const [selC2, setSelC2] = useState();
  const [info, setInfo] = useState();

  // 데이터 불러오기
  const getFetchData = () => {
    let url = `https://api.odcloud.kr/api/15130991/v1/uddi:f64e5b69-8003-4276-99b8-a0025ce60710?`;
    url = `${url}page=1&perPage=1000&serviceKey=${process.env.REACT_APP_API_KEY}`;
    console.log(url);

    fetch(url)
      .then((resp) => resp.json())
      .then((data) => setTdata(data.data))
      .catch((err) => console.error(err));
  };

  // 처음 로딩 시 데이터 가져오기
  useEffect(() => {
    getFetchData();
  }, []);

  // 대분류 (목국명) 설정
  useEffect(() => {
    if (!tdata) return;

    console.log(tdata);
    let tm = tdata.map((item) => item["목국명"]);
    tm = [...new Set(tm)]; // 중복 제거
    console.log("tm=", tm);

    setC1(tm); // 대분류 데이터 설정
  }, [tdata]);

  // 대분류 선택 시 중분류 (과국명) 설정
  useEffect(() => {
    if (!selC1) return;

    console.log("Selected C1: ", selC1);
    let tm = tdata
      .filter((item) => item["목국명"] === selC1)
      .map((item) => item["과국명"]);
    tm = [...new Set(tm)]; // 중복 제거

    setC2(tm);
  }, [selC1]);

  // 중분류 선택 시 세부 정보 설정
  useEffect(() => {
    if (!selC1 || !selC2) return;

    let tm = tdata.filter(
      (item) =>
        item["목국명"] === selC1 && item["과국명"] === selC2
    );

    const infoKey = ["곤충국명", "곤충학명", "소장기관", "채집년도"];
    let tmk = tm.map((dataItem, idx) => (
      <div key={`${selC1}-${selC2}-${idx}`} className="flex justify-center items-center mt-2">
        {infoKey.map((k, subIdx) => (
          <div key={`${k}-${subIdx}`} className="w-full flex justify-between border-b">
            <div className="w-full p-2 text-center text-sm font-bold">
              {k}
            </div>
            <div className="w-full p-2 text-center font-bold">
              {dataItem[k] || "N/A"} {/* 값이 없을 경우 N/A */}
            </div>
          </div>
        ))}
      </div>
    ));

    setInfo(tmk);
  }, [selC2]);

  return (
    <div>
      {/* 대분류 선택 */}
      {c1 && <SearchNav title="목국명" c={c1} sel={selC1} setSel={setSelC1} />}
      {/* 중분류 선택 */}
      {c2 && <SearchNav title="과국명" c={c2} sel={selC2} setSel={setSelC2} />}
      {/* 세부 정보 표시 */}
      <div className="w-full">{info}</div>
    </div>
  );
}
