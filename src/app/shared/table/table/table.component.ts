import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DATATABLE_SETTINGS } from 'src/app/constants';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  searchTerm: string;
  page: number = 1;
  collectionSize: number;
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;

  @Input() rowData :any[] = [];
  @Input() ColData :any[] = [];
  @Output() rowDelete = new EventEmitter<any>();
  @Output() rowUpdate = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }
    
  edit(item: any) {
    debugger;
    this.rowUpdate.emit(item);
  }
  
  delete(item: any) {
    debugger;
    this.rowDelete.emit(item);
  }

}
