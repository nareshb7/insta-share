import { BE_URL } from "./MessagesApi"


export const fileUpload =async (file: FormData) => {
    return fetch(`${BE_URL}/files`, {
        method:'POST',
        body: file
    }).then(res => res.json())
    .then(data => data)
    .catch(err => err)
}

export const fileDownload = async (id: string) => {
    return fetch(`${BE_URL}/files/${id}`, {
        method:'GET',
    }).then(res => res.json())
    .then(data => data)
    .catch(err => err)
}