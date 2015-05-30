
var Room = require('../../app/controllers/rooms.server.controller');


module.exports = function(app){
   
    var io = app.get('socketio');
    var queueManager = new QueueManager();
    
    //When recieve join event from items controller add user id to room. (used for only sending data to correct users)
    io.on('connection', function (socket) {
        console.log('someone connection')
        socket.on('join',function(data){
            //Join the writing room and a user room (soo we can send messages either to the user or to the room)
            socket.join(data.room);
            socket.join(data.user);
            
            //get queue instance or create new one
            var queue = queueManager.getQueue(data.room) || queueManager.createQueue(data.room);
           
            //Add new socket.id to the queue
            queue.addMember(socket.id);
            //add user id to the queue
            //queue.addMember(data.user);
        });
      
        socket.on('room.text.changed', function (data) {
            var queue = queueManager.getQueue(data.room);
            
            if (data.user === queue.writers[0])
                socket.to(data.room).emit('text.changed',data.text);
        });
        
        socket.on('room.writer.ready', function (data) {
            
            var queue = queueManager.getQueue(data.room);
            queue.startTimer();
        });
        
         socket.on('disconnect', function(){
            console.log('some one left', socket.id)
            
        });
      
      
    });
    
    function QueueManager(){
     this.queues = {};
     
    
    this.getQueue = function(room){
        return this.queues[room];
    };
    
    
    
    this.createQueue = function(room){
        var queue = new Queue(room);
        this.queues[room] = queue;
        return queue;
    };
}


function Queue(roomId){   
    
   
    var self = this;
    this.roomStates = {
            WAITING:'waiting',
            READY:'ready',
            ACTIVE:'active',
            Completed:'completed'
		};
	this.roomState = this.roomStates.WAITING;
    this.room = {_id : roomId};
    this.maxWriters = 2;
    this.writers = [];
    this.watchers = [];
    
    this.timer = 30000;//30 seconds 
    
    this.addMember = function(member){
        //dont do anything if user is already in the list or member is undefined
        if (this.writers.indexOf(member) > -1 ||  this.watchers.indexOf(member) > -1  || !member)
            return;

        //if the room still needs writers add it, else they are just spectators
        if( this.writers.length < this.maxWriters){
            this.writers.push(member);
            
            if(this.writers.length == this.maxWriters){
                this.room.full = true;
                Room.update(this.room);
                this.updateState(this.roomStates.READY);
               
            }
            else{
                this.updateState(this.roomStates.WAITING);
            }
            
        }
        else
            this.watcher.push(member);
    };
    
    //Add the current writer to the end of the queue 
    this.updateOrder = function(){
        var currentWriter = this.writers.shift();
        this.writers.push(currentWriter);
    };
    
    //Add the current writer to the end of the queue 
    this.updateState = function(state){
        this.roomState = state;
        io.to(this.room._id).emit('room.state',this.roomState);
    };
    

    
    this.startTimer = function(){
        this.updateState(this.roomStates.ACTIVE);
        this.timesUp();
        setInterval(this.timesUp, this.timer);
        
    };
    
    this.timesUp = function(){
        //update que then emit times up event 
        self.updateOrder();
        for(var i in self.writers){
            io.to(self.writers[i]).emit('room.queue-change',i);
        }
    };
    
    this.cleanUp = function(){
        // should change the room state to completed
        // should 
    };
    
}


    
};

