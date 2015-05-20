
module.exports = function Manager(){
    this.queues = {};
    
    this.getQueue = function(room){
        
        if(this.queues[room])
            return this.queues[room];
        else
           return this.createQueue(room);
    };
    
    this.createQueue = function(room){
        var queue = new Queue(room);
        this.queues[room] = queue;
        return queue;
    };
    
};

var Queue = function Queue(room){   
    var self = this;
    this.room = room;
    this.maxWriters = 2;
    this.writers = [];
    this.watchers = [];
    
    this.timer = 3000;//30 seconds 
    
    this.addMember = function(member){
        //dont do anything if user is already in the list or member is undefined
        if (this.writers.indexOf(member) > -1 ||  this.watchers.indexOf(member) > -1  || !member)
            return;
        
        //if the room still needs writers add it, else they are just spectators
        if( this.writers.length < this.maxWriters){
            this.writers.push(member);
            if(this.writers.length == this.maxWriters){
                console.log('called start timer')
                this.startTimer();
            }
            
        }
        else
            this.watcher.push(member);
    };
    
    //Add the current writer to the end of the queue 
    this.updateQueue = function(){
        var currentWriter = this.writers.shift();
        this.writers.push(currentWriter);
    };
    
    this.startTimer = function(){
        console.log('started timer')
        setInterval(this.timesUp, this.timer);
    };
    
    
    this.timesUp = function(){
        self.updateQueue();
        console.log(self.writers)
    };
    
};

