import {io} from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://192.168.3.12:5000/';

export const socket = io(URL);