Blackprint.registerNode('Multimedia/Audio/Effect/Distortion',
class DistortionNode extends Blackprint.Node {
	static input = { In: Blackprint.Port.ArrayOf(AudioNode) };
	static output = { Out: AudioNode };

	constructor(instance){
		super(instance);
		let iface = this.setInterface('BPIC/Multimedia/Audio/Effect/Distortion');

		iface.title = 'Distortion';
		iface.description = 'Multimedia Effect';

		iface.data = {
			set: 0.5, // 0 ~ 1
		};
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Audio/Effect/Distortion',
Context.IFace.Distortion = class DistortionIFace extends Context.MediaEffect {
	constructor(node){
		super(node);

		this.effect = ScarletsMediaEffect.distortion();
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
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Audio/Effect/Distortion', {
	template: null
}, Context.IFace.Distortion);