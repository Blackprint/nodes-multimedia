Blackprint.registerNode('Multimedia/Audio/Effect/Flanger',
class FlangerNode extends Blackprint.Node {
	constructor(instance){
		super(instance);
		let iface = this.setInterface('BPIC/Multimedia/Audio/Effect/Flanger');

		iface.title = 'Flanger';
		iface.description = 'Multimedia Effect';

		iface.data = {
			mix: 0.5, // 0 ~ 1
			time: 0.45, // 0 ~ 1
			speed: 0.2, // 0 ~ 1
			depth: 0.1, // 0 ~ 1
			feedback: 1.1, // 0 ~ 1
		};

		this.input = {
			In: Blackprint.Port.ArrayOf(AudioNode)
		};

		this.output = {
			Out: AudioNode
		};
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Audio/Effect/Flanger',
Context.IFace.Flanger = class FlangerIFace extends Context.MediaEffect {
	constructor(node){
		super(node);

		// Constructor for Interface can be executed twice when using Cloned Container
		this.effect = ScarletsMediaEffect.flanger();
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
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Audio/Effect/Flanger', {
	template: null
}, Context.IFace.Flanger);