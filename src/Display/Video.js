Blackprint.registerNode('Multimedia/Display/Video',
class VideoNode extends Blackprint.Node {
	static input = {
		MediaStream: MediaStream,
		VideoTrack: MediaStreamTrack,
	}

	constructor(instance){
		super(instance);

		let iface = this.setInterface('BPIC/Multimedia/Display/Video');
		iface.title = 'Video Visualization';
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Display/Video',
Context.IFace.Video = class VideoIFace extends Blackprint.Interface {
	constructor(node){
		super(node);
		this.stream = null;
	}

	// Also put stream data on cloned node, or when HTML hot reload
	init(){
		const {
			IInput, IOutput, // Port interface
			Input, Output, // Port value
		} = this.ref;

		var My = this;

		IInput.VideoTrack.on('value', Context.EventSlot, function({ cable }){
			IInput.MediaStream.disconnectAll();

			My.stream = new MediaStream([cable.value]);
			My.videoElement.prop('srcObject', My.stream);
			setTimeout(()=> My.videoElement.trigger('play', void 0, true), 200);
		});

		IInput.MediaStream.on('value', Context.EventSlot, function({ cable }){
			IInput.VideoTrack.disconnectAll();

			My.stream = cable.value;
			My.videoElement.prop('srcObject', My.stream);
			setTimeout(()=> My.videoElement.trigger('play', void 0, true), 200);
		});

		function disconnect(){
			if(IInput.VideoTrack.cables.length === 0 && IInput.MediaStream.cables.length === 0){
				My.videoElement.trigger('pause', void 0, true);
				My.videoElement.prop('srcObject', null);
				My.stream = null;
			}
		}

		IInput.VideoTrack.on('disconnect', Context.EventSlot, disconnect);
		IInput.MediaStream.on('disconnect', Context.EventSlot, disconnect);
	}

	get videoElement(){ return this._videoElement }
	set videoElement(val){
		if(val == null)
			return this._videoElement = $([]);

		if(val.addClass === void 0)
			val = $(val);

		this._videoElement = val;
		val.prop('srcObject', this.stream);

		// Call el.play() on every element
		val.trigger('play', void 0, true);
	}

	initClone(){ this.init() }
	hotReloadedHTML(){ this.init() }
});