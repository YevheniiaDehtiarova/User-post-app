import { NgModule } from "@angular/core";
import { PhonePipe } from "./phone.pipe";

const pipes = [
    PhonePipe
  ];
  
  @NgModule({
    declarations: [...pipes],
    exports: [...pipes],
  })
  export class PipesModule {}