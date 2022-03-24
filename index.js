//js del backend
//uso express para iniciar el servidor
const app = require('express')();
//servidor
const server = require('http').createServer(app)
//cors middleware para crossorigin request
const cors = require('cors');
//socket io
const io = require('socket.io')(server,{
    cors: {
        origin:'*',
        methods: ['GET', 'POST']
    }
});
//uso cors
app.use(cors())
//declaro el puerto
const PORT = process.env.PORT || 5000;
//creo las rutas
app.get('/', (req, res)=>{
    res.send('El servidor está corriendo')
})
//configuracion se SOCKET.IO
io.on('connection', (socket)=>{
    //backend de socket
    socket.emit('me', socket.id)
    socket.on('disconnect', ()=>{
        //emito un mensaje de llamda temrinada
        socket.broadcast.emit('callended')
    })
    //obtengo los datos desde el front-end (usertocall es le id del usuario)
    socket.on('calluser', ({userToCall, signalData, from, name})=>{
        io.to(userToCall).emit('calluser', {signal: signalData, from, name})
    })
    //
    socket.on('answercall', (data)=>{
        io.to(data.to).emit('callaccepted', data.signal)
    })
})
server.listen(PORT, ()=> console.log(`El servidor esta en el puerto ${PORT}`))