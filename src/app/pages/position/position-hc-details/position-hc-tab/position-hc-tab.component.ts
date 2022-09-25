import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/_metronic/layout';

type Tabs = 'Jelentkező' | 'Potenciális' | 'Interjú' | 'Bemutatott' | 'Kiválasztott' |
'Állományban';

@Component({
  selector: 'app-position-hc-tab',
  templateUrl: './position-hc-tab.component.html',
  styleUrls: ['./position-hc-tab.component.scss']
})
export class PositionHcTabComponent implements OnInit {
  errors: HttpErrorResponse;
  activeTab: Tabs = 'Jelentkező';
  model: any;
  private unsubscribe = new Subject<void>();
  @ViewChild('form', { static: true }) form: NgForm;
  configLoading: boolean = false;
  resetLoading: boolean = false;

  constructor(private layout: LayoutService) { }

  ngOnInit() {
    this.model = this.layout.getConfig();
  }
  
  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
  }
  
  resetPreview(): void {
    this.resetLoading = true;
    this.layout.refreshConfigToDefault();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
