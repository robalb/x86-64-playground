
## disassembly

blink includes a disassembler,
which sadly is in the at&t syntax.
It would be pretty cool to make it work
with the js api, and to add intel syntax.

blinkenlights.c:
```
//beginning of file
static struct Dis dis[1];

//...

static void DrawDisassembly(struct Panel *p) {
  i64 i, j;
  for (i = 0; i < p->bottom - p->top; ++i) {
    j = opstart + i;
    if (0 <= j && j < dis->ops.i) {
      if (j == opline) AppendPanel(p, i, "\033[7m");
      AppendPanel(p, i, DisGetLine(dis, m, j));
      if (j == opline) AppendPanel(p, i, "\033[27m");
    }
  }
}

```

other interesting functions:
blinkenlights.c:860
```
static void ResolveBreakpoints(void) {
  long i, sym;
  for (i = 0; i < breakpoints.i; ++i) {
    if (breakpoints.p[i].symbol && !breakpoints.p[i].addr) {
      if ((sym = DisFindSymByName(dis, breakpoints.p[i].symbol)) != -1) {
        breakpoints.p[i].addr = dis->syms.p[sym].addr;
      }
    }
  }
}

```

dis.c
```
const char *DisGetLine(struct Dis *d, struct Machine *m, int i) {

```



other very important functions:
blinkenlights.c
```
void OnSymbols(struct System *s) {
  ResolveBreakpoints();
  ResolveWatchpoints();
}

void CommonSetup(void) {
  static bool once;
  if (!once) {
    if (tuimode || breakpoints.i || watchpoints.i) {
      m->system->dis = dis;
      m->system->onsymbols = OnSymbols;
      LoadDebugSymbols(m->system);
    }
    once = true;
  }
}

```

this is where dis is initialized, together with
debug symbols stuff that we'll clearly need later


### ideas on how to pass the dis. to js

var line = $(/*your highlighted line*/);
var offset = line.offset();
window.scrollTo(offset.left, offset.top);


the blink api provide a list of instructions,
and the index of the ip in the list.
they automatically handle the redraw of the list
when the ip reaches the bottom, or the execution
jumps outside of the small window we disassembled.

ideally, we could draw each line in the dis list
in an html line, in a scrollable div.
on each step, we scroll to the correct line in the html.

we cann pass the line index in our shared struct.
we only need a lightweight way to render
js strings from a byteArray


## implementing intel dialect

this is what we call:

    disGetLine(){
      xedd = GetInstruction /*huge magical function*/
     return DisLineCode()
     }


we need to understand and modify DisLineCode
if we want the new syntax

it's actually very simple:
```
  DisAddr() //the instr address
  DisRaw() //the raw bytes of the instr.
  DisCode() //the mnemonic. what we want to change
```

    disCode():
      spec = DisSpec()
      return DisInst(spec)

discCode will generate the instruction
based on a normalized string spec.
we can keep the string spec the same,
and only change the DisInst logic

https://imada.sdu.dk/u/kslarsen/dm546/Material/IntelnATT.htm



