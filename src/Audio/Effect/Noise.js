Blackprint.registerNode('Multimedia/Audio/Effect/Noise',
class NoiseNode extends Blackprint.Node {
	static input = { In: Blackprint.Port.ArrayOf(AudioNode) };
	static output = { Out: AudioNode };

	constructor(instance){
		super(instance);
		let iface = this.setInterface('BPIC/Multimedia/Audio/Effect/Noise');

		iface.title = 'Noise';
		iface.description = 'Multimedia Effect';
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Audio/Effect/Noise',
Context.IFace.Noise = class NoiseIFace extends Context.MediaEffect {
	constructor(node){
		super(node);

		this.effect = ScarletsMediaEffect.noise();
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
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Audio/Effect/Noise', {
	template: null
}, Context.IFace.Noise);