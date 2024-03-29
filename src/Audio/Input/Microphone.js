/**
 * Obtain audio source from your microphone input
 * @blackprint node
 */
Blackprint.registerNode('Multimedia/Audio/Input/Microphone',
class MicrophoneNode extends Blackprint.Node {
	// Blackprint Node Output
	static output = {
		/** AudioNode that stream the microphone data */
		Node: AudioNode,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface('BPIC/Multimedia/Audio/Input/Microphone');
		iface.title = 'Microphone';
	}
});

// Interface-> BPIC/Multimedia/Audio/Input/Microphone
Blackprint.registerInterface('BPIC/Multimedia/Audio/Input/Microphone',
Context.IFace.Microphone = class MicrophoneIFace extends Blackprint.Interface {
	constructor(node){
		super(node);

		this.selected = 0; // Default, first option
		this.devices = [];
		this._waitForInit = false;
		this.stream = null;
	}

	init(){
		let iface = this;
		iface._refreshList();

		iface.output.Node
			.on('connecting', Context.EventSlot, function({ port, activate }){
				// undefined = Mark cable connection as disabled
				// true = Mark cable connection as enabled
				// false = Mark cable connection as failed
				activate(undefined);
				iface.startStream(activate); // Callback
			})
			.on('disconnect', Context.EventSlot, function(){
				// Stop any stream when it doesn't have cable anymore
				if(iface.output.Node.cables.length === 0)
					iface.stopStream();
			});
	}

	async _refreshList(){
		let devices = await navigator.mediaDevices.enumerateDevices();
		var list = [];
		var ids = new Set();

		for (var i = 0; i < devices.length; i++) {
			if(devices[i].kind === 'audioinput'){ // Microphone only
				// Avoid duplicate
				var id = devices[i].groupId;
				if(id){
					if(ids.has(id)) continue;
					ids.add(id);
				}

				list.push({
					i: list.length,
					label: (devices[i].label || 'Device'),
					device: devices[i]
				});
			}
		}

		this.devices = list; // Put them here, ScarletsFrame will handle the HTML binding
		this._waitForInit && this._waitForInit();
	}

	select(which){
		if(this.selected === which) return;
		let old = this.selected;

		this.selected = which;
		this.stopStream();

		let iface = this;
		iface.output.Node.disableCables(true);
		this.startStream(function(success){
			if(!success) return this.selected = old;

			// Only reset when success
			iface.output.Node.disableCables(false);
		});
	}

	async startStream(callback){
		var selected = this.devices[this.selected].device;
		if(this.stream !== null)
			return callback(true);

		if(this.devices.length === 0){
			// Wait for initialization
			this._waitForInit = function(){
				this.startStream(callback);
			}

			return;
		}

		try {
			this.stream = await navigator.mediaDevices.getUserMedia({audio: selected});
			this.node.output.Node = ScarletsMedia.audioContext.createMediaStreamSource(this.stream);

			// Refresh again in case if the list was changed after user
			// give the permission
			this._refreshList();
			callback(true);
		} catch(e) {
			callback(false);
			throw e;
		}
	}

	stopStream(){
		if(this.stream === null)
			return;

		this.stream.getTracks().forEach(track=> track.stop());
		this.stream = null;
	}
});