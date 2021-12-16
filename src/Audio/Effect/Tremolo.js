Blackprint.registerNode('Multimedia/Audio/Effect/Tremolo',
class TremoloNode extends Blackprint.Node {
	constructor(instance){
		super(instance);
		let iface = this.setInterface('BPIC/Multimedia/Audio/Effect/Tremolo');

		iface.title = 'Tremolo';
		iface.description = 'Multimedia Effect';

		iface.data = {
			mix: 0.8, // 0 ~ 1
			speed: 0.2, // 0 ~ 3
			depth: 1, // 0 ~ 3
		};

		this.input = {
			In: Blackprint.Port.ArrayOf(AudioNode)
		};

		this.output = {
			Out: AudioNode
		};
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Audio/Effect/Tremolo',
Context.IFace.Tremolo = class TremoloIFace extends Context.MediaEffect {
	constructor(node){
		super(node);

		this.effect = ScarletsMediaEffect.tremolo();
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
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Audio/Effect/Tremolo', {
	template: null
}, Context.IFace.Tremolo);