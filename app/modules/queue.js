
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
            console.log('input changes anyone')
            if (socket.id === queue.participants[0]){
                socket.to(data.room).emit('text.changed',data.text);
            }
            
        });
        
        socket.on('room.participant.ready', function (data) {
            
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
    
    this.deleteQueue = function(room){
        delete this.queues[room];
    };
    
    this.createQueue = function(room){
        var queue = new Queue(room);
        this.queues[room] = queue;
        return queue;
    };
}


function Queue(roomId){
    
    //crete self for use in timesUp functi
    var self = this;
    
    //init room, most likely add a request to the db later 
    this.room = {_id : roomId};
    
    //List of all room states
    this.roomStates = {
            WAITING:'waiting',
            READY:'ready',
            ACTIVE:'active',
            COMPLETED:'completed'
		};
		
	//curent room state
	this.roomState = this.roomStates.WAITING;
	
    
    this.maxParticipants = 2;
    this.participants = [];
    this.watchers = [];
    
    this.maxTurns = 2;
    this.completedTurns = 0;
    
    this.timePerTurn = 30000;//30 seconds 
    
    //instance of queue timer later instantiated
    this.timer;
    
    this.addMember = function(member){
        //dont do anything if user is already in the list or member is undefined
        if (this.participants.indexOf(member) > -1 ||  this.watchers.indexOf(member) > -1  || !member)
            return;

        //if the room still needs participants add it, else they are just spectators
        if( this.participants.length < this.maxParticipants){
            this.participants.push(member);
            
            if(this.participants.length == this.maxParticipants){
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
    
    //Add the current participants to the end of the queue 
    this.updateOrder = function(){
        var currentParticipant = this.participants.shift();
        this.participants.push(currentParticipant);
    };
    
    //Add the current participants to the end of the queue 
    this.updateState = function(state){
        this.roomState = state;
        io.to(this.room._id).emit('room.state',this.roomState);
    };
    

    //update state to active, emit position to client, and start timer
    this.startTimer = function(){
        this.updateState(this.roomStates.ACTIVE);
        
        for(var i in self.participants){
            io.to(self.participants[i]).emit('room.queue.start',i);
        }
        
        this.timer = setInterval(this.timesUp, this.timePerTurn);
        
    };
    
    this.timesUp = function(){
        self.checkForCompleted();
        
        //update que then emit times up event 
        self.updateOrder();
        for(var i in self.participants){
            io.to(self.participants[i]).emit('room.queue.change',i);
        }
    };
    
    this.checkForCompleted = function(){
        this.completedTurns++;
        if(this.completedTurns === this.maxTurns){
            
            this.complete();
        }
    };
    
    
    this.complete = function(){
        this.updateState(this.roomStates.COMPLETED)
        this.room.completed = true;
        Room.update(this.room);
        
        clearInterval(this.timer);
    };
    
}


    
};

