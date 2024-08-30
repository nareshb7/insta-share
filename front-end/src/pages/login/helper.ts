import { FormData } from "./types"

export const ROOM_PATTERN = /^[0-9a-z]{3}-[0-9a-z]{4}-[0-9a-z]{3}$/
export const PASSWORD_PATTERN =
  /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%&*<>]).{8,}$/;

export const generateRandomString =()=> Math.random().toString(36)

export const generateRoomId =() => {
    const random = generateRandomString().substr(2,10)
    return `${random.slice(0,3)}-${random.slice(3,7)}-${random.slice(7)}`
}

export const REQUIRED = "Required"

export const validator =(obj: FormData, type: "JOIN" | "CREATE" = "CREATE")=> {
    const error: {[key in keyof FormData]: string | boolean} = {} as FormData
    let keys = ["roomId", "userName"];
    if (type === "CREATE") {
        keys.push("roomName")
    }
    keys.map((key: string) => {
        const name = key as  keyof FormData
        if (!obj[name]) {
            error[name]= REQUIRED
        }else {
            error[name] = ""
        }
    });
    if (!obj.roomId.match(ROOM_PATTERN)) {
        error['roomId'] = "Room Id is not valid"
    } else {
        error['roomId'] = ""
    }
    if (obj.isProtected && !obj.roomPassword.match(PASSWORD_PATTERN)) {
        error['roomPassword'] = REQUIRED
    }else {
        error['roomPassword'] = ""
    }
    if (!obj.userPassword.match(PASSWORD_PATTERN)) {
        error['userPassword']= REQUIRED
    }else {
        error['userPassword'] = ""
    }
    return {errors: error as FormData, isValid : Object.values(error).filter(v => v).length == 0}
}