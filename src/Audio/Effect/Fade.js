Blackprint.registerNode('Multimedia/Audio/Effect/Fade',
class FadeNode extends Blackprint.Node {
	constructor(instance){
		super(instance);
		let iface = this.setInterface('BPIC/Multimedia/Audio/Effect/Fade');

		iface.title = 'Fade';
		iface.description = 'Multimedia Effect';

		iface.data = {
			volume: 0.5, // First volume
			time: 0.7, // seconds
		};

		let node = this;
		this.input = {
			In: Blackprint.Port.ArrayOf(AudioNode),
			Start: Blackprint.Port.Trigger(function(){
				iface.effect.in(iface.data.volume, iface.data.time, node.output.Finish);
			})
		};

		this.output = {
			Out: AudioNode,
			Finish: Function
		};
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Audio/Effect/Fade',
Context.IFace.Fade = class FadeIFace extends Context.MediaEffect {
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
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Audio/Effect/Fade', {
	template: null
}, Context.IFace.Fade);