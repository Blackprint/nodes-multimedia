Blackprint.registerNode('Multimedia/Audio/Effect/Harmonizer',
class HarmonizerNode extends Blackprint.Node {
	static input = { In: Blackprint.Port.ArrayOf(AudioNode) };
	static output = { Out: AudioNode };

	constructor(instance){
		super(instance);
		let iface = this.setInterface('BPIC/Multimedia/Audio/Effect/Harmonizer');

		iface.title = 'Harmonizer';
		iface.description = 'Multimedia Effect';

		iface.data = {
			pitch: 34, // 0 ~ 1
			slope: 0.65, // 0 ~ 1
			width: 0.15, // 0 ~ 1
		};
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Audio/Effect/Harmonizer',
Context.IFace.Harmonizer = class HarmonizerIFace extends Context.MediaEffect {
	constructor(node){
		super(node);

		this.effect = ScarletsMediaEffect.harmonizer();
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
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Audio/Effect/Harmonizer', {
	template: null
}, Context.IFace.Harmonizer);