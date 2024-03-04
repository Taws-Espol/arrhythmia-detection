import {io} from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : '/esp32/connect';

export const socket = io(URL);