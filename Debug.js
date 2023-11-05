class Debug{
    constructor(){
        this.box=document.getElementById("debug");
    }
    log(string){
        this.box.innerText+="\n"
        this.box.innerText+=string;
    }
    clear(){
        this.box.innerText=null;
    }
}
export{
    Debug
}