import { request } from '../axios'

const getMyProfile = async () => {
    return await request({
        url: '/users/me',
        method: 'GET',
    }, true)
}

export default {
    getMyProfile
}
