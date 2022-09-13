//*** userId test à modifier en "" ensuite ***

export default function userId(userId = "", action) { //userId rentré en dur => à changer
    if (action.type === "addUserId") {
        userId = action.userId
        return userId;
    } else {
        return userId;
    }
}
