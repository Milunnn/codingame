print([...readline()].reduce((s,e)=>s+e.charCodeAt().toString(2).padStart(7,'0'),"").replace(/(0+)/g,'00 $1 ').replace(/(1+)/g,'0 $1 ').replace(/1/g,'0').trim())

o=""
for(_ of readline()){o+=_.charCodeAt().toString(2).padStart(7,'0')}print(o.replace(/(0+)/g,'00 $1 ').replace(/(1+)/g,'0 $1 ').replace(/1/g,'0').trim())

print([...readline()].map(_=>_.charCodeAt().toString(2).padStart(7,'0')).join``.replace(/(0+)/g,'00 $1 ').replace(/(1+)/g,'0 $1 ').replace(/1/g,'0').trim())

_=v=>new RegExp("(0+)","g")
print([...readline()].map(_=>_.charCodeAt().toString(2).padStart(7,'0')).join``.replace(/(0+)/g,'00 $1 ').replace(/(1+)/g,'0 $1 ').replace(/1/g,'0').trim())

/**int val = -1;
        string output = "";
        Array.ForEach( Encoding.ASCII.GetBytes(Console.ReadLine()), b => {
            for( int bit = 6; bit >= 0; bit-- )
            {
                output += ( ( b >> bit ) & 0x1 ) == val ? "0" : ( ( val = ( b >> bit ) & 0x1 ) > 0 ? " 0 0" : " 00 0" );
            }
        });
        Console.WriteLine(output.Trim()); */