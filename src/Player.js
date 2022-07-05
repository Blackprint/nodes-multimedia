Blackprint.registerNode('Multimedia/Player',
class PlayerNode extends Blackprint.Node {
	static output = {
		AudioNode: AudioNode,
		Element: HTMLVideoElement,
		VideoTrack: MediaStreamTrack,
		AudioTrack: MediaStreamTrack
	};

	static input = {
		URL: String,
		Play: Blackprint.Port.Trigger(function(port){
			port.iface.play();
		}),
		Pause: Blackprint.Port.Trigger(function(port){
			port.iface.pause();
		}),
	}

	constructor(instance){
		super(instance);

		let iface = this.setInterface('BPIC/Multimedia/Player');
		iface.title = 'Media Player';
		iface.description = 'Multimedia media player';
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
			var mediaStream = iface.player.captureStream();
			iface.node.output.AudioTrack = mediaStream.getAudioTracks()[0];
			iface.node.output.VideoTrack = mediaStream.getVideoTracks()[0];
		}

		iface.player.onplay = function(){
			if(iface._paused) iface.player.pause();
		}

		iface.input.URL.on('value', Context.EventSlot, function({ cable }){
			iface.player.src = cable.value;
		})
	}

	play(){
		this._paused = false;
		this.player.play();
	}
	pause(){
		this._paused = true;
		this.player.pause();
	}
});

// For Sketch Editor (use default UI, and use similar interface)
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Player', {
	template: null
}, Context.IFace.Player);