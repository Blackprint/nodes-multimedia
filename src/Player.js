/**
 * Media player that can be used to play audio or video from an URL into streamable object.
 * Make sure CORS is enabled and configured properly if you want to use cross-domain URL
 * @blackprint node
 * @summary Multimedia media player
 */
Blackprint.registerNode('Multimedia/Player',
class PlayerNode extends Blackprint.Node {
	static output = {
		/** You can connect this audio source to audio destination */
		AudioNode: AudioNode,
		/** Player's HTML element */
		Element: HTMLVideoElement,
		/** Can be used for obtaining audio or video stream */
		MediaStream: Blackprint.Port.StructOf(MediaStream, {
			Video: {type: MediaStreamTrack, handle(data){ return data.getVideoTracks()[0] }},
			Audio: {type: MediaStreamTrack, handle(data){ return data.getAudioTracks()[0] }},
		}),
		/** Total duration of the media file */
		Duration: Number,
	};

	static input = {
		/** This can be Blob URL or remote URL */
		URL: String,
		/** Change the start point */
		Seek: Number,
		/** Play the media loaded into this player */
		Play: Blackprint.Port.Trigger(function(port){
			port.iface.play();
		}),
		/** Pause this player */
		Pause: Blackprint.Port.Trigger(function(port){
			port.iface.pause();
		}),
		/** Pause this player and reset the seek to default */
		Stop: Blackprint.Port.Trigger(function(port){
			port.iface.stop();
		}),
	}

	constructor(instance){
		super(instance);

		let iface = this.setInterface('BPIC/Multimedia/Player');
		iface.title = 'Media Player';
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Player',
Context.IFace.Player = class PlayerIFace extends Blackprint.Interface {
	constructor(node){
		super(node);
		this._paused = true;
		this.player = document.createElement('video');
	}

	init(){
		let iface = this;
		iface.player.crossOrigin = 'anonymouse';
		iface.player.preload = 'auto';
		iface.player.autoload = true;

		iface.node.output.Element = iface.player;
		iface.node.output.AudioNode = ScarletsMedia.audioContext.createMediaElementSource(iface.player);

		// Fix video sync
		iface.node.output.AudioNode.connect(fakeDestination);

		// Update tracks after the file is playable
		iface.player.oncanplay = function(){
			iface.node.output.MediaStream = iface.player.captureStream();
			iface.node.output.Duration = iface.player.duration;
		}

		iface.player.onplay = function(){
			if(iface._paused) iface.player.pause();
		}

		iface.input.URL.on('value', Context.EventSlot, function({ cable }){
			iface.player.src = cable.value;
		});

		iface.input.Seek.on('value', Context.EventSlot, function({ cable }){
			iface.player.currentTime = cable.value;
		});
	}

	play(){
		this._paused = false;
		this.player.play();
	}
	pause(){
		this._paused = true;
		this.player.pause();
	}
	stop(){
		this._paused = true;
		this.player.pause();
		this.player.currentTime = 0;
	}
});

// For Sketch Editor (use default UI, and use similar interface)
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Player', {
	template: null
}, Context.IFace.Player);