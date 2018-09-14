function EventBus() {
    this.state={spiralVisible:true,
                latheVisible:false,
                latheOpacity: 0.7,
                curveResolution: 5000,
                spiralResolution: 1000,   
                spiralSlope: 0.1,    
                slopeXres: 1,      
    }
    this.eventCallbacksPairsList = [];

    this.subscribe = function (eventType, callback) {
        const eventCallbacksPair = findEventCallbacksPair(eventType);

        if (eventCallbacksPair)
            eventCallbacksPair.callbacks.push(callback);
        else {
            this.eventCallbacksPairsList.push(new EventCallbacksPair(eventType, callback));
        }
            
    }

    this.post = function (eventType, args) {
        const eventCallbacksPair = findEventCallbacksPair(eventType);

        if (!eventCallbacksPair) {
            console.error("no subscribers for event " + eventType);
            return;
        }

        eventCallbacksPair.callbacks.forEach(callback => callback(args));
    }

    findEventCallbacksPair = eventType => {
        return this.eventCallbacksPairsList.find(eventObject => eventObject.eventType === eventType);
    }

    function EventCallbacksPair(eventType, callback) {
        this.eventType = eventType;
        this.callbacks = [callback];
    }
}

const eventBus = new EventBus();