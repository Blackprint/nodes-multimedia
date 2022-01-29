// ToDo: Fix this and add support for adding more ports to control frequency

Blackprint.registerNode('Multimedia/Audio/Effect/Equalizer',
class EqualizerNode extends Blackprint.Node {
	static input = { In: Blackprint.Port.ArrayOf(AudioNode) };
	static output = { Out: AudioNode };

	constructor(instance){
		super(instance);
		let iface = this.setInterface('BPIC/Multimedia/Audio/Effect/Equalizer');

		iface.title = 'Equalizer';
		iface.description = 'Multimedia Effect';

		iface.data = {
			frequency: 0.7,
			decibel: 0.5, // -20 ~ 20
		};
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Audio/Effect/Equalizer',
Context.IFace.Equalizer = class EqualizerIFace extends Context.MediaEffect {
	constructor(node){
		super(node);

		this.effect = ScarletsMediaEffect.equalizer();
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
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Audio/Effect/Equalizer', {
	template: null
}, Context.IFace.Equalizer);