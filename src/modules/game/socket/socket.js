
export const initSockets = (io) => {
    io.on("connection" , (socket) => {
        console.log('New Client Connected :', socket.id);
        // Event Handlers
    });
}