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
NOT relevant
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

# 8 ott

disSymLiteral


# 12 ott


DisM (at&t operand source Memory)
  displacement + `(...)`
   |               /
   |              /
 DisDisp         /
                DisBis (draws [...])
                    \
                     \
                    DisDysp  --------> DisSym
                    (draws +/-)



https://sdasgup3.github.io/Intel_Vs_Att_format/
Intel Syntax
instr   foo,segreg:[base+index*scale+disp]
AT&T Syntax
instr   %segreg:disp(base,index,scale),foo


There are a few different forms of indirect operands in x86:

    [reg]
    [reg + displacement]
    [displacement]
    [reg * constant + reg]
    [reg * constant + reg + displacement]

The "displacement" is just a constant that gets added to the rest of the address. In cases where there is no component of the address other than the constant, it is still called a "displacement". This is mainly for consistency with the other addressing forms.

Another way to look at it is that all addresses are of the form

[reg * constant + reg + displacement]

With each of the components allowing a value of 0.

The [displacement] form is just the encoding where all components other than the displacement are zero.

As a compiler writer the last 2 forms are particularly interesting. They make it easy to encode things like pArray[index]->field + 1in a single instruction.


