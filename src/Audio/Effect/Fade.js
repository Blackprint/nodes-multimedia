Blackprint.registerNode('Multimedia/Audio/Effect/Fade',
class FadeNode extends Blackprint.Node {
	static input = {
		In: Blackprint.Port.ArrayOf(AudioNode),
		Start: Blackprint.Port.Trigger(function({ iface }){
			let node = iface.node;
			let input = node.input;

			if(input.FadeIn)
				iface.effect.in(input.Volume, input.Time, node.output.Finish);
			else iface.effect.out(input.Volume, input.Time, node.output.Finish);
		}),
		FadeIn: Boolean,
		Volume: Number,
		Time: Number,
	};

	static output = {
		Out: AudioNode,
		Finish: Blackprint.Types.Trigger
	};

	constructor(instance){
		super(instance);
		let iface = this.setInterface('BPIC/Multimedia/Audio/Effect/Fade');

		iface.title = 'Fade';
		iface.description = 'Multimedia Effect';
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Audio/Effect/Fade',
Context.IFace.Fade = class FadeIFace extends Context.MediaEffect {
	constructor(node){
		super(node);

		this.effect = ScarletsMediaEffect.fade();
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
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Audio/Effect/Fade', {
	template: null
}, Context.IFace.Fade);