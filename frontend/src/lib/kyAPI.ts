import ky, {Options} from 'ky';
import {API_BASE_URL} from '@/src/lib/globalConstants';
import {refreshAccessToken} from '@/actions/users';
import useUserStore from '@/store/usersStore';

interface CustomRetryOptions extends Options {
    _retry?: boolean;
}

const kyAPI = ky.create({
    prefixUrl: API_BASE_URL,
    credentials: 'include',
    hooks: {
        beforeRequest: [
            request => {
                const { accessToken } = useUserStore.getState();
                if (accessToken) {
                    request.headers.set('Authorization', `Bearer ${accessToken}`);
                }
            }
        ],
        afterResponse: [
            async (request, options: CustomRetryOptions, response) => {
                if (response.status === 401 && !options._retry) {
                    options._retry = true;

                    try {
                        const newToken = await refreshAccessToken();
                        if (!newToken) {
                            useUserStore.getState().setAccessToken(null);
                            useUserStore.getState().setLogout?.();
                            throw new Error('Refresh token failed');
                        }
                        useUserStore.getState().setAccessToken(newToken);

                        return ky(request, {
                            ...options,
                            headers: {
                                ...options.headers,
                                Authorization: `Bearer ${newToken}`,
                            }
                        });
                    } catch (e) {
                        useUserStore.getState().setAccessToken(null);
                        useUserStore.getState().setLogout?.();
                        throw e;
                    }
                }

                return response;
            }
        ]
    }
});

export default kyAPI;