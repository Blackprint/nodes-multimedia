Blackprint.registerNode('Multimedia/Audio/Effect/DubDelay',
class DubDelayNode extends Blackprint.Node {
	static input = { In: Blackprint.Port.ArrayOf(AudioNode) };
	static output = { Out: AudioNode };

	constructor(instance){
		super(instance);
		let iface = this.setInterface('BPIC/Multimedia/Audio/Effect/DubDelay');

		iface.title = 'DubDelay';
		iface.description = 'Multimedia Effect';

		iface.data = {
			mix: 0.5, // 0 ~ 1
			time: 0.7, // 0 ~ 180
			feedback: 0.5, // 0 ~ 1
			cutoff: 700, // 0 ~ 4000
		};
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Audio/Effect/DubDelay',
Context.IFace.DubDelay = class DubDelayIFace extends Context.MediaEffect {
	constructor(node){
		super(node);

		this.effect = ScarletsMediaEffect.dubDelay();
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
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Audio/Effect/DubDelay', {
	template: null
}, Context.IFace.DubDelay);