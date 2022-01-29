// This script will run first, and then the other files
// depends on blackprint.config.js configuration

// Prepare stuff when the page is loading
// maybe like loading our dependencies for the nodes

// Module loader fix for Resonance
let Resonance
window.define = function(_, func){
	Resonance = func().ResonanceAudio;
}
window.define.amd = true;

// Load dependencies
await imports([
	"https://cdn.jsdelivr.net/npm/sfmediastream@latest",
	// "https://cdn.jsdelivr.net/npm/resonance-audio/build/resonance-audio.min.js",
]);

delete window.define;

// Because .js and .sf is separated
// we also need to call loadScope just like _init.js
let Blackprint = window.Blackprint.loadScope({
	// You can find the URL on Blackprint menu -> Modules
	// This will also be exported to JSON if this module's nodes is being used
	url: import.meta.url,
});

// Global shared context
let Context = Blackprint.createContext('Multimedia');

// This is needed to avoid duplicated event listener when using hot reload
// Event listener that registered with same slot will be replaced
Context.EventSlot = {slot: 'my-private-event-slot'};

// Shared function
Context.objLength = function objLength(obj){
	var i = 0;
	for(var k in obj) i++;
	return i;
}

// To fix video sync bug
var fakeDestination = Context.fakeDestination = ScarletsMedia.audioContext.createGain();
fakeDestination.gain.value = 0
fakeDestination.connect(ScarletsMedia.audioContext.destination);

// To be extended by Interface on /multimedia/effect
// Don't immediately put in 'Context.MediaEffect = class MediaEffect {}'
// Or the compiler will not soft hot reload the class prototype
// We may need to migrate this to other file, because this file contains 'import.meta'
// and it may broke when this file will be hot reloaded
class MediaEffect extends Blackprint.Interface {
	init(){
		var iface = this;
		var node = this.node;

		iface.input.In.on('value', function({ cable }){
			cable.value.connect(iface.audioInput);
		})
		.on('disconnect', function({ cable }){
			cable.value.disconnect(iface.audioInput);
		});
	}
};

Context.MediaEffect = MediaEffect;

function customEffectFunctionBind(iface){
	var node = iface.node;
	var effect = iface.effect;
	var data = iface.data;

	for(let prop in data){
		if(prop.includes('$'))
			continue;

		let value = data[prop];

		let func = effect[prop];
		if(value !== void 0)
			func(value);
		else value = data[prop] = func();

		if(value.constructor === Number)
			value = Number(value.toFixed(2));

		Object.defineProperty(data, prop, {
			enumerable:true,
			get(){ return value },
			set(val){ func(value = val) }
		});

		let inputComp = {
			which: prop,
			obj: iface.data,
			whenChanged(now){ func(value = now) }
		};

		var name = prop[0].toUpperCase()+prop.slice(1);

		var port = node.createPort('input', name, value.constructor);
		port.on('value', function({ cable }){
			data[prop] = cable.value; // For data value
			inputComp.default = cable.value;
			func(cable.value); // For ScarletsMediaEffect value
		});

		port.insertComponent(null, 'comp-port-input', inputComp);
	}
}