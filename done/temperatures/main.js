r=readline
r()
_=q=>q>0?+q:0-q
print(r().split` `.reduce((s,e)=>_(e)<_(s)|(_(e)==_(s)&e>s)?e:s)|0);