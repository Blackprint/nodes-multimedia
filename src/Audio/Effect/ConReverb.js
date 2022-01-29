Blackprint.registerNode('Multimedia/Audio/Effect/ConReverb',
class ConReverbNode extends Blackprint.Node {
	static input = {
		In: Blackprint.Port.ArrayOf(AudioNode),
		Buffer: AudioBuffer,
	};
	static output = { Out: AudioNode };

	constructor(instance){
		super(instance);
		let iface = this.setInterface('BPIC/Multimedia/Audio/Effect/ConReverb');

		iface.title = 'ConReverb';
		iface.description = 'Multimedia Effect';

		iface.data = {
			mix: 0.5,
		};
	}

	imported(){
		let {Input, IInput} = this.ref;
		let {iface} = this;

		IInput.Buffer.on('value', Context.EventSlot, function(ev){
			iface.effect.setBuffer(Input.Buffer);
		});
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Audio/Effect/ConReverb',
Context.IFace.ConReverb = class ConReverbIFace extends Context.MediaEffect {
	constructor(node){
		super(node);

		this.effect = ScarletsMediaEffect.conReverb();
		this.audioInput = this.effect.input;
		this.audioOutput = this.effect.output;
	}

	init(){
		super.init(); // Call parent function
		this.node.output.Out = this.audioOutput;

		// Custom bind for ScarletsFrame with ScarletsMediaEffect object
		customEffectFunctionBind(this);
	}
});

// For Sketch Editor (use default UI, and use similar interface)
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Audio/Effect/ConReverb', {
	template: null
}, Context.IFace.ConReverb);