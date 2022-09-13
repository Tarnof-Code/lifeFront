export default function (listHealthCare = [], action) {
  if (action.type == "addHealthCare") {
    //J'ajoute un soin dans le profil
    let isExist = listHealthCare.find(
      //Je recherche avec find
      (element) => element.name === action.healthCare.name //Si le soin choisi est même que celui déjà dans la liste
    );
    if (!isExist) {
      //Si le soin n'existe pas dans la liste alors on l'ajoute
      let listHealthCareCopy = [...listHealthCare]; //Je fais une copie de mon tableau
      listHealthCareCopy.push(action.healthCare); //J'ajoute le soin dans la liste
      return listHealthCareCopy;
    } else {
      return listHealthCare;
    }
  } else if (
    //Je supprime un soin dans la liste
    action.type === "deleteHealthCare"
  ) {
    let listHealthCareCopy = [...listHealthCare]; // Je fais une copie de mon tableau
    listHealthCareCopy.splice(action.index, 1); //Je supprime un soin dans la liste
    return listHealthCareCopy;
  } else {
    return listHealthCare;
  }
}
