<script>
/**
 * This is an interactive element specifically created
 * for the moving-data-x64 article
 * 
 * It's supposed to be a x64 registers table, with a stylish design.

 * Some extra work is required for proper a11y
 * 
*/
</script>


<div class="regtablecontainer">
    <div class="regtable">

        <div class="regtable__scale">
            <span>07</span>
            <span>06</span>
            <span>05</span>
            <span>04</span>
            <br/>
            <span>03</span>
            <span>02</span>
            <br/>
            <span>01</span>
            <span>00</span>
        </div>

        <div class="regtable__rect">
            <span>rax</span>
            <div class="regtable__rect">
                <span>eax</span>
                <div class="regtable__rect regtable__rect--grouping">
                    ax
                    <div class="regtable__rect regtable__rect--16">
                        <span>ah</span>
                        <span>al</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="regtable__rect">
            <span>rbx</span>
            <div class="regtable__rect">
                <span>ebx</span>
                <div class="regtable__rect regtable__rect--grouping">
                    bx
                    <div class="regtable__rect regtable__rect--16">
                        <span>bh</span>
                        <span>bl</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="regtable__rect">
            <span>rcx</span>
            <div class="regtable__rect">
                <span>ecx</span>
                <div class="regtable__rect regtable__rect--grouping">
                    cx
                    <div class="regtable__rect regtable__rect--16">
                        <span>ch</span>
                        <span>cl</span>
                    </div>
                </div>
            </div>
        </div>


        <div class="regtable__rect">
            <span>rdx</span>
            <div class="regtable__rect">
                <span>edx</span>
                <div class="regtable__rect regtable__rect--grouping">
                    dx
                    <div class="regtable__rect regtable__rect--16">
                        <span>dh</span>
                        <span>dl</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="regtable__rect">
            <span>rsi</span>
            <div class="regtable__rect">
                <span>esi</span>
                <div class="regtable__rect regtable__rect--grouping">
                    si
                    <div class="regtable__rect regtable__rect--16">
                        <span class="invisible">--</span>
                        <span>sil</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="regtable__rect">
            <span>rdi</span>
            <div class="regtable__rect">
                <span>edi</span>
                <div class="regtable__rect regtable__rect--grouping">
                    di
                    <div class="regtable__rect regtable__rect--16">
                        <span class="invisible">--</span>
                        <span>dil</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="regtable__rect">
            <span>rsp</span>
            <div class="regtable__rect">
                <span>esp</span>
                <div class="regtable__rect regtable__rect--grouping">
                    sp
                    <div class="regtable__rect regtable__rect--16">
                        <span class="invisible">--</span>
                        <span>spl</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="regtable__rect">
            <span>rbp</span>
            <div class="regtable__rect">
                <span>ebp</span>
                <div class="regtable__rect regtable__rect--grouping">
                    bp
                    <div class="regtable__rect regtable__rect--16">
                        <span class="invisible">--</span>
                        <span>bpl</span>
                    </div>
                </div>
            </div>
        </div>


    </div>
<!-- </div> -->




<!-- <div class="regtablecontainer"> -->
    <div class="regtable">

        <div class="regtable__scale">
            <span>07</span>
            <span>06</span>
            <span>05</span>
            <span>04</span>
            <br/>
            <span>03</span>
            <span>02</span>
            <br/>
            <span>01</span>
            <span>00</span>
        </div>

    {#each [8,9,10,11,12,13,14,15] as reg}
        <div class="regtable__rect">
            <span>r{reg}</span>
            <div class="regtable__rect">
                <span>r{reg}d</span>
                <div class="regtable__rect regtable__rect--grouping">
                    r{reg}w
                    <div class="regtable__rect regtable__rect--16">
                        <span class="invisible">--</span>
                        <span>r{reg}8</span>
                    </div>
                </div>
            </div>
        </div>
    {/each}

  </div>
</div>



<style>
    .regtablecontainer{
      display: flex;
      flex-direction: row;
      justify-content: center;
      flex-wrap: wrap;
    }
    .regtable{
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        align-items: center;
        margin: 1rem 0;
    }
    @media screen and (min-width: 400px){
      .regtable{
        width: auto;
        min-width: 354px;
        margin: 1rem;
      }
    }

    .regtable__scale{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 360px;
        padding-left: 0.8rem;
        padding-right: 0.8rem;
        color: var(--font-color);
    }

    .regtable>.regtable__rect{
        width: 100%;
        max-width: 360px;
        background: #b8e5fa;
    }
    .regtable>.regtable__rect>.regtable__rect{
        background: #dbf2fd;
    }

    .regtable__rect{
        display: flex;
        width: 50%;

        color: black;
        font-family: var(--code-font-family);
        font-size: 0.9rem;

        border: 1px solid black;
        padding: 2px;
        justify-content: space-between;
        align-items: center;
    }
    .regtable__rect--grouping{
        border: 0;
        padding: 0;
        background: transparent;
        width:calc(50% + 20px);
    }
    .regtable__rect--16{
        margin-left: 10px;
        width: 100%;
        background: white;
        overflow: hidden;
    }
    .regtable__rect--16 span{
      font-size:.8rem;
        border: 1px solid black;
        background: white;
        /* padding: 1px; */
        width: 100%;
        justify-content: center;
        display: flex;
    }
    .regtable__rect--16 span.invisible{
        opacity: 0;
    }
    .regtable__rect--16 span:first-child{
        margin-right: 2px;
    }


</style>
