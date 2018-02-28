import {Component, Input} from "@angular/core";

export namespace Tabs {

    @Component({
        selector: "tabs",
        template: `
            <ul class="nav nav-tabs">
                <li *ngFor="let tab of tabs" (click)="selectTab(tab)" class="nav-item">
                    <a class="nav-link" [class.active]="tab.active" href="#">{{tab.title}}</a>
                </li>
            </ul>
            <ng-content></ng-content>
        `
    })
    export class TabsComponent {
        public tabs: Array<TabComponent> = [];

        public addTab(tab: TabComponent) {
            if (this.tabs.length === 0) {
                tab.active = true;
            }

            this.tabs.push(tab);
        }

        public selectTab(tab: TabComponent) {
            this.tabs.forEach(tab => tab.active = false);
            tab.active = true;
        }
    }

    @Component({
        selector: "tab",
        template: `
            <div [hidden]="!active">
                <ng-content></ng-content>
            </div>
        `
    })
    export class TabComponent {

        @Input() public title: string;
        @Input() public active: boolean;

        public constructor(tabs: TabsComponent) {
            tabs.addTab(this);
        }
    }
}