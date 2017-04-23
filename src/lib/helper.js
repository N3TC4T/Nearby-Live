import { AsyncStorage } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob'

import { APIConfig } from '@constants/'




export const imageUploader = (imageUri) => {
    AsyncStorage.getItem('api/token').then((res) => {const apiToken = res});

    RNFetchBlob.fs.exists(imageUri)
        .then((exist) => {
            !exist || !apiToken ?  reject() : null
        })
        .catch(() => { return reject()})

    return RNFetchBlob.fetch('POST', APIConfig.apiUrl + '/upload-image.ashx', {
        'Content-Type': 'jpg/jpeg',
        'X-AUTH-TOKEN' : apiToken
    }, RNFetchBlob.wrap(imageUri))

}