CC=musl-gcc
AS=as
LD=ld

CFLAGS= --static #-nostdlib
ASFLAGS=
LDFLAGS= --no-dynamic-linker #-z noexecstack -z stack-size=4096

.PHONY: all
all: hang.elf argv.elf exit.elf nop.elf err.elf stdout.elf hello_dynamic.elf

hello_dynamic.elf: hello_dynamic.c
	$(CC) -o $@ $<

hang.elf: hang.c
	$(CC) $(CFLAGS) -o $@ $<

argv.elf: argv.c
	$(CC) $(CFLAGS) -o $@ $<

exit.elf: exit.o
	$(LD) $(LDFLAGS) -o $@ $<
exit.o: exit.s
	$(AS) $(ASFLAGS) -o $@ $<

nop.elf: nop.o
	$(LD) $(LDFLAGS) -o $@ $<
nop.o: nop.s
	$(AS) $(ASFLAGS) -o $@ $<

err.elf: err.o
	$(LD) $(LDFLAGS) -o $@ $<
err.o: err.s
	$(AS) $(ASFLAGS) -o $@ $<

stdout.elf: stdout.o
	$(LD) $(LDFLAGS) -o $@ $<
stdout.o: stdout.s
	$(AS) $(ASFLAGS) -o $@ $<

