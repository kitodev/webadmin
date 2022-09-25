import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { Qualification, UserDeletionLogs, UserHc } from 'src/app/core/models/loopback.model';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { ColumnSetting } from 'src/app/shared/table/TableCol';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../core/services/loopback.service';

@Component({
  selector: 'app-workers-list',
  templateUrl: './workers-list.component.html',
  styleUrls: ['./workers-list.component.scss']
})
export class WorkersListComponent implements OnInit {
  private unsubscribe = new Subject<void>();
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTION = DATATABLE_SETTINGS.SIZE_OPTIONS;
  qualificationsId: number;
  listUserDeletionLogs: UserDeletionLogs[] = [];
  isLoading =  true;
  errors: HttpErrorResponse;
  countUserDeletionLogs: number[];
  searchTerm: string;
  currentPage: number = 1;
  collectionSize: number;
  listUserHc: UserHc[] = [];

  @Input() title: any[];
  @Input() listRow: any[];
  @Input() settings: ColumnSetting[];

  constructor(
    private cdr: ChangeDetectorRef,
    private loopbackService: LoopbackService,
    private router: Router,
    private toastService: HotToastService,
  ) { }
  
  ngOnInit(): void {
    this.listUserHcs();
  }

  listUserHcs(): any {
    this.loopbackService
    .listUserHcs()
    .subscribe((response) => {
      console.log(response);
      this.listUserHc = response;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
