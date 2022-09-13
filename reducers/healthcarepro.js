export default function (infos = {}, action) {
  if (action.type === "AddSoin") {
    let setInfos = action.datas;
    return setInfos;
  } else {
    return infos;
  }
}
