Blackprint.registerNode('Multimedia/Audio/Effect/Reverb',
class ReverbNode extends Blackprint.Node {
	constructor(instance){
		super(instance);
		let iface = this.setInterface('BPIC/Multimedia/Audio/Effect/Reverb');

		iface.title = 'Reverb';
		iface.description = 'Multimedia Effect';

		iface.data = {
			mix: 1, // 0 ~ 1
			time: 1, // 0 ~ 3
			decay: 0.1, // 0 ~ 3
			reverse: false, // boolean
		};

		this.input = {
			In: Blackprint.Port.ArrayOf(AudioNode)
		};

		this.output = {
			Out: AudioNode
		};
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Audio/Effect/Reverb',
Context.IFace.Reverb = class ReverbIFace extends Context.MediaEffect {
	constructor(node){
		super(node);

		this.effect = ScarletsMediaEffect.reverb();
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
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Audio/Effect/Reverb', {
	template: null
}, Context.IFace.Reverb);