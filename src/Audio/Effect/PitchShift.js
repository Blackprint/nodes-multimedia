Blackprint.registerNode('Multimedia/Audio/Effect/PitchShift',
class PitchShiftNode extends Blackprint.Node {
	constructor(instance){
		super(instance);
		let iface = this.setInterface('BPIC/Multimedia/Audio/Effect/PitchShift');

		iface.title = 'PitchShift';
		iface.description = 'Multimedia Effect';

		iface.data = {
			shift: 0, // -3 ~ 3
		};

		this.input = {
			In: Blackprint.Port.ArrayOf(AudioNode)
		};

		this.output = {
			Out: AudioNode
		};
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Audio/Effect/PitchShift',
Context.IFace.PitchShift = class PitchShiftIFace extends Context.MediaEffect {
	constructor(node){
		super(node);

		this.effect = ScarletsMediaEffect.pitchShift();
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
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Audio/Effect/PitchShift', {
	template: null
}, Context.IFace.PitchShift);