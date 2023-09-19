import { SendMessageType } from "../saga/Actions"

export const BE_URL = "http://192.168.10.28:8081"
export const getMessagesApi = async (id: string): Promise<string[]> => {
    return fetch(`${BE_URL}/message/${id}`, {
        method:'GET',
    }).then(res => res.json())
    .then(data => data)
    .catch(err => err)
    // return dt
}
export const sendMessageAPi = async (data: SendMessageType):Promise<string> => {
    return fetch(`${BE_URL}/message/sendmessage`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({data})
    }).then(res => res.json())
    .then(data => data)
    .catch(err => err)
}

export const deleteMessage = async (id: string = '') => {
    return fetch(`${BE_URL}/message/${id}`, {
        method:'DELETE',
    }).then(res => res.json())
    .then(data => data)
    .catch(err => err)
}

















// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// export const messageApi = createApi({
//     baseQuery: fetchBaseQuery({baseUrl: '/'}),
//     endpoints: (build) => ({
//         sendMessage: build.mutation({
//             query: (body) => ({
//                 url: '/messages',
//                 method: 'POST',
//                 body
//             })
//         })
//     })
// })

// export const {useSendMessageMutation} = messageApi

