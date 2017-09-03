import {Component} from "@angular/core";

@Component({
    selector: "collapsible-item",
    template: `
        <li (click)="toggleBodyVisibility()" class="list-group-item selectable pointable">
            <div>
                <ng-content select="[item-header]"></ng-content>
            </div>
            <hr *ngIf="isBodyVisible">
            <ng-content *ngIf="isBodyVisible" select="[item-body]"></ng-content>
        </li>
    `
})
export class CollapsibleItemComponent {
    public isBodyVisible: boolean;

    public toggleBodyVisibility(): void {
        this.isBodyVisible = !this.isBodyVisible;
    }
}