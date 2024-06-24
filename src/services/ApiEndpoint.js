import axios from 'axios'

// const instance = axios.create({
//     baseURL:'http://localhost:3000',
//     headers:{
//         'Content-Type': 'application/json'
//     },
//     withCredentials:true
// })

const instance = axios.create({
    baseURL:'http://192.168.1.141:3000',
    headers:{
        'Content-Type': 'application/json'
    },
    withCredentials:true
})

export const get = (url, params) => instance.get(url, { params });
export const post = (url, data) => instance.post(url, data);
export const put = (url, data) => instance.put(url, data);
export const deleteUser = (url) => instance.delete(url);

export const uploadFile = (url, formData) => instance.post(url, formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

  instance.interceptors.request.use(function (config) {
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

instance.interceptors.response.use(function (response) {
        console.log('intercpert reponse',response)
    return response;
  }, function (error) {
    console.log('intercpert reponse',error)
    return Promise.reject(error);
  });