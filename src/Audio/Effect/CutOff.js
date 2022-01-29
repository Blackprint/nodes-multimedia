Blackprint.registerNode('Multimedia/Audio/Effect/CutOff',
class CutOffNode extends Blackprint.Node {
	static input = { In: Blackprint.Port.ArrayOf(AudioNode) };
	static output = { Out: AudioNode };

	constructor(instance){
		super(instance);
		let iface = this.setInterface('BPIC/Multimedia/Audio/Effect/CutOff');

		iface.title = 'CutOff';
		iface.description = 'Multimedia Effect';

		iface.data = {
			type: 'lowpass', // lowpass | highpass | midpass
			frequency: 350, // Filter node's frequency value
			width: 1, // Filter node's Q value
		};
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Audio/Effect/CutOff',
Context.IFace.CutOff = class CutOffIFace extends Context.MediaEffect {
	constructor(node){
		super(node);

		this.effect = ScarletsMediaEffect.cutOff();
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
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Audio/Effect/CutOff', {
	template: null
}, Context.IFace.CutOff);