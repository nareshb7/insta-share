export const BE_URL = 'http://localhost:8081'
export const getMessagesApi = async (): Promise<string[]> => {
    return fetch(`${BE_URL}/getmessages`, {
        method:'GET',
    }).then(res => res.json())
    .then(data => data)
    .catch(err => err)
    // return dt
}
export const sendMessageAPi = async (message: string):Promise<string> => {
    console.log('API::', message)
    return fetch(`${BE_URL}/addMessage`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({message})
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

