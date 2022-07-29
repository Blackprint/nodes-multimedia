// ToDo: implement w3c draft after it's available for multi target audio output
// https://www.w3.org/TR/audio-output/

/**
 * Send the audio output to destination
 * This may be your speaker or default output devices
 * @blackprint node
 * @summary Audio output
 */
Blackprint.registerNode('Multimedia/Audio/Output/Destination',
class DestinationNode extends Blackprint.Node {
	static input = {
		/** AudioNode that can be from from Microphone, Effects, etc */
		In: Blackprint.Port.ArrayOf(AudioNode),
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface('BPIC/Multimedia/Audio/Output/Destination');
		iface.title = 'Destination';
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Audio/Output/Destination',
Context.IFace.Destination = class DestinationIFace extends Blackprint.Interface {
	init(){
		var destination = ScarletsMedia.audioContext.destination;
		let iface = this;

		iface.on('cable.connect', Context.EventSlot, function({ port, cable }){
			if(port === iface.input.In)
				cable.value.connect(destination);
		});

		iface.on('cable.disconnect', Context.EventSlot, function({ port, cable }){
			if(port === iface.input.In)
				cable.value.disconnect(destination);
		});
	}

	hotReloaded(){
		this.init();
	}
});

// For Sketch Editor (use default UI, and use similar interface)
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Audio/Output/Destination', {
	template: null
}, Context.IFace.Destination);