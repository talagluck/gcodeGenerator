function EventBus() {
    this.state = {      
        latheVisible:false,
        latheOpacity: 0.7,

        spiralVisible: true,
        curveResolution: 5000,
        spiralResolution: 3000, 
        curveXspiral: 3/5  ,
        spiralSlope: 0.01,
        totalHeight: 20,

        anchorPointsPosition:[[10, 10, 0], [10, -10, 0]],
        slopeXres: 30,
        // heightXres: 150,
        heightXslope: 0.01/20,
        bottomSpiralVisible:true,
        bottomSpiralRevolutions:50,
        bottomSpiralOffset: 0.5,
        bottomSpiralXZSpeed: 1.5,
        bottomSpiralYSpeed: 4,
        bottomSpiralResolution: 360,


    }
    this.prevState = []

    this.save = function () {
        let newPrevState = Object.assign({ timestamp: Date.now() }, this.state)
        this.prevState.push(newPrevState);
        let redrawOptionsController = sceneManager.gui.root.__controllers.filter(controller => controller.property == "redrawOptions")[0];
        let redrawController = sceneManager.gui.root.__controllers.filter(controller => controller.property == "redraw")[0];
        if (redrawOptionsController){
            redrawOptionsController.remove();
            redrawController.remove();
        }
        this.prevState=this.prevState.reverse();
       sceneManager.gui.root.add(sceneManager, 'redrawOptions', this.prevState.map(pr => pr.timestamp) ).onChange(console.log('changed'));
       sceneManager.gui.root.add(sceneManager, 'redraw');

        // console.log(this.prevState[this.prevState.length-1])
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