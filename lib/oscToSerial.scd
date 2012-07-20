(
p = SerialPort("/dev/tty.usbserial-A7006QLh", 9600 ,crtscts:true);
OSCFunc({ |t, r, msg|
	var stepAscii;
	if( 2<msg.size, {
		stepAscii = msg[1].asAscii;
	});
	p.putAll("xF" ++ stepAscii ++ "0000"); "FORWORD".postln;
	msg.postln;
},'/forword', nil, 50000 );

OSCFunc({ |t, r, msg|
	var stepAscii;
	if( 2<msg.size, {
		stepAscii = msg[1].asAscii;
	});
	p.putAll("xB" ++ stepAscii ++ "0000"); "BACK".postln;
	msg.postln;
}, '/back', nil, 50000 );

OSCFunc({ |t, r, msg|
	var stepAscii;
	if( 2<msg.size, {
		stepAscii = msg[1].asAscii;
	});
	p.putAll("xR00000"); "RESET".postln;
	msg.postln;
}, '/reset', nil, 50000 );

//t=Task({
//	inf.do({var buf;
//		buf = p.next;
//		if(nil != buf,{
//			buf.postln;
//		});
//		0.25.wait;
//		})
//	});
//t.play;
Document.current.onClose_({p.close;t.stop;});
)