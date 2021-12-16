Blackprint.registerNode('Multimedia/Audio/Effect/Delay',
class DelayNode extends Blackprint.Node {
	constructor(instance){
		super(instance);
		let iface = this.setInterface('BPIC/Multimedia/Audio/Effect/Delay');

		iface.title = 'Delay';
		iface.description = 'Multimedia Effect';

		iface.data = {
			mix: 0.5, // 0 ~ 1
			time: 0.3, // 0 ~ 180
			feedback: 0.5, // 0 ~ 1
		};

		this.input = {
			In: Blackprint.Port.ArrayOf(AudioNode)
		};

		this.output = {
			Out: AudioNode
		};
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Audio/Effect/Delay',
Context.IFace.Delay = class DelayIFace extends Context.MediaEffect {
	constructor(node){
		super(node);

		this.effect = ScarletsMediaEffect.delay();
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
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Audio/Effect/Delay', {
	template: null
}, Context.IFace.Delay);