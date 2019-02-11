import { environment } from './../../environments/environment';

const baseUrl = environment.baseUrl;

export const APIENDPOINTS = {
    message: baseUrl + 'messages',
    user: baseUrl + 'user'
};
