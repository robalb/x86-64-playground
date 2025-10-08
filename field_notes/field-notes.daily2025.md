# 4 ott

checking eflags values


[ auxiliary sign overflow ]
0x80001a92
0b10000000000000000001101010010010
                      | | |  |  |
                      | 9 7  4  1
                      | I S  A
                      11
                      O
                       
[ auxiliary ]
0x10001212
0b10000000000000001001000010010
                  |  |    |  |
                  |  9    4  1
                  |  I    A   
                  12

0 	CF 	Carry Flag
1 	1 	Reserved
2 	PF 	Parity Flag
3 	0 	Reserved
4 	AF 	Auxiliary Carry Flag
5 	0 	Reserved
6 	ZF 	Zero Flag
7 	SF 	Sign Flag
8 	TF 	Trap Flag
9 	IF 	Interrupt Enable Flag
10 	DF 	Direction Flag
11 	OF 	Overflow Flag
12-13 	IOPL 	I/O Privilege Level
14 	NT 	Nested Task
15 	0 	Reserved
16 	RF 	Resume Flag
17 	VM 	Virtual-8086 Mode
18 	AC 	Alignment Check / Access Control
19 	VIF 	Virtual Interrupt Flag
20 	VIP 	Virtual Interrupt Pending
21 	ID 	ID Flag
22-63 	0 	Reserved 


# 5 ott

fixing disass visualization bug

disinst.c
```
static char *DisSpecialAddr(struct Dis *d, u64 rde, char *p, int r) {
  if(INTEL_SYNTAX){
    *p++ = '[';
    p = DisRegister(p, GetAddrReg(d, rde, 0, r));
    *p++ = ']';
  }else{
    *p++ = '(';
    p = DisRegister(p, GetAddrReg(d, rde, 0, r));
    *p++ = ')';
  }
  *p = '\0';
  return p;
}
```


