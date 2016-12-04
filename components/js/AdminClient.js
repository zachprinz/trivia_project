/**
 * Created by Edward on 12/3/2016.
 */

const socket = io();

socket.on('connect', () => {
    console.log('Connected');
});

socket.on('disconnect', () => {
    console.log('Disconnected');
});