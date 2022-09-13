export default function (mail = [], action) {
  if (action.type == "saveMail") {
    let setMail = [...mail];
    setMail.push(action.mail);
    console.log(setMail);
    return setMail;
  } else {
    return mail;
  }
}
