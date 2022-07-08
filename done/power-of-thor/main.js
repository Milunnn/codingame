[X,Y,s,d]=readline().split` `
x=X-s
y=Y-d
while(1){o=""
if(y>0){o+="S"
y--}
if(y<0){o+="N"
y++}
if(x>0){o+="E"
x--}
if(x<0){o+="W"
x++}print(o)}

while(1)print(`${y>0?(y--,"S"):(y<0)?(y++,"N"):""}${x>0?(x--,"E"):(x<0)?(x++,"W"):""}`)