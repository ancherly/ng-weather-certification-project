import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  TemplateRef,
} from "@angular/core";
import { Tab } from "app/models/tab";

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.component.html",
  styleUrl: "./tabs.component.css",
})
export class TabsComponent {
  @Input() tabs: Tab[] = [];

  @Output() closed = new EventEmitter<string>();
  @Output() selected = new EventEmitter<string>();

  @ContentChild("tabContent", { static: true })
  tabContentTemplate!: TemplateRef<any>;

  activeTabId: string | null = null;

  //Detection tab changes
  //If any tab dont have selected true , selected if the first of the array by defautl
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes["tabs"] || this.tabs.length === 0) return;

    const selectedTab = this.tabs.find((tab) => tab.selected);
    const isActiveStillValid = this.tabs.some((t) => t.id === this.activeTabId);

    if (selectedTab) {
      this.selectTab(selectedTab.id);
    } else if (!this.activeTabId || !isActiveStillValid) {
      this.selectTab(this.tabs[0].id);
    }
  }

  selectTab(id: string): void {
    if (this.activeTabId !== id) {
      this.activeTabId = id;
      this.tabs = this.tabs.map((tab) => ({
        ...tab,
        selected: tab.id === id,
      }));
      this.selected.emit(id);
    }
  }

  closeTab(id: string): void {
    const tabs = this.tabs;
    const index = tabs.findIndex((tab) => tab.id === id);
    const isActive = this.activeTabId === id;

    this.closed.emit(id);

    if (isActive && tabs.length > 1) {
      const nextTab = tabs[index === 0 ? 1 : index - 1];
      this.selectTab(nextTab.id);
    }

    if (tabs.length === 1) {
      this.activeTabId = null;
    }
  }

  isActive(id: string): boolean {
    return this.activeTabId === id;
  }
}
