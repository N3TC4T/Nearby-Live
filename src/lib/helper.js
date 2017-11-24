/* eslint no-undef: "off" */

import RNFetchBlob from 'react-native-fetch-blob';

import {APIConfig} from '@constants/';

export default function imageUploader(imageUri) {
    const apiToken = AsyncStorage.getItem('api/token').then(res => res);

    RNFetchBlob.fs.exists(imageUri)
        .then((exist) => {
            if (!exist || !apiToken) {
                reject();
            }
        })
        .catch(() => reject());

    return RNFetchBlob.fetch('POST', `${APIConfig.apiUrl}/upload-image.ashx`, {
        'Content-Type': 'jpg/jpeg',
        'X-AUTH-TOKEN': apiToken
    }, RNFetchBlob.wrap(imageUri));
}
