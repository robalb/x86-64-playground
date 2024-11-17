
# implementing intel dialect in blink

This is an experiment, I plan to freely modify
the blink code until I get something stable.
Then I'll work on a proper patch upstream.


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


time to properly learn xed
https://intelxed.github.io/ref-manual/index.html




a simple entry point seems to be DisArg.

all we need to do:
remove the $,% prefix


