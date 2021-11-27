Blackprint.registerNode('Multimedia/Converter/GIF',
class GIFNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface('BPIC/Multimedia/Converter/GIF');
		iface.title = 'GIF Player';

		this.input = {
			URL: String
		}

		this.output = {
			Canvas: PIXI.CanvasResource
		}
	}
});

Blackprint.registerInterface('BPIC/Multimedia/Converter/GIF',
Context.IFace.GIF = class GIFIFace extends Blackprint.Interface {
	constructor(node){
		super(node);

		// Constructor for Interface can be executed twice when using Cloned Container
		if(this.canvas !== void 0) return;

		this.canvas = null;
		this.gif = null;
		this.pixi = null;
	}

	init(){
		let iface = this;
		let node = this.node;

		this.canvas = document.createElement('canvas');
		this.pixi = new PIXI.CanvasResource(this.canvas);

		// This should be on property
		node.output.Canvas = this.pixi;

		this.input.URL.on('value', Context.EventSlot, function(port){
			gifler(port.value).get(function(anim){
				iface.gif = anim;
				anim.onDrawFrame = function(ctx, frame){
					ctx.drawImage(frame.buffer, 0, 0);
					iface.pixi.update();
				}

				anim.animateInCanvas(iface.canvas);
			});
		});

		this.input.URL.on('disconnect', Context.EventSlot, function(){
			iface.gif.stop();
		});
	}
});

// For Sketch Editor (use default UI, and use similar interface)
Blackprint.Sketch.registerInterface('BPIC/Multimedia/Converter/GIF', {
	template: null
}, Context.IFace.GIF);