import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { PipesModule } from './pipes/pipes.module';

import { AppComponent } from './app.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { UserService } from './services/user.service';
import { UserMapper } from './mappers/user.mapper';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { PostService } from './services/post.service';
import { PostComponent } from './components/post/post.component';
import { PostFormStateService } from './services/post-form-state.service';
import { PostFormComponent } from './components/post-form/post-form.component';
import { UserModalService } from './services/user-modal.service';
import { PostModalComponent } from './components/post-modal/post-modal.component';
import { CommentComponent } from './components/comment/comment.component';
import { UserModalComponent } from './components/user-modal/user-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    UserTableComponent,
    UserFormComponent,
    UserDetailComponent,
    PostComponent,
    PostFormComponent,
    PostModalComponent,
    CommentComponent,
    UserModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    GridModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ButtonsModule,
    PipesModule,
    DropDownsModule,
    InputsModule,
    DateInputsModule,
    LabelModule,
    ReactiveFormsModule,
    DropDownsModule,
    DialogsModule,
  ],
  providers: [UserService, UserMapper,UserModalService,
              PostService,PostFormStateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
