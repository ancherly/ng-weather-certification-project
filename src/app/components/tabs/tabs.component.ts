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
  imports: [],
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
    this.tabs = this.tabs.filter((tab) => tab.id !== id);

    if (this.activeTabId === id) {
      this.activeTabId = this.tabs[0]?.id ?? null;
    }

    this.closed.emit(id);
  }

  isActive(id: string): boolean {
    return this.activeTabId === id;
  }
}
