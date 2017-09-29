import {Component} from "@angular/core";

@Component({
  selector: "collapsible-item",
  template: `
    <li class="list-group-item customListGroupItem" style="padding: 0;">
      <div (click)="toggleBodyVisibility()" class="selectable pointable" style="padding: 10px;">
        <ng-content select="[item-header]"></ng-content>
      </div>
      
      <hr *ngIf="isBodyVisible" style="margin-top: 0; margin-bottom: 0px;">
      
      <div *ngIf="isBodyVisible" style="padding: 10px;">
        <ng-content select="[item-body]"></ng-content>
      </div>
    </li>
  `
})
export class CollapsibleItemComponent {
  public isBodyVisible: boolean;

  public toggleBodyVisibility(): void {
    this.isBodyVisible = !this.isBodyVisible;
  }
}
