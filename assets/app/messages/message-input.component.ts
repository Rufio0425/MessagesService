import {Component, OnInit} from "angular2/core";
import {Message} from "./message";
import {MessageService} from "./message.service";
import {ErrorService} from "../errors/error.service";
@Component({
    selector: 'my-message-input',
    template: `
        <section class="col-md-8 col-md-offset-2">
            <form (ngSubmit)="onSubmit(f.value)" #f="ngForm">
                <div class="form-group">
                    <label for="content">Content</label>
                    <input ngControl="content" type="text" class="form-control" id="content" #input [ngModel]="message?.content">
                    <input ngControl="anonymous" type="boolean" class="form-control" id="anonymous" [ngModel]="message?.anonymous">
                </div>
                <button title="Public Help Text" trigger="hover" type="submit" class="btn btn-primary">{{ !message ? 'Post Publicly' : 'Save Message' }}</button>
                <button title="Private Help Text" trigger="hover" type="submit" class="btn btn-primary">Post Anonymously</button>
                <button type="button" class="btn btn-danger" (click)="onCancel()" *ngIf="message">Cancel</button>
            </form>
        </section>
    `
})
export class MessageInputComponent implements OnInit{
    message:Message = null;
    constructor(private _messageService:MessageService, private _errorService: ErrorService) {}

    onSubmit(form:any) {
        if (this.message) {
            // Edit
            this.message.content = form.content;
            this._messageService.updateMessage(this.message)
                .subscribe(
                    data => console.log(data),
                    error => this._errorService.handleError(error)
                );
            this.message = null;
        } else {
            const message:Message = new Message(form.content, null, 'Dummy', null, form.anonymous);
            console.log('message is::: ' + JSON.stringify(message));
            this._messageService.addMessage(message)
                .subscribe(
                    data => {
                        console.log(data);
                        this._messageService.messages.push(data);
                    },
                    error => this._errorService.handleError(error)
                );
        }
    }

    onCancel() {
        this.message = null;
    }

    ngOnInit() {
        this._messageService.messageIsEdit.subscribe(
            message => {
                this.message = message;
            }
        );
    }
}