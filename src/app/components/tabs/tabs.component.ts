import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  TemplateRef,
} from "@angular/core";

export interface Tab {
  id: string;
  label: string;
}

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["tabs"] && this.tabs.length > 0) {
      const firstTab = this.tabs[0];
      if (
        !this.activeTabId ||
        !this.tabs.some((t) => t.id === this.activeTabId)
      ) {
        this.selectTab(firstTab.id);
      }
    }
  }

  selectTab(id: string): void {
    if (this.activeTabId != id) {
      this.activeTabId = id;
      this.selected.emit(id);
    }
  }

  closeTab(id: string): void {
    const tabs = this.tabs;
    const index = tabs.findIndex((tab) => tab.id === id);
    const wasActive = this.activeTabId === id;

    this.closed.emit(id);

    if (wasActive && tabs.length > 1) {
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
