/**
 * Visualize video from a stream or video source
 * @blackprint node
 */
Blackprint.registerNode('Multimedia/Display/Video',
class VideoNode extends Blackprint.Node {
	static input = {
		/** Visualize video from a MediaStream */
		MediaStream: MediaStream,
		/** Visualize video from a VideoTrack */
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
			My._playVideo();
		});

		IInput.MediaStream.on('value', Context.EventSlot, function({ cable }){
			IInput.VideoTrack.disconnectAll();

			My.stream = cable.value;
			My._playVideo();
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

	_playVideo(){
		let val = this._videoElement;
		for (let i=0; i < val.length; i++){
			let el = val[i];

			if(el.srcObject === this.stream && !el.paused) continue;

			el.srcObject = this.stream;
			el.play().catch(function(){
				$(el.ownerDocument).once('pointerdown', ev => el.play());
			});
		}
	}

	get videoElement(){ return this._videoElement }
	set videoElement(val){
		if(val == null)
			return this._videoElement = $([]);

		if(val.addClass === void 0)
			val = $(val);

		this._videoElement = val;
		val.prop('srcObject', this.stream);
		this._playVideo();
	}
});