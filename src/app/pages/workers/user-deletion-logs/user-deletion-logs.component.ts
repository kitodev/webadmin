import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { UserDeletionLogs } from 'src/app/core/models/loopback.model';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../core/services/loopback.service';
@Component({
  selector: 'app-user-deletion-logs',
  templateUrl: './user-deletion-logs.component.html',
  styleUrls: ['./user-deletion-logs.component.scss']
})
export class UserDeletionLogsComponent implements OnInit {

  
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

  constructor(
      private cdr: ChangeDetectorRef,
      private loopbackService: LoopbackService,
      private router: Router,
      private toastService: HotToastService,
      private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.listQualifications();
    this.countQualifications()
  }
  
  countQualifications(): any {
    this.loopbackService
    .userDeletionLogsCount()
    .subscribe((response) => {
      console.log(response);
      this.countUserDeletionLogs = response.count;
      this.cdr.detectChanges();
    });
  }

  listQualifications(): any {
    this.loopbackService
    .listUserDeletionLogs()
    .subscribe((response) => {
      this.listUserDeletionLogs = response;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
